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
          <span>{{ $t('aloituskeskustelu-hyvaksytty-kaikkien-toimesta') }}</span>
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
        <b-row>
          <b-col>
            <h3>{{ $t('koulutuspaikan-arvioijat') }}</h3>
            <h5>{{ $t('lahikouluttaja') }}</h5>
            <p>{{ aloituskeskustelu.lahikouluttaja.nimi }}</p>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <h5>{{ $t('lahiesimies-tai-muu') }}</h5>
            <p>{{ aloituskeskustelu.lahiesimies.nimi }}</p>
          </b-col>
        </b-row>
        <hr />
        <b-row>
          <b-col>
            <h3>{{ $t('aloituskeskustelu-tavoitteet') }}</h3>
            <h5>{{ $t('koejakso-osaamistavoitteet') }}</h5>
            <p>{{ aloituskeskustelu.koejaksonOsaamistavoitteet }}</p>
          </b-col>
        </b-row>
        <hr />
        <b-row v-if="showAllekirjoitukset">
          <b-col lg="8">
            <h3>{{ $t('allekirjoitukset') }}</h3>
          </b-col>
        </b-row>
        <b-row v-if="aloituskeskustelu.erikoistuvanAllekirjoitusaika !== null">
          <b-col lg="2">
            <h5>{{ $t('päiväys') }}</h5>
            <p>{{ $date(aloituskeskustelu.erikoistuvanAllekirjoitusaika) }}</p>
          </b-col>
          <b-col lg="6">
            <h5>{{ $t('nimi-ja-nimike') }}</h5>
            <p>
              {{ aloituskeskustelu.erikoistuvanNimi }},
              {{ $t('erikoistuva-laakari').toLowerCase() }}
            </p>
          </b-col>
        </b-row>
        <b-row v-if="aloituskeskustelu.lahikouluttaja.sopimusHyvaksytty">
          <b-col lg="2">
            <h5>{{ $t('päiväys') }}</h5>
            <p>{{ $date(aloituskeskustelu.lahikouluttaja.kuittausaika) }}</p>
          </b-col>
          <b-col lg="6">
            <h5>{{ $t('nimi-ja-nimike') }}</h5>
            <p>
              {{ aloituskeskustelu.lahikouluttaja.nimi }},
              {{ $t('lahikouluttaja').toLowerCase() }}
            </p>
          </b-col>
        </b-row>
        <b-row v-if="aloituskeskustelu.lahiesimies.sopimusHyvaksytty">
          <b-col lg="2">
            <h5>{{ $t('päiväys') }}</h5>
            <p>{{ $date(aloituskeskustelu.lahiesimies.kuittausaika) }}</p>
          </b-col>
          <b-col lg="6">
            <h5>{{ $t('nimi-ja-nimike') }}</h5>
            <p>
              {{ aloituskeskustelu.lahiesimies.nimi }},
              {{ $t('lahiesimies').toLowerCase() }}
            </p>
          </b-col>
        </b-row>
      </div>
      <hr v-if="showAllekirjoitukset && editable" />
      <b-row v-if="editable">
        <b-col>
          <elsa-button variant="outline-primary" v-b-modal.return-to-sender>
            {{ $t('palauta-muokattavaksi') }}
          </elsa-button>
        </b-col>
        <b-col class="text-right">
          <elsa-button variant="back" :to="{ name: 'koejakso' }">{{ $t('peruuta') }}</elsa-button>
          <elsa-button
            v-if="isCurrentUserLahiesimies"
            v-b-modal.confirm-send
            variant="primary"
            class="ml-4 px-5"
          >
            {{ $t('allekirjoita-laheta') }}
          </elsa-button>
          <elsa-button
            v-else
            :loading="params.saving"
            @click="onSubmit"
            variant="primary"
            class="ml-4 px-5"
          >
            {{ $t('allekirjoita-laheta') }}
          </elsa-button>
        </b-col>
      </b-row>
    </b-container>

    <b-modal id="return-to-sender" :title="$t('palauta-erikoistuvalle-muokattavaksi')">
      <div class="d-block">
        <b-form>
          <elsa-form-group :label="$t('syy-palautukseen')" :required="true">
            <template v-slot="{ uid }">
              <b-form-textarea
                :id="uid"
                v-model="korjausehdotus"
                :state="validateState('korjausehdotus')"
                rows="4"
                class="textarea-min-height"
              ></b-form-textarea>
            </template>
          </elsa-form-group>
        </b-form>
      </div>
      <template #modal-footer>
        <elsa-button variant="back" @click="hideModal('return-to-sender')">
          {{ $t('peruuta') }}
        </elsa-button>
        <elsa-button variant="primary" @click="returnToSender">
          {{ $t('palauta-muokattavaksi') }}
        </elsa-button>
      </template>
    </b-modal>

    <b-modal id="confirm-send" :title="$t('vahvista-lomakkeen-lahetys')">
      <div class="d-block">
        <p>{{ $t('vahvista-koejakson-vaihe-hyvaksytty', { koejaksonVaihe }) }}</p>
      </div>
      <template #modal-footer>
        <elsa-button variant="back" @click="hideModal('confirm-send')">
          {{ $t('peruuta') }}
        </elsa-button>
        <elsa-button variant="primary" @click="onSubmit">
          {{ $t('allekirjoita-laheta') }}
        </elsa-button>
      </template>
    </b-modal>
  </div>
