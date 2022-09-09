<template>
  <div class="valmistumispyynto">
    <b-breadcrumb :items="items" class="mb-0" />
    <b-container fluid>
      <h1>{{ $t('valmistumispyynto') }}</h1>
      <div v-if="!loading">
        <div v-if="showValmistumispyyntoForm">
          <b-row lg>
            <b-col>
              <b-alert :show="valmistumispyyntoPalautettu" variant="danger" class="mt-2">
                <div class="d-flex flex-row">
                  <em class="align-middle">
                    <font-awesome-icon :icon="['fas', 'exclamation-circle']" class="mr-2" />
                  </em>
                  <div>
                    <span v-if="vastuuhenkiloOsaamisenArvioijaPalauttanut">
                      {{ $t('valmistumispyynto-osaamisen-arvioija-palauttanut') }}
                    </span>
                    <span v-else-if="virkailijaPalauttanut">
                      {{ $t('valmistumispyynto-virkailija-palauttanut') }}
                    </span>
                    <span v-else>
                      {{ $t('valmistumispyynto-hyvaksyja-palauttanut') }}
                    </span>
                    <span v-if="!vastuuhenkiloOsaamisenArvioijaPalauttanut" class="d-block">
                      {{ $t('syy') }}&nbsp;
                      <span class="font-weight-500">{{ korjausehdotus }}</span>
                    </span>
                    <span v-else class="d-block">
                      <div class="font-weight-700 mt-1">
                        {{ $t('osaaminen-ei-riita-valmistumiseen') }}
                      </div>
                      <span class="font-weight-500">{{ korjausehdotus }}</span>
                    </span>
                  </div>
                </div>
              </b-alert>
              <p class="mt-3 mb-3">
                {{ $t('valmistumispyynto-ingressi-hae-koulutustodistusta-kappale') }}
              </p>
              <p class="mb-3">
                {{ $t('valmistumispyynto-ingressi-opintohallinto-tarkastaa-kappale') }}
              </p>
              <p class="mb-3">
                {{ $t('valmistumispyynto-ingressi-kun-koulutuskokonaisuus-arvioitu-kappale') }}
              </p>
              <elsa-form-group :label="$t('valmistumispyynto-ennen-lahettamista')" :required="true">
                <template #label-right>
                  <b-form-checkbox
                    v-model="valmistumispyyntoVaatimuksetLomake.tyoskentelyjaksot"
                    :state="validateVaatimuksetState('tyoskentelyjaksot')"
                    :disabled="vaatimuksetHyvaksytty"
                    @input="$emit('skipRouteExitConfirm', false)"
                    class="py-0 mt-3"
                  >
                    <span>
                      {{ $t('valmistumispyynto-tyoskentelyjaksot-suoritettu') }}
                      <a
                        href="https://www.laaketieteelliset.fi/ammatillinen-jatkokoulutus/opinto-oppaat/"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {{ $t('opinto-oppaasta') }}.
                      </a>
                    </span>
                  </b-form-checkbox>
                  <b-form-checkbox
                    v-model="valmistumispyyntoVaatimuksetLomake.tyotodistukset"
                    :state="validateVaatimuksetState('tyotodistukset')"
                    :disabled="vaatimuksetHyvaksytty"
                    @input="$emit('skipRouteExitConfirm', false)"
                    class="py-0 mt-3"
                  >
                    {{ $t('valmistumispyynto-tyotodistukset') }}
                  </b-form-checkbox>
                  <b-form-checkbox
                    v-model="valmistumispyyntoVaatimuksetLomake.kuulusteluJaJohtamisopinnot"
                    :state="validateVaatimuksetState('kuulusteluJaJohtamisopinnot')"
                    :disabled="vaatimuksetHyvaksytty"
                    @input="$emit('skipRouteExitConfirm', false)"
                    class="py-0 mt-3"
                  >
                    {{ $t('valmistumispyynto-kuulustelu-ja-johtamisopinnot') }}
                  </b-form-checkbox>
                  <b-form-checkbox
                    v-model="valmistumispyyntoVaatimuksetLomake.teoriakoulutus"
                    :state="validateVaatimuksetState('teoriakoulutus')"
                    :disabled="vaatimuksetHyvaksytty"
                    @input="$emit('skipRouteExitConfirm', false)"
                    class="py-0 mt-3"
                  >
                    {{ $t('valmistumispyynto-teoriakoulutusta-riittavasti') }}
                  </b-form-checkbox>
                  <b-form-checkbox
                    v-model="valmistumispyyntoVaatimuksetLomake.osaamisenArvioinnit"
                    :state="validateVaatimuksetState('osaamisenArvioinnit')"
                    :disabled="vaatimuksetHyvaksytty"
                    @input="$emit('skipRouteExitConfirm', false)"
                    class="py-0 mt-3"
                  >
                    {{ $t('valmistumispyynto-osaamisen-arvioinnit') }}
                  </b-form-checkbox>
                </template>
              </elsa-form-group>
              <p class="mt-2 mb-0">
                {{ $t('valmistumispyynto-mikali-olet-toimittanut-tarvittavat-tiedot') }}
              </p>
              <hr />
              <div v-if="!vaatimuksetHyvaksytty" class="text-right mr-2">
                <elsa-button variant="primary" @click="confirmVaatimukset">
                  {{ $t('tee-valmistumispyynto') }}
                </elsa-button>
              </div>
              <div v-else-if="valmistumispyyntoSuoritustenTila">
                <erikoistuva-details
                  :avatar="account.avatar"
                  :name="`${account.firstName} ${account.lastName}`"
                  :erikoisala="account.erikoistuvaLaakari.erikoisalaNimi"
                  :syntymaaika="account.erikoistuvaLaakari.syntymaaika"
                  :opiskelijatunnus="account.erikoistuvaLaakari.opiskelijatunnus"
                  :yliopisto="account.erikoistuvaLaakari.yliopisto"
                  :laillistamispaiva="valmistumispyynto.erikoistujanLaillistamispaiva"
                  :laillistamistodistus="valmistumispyynto.erikoistujanLaillistamistodistus"
                  :laillistamistodistusNimi="valmistumispyynto.erikoistujanLaillistamistodistusNimi"
                  :laillistamistodistusTyyppi="
                    valmistumispyynto.erikoistujanLaillistamistodistusTyyppi
                  "
                />
                <hr />
                <div
                  v-if="
                    !valmistumispyynto.erikoistujanLaillistamispaiva ||
                    !valmistumispyynto.erikoistujanLaillistamistodistus
                  "
                >
                  <h3>
                    {{ $t('laillistaminen') }}
                  </h3>
                  <elsa-form-group
                    class="col-xs-12 col-sm-3 pl-0"
                    :label="$t('laillistamispaiva')"
                    :required="true"
                  >
                    <template v-slot="{ uid }">
                      <elsa-form-datepicker
                        ref="laillistamispaiva"
                        :id="uid"
                        :value.sync="valmistumispyyntoLomake.laillistamispaiva"
                        @input="$emit('skipRouteExitConfirm', false)"
                      ></elsa-form-datepicker>
                      <b-form-invalid-feedback>
                        {{ $t('pakollinen-tieto') }}
                      </b-form-invalid-feedback>
                    </template>
                  </elsa-form-group>
                  <elsa-form-group :label="$t('laillistamispaivan-liitetiedosto')" :required="true">
                    <span>
                      {{ $t('lisaa-liite-joka-todistaa-laillistamispaivan') }}
                    </span>
                    <asiakirjat-upload
                      class="mt-3"
                      :isPrimaryButton="false"
                      :allowMultiplesFiles="false"
                      :buttonText="$t('lisaa-liitetiedosto')"
                      @selectedFiles="onLaillistamistodistusFilesAdded"
                      :disabled="laillistamispaivaAsiakirjat.length > 0"
                    />
                    <asiakirjat-content
                      :asiakirjat="laillistamispaivaAsiakirjat"
                      :sorting-enabled="false"
                      :pagination-enabled="false"
                      :enable-search="false"
                      :enable-delete="true"
                      @deleteAsiakirja="onDeletelaillistamistodistus"
                      :no-results-info-text="$t('ei-liitetiedostoja')"
                      :state="validateValmistumispyyntoState('laillistamistodistus')"
                    />
                    <b-form-invalid-feedback
                      :state="validateValmistumispyyntoState('laillistamistodistus')"
                    >
                      {{ $t('pakollinen-tieto') }}
                    </b-form-invalid-feedback>
                  </elsa-form-group>
                  <hr />
                </div>
                <div v-if="hasVanhentuneitaSuorituksia">
                  <h3>{{ $t('vanhat-suoritukset') }}</h3>
                  <span
                    v-if="
                      valmistumispyyntoSuoritustenTila.vanhojaTyoskentelyjaksojaOrSuorituksiaExists
                    "
                  >
                    {{
                      $t('valmistumispyynto-vanhoja-tyoskentelyjaksoja-tai-suorituksia', {
                        vanhentunutSuoritusVuotta
                      })
                    }}
                  </span>
                  <span v-if="valmistumispyyntoSuoritustenTila.kuulusteluVanhentunut">
                    {{ $t('valmistumispyynto-valtakunnallinen-kuulustelu-yli-4-vuotta') }}
                  </span>
                  <elsa-form-group
                    :label="$t('selvitys-vanhentuneista-suorituksista-otsikko')"
                    :required="true"
                    class="mt-4"
                  >
                    <template v-slot="{ uid }">
                      <b-form-textarea
                        :id="uid"
                        v-model="valmistumispyyntoLomake.selvitysVanhentuneistaSuorituksista"
                        @input="$emit('skipRouteExitConfirm', false)"
                        :state="
                          validateValmistumispyyntoState('selvitysVanhentuneistaSuorituksista')
                        "
                        rows="5"
                      ></b-form-textarea>
                      <b-form-invalid-feedback :id="`${uid}-feedback`">
                        {{ $t('pakollinen-tieto') }}
                      </b-form-invalid-feedback>
                    </template>
                  </elsa-form-group>
                  <hr />
                </div>
                <b-row>
                  <b-col lg="8">
                    <div v-if="useaVastuuhenkilo">
                      <h3>{{ $t('erikoisala-vastuuhenkilöt') }}</h3>
                      <h5 class="mt-3">{{ $t('erikoisala-vastuuhenkilö-label') }}</h5>
                      {{ vastuuhenkiloOsaamisenArvioija }}
                      <h5 class="mt-3">{{ $t('erikoisala-vastuuhenkilö-label') }}</h5>
                      {{ vastuuhenkiloHyvaksyja }}
                    </div>
                    <div v-else>
                      <h3>{{ $t('erikoisala-vastuuhenkilö') }}</h3>
                      <h5>{{ $t('erikoisala-vastuuhenkilö-label') }}</h5>
                      {{ vastuuhenkiloHyvaksyja }}
                    </div>
                  </b-col>
                </b-row>
                <hr />
                <b-row>
                  <b-col class="text-right">
                    <elsa-button variant="back" @click="onCancel">
                      {{ $t('peruuta') }}
                    </elsa-button>
                    <elsa-button
                      v-if="!loading"
                      @click="onValidateAndConfirmSend('confirm-send')"
                      :loading="sending"
                      variant="primary"
                      class="ml-2"
                      style="min-width: 14rem"
                    >
                      {{ $t('laheta-pyynto') }}
                    </elsa-button>
                  </b-col>
                </b-row>
              </div>
            </b-col>
          </b-row>
        </div>
        <div v-else>
          <valmistumispyynnon-tila-erikoistuja :valmistumispyynto="valmistumispyynto" />
        </div>
      </div>
      <div v-else class="text-center mt-3">
        <b-spinner variant="primary" :label="$t('ladataan')" />
      </div>
    </b-container>

    <elsa-confirmation-modal
      id="confirm-send"
      :title="$t('vahvista-lomakkeen-lahetys')"
      :text="$t('valmistumispyynto-vahvistus')"
      :submitText="$t('laheta-pyynto')"
      @submit="onSend"
    />
  </div>
