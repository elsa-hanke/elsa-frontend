<template>
  <div class="koulutussopimus col-lg-8 px-0">
    <b-breadcrumb :items="items" class="mb-0" />
    <b-container fluid v-if="!loading">
      <h1 class="mb-3">{{ $t('aloituskeskustelu-kouluttaja') }}</h1>

      <div v-if="editable && isCurrentUserLahiesimies">
        <p>{{ $t('aloituskeskustelu-esimies-ingressi') }}</p>
      </div>
      <div v-else-if="editable">
        <p>{{ $t('aloituskeskustelu-kouluttaja-ingressi') }}</p>
      </div>

      <b-alert :show="showWaitingForLahiesimies" variant="dark" class="mt-3">
        <div class="d-flex flex-row">
          <em class="align-middle">
            <font-awesome-icon :icon="['fas', 'info-circle']" class="text-muted mr-2" />
          </em>
          <div>
            {{ $t('aloituskeskustelu-kouluttaja-allekirjoitettu') }}
          </div>
        </div>
      </b-alert>

      <b-alert :show="returned" variant="dark" class="mt-3">
        <div class="d-flex flex-row">
          <em class="align-middle">
            <font-awesome-icon :icon="['fas', 'info-circle']" class="text-muted mr-2" />
          </em>
          <div>
            {{ $t('aloituskeskustelu-palautettu-erikoistuvalle-muokattavaksi') }}
            <span class="d-block">{{ $t('syy') }} {{ aloituskeskustelu.korjausehdotus }}</span>
          </div>
        </div>
      </b-alert>

      <b-alert variant="success" :show="acceptedByEveryone">
        <div class="d-flex flex-row">
          <em class="align-middle">
            <font-awesome-icon :icon="['fas', 'check-circle']" class="mr-2" />
          </em>
          <span>{{ $t('aloituskeskustelu-tila-hyvaksytty') }}</span>
        </div>
      </b-alert>
      <hr />
      <erikoistuva-details
        :firstName="erikoistuvanEtunimi"
        :lastName="erikoistuvanSukunimi"
        :erikoisala="aloituskeskustelu.erikoistuvanErikoisala"
        :opiskelijatunnus="aloituskeskustelu.erikoistuvanOpiskelijatunnus"
        :yliopisto="aloituskeskustelu.erikoistuvanYliopisto"
        :show-birthdate="false"
      />
      <hr />
      <div>
        <b-row>
          <b-col>
            <h5>{{ $t('sahkopostiosoite') }}</h5>
            <p>{{ aloituskeskustelu.erikoistuvanSahkoposti }}</p>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <h5>{{ $t('koejakson-suorituspaikka') }}</h5>
            <p>{{ aloituskeskustelu.koejaksonSuorituspaikka }}</p>
          </b-col>
        </b-row>
        <b-row>
          <b-col lg="4">
            <h5>{{ $t('koejakson-alkamispäivä') }}</h5>
            <p>{{ $date(aloituskeskustelu.koejaksonAlkamispaiva) }}</p>
          </b-col>
          <b-col lg="4">
            <h5>{{ $t('koejakson-päättymispäivä') }}</h5>
            <p>{{ $date(aloituskeskustelu.koejaksonPaattymispaiva) }}</p>
          </b-col>
        </b-row>
        <b-row>
          <b-col lg="8">
            <h5>{{ $t('koejakso-suoritettu-kokoaikatyössä') }}</h5>
            <p v-if="aloituskeskustelu.suoritettuKokoaikatyossa">{{ $t('kylla') }}</p>
            <p v-else>
              {{ $t('suoritettu-osa-aikatyossa-tuntia-viikossa', { tyotunnitViikossa }) }}
            </p>
          </b-col>
        </b-row>
        <hr />
        <koulutuspaikan-arvioijat
          :lahikouluttaja="aloituskeskustelu.lahikouluttaja"
          :lahiesimies="aloituskeskustelu.lahiesimies"
          :isReadonly="true"
        />
        <hr />
        <b-row>
          <b-col>
            <h3>{{ $t('aloituskeskustelu-tavoitteet') }}</h3>
            <h5>{{ $t('koejakso-osaamistavoitteet') }}</h5>
            <p>{{ aloituskeskustelu.koejaksonOsaamistavoitteet }}</p>
          </b-col>
        </b-row>
        <hr />
        <koejakson-vaihe-allekirjoitukset :allekirjoitukset="allekirjoitukset" />
      </div>
      <hr v-if="showAllekirjoitukset && editable" />
      <b-row v-if="editable">
        <b-col class="text-right">
          <elsa-button
            class="ml-1 mr-3 d-block d-md-inline-block d-lg-block d-xl-inline-block text-left"
            style="max-width: 14rem"
            variant="back"
            :to="{ name: 'koejakso' }"
          >
            {{ $t('peruuta') }}
          </elsa-button>
          <elsa-button
            class="my-2 mr-3 d-block d-md-inline-block d-lg-block d-xl-inline-block"
            style="min-width: 14rem"
            :disabled="buttonStates.primaryButtonLoading"
            :loading="buttonStates.secondaryButtonLoading"
            variant="outline-primary"
            v-b-modal.return-to-sender
          >
            {{ $t('palauta-muokattavaksi') }}
          </elsa-button>
          <elsa-button
            class="my-2 mr-3 d-block d-md-inline-block d-lg-block d-xl-inline-block"
            style="min-width: 14rem"
            :disabled="buttonStates.secondaryButtonLoading"
            :loading="buttonStates.primaryButtonLoading"
            v-b-modal.confirm-send
            variant="primary"
          >
            {{ $t('allekirjoita-laheta') }}
          </elsa-button>
        </b-col>
      </b-row>
    </b-container>

    <elsa-confirmation-modal
      id="confirm-send"
      :title="$t('vahvista-lomakkeen-lahetys')"
      :text="
        isCurrentUserLahiesimies
          ? $t('vahvista-koejakson-vaihe-hyvaksytty', $t('aloituskeskustelu'))
          : $t('vahvista-koejakson-vaihe-esimiehelle')
      "
      :submitText="$t('allekirjoita-laheta')"
      @submit="onSubmit"
    />
    <elsa-return-to-sender-modal
      id="return-to-sender"
      :title="$t('palauta-erikoistuvalle-muokattavaksi')"
      @submit="returnToSender"
    />
  </div>