</template>

<script lang="ts">
  import Component from 'vue-class-component'
  import { Mixins } from 'vue-property-decorator'
  import { validationMixin } from 'vuelidate'
  import { required } from 'vuelidate/lib/validators'
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

  @Component({
    components: {
      ErikoistuvaDetails,
      ElsaFormGroup,
      ElsaButton
    },
    validations: {
      korjausehdotus: {
        required
      }
    }
  })
  export default class KouluttajaArviointilomakeAloituskeskustelu extends Mixins(
    ConfirmRouteExit,
    validationMixin
  ) {
    skipRouteExitConfirm!: boolean
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
    params = {
      saving: false,
      deleting: false
    }
    loading = true
    aloituskeskustelu: null | AloituskeskusteluLomake = null
    korjausehdotus = ''
    koejaksonVaihe = 'aloituskeskustelu'

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
      return this.aloituskeskustelu?.tyotunnitViikossa
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

    async returnToSender() {
      this.$v.$touch()
      if (this.$v.$anyError) {
        return
      }

      const form = {
        ...this.aloituskeskustelu,
        korjausehdotus: this.korjausehdotus,
        lahetetty: false
      }
      try {
        await store.dispatch('kouluttaja/putAloituskeskustelu', form)
        this.skipRouteExitConfirm = true
        checkCurrentRouteAndRedirect(this.$router, '/koejakso')
        toastSuccess(this, this.$t('aloituskeskustelu-lisatty-onnistuneesti'))
      } catch (err) {
        toastFail(this, this.$t('aloituskeskustelu-lisaaminen-epaonnistui'))
      }
    }

    async updateSentForm() {
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
        await store.dispatch('kouluttaja/putAloituskeskustelu', form)

        checkCurrentRouteAndRedirect(this.$router, '/koejakso')
        toastSuccess(this, this.$t('aloituskeskustelu-lisatty-onnistuneesti'))
      } catch (err) {
        toastFail(this, this.$t('aloituskeskustelu-lisaaminen-epaonnistui'))
      }
    }

    onSubmit(params: any) {
      params.saving = true
      this.updateSentForm()
      this.skipRouteExitConfirm = true
      params.saving = false
    }

    async mounted() {
      this.loading = true
      await store.dispatch('kouluttaja/getKoejaksot')
      const { data } = await api.getAloituskeskustelu(this.aloituskeskusteluId)
      this.aloituskeskustelu = data
      this.loading = false

      if (!this.editable) {
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
