<template>
  <div class="col-lg-8 px-0">
    <b-breadcrumb :items="items" class="mb-0" />

    <b-container fluid>
      <h1 class="mb-3">{{ $t('koejakson-loppukeskustelu') }}</h1>
      <div v-if="!loading">
        <b-row lg>
          <b-col>
            <div v-if="editable">
              <p>{{ $t('koejakson-loppukeskustelu-ingressi') }}</p>
            </div>
            <div v-else>
              <b-alert :show="waitingForAcceptance" variant="dark" class="mt-3">
                <div class="d-flex flex-row">
                  <em class="align-middle">
                    <font-awesome-icon :icon="['fas', 'info-circle']" class="text-muted mr-2" />
                  </em>
                  <div>
                    {{ $t('loppukeskustelu-tila-odottaa-hyvaksyntaa') }}
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
            </div>
          </b-col>
        </b-row>
        <hr />
        <b-row>
          <b-col>
            <erikoistuva-details
              :avatar="account.avatar"
              :name="`${account.firstName} ${account.lastName}`"
              :erikoisala="account.erikoistuvaLaakari.erikoisalaNimi"
              :opiskelijatunnus="account.erikoistuvaLaakari.opiskelijatunnus"
              :syntymaaika="account.erikoistuvaLaakari.syntymaaika"
              :yliopisto="account.erikoistuvaLaakari.yliopisto"
            ></erikoistuva-details>
          </b-col>
        </b-row>

        <hr />

        <div v-if="acceptedByEveryone">
          <h3 class="mb-3">{{ $t('koejakson-tavoitteet-on-kasitelty-loppukeskustelussa') }}</h3>
          <p v-if="loppukeskusteluLomake.esitetaanKoejaksonHyvaksymista">
            {{ $t('loppukeskustelu-kayty-hyvaksytty') }}
          </p>
          <p v-else>{{ $t('loppukeskustelu-kayty-jatkotoimenpiteet') }}</p>
          <b-row v-if="!loppukeskusteluLomake.esitetaanKoejaksonHyvaksymista">
            <b-col lg="8">
              <h5>{{ $t('selvitys-jatkotoimista') }}</h5>
              <p>{{ loppukeskusteluLomake.jatkotoimenpiteet }}</p>
            </b-col>
          </b-row>
          <hr />
        </div>

        <koulutuspaikan-arvioijat
          ref="koulutuspaikanArvioijat"
          :lahikouluttaja="loppukeskusteluLomake.lahikouluttaja"
          :lahiesimies="loppukeskusteluLomake.lahiesimies"
          :is-readonly="!editable"
          :allow-duplicates="true"
          @lahikouluttajaSelect="onLahikouluttajaSelect"
          @lahiesimiesSelect="onLahiesimiesSelect"
        />
        <hr />

        <div v-if="acceptedByEveryone">
          <koejakson-vaihe-allekirjoitukset
            :allekirjoitukset="allekirjoitukset"
            title="hyvaksymispaivamaarat"
          />
        </div>

        <div v-if="!account.impersonated && editable">
          <hr v-if="allekirjoitukset.length > 0" />

          <b-row>
            <b-col class="text-right">
              <elsa-button variant="back" :to="{ name: 'koejakso' }">
                {{ $t('peruuta') }}
              </elsa-button>
              <elsa-button
                v-if="!loading"
                :loading="buttonStates.primaryButtonLoading"
                variant="primary"
                class="ml-4 px-6"
                @click="onValidateAndConfirm('confirm-send')"
              >
                {{ $t('laheta') }}
              </elsa-button>
            </b-col>
          </b-row>
          <b-row>
            <elsa-form-error :active="$v.$anyError" />
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
      :text="$t('vahvista-koejakson-vaihe-lahetys')"
      :submit-text="$t('laheta')"
      @submit="onSend"
    />
  </div>
</template>

