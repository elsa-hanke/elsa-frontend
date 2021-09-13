<template>
  <div class="col-lg-8 px-0">
    <b-breadcrumb :items="items" class="mb-0" />
    <b-container fluid>
      <h1 class="mb-3">{{ $t('kehittamistoimenpiteet-otsikko') }}</h1>
      <div v-if="!loading">
        <div v-if="editableForEsimies">
          <p>{{ $t('kehittamistoimenpiteet-esimies-ingressi') }}</p>
        </div>
        <div v-else-if="editable">
          <p>{{ $t('kehittamistoimenpiteet-kouluttaja-ingressi') }}</p>
        </div>
        <b-alert :show="waitingForLahiesimiesOrErikoistuva" variant="dark" class="mt-3">
          <div class="d-flex flex-row">
            <em class="align-middle">
              <font-awesome-icon :icon="['fas', 'info-circle']" class="text-muted mr-2" />
            </em>
            <div>
              {{ $t('kehittamistoimenpiteet-kouluttaja-allekirjoitettu') }}
            </div>
          </div>
        </b-alert>
        <b-alert :show="waitingForErikoistuva" variant="dark" class="mt-3">
          <div class="d-flex flex-row">
            <em class="align-middle">
              <font-awesome-icon :icon="['fas', 'info-circle']" class="text-muted mr-2" />
            </em>
            <div>
              {{ $t('kehittamistoimenpiteet-esimies-allekirjoitettu') }}
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
                {{ $t('kehittamistoimenpiteet-palautettu-kouluttajalle-muokattavaksi-esimies') }}
              </span>
              <span v-else>
                {{ $t('kehittamistoimenpiteet-palautettu-kouluttajalle-muokattavaksi-kouluttaja') }}
              </span>
              <span class="d-block">
                {{ $t('syy') }} {{ kehittamistoimenpiteet.korjausehdotus }}
              </span>
            </div>
          </div>
        </b-alert>
        <b-alert variant="success" :show="acceptedByEveryone">
          <div class="d-flex flex-row">
            <em class="align-middle">
              <font-awesome-icon :icon="['fas', 'check-circle']" class="mr-2" />
            </em>
            <span>{{ $t('kehittamistoimenpiteet-tila-hyvaksytty') }}</span>
          </div>
        </b-alert>
        <hr />
        <erikoistuva-details
          :avatar="erikoistuvanAvatar"
          :name="erikoistuvanNimi"
          :erikoisala="kehittamistoimenpiteet.erikoistuvanErikoisala"
          :opiskelijatunnus="kehittamistoimenpiteet.erikoistuvanOpiskelijatunnus"
          :yliopisto="kehittamistoimenpiteet.erikoistuvanYliopisto"
          :kehittamistoimenpiteet="kehittamistoimenpiteet.kehittamistoimenpiteetKuvaus"
          :show-birthdate="false"
        />
        <hr />

        <h3 class="mb-3">{{ $t('kehittamistoimenpiteiden-arviointi') }}</h3>
        <b-row>
          <b-col lg="8">
            <div v-if="editable">
              <b-form-group>
                <template v-slot="{ uid }">
                  <b-form-radio-group
                    :id="uid"
                    v-model="kehittamistoimenpiteet.kehittamistoimenpiteetRiittavat"
                    :options="kehittamistoimenpiteidenArviointiOptions"
                    :state="validateState('kehittamistoimenpiteetRiittavat')"
                    stacked
                  ></b-form-radio-group>
                  <b-form-invalid-feedback
                    :id="`${uid}-feedback`"
                    :state="validateState('kehittamistoimenpiteetRiittavat')"
                  >
                    {{ $t('pakollinen-tieto') }}
                  </b-form-invalid-feedback>
                </template>
              </b-form-group>
            </div>
            <div v-else>
              <p v-if="kehittamistoimenpiteet.kehittamistoimenpiteetRiittavat">
                {{ $t('kehittamistoimenpiteet-riittavat') }}
              </p>
              <p v-else>{{ $t('kehittamistoimenpiteet-ei-riittavat') }}</p>
            </div>
          </b-col>
        </b-row>
        <hr />
        <koulutuspaikan-arvioijat
          :lahikouluttaja="kehittamistoimenpiteet.lahikouluttaja"
          :lahiesimies="kehittamistoimenpiteet.lahiesimies"
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
  import { required } from 'vuelidate/lib/validators'
  import _get from 'lodash/get'
  import { getKehittamistoimenpiteet } from '@/api/kouluttaja'
  import store from '@/store'
  import ElsaButton from '@/components/button/button.vue'
  import { checkCurrentRouteAndRedirect } from '@/utils/functions'
  import { toastFail, toastSuccess } from '@/utils/toast'
  import ErikoistuvaDetails from '@/components/erikoistuva-details/erikoistuva-details.vue'
  import ElsaFormGroup from '@/components/form-group/form-group.vue'
  import { KehittamistoimenpiteetLomake, KoejaksonVaiheButtonStates } from '@/types'
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
      kehittamistoimenpiteet: {
        kehittamistoimenpiteetRiittavat: {
          required
        }
      }
    }
  })
  export default class KouluttajaArviointilomakeKehittamistoimenpiteet extends Mixins(
    validationMixin
  ) {
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
        text: this.$t('kehittamistoimenpiteet-otsikko'),
        active: true
      }
    ]

    kehittamistoimenpiteidenArviointiOptions = [
      {
        text: this.$t('kehittamistoimenpiteet-riittavat'),
        value: true
      },
      {
        text: this.$t('kehittamistoimenpiteet-ei-riittavat'),
        value: false
      }
    ]

    buttonStates: KoejaksonVaiheButtonStates = {
      primaryButtonLoading: false,
      secondaryButtonLoading: false
    }

    loading = true

    kehittamistoimenpiteet: KehittamistoimenpiteetLomake | null = null

    validateState(value: string) {
      const form = this.$v.kehittamistoimenpiteet
      const { $dirty, $error } = _get(form, value) as any
      return $dirty ? ($error ? false : null) : null
    }

    get kehittamistoimenpiteetTila() {
      return store.getters['kouluttaja/koejaksot'].find(
        (k: any) => k.id === this.kehittamistoimenpiteet?.id
      )?.tila
    }

    get kehittamistoimenpiteetId() {
      return Number(this.$route.params.id)
    }

    get editable() {
      return (
        !this.isCurrentUserLahiesimies &&
        !this.kehittamistoimenpiteet?.lahikouluttaja.sopimusHyvaksytty
      )
    }

    get editableForEsimies() {
      return (
        this.isCurrentUserLahiesimies &&
        this.kehittamistoimenpiteet?.lahikouluttaja.sopimusHyvaksytty &&
        !this.kehittamistoimenpiteet?.lahiesimies.sopimusHyvaksytty
      )
    }

    get isCurrentUserLahiesimies() {
      const currentUser = store.getters['auth/account']
      return this.kehittamistoimenpiteet?.lahiesimies.kayttajaUserId === currentUser.id
    }

    get erikoistuvanAvatar() {
      return this.kehittamistoimenpiteet?.erikoistuvanAvatar
    }

    get erikoistuvanNimi() {
      return this.kehittamistoimenpiteet?.erikoistuvanNimi
    }

    get waitingForLahiesimiesOrErikoistuva() {
      return (
        !this.isCurrentUserLahiesimies &&
        this.kehittamistoimenpiteet?.lahikouluttaja.sopimusHyvaksytty &&
        !this.kehittamistoimenpiteet?.erikoistuvaAllekirjoittanut
      )
    }

    get waitingForErikoistuva() {
      return (
        this.isCurrentUserLahiesimies &&
        this.kehittamistoimenpiteet?.lahiesimies.sopimusHyvaksytty &&
        !this.kehittamistoimenpiteet?.erikoistuvaAllekirjoittanut
      )
    }

    get acceptedByEveryone() {
      return this.kehittamistoimenpiteet?.erikoistuvaAllekirjoittanut
    }

    get returned() {
      return this.kehittamistoimenpiteetTila === LomakeTilat.PALAUTETTU_KORJATTAVAKSI
    }

    get allekirjoitukset(): KoejaksonVaiheAllekirjoitus[] {
      const allekirjoitusErikoistuva = allekirjoituksetHelper.mapAllekirjoitusErikoistuva(
        this,
        this.kehittamistoimenpiteet?.erikoistuvanNimi,
        this.kehittamistoimenpiteet?.erikoistuvanAllekirjoitusaika
      ) as KoejaksonVaiheAllekirjoitus
      const allekirjoitusLahikouluttaja = allekirjoituksetHelper.mapAllekirjoitusLahikouluttaja(
        this,
        this.kehittamistoimenpiteet?.lahikouluttaja
      )
      const allekirjoitusLahiesimies = allekirjoituksetHelper.mapAllekirjoitusLahiesimies(
        this,
        this.kehittamistoimenpiteet?.lahiesimies
      )

      return [
        allekirjoitusLahikouluttaja,
        allekirjoitusLahiesimies,
        allekirjoitusErikoistuva
      ].filter((a): a is KoejaksonVaiheAllekirjoitus => a !== null)
    }

    async onReturnToSender(korjausehdotus: string) {
      const form = {
        ...this.kehittamistoimenpiteet,
        korjausehdotus: korjausehdotus,
        lahetetty: false
      }

      try {
        this.buttonStates.secondaryButtonLoading = true
        await store.dispatch('kouluttaja/putKehittamistoimenpiteet', form)
        this.buttonStates.secondaryButtonLoading = false
        checkCurrentRouteAndRedirect(this.$router, '/koejakso')
        toastSuccess(this, this.$t('kehittamistoimenpiteet-palautus-onnistui'))
      } catch (err) {
        toastFail(this, this.$t('kehittamistoimenpiteet-palautus-epaonnistui'))
      }
    }

    async onSign() {
      if (!this.kehittamistoimenpiteet) return
      try {
        this.buttonStates.primaryButtonLoading = true
        await store.dispatch('kouluttaja/putKehittamistoimenpiteet', this.kehittamistoimenpiteet)
        this.buttonStates.primaryButtonLoading = false
        checkCurrentRouteAndRedirect(this.$router, '/koejakso')
        toastSuccess(this, this.$t('kehittamistoimenpiteet-allekirjoitus-ja-lahetys-onnistui'))
      } catch (err) {
        toastFail(this, this.$t('kehittamistoimenpiteet-allekirjoitus-ja-lahetys-epaonnistui'))
      }
    }

    onValidateAndConfirm() {
      if (!this.isCurrentUserLahiesimies) {
        this.$v.$touch()
        if (this.$v.$anyError) {
          return
        }
      }
      return this.$bvModal.show('confirm-send')
    }

    async mounted() {
      this.loading = true
      await store.dispatch('kouluttaja/getKoejaksot')
      const { data } = await getKehittamistoimenpiteet(this.kehittamistoimenpiteetId)
      this.kehittamistoimenpiteet = data
      this.loading = false
    }
  }
</script>