</template>

<script lang="ts">
  import { AxiosError } from 'axios'
  import { Component, Mixins } from 'vue-property-decorator'
  import { validationMixin } from 'vuelidate'
  import { requiredIf } from 'vuelidate/lib/validators'

  import {
    getValmistumispyynto,
    getValmistumispyyntoSuoritustenTila,
    postValmistumispyynto,
    putValmistumispyynto
  } from '@/api/erikoistuva'
  import AsiakirjatContent from '@/components/asiakirjat/asiakirjat-content.vue'
  import AsiakirjatUpload from '@/components/asiakirjat/asiakirjat-upload.vue'
  import ElsaButton from '@/components/button/button.vue'
  import ElsaFormDatepicker from '@/components/datepicker/datepicker.vue'
  import ErikoistuvaDetails from '@/components/erikoistuva-details/erikoistuva-details.vue'
  import ElsaFormGroup from '@/components/form-group/form-group.vue'
  import ElsaConfirmationModal from '@/components/modal/confirmation-modal.vue'
  import ElsaPopover from '@/components/popover/popover.vue'
  import store from '@/store'
  import {
    ValmistumispyyntoVaatimuksetLomake,
    Valmistumispyynto,
    ValmistumispyyntoLomakeErikoistuja,
    ValmistumispyyntoSuoritustenTila,
    ElsaError,
    Asiakirja
  } from '@/types'
  import { confirmExit } from '@/utils/confirm'
  import { ErikoisalaTyyppi, ValmistumispyynnonTila } from '@/utils/constants'
  import { mapFile, mapFiles } from '@/utils/fileMapper'
  import { toastFail, toastSuccess } from '@/utils/toast'
  import ValmistumispyynnonTilaErikoistuja from '@/views/valmistumispyynto/erikoistuja/valmistumispyynnon-tila-erikoistuja.vue'

  @Component({
    components: {
      AsiakirjatContent,
      AsiakirjatUpload,
      ElsaButton,
      ErikoistuvaDetails,
      ElsaFormGroup,
      ElsaFormDatepicker,
      ElsaPopover,
      ElsaConfirmationModal,
      ValmistumispyynnonTilaErikoistuja
    }
  })
  export default class ValmistumispyyntoErikoistuja extends Mixins(validationMixin) {
    $refs!: {
      laillistamispaiva: ElsaFormDatepicker
    }

    items = [
      {
        text: this.$t('etusivu'),
        to: { name: 'etusivu' }
      },
      {
        text: this.$t('valmistumispyynto'),
        active: true
      }
    ]

    valmistumispyynto: Partial<Valmistumispyynto> = {}
    valmistumispyyntoSuoritustenTila: Partial<ValmistumispyyntoSuoritustenTila> = {}
    valmistumispyyntoVaatimuksetLomake: Partial<ValmistumispyyntoVaatimuksetLomake> = {}
    valmistumispyyntoLomake: ValmistumispyyntoLomakeErikoistuja = {
      selvitysVanhentuneistaSuorituksista: null,
      laillistamispaiva: null,
      laillistamistodistus: null
    }
    vaatimuksetHyvaksytty = false
    loading = true
    sending = false
    laillistamispaivaAsiakirjat: Asiakirja[] = []

    validations() {
      return {
        valmistumispyyntoVaatimuksetLomake: {
          tyoskentelyjaksot: { checked: (value: boolean) => value === true },
          tyotodistukset: { checked: (value: boolean) => value === true },
          kuulusteluJaJohtamisopinnot: { checked: (value: boolean) => value === true },
          teoriakoulutus: { checked: (value: boolean) => value === true },
          osaamisenArvioinnit: { checked: (value: boolean) => value === true }
        },
        valmistumispyyntoLomake: {
          selvitysVanhentuneistaSuorituksista: {
            required: requiredIf(() => this.hasVanhentuneitaSuorituksia)
          },
          laillistamispaiva: {
            required: requiredIf(() => {
              return this.valmistumispyynto?.erikoistujanLaillistamispaiva == null
            })
          },
          laillistamistodistus: {
            required: requiredIf(() => {
              return this.laillistamispaivaAsiakirjat.length === 0
            })
          }
        }
      }
    }

    async mounted() {
      try {
        this.valmistumispyynto = (await getValmistumispyynto()).data
        if (this.showValmistumispyyntoForm) {
          this.valmistumispyyntoSuoritustenTila = (await getValmistumispyyntoSuoritustenTila()).data
          this.initLaillistamispaivaAndTodistus()
        }
      } catch (err) {
        toastFail(this, this.$t('valmistumispyynnon-hakeminen-epaonnistui'))
      }
      this.loading = false
    }

    get account() {
      return store.getters['auth/account']
    }

    get vanhentunutSuoritusVuotta() {
      return this.valmistumispyyntoSuoritustenTila.erikoisalaTyyppi === ErikoisalaTyyppi.LAAKETIEDE
        ? 10
        : 6
    }

    get hasVanhentuneitaSuorituksia() {
      return (
        this.valmistumispyyntoSuoritustenTila.vanhojaTyoskentelyjaksojaOrSuorituksiaExists ||
        this.valmistumispyyntoSuoritustenTila.kuulusteluVanhentunut
      )
    }

    get vastuuhenkiloOsaamisenArvioija() {
      return this.valmistumispyynto
        ? `${this.valmistumispyynto?.vastuuhenkiloOsaamisenArvioijaNimi}${
            this.valmistumispyynto?.vastuuhenkiloOsaamisenArvioijaNimike
              ? `, ${this.valmistumispyynto?.vastuuhenkiloOsaamisenArvioijaNimike}`
              : ''
          }`
        : ''
    }

    get vastuuhenkiloHyvaksyja() {
      return this.valmistumispyynto
        ? `${this.valmistumispyynto?.vastuuhenkiloHyvaksyjaNimi}${
            this.valmistumispyynto?.vastuuhenkiloHyvaksyjaNimike
              ? `, ${this.valmistumispyynto?.vastuuhenkiloHyvaksyjaNimike}`
              : ''
          }`
        : ''
    }

    get useaVastuuhenkilo() {
      return this.vastuuhenkiloOsaamisenArvioija !== this.vastuuhenkiloHyvaksyja
    }

    get showValmistumispyyntoForm() {
      return (
        this.valmistumispyynto.tila === ValmistumispyynnonTila.UUSI ||
        this.valmistumispyynto.tila ===
          ValmistumispyynnonTila.VASTUUHENKILON_TARKISTUS_PALAUTETTU ||
        this.valmistumispyynto.tila === ValmistumispyynnonTila.VIRKAILIJAN_TARKISTUS_PALAUTETTU ||
        this.valmistumispyynto.tila === ValmistumispyynnonTila.VASTUUHENKILON_HYVAKSYNTA_PALAUTETTU
      )
    }

    get vastuuhenkiloOsaamisenArvioijaPalauttanut() {
      return (
        this.valmistumispyynto.tila === ValmistumispyynnonTila.VASTUUHENKILON_TARKISTUS_PALAUTETTU
      )
    }

    get vastuuhenkiloHyvaksyjaPalauttanut() {
      return (
        this.valmistumispyynto.tila === ValmistumispyynnonTila.VASTUUHENKILON_HYVAKSYNTA_PALAUTETTU
      )
    }

    get virkailijaPalauttanut() {
      return this.valmistumispyynto.tila === ValmistumispyynnonTila.VIRKAILIJAN_TARKISTUS_PALAUTETTU
    }

    get valmistumispyyntoPalautettu() {
      return (
        this.vastuuhenkiloOsaamisenArvioijaPalauttanut ||
        this.vastuuhenkiloHyvaksyjaPalauttanut ||
        this.virkailijaPalauttanut
      )
    }

    get korjausehdotus() {
      if (this.vastuuhenkiloOsaamisenArvioijaPalauttanut) {
        return this.valmistumispyynto.vastuuhenkiloOsaamisenArvioijaKorjausehdotus
      } else if (this.virkailijaPalauttanut) {
        return this.valmistumispyynto.virkailijanKorjausehdotus
      } else {
        return this.valmistumispyynto.vastuuhenkiloHyvaksyjaKorjausehdotus
      }
    }

    validateVaatimuksetState(name: string) {
      const { $dirty, $error } = this.$v.valmistumispyyntoVaatimuksetLomake[name] as any
      return $dirty ? !$error : null
    }

    validateValmistumispyyntoState(name: string) {
      const { $dirty, $error } = this.$v.valmistumispyyntoLomake[name] as any
      return $dirty ? !$error : null
    }

    confirmVaatimukset() {
      this.$v.valmistumispyyntoVaatimuksetLomake.$touch()
      this.vaatimuksetHyvaksytty = !this.$v.$anyError
    }

    onValidateAndConfirmSend(modalId: string) {
      const validations = [
        this.validateForm(),
        this.$refs.laillistamispaiva ? this.$refs.laillistamispaiva.validateForm() : true
      ]
      if (validations.includes(false)) return

      return this.$bvModal.show(modalId)
    }

    validateForm() {
      this.$v.$touch()
      return !this.$v.$anyError
    }

    initLaillistamispaivaAndTodistus() {
      if (this.valmistumispyynto?.erikoistujanLaillistamistodistus) {
        const data = Uint8Array.from(
          atob(this.valmistumispyynto?.erikoistujanLaillistamistodistus),
          (c) => c.charCodeAt(0)
        )
        this.laillistamispaivaAsiakirjat.push(
          mapFile(
            new File([data], this.valmistumispyynto?.erikoistujanLaillistamistodistusNimi || '', {
              type: this.valmistumispyynto?.erikoistujanLaillistamistodistusTyyppi
            })
          )
        )
      }
      if (this.valmistumispyynto?.erikoistujanLaillistamispaiva) {
        this.valmistumispyyntoLomake.laillistamispaiva =
          this.valmistumispyynto.erikoistujanLaillistamispaiva
      }
    }

    async onSend() {
      try {
        this.sending = true
        this.valmistumispyynto = this.valmistumispyyntoPalautettu
          ? (await putValmistumispyynto(this.valmistumispyyntoLomake)).data
          : (await postValmistumispyynto(this.valmistumispyyntoLomake)).data
        this.$emit('skipRouteExitConfirm', true)
        toastSuccess(this, this.$t('valmistumispyynto-lahetetty-onnistuneesti'))
      } catch (err) {
        const axiosError = err as AxiosError<ElsaError>
        const message = axiosError?.response?.data?.message
        toastFail(
          this,
          message
            ? `${this.$t('valmistumispyynnon-tallentaminen-epaonnistui')}: ${this.$t(message)}`
            : this.$t('valmistumispyynnon-tallentaminen-epaonnistui')
        )
      }
      this.sending = false
    }

    async onCancel() {
      if (await confirmExit(this)) {
        this.initForm()
        this.$v.valmistumispyyntoVaatimuksetLomake.$reset()
        this.$v.valmistumispyyntoLomake.$reset()
        this.$nextTick(() => {
          this.$emit('skipRouteExitConfirm', true)
        })
      }
    }

    onLaillistamistodistusFilesAdded(files: File[]) {
      this.valmistumispyyntoLomake.laillistamistodistus = files[0]
      this.laillistamispaivaAsiakirjat.push(...mapFiles(files))
    }

    async onDeletelaillistamistodistus() {
      this.valmistumispyyntoLomake.laillistamistodistus = null
      this.laillistamispaivaAsiakirjat = []
      this.$emit('skipRouteExitConfirm', false)
    }

    initForm() {
      this.valmistumispyyntoVaatimuksetLomake.tyoskentelyjaksot = false
      this.valmistumispyyntoVaatimuksetLomake.tyotodistukset = false
      this.valmistumispyyntoVaatimuksetLomake.kuulusteluJaJohtamisopinnot = false
      this.valmistumispyyntoVaatimuksetLomake.teoriakoulutus = false
      this.valmistumispyyntoVaatimuksetLomake.osaamisenArvioinnit = false
      this.valmistumispyyntoLomake.selvitysVanhentuneistaSuorituksista = null
      this.vaatimuksetHyvaksytty = false
      this.initLaillistamispaivaAndTodistus()
    }
  }
</script>

<style lang="scss" scoped>
  @import '~@/styles/variables';
  @import '~bootstrap/scss/mixins/breakpoints';

  .valmistumispyynto {
    max-width: 1024px;
  }

  ::v-deep {
    .custom-control-label {
      font-size: 0.9375rem;
    }

    .custom-control-input.is-valid ~ .custom-control-label {
      color: $black;
    }

    .custom-checkbox > [type='checkbox']:checked + label:after {
      background-color: $primary;
    }
  }
</style>
