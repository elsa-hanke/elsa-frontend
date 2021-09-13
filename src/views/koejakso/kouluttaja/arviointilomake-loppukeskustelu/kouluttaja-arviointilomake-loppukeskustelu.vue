<template>
  <div class="col-lg-8 px-0">
    <b-breadcrumb :items="items" class="mb-0" />
    <b-container fluid>
      <h1 class="mb-3">{{ $t('loppukeskustelu-kouluttaja') }}</h1>

      <div v-if="!loading">
        <div v-if="editableForEsimies">
          <p>{{ $t('loppukeskustelu-esimies-ingressi') }}</p>
        </div>
        <div v-else-if="editable">
          <p>{{ $t('loppukeskustelu-kouluttaja-ingressi') }}</p>
        </div>

        <b-alert :show="showWaitingForLahiesimiesOrErikoistuva" variant="dark" class="mt-3">
          <div class="d-flex flex-row">
            <em class="align-middle">
              <font-awesome-icon :icon="['fas', 'info-circle']" class="text-muted mr-2" />
            </em>
            <div>
              {{ $t('loppukeskustelu-kouluttaja-allekirjoitettu') }}
            </div>
          </div>
        </b-alert>

        <b-alert :show="showWaitingForErikoistuva" variant="dark" class="mt-3">
          <div class="d-flex flex-row">
            <em class="align-middle">
              <font-awesome-icon :icon="['fas', 'info-circle']" class="text-muted mr-2" />
            </em>
            <div>
              {{ $t('loppukeskustelu-esimies-allekirjoitettu') }}
            </div>
          </div>
        </b-alert>

        <b-alert
          :show="returned"
          :variant="isCurrentUserLahiesimies ? 'dark' : 'danger'"
          class="mt-3"
        >
          <div class="d-flex flex-row">
            <em class="align-middle">
              <font-awesome-icon
                v-if="isCurrentUserLahiesimies"
                :icon="['fas', 'info-circle']"
                class="text-muted mr-2"
              />
              <font-awesome-icon v-else :icon="['fas', 'exclamation-circle']" class="mr-2" />
            </em>
            <div>
              <span v-if="isCurrentUserLahiesimies">
                {{ $t('loppukeskustelu-palautettu-kouluttajalle-muokattavaksi-esimies') }}
              </span>
              <span v-else>
                {{ $t('loppukeskustelu-palautettu-kouluttajalle-muokattavaksi-kouluttaja') }}
              </span>
              <span class="d-block">{{ $t('syy') }} {{ loppukeskustelu.korjausehdotus }}</span>
            </div>
          </div>
        </b-alert>

        <b-alert variant="success" :show="acceptedByEveryone">
          <div class="d-flex flex-row">
            <em class="align-middle">
              <font-awesome-icon :icon="['fas', 'check-circle']" class="mr-2" />
            </em>
            <span>{{ $t('loppukeskustelu-tila-hyvaksytty') }}</span>
          </div>
        </b-alert>

        <hr />

        <erikoistuva-details
          :avatar="erikoistuvanAvatar"
          :name="erikoistuvanNimi"
          :erikoisala="loppukeskustelu.erikoistuvanErikoisala"
          :opiskelijatunnus="loppukeskustelu.erikoistuvanOpiskelijatunnus"
          :yliopisto="loppukeskustelu.erikoistuvanYliopisto"
          :show-birthdate="false"
        />

        <hr />

        <div>
          <b-row>
            <b-col lg="8">
              <div v-if="!editable">
                <h3>{{ $t('koejakson-tavoitteet-on-kasitelty-loppukeskustelussa') }}</h3>
                <p>
                  {{
                    loppukeskustelu.esitetaanKoejaksonHyvaksymista
                      ? $t('loppukeskustelu-kayty-hyvaksytty')
                      : $t('loppukeskustelu-kayty-jatkotoimenpiteet')
                  }}
                </p>
                <div v-if="!loppukeskustelu.esitetaanKoejaksonHyvaksymista">
                  <h5>{{ $t('selvitys-jatkotoimista') }}</h5>
                  <p>{{ loppukeskustelu.jatkotoimenpiteet }}</p>
                </div>
              </div>
              <elsa-form-group
                v-else
                :label="$t('koejakson-tavoitteet-on-kasitelty-loppukeskustelussa')"
                :required="true"
              >
                <template v-slot="{ uid }">
                  <b-form-radio-group
                    :id="uid"
                    v-model="loppukeskustelu.esitetaanKoejaksonHyvaksymista"
                    :options="hyvaksyttyVaihtoehdot"
                    :state="validateState('esitetaanKoejaksonHyvaksymista')"
                    stacked
                  ></b-form-radio-group>
                  <b-form-invalid-feedback
                    :id="`${uid}-feedback`"
                    :state="validateState('esitetaanKoejaksonHyvaksymista')"
                  >
                    {{ $t('pakollinen-tieto') }}
                  </b-form-invalid-feedback>
                  <elsa-form-group
                    class="mt-4"
                    v-if="loppukeskustelu.esitetaanKoejaksonHyvaksymista === false"
                    :label="$t('selvitys-jatkotoimista')"
                    :required="true"
                  >
                    <template v-slot="{ uid }">
                      <b-form-textarea
                        :id="uid"
                        v-model="loppukeskustelu.jatkotoimenpiteet"
                        :state="validateState('jatkotoimenpiteet')"
                        rows="7"
                        class="textarea-min-height"
                      ></b-form-textarea>
                      <b-form-invalid-feedback :id="`${uid}-feedback`">
                        {{ $t('pakollinen-tieto') }}
                      </b-form-invalid-feedback>
                    </template>
                  </elsa-form-group>
                </template>
              </elsa-form-group>
            </b-col>
          </b-row>
          <hr />
        </div>
        <koulutuspaikan-arvioijat
          :lahikouluttaja="loppukeskustelu.lahikouluttaja"
          :lahiesimies="loppukeskustelu.lahiesimies"
          :isReadonly="true"
        />
        <hr />

        <div v-if="allekirjoitukset.length > 0">
          <koejakson-vaihe-allekirjoitukset :allekirjoitukset="allekirjoitukset" />
        </div>

        <div v-if="editable || editableForEsimies">
          <hr v-if="allekirjoitukset.length > 0" />
          <b-row>
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
                v-if="isCurrentUserLahiesimies"
                class="my-2 mr-3 d-block d-md-inline-block d-lg-block d-xl-inline-block"
                style="min-width: 14rem"
                variant="outline-primary"
                :disabled="buttonStates.primaryButtonLoading"
                :loading="buttonStates.secondaryButtonLoading"
                v-b-modal.return-to-sender
              >
                {{ $t('palauta-muokattavaksi') }}
              </elsa-button>
              <elsa-button
                class="my-2 mr-3 d-block d-md-inline-block d-lg-block d-xl-inline-block"
                style="min-width: 14rem"
                variant="primary"
                :disabled="buttonStates.secondaryButtonLoading"
                :loading="buttonStates.primaryButtonLoading"
                @click="onValidateAndConfirm"
              >
                {{ $t('allekirjoita-laheta') }}
              </elsa-button>
            </b-col>
          </b-row>
        </div>
      </div>
      <div v-else class="text-center">
        <b-spinner variant="primary" :label="$t('ladataan')" />
      </div>
    </b-container>

    <elsa-confirmation-modal
      id="confirm-send"
      :title="$t('vahvista-lomakkeen-lahetys')"
      :text="
        isCurrentUserLahiesimies
          ? $t('vahvista-koejakson-vaihe-erikoistuvalle')
          : $t('vahvista-koejakson-vaihe-esimiehelle')
      "
      :submitText="$t('allekirjoita-laheta')"
      @submit="onSign"
    />

    <elsa-return-to-sender-modal
      id="return-to-sender"
      :title="$t('palauta-kouluttajalle-muokattavaksi')"
      @submit="onReturnToSender"
    />
  </div>