<script lang="ts">
  import _get from 'lodash/get'
  import Component from 'vue-class-component'
  import { Mixins } from 'vue-property-decorator'
  import { validationMixin } from 'vuelidate'
  import { required } from 'vuelidate/lib/validators'

  import ElsaButton from '@/components/button/button.vue'
  import ErikoistuvaDetails from '@/components/erikoistuva-details/erikoistuva-details.vue'
  import ElsaFormError from '@/components/form-error/form-error.vue'
  import ElsaFormGroup from '@/components/form-group/form-group.vue'
  import KoejaksonVaiheAllekirjoitukset from '@/components/koejakson-vaiheet/koejakson-vaihe-allekirjoitukset.vue'
  import KoulutuspaikanArvioijat from '@/components/koejakson-vaiheet/koulutuspaikan-arvioijat.vue'
  import ElsaConfirmationModal from '@/components/modal/confirmation-modal.vue'
  import ElsaFormMultiselect from '@/components/multiselect/multiselect.vue'
  import KouluttajaForm from '@/forms/kouluttaja-form.vue'
  import store from '@/store'
  import {
    LoppukeskusteluLomake,
    KoejaksonVaiheHyvaksyja,
    Koejakso,
    KoejaksonVaiheButtonStates,
    KoejaksonVaiheAllekirjoitus
  } from '@/types'
  import { LomakeTilat } from '@/utils/constants'
  import * as allekirjoituksetHelper from '@/utils/koejaksonVaiheAllekirjoitusMapper'
  import { toastFail, toastSuccess } from '@/utils/toast'

  @Component({
    components: {
      ErikoistuvaDetails,
      KouluttajaForm,
      ElsaFormGroup,
      ElsaFormError,
      ElsaFormMultiselect,
      ElsaButton,
      ElsaConfirmationModal,
      KoejaksonVaiheAllekirjoitukset,
      KoulutuspaikanArvioijat
    }
  })
  export default class ErikoistuvaArviointilomakeLoppukeskustelu extends Mixins(validationMixin) {
    $refs!: {
      koulutuspaikanArvioijat: KoulutuspaikanArvioijat
    }
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
        text: this.$t('koejakson-loppukeskustelu'),
        active: true
      }
    ]
    validations() {
      return {
        loppukeskusteluLomake: {
          lahikouluttaja: {
            nimi: {
              required
            }
          },
          lahiesimies: {
            nimi: {
              required
            }
          }
        }
      }
    }

    loading = true

    buttonStates: KoejaksonVaiheButtonStates = {
      primaryButtonLoading: false,
      secondaryButtonLoading: false
    }

    koejaksonVaihe = 'väliarviointi'

    loppukeskusteluLomake: Partial<LoppukeskusteluLomake> = {
      erikoistuvaAllekirjoittanut: false,
      erikoistuvanErikoisala: this.account.erikoistuvaLaakari.erikoisalaNimi,
      erikoistuvanNimi: `${this.account.firstName} ${this.account.lastName}`,
      erikoistuvanOpiskelijatunnus: this.account.erikoistuvaLaakari.opiskelijatunnus,
      erikoistuvanYliopisto: this.account.erikoistuvaLaakari.yliopisto,
      esitetaanKoejaksonHyvaksymista: null,
      id: null,
      jatkotoimenpiteet: null,
      korjausehdotus: '',
      lahiesimies: {
        id: null,
        kayttajaUserId: null,
        kuittausaika: '',
        nimi: '',
        nimike: null,
        sopimusHyvaksytty: false
      },
      lahikouluttaja: {
        id: 0,
        kayttajaUserId: null,
        kuittausaika: '',
        nimi: '',
        nimike: null,
        sopimusHyvaksytty: false
      },
      muokkauspaiva: ''
    }

    validateState(value: string) {
      const form = this.$v.loppukeskusteluLomake
      const { $dirty, $error } = _get(form, value) as any
      return $dirty ? ($error ? false : null) : null
    }

    get account() {
      return store.getters['auth/account']
    }

    get editable() {
      if (this.account.impersonated) {
        return false
      }
      return this.koejaksoData.loppukeskustelunTila === LomakeTilat.UUSI
    }

    get waitingForAcceptance() {
      return this.koejaksoData.loppukeskustelunTila === LomakeTilat.ODOTTAA_HYVAKSYNTAA
    }

    get acceptedByEveryone() {
      return this.koejaksoData.loppukeskustelunTila === LomakeTilat.HYVAKSYTTY
    }

    get kouluttajat() {
      return store.getters['erikoistuva/kouluttajat']
    }

    get koejaksoData(): Koejakso {
      return store.getters['erikoistuva/koejakso']
    }

    setKoejaksoData() {
      if (this.koejaksoData.loppukeskustelu) {
        this.loppukeskusteluLomake = this.koejaksoData.loppukeskustelu
      }
    }

    onLahikouluttajaSelect(lahikouluttaja: KoejaksonVaiheHyvaksyja) {
      this.loppukeskusteluLomake.lahikouluttaja = lahikouluttaja
    }

    onLahiesimiesSelect(lahiesimies: KoejaksonVaiheHyvaksyja) {
      this.loppukeskusteluLomake.lahiesimies = lahiesimies
    }

    get allekirjoitukset(): KoejaksonVaiheAllekirjoitus[] {
      const allekirjoitusErikoistuva = allekirjoituksetHelper.mapAllekirjoitusErikoistuva(
        this,
        this.loppukeskusteluLomake?.erikoistuvanNimi,
        this.loppukeskusteluLomake?.erikoistuvanKuittausaika
      )
      const allekirjoitusLahikouluttaja = allekirjoituksetHelper.mapAllekirjoitusLahikouluttaja(
        this,
        this.loppukeskusteluLomake?.lahikouluttaja
      )
      const allekirjoitusLahiesimies = allekirjoituksetHelper.mapAllekirjoitusLahiesimies(
        this,
        this.loppukeskusteluLomake?.lahiesimies
      )

      return [
        allekirjoitusLahikouluttaja,
        allekirjoitusLahiesimies,
        allekirjoitusErikoistuva
      ].filter((a): a is KoejaksonVaiheAllekirjoitus => a !== null)
    }

    optionDisplayName(option: any) {
      return option.nimike ? option.nimi + ', ' + option.nimike : option.nimi
    }

    hideModal(id: string) {
      return this.$bvModal.hide(id)
    }

    onValidateAndConfirm(modalId: string) {
      if (
        this.$refs.koulutuspaikanArvioijat &&
        !this.$refs.koulutuspaikanArvioijat.validateForm()
      ) {
        return
      }
      return this.$bvModal.show(modalId)
    }

    async onSend() {
      try {
        this.buttonStates.primaryButtonLoading = true
        await store.dispatch('erikoistuva/postLoppukeskustelu', this.loppukeskusteluLomake)
        this.buttonStates.primaryButtonLoading = false
        toastSuccess(this, this.$t('loppukeskustelu-lahetetty-onnistuneesti'))
      } catch {
        toastFail(this, this.$t('loppukeskustelu-tallennus-epaonnistui'))
      }
    }

    async mounted() {
      this.loading = true
      if (!this.koejaksoData) {
        await store.dispatch('erikoistuva/getKoejakso')
      }
      await store.dispatch('erikoistuva/getKouluttajat')
      this.setKoejaksoData()
      this.loading = false
    }
  }
</script>