</template>

<script lang="ts">
  import Component from 'vue-class-component'
  import { Mixins } from 'vue-property-decorator'
  import { format } from 'date-fns'
  import _get from 'lodash/get'
  import * as api from '@/api/kouluttaja'
  import store from '@/store'
  import ElsaButton from '@/components/button/button.vue'
  import { checkCurrentRouteAndRedirect } from '@/utils/functions'
  import { toastFail, toastSuccess } from '@/utils/toast'
  import ErikoistuvaDetails from '@/components/erikoistuva-details/erikoistuva-details.vue'
  import ElsaFormGroup from '@/components/form-group/form-group.vue'
  import { LomakeTilat } from '@/utils/constants'
  import { AloituskeskusteluLomake } from '@/types'
  import ConfirmRouteExit from '@/mixins/confirm-route-exit'
  import KoejaksonVaiheAllekirjoitukset from '@/components/koejakson-vaiheet/koejakson-vaihe-allekirjoitukset.vue'
  import { KoejaksonVaiheAllekirjoitus, KoejaksonVaiheButtonStates } from '@/types'
  import * as allekirjoituksetHelper from '@/utils/koejaksonVaiheAllekirjoitusMapper'
  import ElsaConfirmationModal from '@/components/modal/confirmation-modal.vue'
  import ElsaReturnToSenderModal from '@/components/modal/return-to-sender-modal.vue'
  import KoulutuspaikanArvioijat from '@/components/koejakson-vaiheet/koulutuspaikan-arvioijat.vue'

  @Component({
    components: {
      ErikoistuvaDetails,
      ElsaFormGroup,
      ElsaButton,
      KoejaksonVaiheAllekirjoitukset,
      ElsaConfirmationModal,
      ElsaReturnToSenderModal,
      KoulutuspaikanArvioijat
    }
  })
  export default class KouluttajaArviointilomakeAloituskeskustelu extends Mixins(ConfirmRouteExit) {
    items = [
      {
        text: this.$t('etusivu'),
        to: { name: 'etusivu' }
      },
      {
        text: this.$t('koejakso'),
        to: { name: 'koejakso' }
      },
      {
        text: this.$t('aloituskeskustelu-kouluttaja'),
        active: true
      }
    ]
    buttonStates: KoejaksonVaiheButtonStates = {
      primaryButtonLoading: false,
      secondaryButtonLoading: false
    }
    loading = true
    aloituskeskustelu: null | AloituskeskusteluLomake = null
    koejaksonVaihe = this.$t('aloituskeskustelu')

    validateState(value: string) {
      const form = this.$v
      const { $dirty, $error } = _get(form, value) as any
      return $dirty ? ($error ? false : null) : null
    }

    hideModal(id: string) {
      return this.$bvModal.hide(id)
    }

    get aloituskeskusteluId() {
      return Number(this.$route.params.id)
    }

    get aloituskeskustelunTila() {
      return store.getters['kouluttaja/koejaksot'].find(
        (k: any) => k.id === this.aloituskeskusteluId
      )?.tila
    }

    get showAllekirjoitukset() {
      return (
        this.aloituskeskustelu?.erikoistuvanAllekirjoitusaika !== null ||
        this.aloituskeskustelu?.lahikouluttaja.sopimusHyvaksytty ||
        this.aloituskeskustelu?.lahiesimies.sopimusHyvaksytty
      )
    }

    get returned() {
      return this.aloituskeskustelunTila === LomakeTilat.PALAUTETTU_KORJATTAVAKSI
    }

    get isCurrentUserLahiesimies() {
      const currentUser = store.getters['auth/account']
      return this.aloituskeskustelu?.lahiesimies.kayttajaUserId === currentUser.id
    }

    get editable() {
      return (
        this.aloituskeskustelunTila !== LomakeTilat.PALAUTETTU_KORJATTAVAKSI &&
        ((this.isCurrentUserLahiesimies &&
          !this.aloituskeskustelu?.lahiesimies.sopimusHyvaksytty) ||
          !this.aloituskeskustelu?.lahikouluttaja.sopimusHyvaksytty)
      )
    }

    get acceptedByEveryone() {
      return (
        this.aloituskeskustelunTila !== LomakeTilat.PALAUTETTU_KORJATTAVAKSI &&
        this.aloituskeskustelu?.lahikouluttaja.sopimusHyvaksytty &&
        this.aloituskeskustelu?.lahiesimies.sopimusHyvaksytty
      )
    }

    get tyotunnitViikossa() {
      return this.aloituskeskustelu?.tyotunnitViikossa?.toString().replace('.', ',')
    }

    get showWaitingForLahiesimies() {
      return (
        !this.isCurrentUserLahiesimies &&
        this.aloituskeskustelunTila !== LomakeTilat.PALAUTETTU_KORJATTAVAKSI &&
        this.aloituskeskustelu?.lahikouluttaja.sopimusHyvaksytty &&
        !this.aloituskeskustelu?.lahiesimies.sopimusHyvaksytty
      )
    }

    get erikoistuvanEtunimi() {
      return this.aloituskeskustelu?.erikoistuvanNimi.split(' ')[0]
    }

    get erikoistuvanSukunimi() {
      return this.aloituskeskustelu?.erikoistuvanNimi.split(' ')[1]
    }

    get allekirjoitukset() {
      const allekirjoitusErikoistuva = allekirjoituksetHelper.mapAllekirjoitusErikoistuva(
        this,
        this.aloituskeskustelu?.erikoistuvanNimi,
        this.aloituskeskustelu?.erikoistuvanAllekirjoitusaika
      ) as KoejaksonVaiheAllekirjoitus
      const allekirjoitusLahikouluttaja = allekirjoituksetHelper.mapAllekirjoitusLahikouluttaja(
        this,
        this.aloituskeskustelu?.lahikouluttaja
      )
      const allekirjoitusLahiesimies = allekirjoituksetHelper.mapAllekirjoitusLahiesimies(
        this,
        this.aloituskeskustelu?.lahiesimies
      )

      return [
        allekirjoitusErikoistuva,
        allekirjoitusLahikouluttaja,
        allekirjoitusLahiesimies
      ].filter((a): a is KoejaksonVaiheAllekirjoitus => a !== null)
    }

    async returnToSender(korjausehdotus: string) {
      const form = {
        ...this.aloituskeskustelu,
        korjausehdotus: korjausehdotus,
        lahetetty: false
      }
      try {
        this.buttonStates.secondaryButtonLoading = true
        await store.dispatch('kouluttaja/putAloituskeskustelu', form)
        this.buttonStates.secondaryButtonLoading = false
        this.skipRouteExitConfirm = true
        checkCurrentRouteAndRedirect(this.$router, '/koejakso')
        toastSuccess(this, this.$t('aloituskeskustelu-palautettu-erikoistuvalle-muokattavaksi'))
      } catch (err) {
        toastFail(this, this.$t('aloituskeskustelu-palautus-epaonnistui'))
      }
    }

    async onSubmit() {
      const form = this.isCurrentUserLahiesimies
        ? {
            ...this.aloituskeskustelu,
            lahiesimies: {
              sopimusHyvaksytty: true,
              kuittausaika: format(new Date(), 'yyyy-MM-dd')
            }
          }
        : {
            ...this.aloituskeskustelu,
            lahikouluttaja: {
              sopimusHyvaksytty: true,
              kuittausaika: format(new Date(), 'yyyy-MM-dd')
            }
          }
      try {
        this.buttonStates.primaryButtonLoading = true
        await store.dispatch('kouluttaja/putAloituskeskustelu', form)
        this.buttonStates.primaryButtonLoading = false
        this.skipRouteExitConfirm = true
        checkCurrentRouteAndRedirect(this.$router, '/koejakso')
        toastSuccess(this, this.$t('aloituskeskustelu-lisatty-onnistuneesti'))
      } catch (err) {
        toastFail(this, this.$t('aloituskeskustelu-lisaaminen-epaonnistui'))
      }
    }

    async mounted() {
      this.loading = true
      await store.dispatch('kouluttaja/getKoejaksot')
      const { data } = await api.getAloituskeskustelu(this.aloituskeskusteluId)
      this.aloituskeskustelu = data
      this.loading = false

      if (!this.editable || this.returned) {
        this.skipRouteExitConfirm = true
      }
    }
  }
</script>

<style lang="scss">
  .textarea-min-height {
    min-height: 100px;
  }
</style>