</template>

<script lang="ts">
  import Component from 'vue-class-component'
  import { Mixins } from 'vue-property-decorator'
  import { validationMixin } from 'vuelidate'
  import { required, requiredIf } from 'vuelidate/lib/validators'
  import _get from 'lodash/get'
  import * as api from '@/api/kouluttaja'
  import store from '@/store'
  import ElsaButton from '@/components/button/button.vue'
  import { checkCurrentRouteAndRedirect } from '@/utils/functions'
  import { toastFail, toastSuccess } from '@/utils/toast'
  import ErikoistuvaDetails from '@/components/erikoistuva-details/erikoistuva-details.vue'
  import ElsaFormGroup from '@/components/form-group/form-group.vue'
  import { LoppukeskusteluLomake, KoejaksonVaiheButtonStates } from '@/types'
  import { LomakeTilat } from '@/utils/constants'
  import ElsaConfirmationModal from '@/components/modal/confirmation-modal.vue'
  import ElsaReturnToSenderModal from '@/components/modal/return-to-sender-modal.vue'
  import KoulutuspaikanArvioijat from '@/components/koejakson-vaiheet/koulutuspaikan-arvioijat.vue'
  import KoejaksonVaiheAllekirjoitukset from '@/components/koejakson-vaiheet/koejakson-vaihe-allekirjoitukset.vue'
  import { KoejaksonVaiheAllekirjoitus } from '@/types'
  import * as allekirjoituksetHelper from '@/utils/koejaksonVaiheAllekirjoitusMapper'

  @Component({
    components: {
      ErikoistuvaDetails,
      ElsaFormGroup,
      ElsaButton,
      ElsaConfirmationModal,
      ElsaReturnToSenderModal,
      KoulutuspaikanArvioijat,
      KoejaksonVaiheAllekirjoitukset
    },
    validations: {
      loppukeskustelu: {
        esitetaanKoejaksonHyvaksymista: {
          required
        },
        jatkotoimenpiteet: {
          required: requiredIf((value) => {
            return value.esitetaanKoejaksonHyvaksymista === false
          })
        }
      }
    }
  })
  export default class KouluttajaArviointilomakeLoppukeskustelu extends Mixins(validationMixin) {
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
        text: this.$t('loppukeskustelu-kouluttaja'),
        active: true
      }
    ]

    hyvaksyttyVaihtoehdot = [
      {
        text: this.$t('loppukeskustelu-kayty-hyvaksytty'),
        value: true
      },
      {
        text: this.$t('loppukeskustelu-kayty-jatkotoimenpiteet'),
        value: false
      }
    ]

    buttonStates: KoejaksonVaiheButtonStates = {
      primaryButtonLoading: false,
      secondaryButtonLoading: false
    }

    loading = true

    loppukeskustelu: LoppukeskusteluLomake | null = null

    validateState(value: string) {
      const form = this.$v.loppukeskustelu
      const { $dirty, $error } = _get(form, value) as any
      return $dirty ? ($error ? false : null) : null
    }

    get loppukeskustelunTila() {
      return store.getters['kouluttaja/koejaksot'].find(
        (k: any) => k.id === this.loppukeskustelu?.id
      )?.tila
    }

    get loppukeskusteluId() {
      return Number(this.$route.params.id)
    }

    get editable() {
      return (
        !this.isCurrentUserLahiesimies && !this.loppukeskustelu?.lahikouluttaja.sopimusHyvaksytty
      )
    }

    get editableForEsimies() {
      return (
        this.isCurrentUserLahiesimies &&
        this.loppukeskustelu?.lahikouluttaja.sopimusHyvaksytty &&
        !this.loppukeskustelu?.lahiesimies.sopimusHyvaksytty
      )
    }

    get isCurrentUserLahiesimies() {
      const currentUser = store.getters['auth/account']
      return this.loppukeskustelu?.lahiesimies.kayttajaUserId === currentUser.id
    }

    get erikoistuvanAvatar() {
      return this.loppukeskustelu?.erikoistuvanAvatar
    }

    get erikoistuvanNimi() {
      return this.loppukeskustelu?.erikoistuvanNimi
    }

    get showWaitingForLahiesimiesOrErikoistuva() {
      return (
        !this.isCurrentUserLahiesimies &&
        this.loppukeskustelu?.lahikouluttaja.sopimusHyvaksytty &&
        !this.loppukeskustelu?.erikoistuvaAllekirjoittanut
      )
    }

    get showWaitingForErikoistuva() {
      return (
        this.isCurrentUserLahiesimies &&
        this.loppukeskustelu?.lahiesimies.sopimusHyvaksytty &&
        !this.loppukeskustelu?.erikoistuvaAllekirjoittanut
      )
    }

    get acceptedByEveryone() {
      return this.loppukeskustelu?.erikoistuvaAllekirjoittanut
    }

    get returned() {
      return this.loppukeskustelunTila === LomakeTilat.PALAUTETTU_KORJATTAVAKSI
    }

    get allekirjoitukset(): KoejaksonVaiheAllekirjoitus[] {
      const allekirjoitusErikoistuva = allekirjoituksetHelper.mapAllekirjoitusErikoistuva(
        this,
        this.loppukeskustelu?.erikoistuvanNimi,
        this.loppukeskustelu?.erikoistuvanAllekirjoitusaika
      )
      const allekirjoitusLahikouluttaja = allekirjoituksetHelper.mapAllekirjoitusLahikouluttaja(
        this,
        this.loppukeskustelu?.lahikouluttaja
      )
      const allekirjoitusLahiesimies = allekirjoituksetHelper.mapAllekirjoitusLahiesimies(
        this,
        this.loppukeskustelu?.lahiesimies
      )

      return [
        allekirjoitusLahikouluttaja,
        allekirjoitusLahiesimies,
        allekirjoitusErikoistuva
      ].filter((a): a is KoejaksonVaiheAllekirjoitus => a !== null)
    }

    async onReturnToSender(korjausehdotus: string) {
      const form = {
        ...this.loppukeskustelu,
        korjausehdotus: korjausehdotus,
        lahetetty: false
      }

      try {
        this.buttonStates.secondaryButtonLoading = true
        await store.dispatch('kouluttaja/putLoppukeskustelu', form)
        this.buttonStates.secondaryButtonLoading = false
        checkCurrentRouteAndRedirect(this.$router, '/koejakso')
        toastSuccess(this, this.$t('loppukeskustelu-palautettu-muokattavaksi'))
      } catch (err) {
        toastFail(this, this.$t('loppukeskustelu-palautus-epaonnistui'))
      }
    }

    async onSign() {
      if (!this.loppukeskustelu) return
      if (this.loppukeskustelu.esitetaanKoejaksonHyvaksymista === true) {
        this.loppukeskustelu.jatkotoimenpiteet = null
      }
      try {
        this.buttonStates.primaryButtonLoading = true
        await store.dispatch('kouluttaja/putLoppukeskustelu', this.loppukeskustelu)
        this.buttonStates.primaryButtonLoading = false

        checkCurrentRouteAndRedirect(this.$router, '/koejakso')
        toastSuccess(this, this.$t('loppukeskustelu-allekirjoitettu-ja-lahetetty-onnistuneesti'))
      } catch (err) {
        toastFail(this, this.$t('loppukeskustelun-tallennus-epaonnistui'))
      }
    }

    onValidateAndConfirm() {
      this.$v.$touch()
      if (this.$v.$anyError) {
        return
      }
      return this.$bvModal.show('confirm-send')
    }

    async mounted() {
      this.loading = true
      await store.dispatch('kouluttaja/getKoejaksot')
      const { data } = await api.getLoppukeskustelu(this.loppukeskusteluId)
      this.loppukeskustelu = data
      this.loading = false
    }
  }
</script>

<style lang="scss">
  .textarea-min-height {
    min-height: 100px;
  }
</style>
