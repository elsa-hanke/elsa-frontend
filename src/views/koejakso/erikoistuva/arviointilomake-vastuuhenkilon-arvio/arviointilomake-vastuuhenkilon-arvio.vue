<template>
  <div class="col-lg-8 px-0">
    <b-breadcrumb :items="items" class="mb-0" />

    <b-container fluid>
      <h1 class="mb-3">{{ $t('erikoisalan-vastuuhenkilon-arvio-koejaksosta') }}</h1>
      <div v-if="!loading">
        <b-row lg>
          <b-col>
            <b-alert
              :show="editable"
              variant="dark"
              class="mt-2 mb-2"
              :class="{ 'border border-danger': hasTyoskentelyjaksoErrors }"
            >
              <div class="d-flex flex-row">
                <em class="align-middle">
                  <font-awesome-icon :icon="['fas', 'info-circle']" class="text-muted mr-2" />
                </em>
                <div>
                  {{ $t('vastuuhenkilon-arvio-ingressi-sisalto.kuvaus') }}
                  <ul>
                    <li>
                      {{ $t('vastuuhenkilon-arvio-ingressi-sisalto.lista.item1.teksti') }}
                      <elsa-button
                        :to="{
                          name: 'koejakso'
                        }"
                        variant="link"
                        class="shadow-none p-0"
                      >
                        {{ $t('vastuuhenkilon-arvio-ingressi-sisalto.lista.item1.linkki') }}
                      </elsa-button>
                    </li>
                    <li>{{ $t('vastuuhenkilon-arvio-ingressi-sisalto.lista.item2') }}</li>
                    <li>{{ $t('vastuuhenkilon-arvio-ingressi-sisalto.lista.item3') }}</li>
                  </ul>
                </div>
              </div>
            </b-alert>
            <div v-if="editable">
              <div class="text-error" v-if="formData.tyoskentelyjaksoLiitetty === false">
                {{ $t('tyoskentelyjaksoa-ei-liitetty-koejaksoon') }}
              </div>
              <div v-else>
                <div class="text-error" v-if="formData.tyoskentelyjaksonPituusRiittava === false">
                  {{ $t('tyoskentelyjakson-pituus-alle-6-kk') }}
                </div>
                <div class="text-error" v-if="formData.tyotodistusLiitetty === false">
                  {{ $t('tyotodistusta-ei-liitetty-tyoskentelyjaksoon') }}
                </div>
              </div>
            </div>
            <b-alert :show="waitingForAcceptance" variant="dark" class="mt-3 mb-2">
              <div class="d-flex flex-row">
                <em class="align-middle">
                  <font-awesome-icon :icon="['fas', 'info-circle']" class="text-muted mr-2" />
                </em>
                <div>
                  {{ $t('vastuuhenkilon-arvio-tila-odottaa-hyvaksyntaa') }}
                </div>
              </div>
            </b-alert>
            <b-alert :show="waitingForErikoistuva" variant="dark" class="mt-3 mb-2">
              <div class="d-flex flex-row">
                <em class="align-middle">
                  <font-awesome-icon :icon="['fas', 'info-circle']" class="text-muted mr-2" />
                </em>
                <div>
                  {{ $t('vastuuhenkilon-arvio-tila-odottaa-erikoistuvan-hyvaksyntaa') }}
                </div>
              </div>
            </b-alert>
            <b-alert variant="success" class="mb-2" :show="acceptedByEveryone">
              <div class="d-flex flex-row">
                <em class="align-middle">
                  <font-awesome-icon :icon="['fas', 'check-circle']" class="mr-2" />
                </em>
                <span>{{ $t('vastuuhenkilon-arvio-tila-hyvaksytty') }}</span>
              </div>
            </b-alert>
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
              :yliopisto="account.erikoistuvaLaakari.yliopisto"
              :show-birthdate="false"
            ></erikoistuva-details>
          </b-col>
        </b-row>
        <hr />
        <b-row>
          <b-col v-if="editable" lg="8">
            <h3>{{ $t('erikoisala-vastuuhenkilö') }}</h3>
            <elsa-form-group
              v-if="formData.vastuuhenkilot.length > 1"
              :label="$t('erikoisala-vastuuhenkilö-label')"
              :required="true"
            >
              <template v-slot="{ uid }">
                <b-form-radio-group
                  :id="uid"
                  v-model="selected.vastuuhenkilo"
                  :options="vastuuhenkilotOptions"
                  :state="validateState('vastuuhenkilo')"
                  name="erikoisalan-vastuuhenkilo"
                  @change="updateVastuuhenkilo"
                  stacked
                ></b-form-radio-group>
                <b-form-invalid-feedback
                  class="mt-3"
                  :id="`${uid}-feedback`"
                  :state="validateState('vastuuhenkilo')"
                >
                  {{ $t('pakollinen-tieto') }}
                </b-form-invalid-feedback>
              </template>
            </elsa-form-group>
            <div v-if="formData.vastuuhenkilot.length === 1">
              <h5>{{ $t('erikoisala-vastuuhenkilö-label') }}</h5>
              <p>{{ formData.vastuuhenkilot[0].nimi }}, {{ formData.vastuuhenkilot[0].nimike }}</p>
            </div>
          </b-col>
          <b-col v-else-if="waitingForErikoistuva || acceptedByEveryone">
            <elsa-form-group
              class="mt-2"
              :class="{ 'mb-4': form.koejaksoHyvaksytty === false }"
              :label="$t('koejakso-on')"
            >
              {{ form.koejaksoHyvaksytty ? $t('hyvaksytty') : $t('hylatty') }}
            </elsa-form-group>
            <elsa-form-group
              v-if="form.koejaksoHyvaksytty === false"
              class="mb-4"
              :label="$t('perustelu-hylkaamiselle')"
            >
              {{ form.perusteluHylkaamiselle }}
            </elsa-form-group>
            <elsa-form-group
              v-if="form.koejaksoHyvaksytty === false"
              :label="$t('hylatyn-koejakson-arviointi-kayty-lapi-keskustellen')"
            >
              {{ $t('kylla') }}
            </elsa-form-group>
          </b-col>
          <b-col v-else>
            <h3 class="mb-3">{{ $t('erikoisala-vastuuhenkilö') }}</h3>
            <elsa-form-group :label="$t('erikoisala-vastuuhenkilö-label')">
              <p>
                {{ form.vastuuhenkilo.nimi }},
                {{ form.vastuuhenkilo.nimike }}
              </p>
            </elsa-form-group>
          </b-col>
        </b-row>
        <div v-if="waitingForErikoistuva || acceptedByEveryone">
          <hr />
          <koejakson-vaihe-allekirjoitukset :allekirjoitukset="allekirjoitukset" />
        </div>
        <div v-if="editable || waitingForErikoistuva">
          <hr />
          <b-row>
            <b-col class="text-right">
              <elsa-button variant="back" :to="{ name: 'koejakso' }">
                {{ $t('peruuta') }}
              </elsa-button>
              <elsa-button
                v-if="!loading"
                @click="
                  onValidateAndConfirm(waitingForErikoistuva ? 'confirm-sign' : 'confirm-send')
                "
                :disabled="hasTyoskentelyjaksoErrors"
                :loading="buttonStates.primaryButtonLoading"
                variant="primary"
                class="ml-4 px-5"
              >
                {{ waitingForErikoistuva ? $t('allekirjoita') : $t('laheta') }}
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
      :text="$t('vahvista-pyyda-vastuuhenkilon-arvio')"
      :submitText="$t('laheta')"
      @submit="onSend"
    />
    <elsa-confirmation-modal
      id="confirm-sign"
      :title="$t('allekirjoita-vastuuhenkilon-arvio')"
      :text="$t('vahvista-koejakson-vaihe-hyvaksytty', { koejaksonVaihe })"
      :submitText="$t('allekirjoita')"
      @submit="onSign"
    />
  </div>
</template>

<script lang="ts">
  import _get from 'lodash/get'
  import Component from 'vue-class-component'
  import { Mixins } from 'vue-property-decorator'
  import { validationMixin } from 'vuelidate'
  import { required } from 'vuelidate/lib/validators'

  import { getVastuuhenkilonArvioLomake } from '@/api/erikoistuva'
  import ElsaButton from '@/components/button/button.vue'
  import ErikoistuvaDetails from '@/components/erikoistuva-details/erikoistuva-details.vue'
  import ElsaFormGroup from '@/components/form-group/form-group.vue'
  import KoejaksonVaiheAllekirjoitukset from '@/components/koejakson-vaiheet/koejakson-vaihe-allekirjoitukset.vue'
  import ElsaConfirmationModal from '@/components/modal/confirmation-modal.vue'
  import ElsaFormMultiselect from '@/components/multiselect/multiselect.vue'
  import store from '@/store'
  import {
    Koejakso,
    KoejaksonVaiheAllekirjoitus,
    KoejaksonVaiheButtonStates,
    VastuuhenkilonArvioLomake,
    VastuuhenkilonArvioLomakeData
  } from '@/types'
  import { LomakeTilat } from '@/utils/constants'
  import * as allekirjoituksetHelper from '@/utils/koejaksonVaiheAllekirjoitusMapper'
  import { toastFail, toastSuccess } from '@/utils/toast'

  @Component({
    components: {
      ErikoistuvaDetails,
      ElsaFormGroup,
      ElsaFormMultiselect,
      ElsaButton,
      ElsaConfirmationModal,
      KoejaksonVaiheAllekirjoitukset
    },
    validations: {
      form: {
        vastuuhenkilo: {
          id: {
            required
          }
        }
      }
    }
  })
  export default class ErikoistuvaArviointilomakeVastuuhenkilonArvio extends Mixins(
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
        text: this.$t('koejakson-vastuuhenkilon-arvio'),
        active: true
      }
    ]
    buttonStates: KoejaksonVaiheButtonStates = {
      primaryButtonLoading: false,
      secondaryButtonLoading: false
    }
    koejaksonVaihe = this.$t('vastuuhenkilon-arvio')

    form: VastuuhenkilonArvioLomake = {
      erikoistuvaAllekirjoittanut: false,
      erikoistuvanAllekirjoitusaika: undefined,
      erikoistuvanErikoisala: this.account.erikoistuvaLaakari.erikoisalaNimi,
      erikoistuvanNimi: `${this.account.firstName} ${this.account.lastName}`,
      erikoistuvanOpiskelijatunnus: this.account.erikoistuvaLaakari.opiskelijatunnus,
      erikoistuvanYliopisto: this.account.erikoistuvaLaakari.yliopisto,
      id: null,
      muokkauspaiva: '',
      koejaksoHyvaksytty: null,
      vastuuhenkilo: undefined,
      vastuuhenkiloAllekirjoittanut: null,
      perusteluHylkaamiselle: null,
      hylattyArviointiKaytyLapiKeskustellen: null,
      vastuuhenkilonKuittausaika: undefined
    }
    formData: VastuuhenkilonArvioLomakeData = {
      vastuuhenkilot: [],
      tyoskentelyjaksoLiitetty: false,
      tyoskentelyjaksonPituusRiittava: false,
      tyotodistusLiitetty: false
    }

    selected: any = {
      vastuuhenkilo: null
    }
    loading = true

    validateState(value: string) {
      const form = this.$v.form
      const { $dirty, $error } = _get(form, value) as any
      return $dirty ? ($error ? false : null) : null
    }

    get account() {
      return store.getters['auth/account']
    }

    get editable() {
      return this.koejaksoData.vastuuhenkilonArvionTila === LomakeTilat.UUSI
    }

    get waitingForAcceptance() {
      return this.koejaksoData.vastuuhenkilonArvionTila === LomakeTilat.ODOTTAA_HYVAKSYNTAA
    }

    get waitingForErikoistuva() {
      return (
        this.koejaksoData.vastuuhenkilonArvionTila === LomakeTilat.ODOTTAA_ERIKOISTUVAN_HYVAKSYNTAA
      )
    }

    get acceptedByEveryone() {
      return this.koejaksoData.vastuuhenkilonArvionTila === LomakeTilat.HYVAKSYTTY
    }

    get koejaksoData(): Koejakso {
      return store.getters['erikoistuva/koejakso']
    }

    setKoejaksoData() {
      if (this.koejaksoData.vastuuhenkilonArvio) {
        this.form = this.koejaksoData.vastuuhenkilonArvio
      }
    }

    get allekirjoitukset(): KoejaksonVaiheAllekirjoitus[] {
      const allekirjoitusErikoistuva = allekirjoituksetHelper.mapAllekirjoitusErikoistuva(
        this,
        this.form?.erikoistuvanNimi,
        this.form?.erikoistuvanAllekirjoitusaika
      )
      const allekirjoitusVastuuhenkilo = allekirjoituksetHelper.mapAllekirjoitusVastuuhenkilo(
        this.form.vastuuhenkilo
      ) as KoejaksonVaiheAllekirjoitus

      return [allekirjoitusVastuuhenkilo, allekirjoitusErikoistuva].filter(
        (a): a is KoejaksonVaiheAllekirjoitus => a !== null
      )
    }

    get hasTyoskentelyjaksoErrors() {
      return (
        this.formData.tyoskentelyjaksoLiitetty === false ||
        this.formData.tyoskentelyjaksonPituusRiittava === false ||
        this.formData.tyotodistusLiitetty === false
      )
    }

    get vastuuhenkilotOptions() {
      return this.formData.vastuuhenkilot.map((v: any) => ({
        text: `${v.nimi}, ${v.nimike}`,
        value: v.id
      }))
    }

    updateVastuuhenkilo(id: number) {
      this.form.vastuuhenkilo = this.formData.vastuuhenkilot.filter((v) => v.id === id)[0]
    }

    optionDisplayName(option: any) {
      return option.nimike ? option.nimi + ', ' + option.nimike : option.nimi
    }

    hideModal(id: string) {
      return this.$bvModal.hide(id)
    }

    onValidateAndConfirm(modalId: string) {
      this.$v.form.$touch()
      if (this.$v.$anyError) {
        return
      }

      return this.$bvModal.show(modalId)
    }

    async onSend() {
      try {
        this.buttonStates.primaryButtonLoading = true
        await store.dispatch('erikoistuva/postVastuuhenkilonArvio', this.form)
        this.buttonStates.primaryButtonLoading = false
        toastSuccess(this, this.$t('vastuuhenkilon-arvio-lahetetty-onnistuneesti'))
      } catch (err) {
        toastFail(this, this.$t('vastuuhenkilon-arvio-lahetys-epaonnistui'))
      }
    }

    async onSign() {
      try {
        this.buttonStates.primaryButtonLoading = true
        await store.dispatch('erikoistuva/putVastuuhenkilonArvio', this.form)
        this.form.erikoistuvanAllekirjoitusaika = this.koejaksoData.vastuuhenkilonArvio.erikoistuvanAllekirjoitusaika
        this.buttonStates.primaryButtonLoading = false
        toastSuccess(this, this.$t('vastuuhenkilon-arvio-allekirjoitettu-onnistuneesti'))
      } catch (err) {
        toastFail(this, this.$t('vastuuhenkilon-arvio-allekirjoitus-epaonnistui'))
      }
    }

    async mounted() {
      this.loading = true
      if (!this.koejaksoData) {
        await store.dispatch('erikoistuva/getKoejakso')
      }
      this.setKoejaksoData()
      this.formData = (await getVastuuhenkilonArvioLomake()).data

      if (this.formData.vastuuhenkilot.length === 1) {
        this.form.vastuuhenkilo = this.formData.vastuuhenkilot[0]
      }

      this.loading = false
    }
  }
</script>
