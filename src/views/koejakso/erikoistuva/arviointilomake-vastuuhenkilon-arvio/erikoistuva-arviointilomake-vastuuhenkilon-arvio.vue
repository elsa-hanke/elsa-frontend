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
              :syntymaaika="account.erikoistuvaLaakari.syntymaaika"
            ></erikoistuva-details>
          </b-col>
        </b-row>
        <hr />
        <div v-if="editable">
          <b-row>
            <b-col lg="4">
              <elsa-form-group :label="$t('sahkopostiosoite')" :required="true">
                <template v-slot="{ uid }">
                  <b-form-input
                    :id="uid"
                    v-model="form.erikoistuvanSahkoposti"
                    @input="$emit('skipRouteExitConfirm', false)"
                    :state="validateState('erikoistuvanSahkoposti')"
                    :value="account.erikoistuvaLaakari.sahkoposti"
                  />
                  <b-form-invalid-feedback
                    v-if="!$v.form.erikoistuvanSahkoposti.required"
                    :id="`${uid}-feedback`"
                  >
                    {{ $t('pakollinen-tieto') }}
                  </b-form-invalid-feedback>
                  <b-form-invalid-feedback
                    v-if="!$v.form.erikoistuvanSahkoposti.email"
                    :state="validateState('erikoistuvanSahkoposti')"
                    :id="`${uid}-feedback`"
                  >
                    {{ $t('sahkopostiosoite-ei-kelvollinen') }}
                  </b-form-invalid-feedback>
                </template>
              </elsa-form-group>
            </b-col>

            <b-col lg="4">
              <elsa-form-group :label="$t('matkapuhelinnumero')" :required="true">
                <template v-slot="{ uid }">
                  <b-form-input
                    :id="uid"
                    v-model="form.erikoistuvanPuhelinnumero"
                    @input="$emit('skipRouteExitConfirm', false)"
                    :state="validateState('erikoistuvanPuhelinnumero')"
                    :value="account.erikoistuvaLaakari.puhelinnumero"
                  />
                  <b-form-invalid-feedback :id="`${uid}-feedback`">
                    {{ $t('pakollinen-tieto') }}
                  </b-form-invalid-feedback>
                </template>
              </elsa-form-group>
            </b-col>
          </b-row>
          <hr />
          <b-row v-if="muutOpintooikeudet">
            <b-col>
              <elsa-form-group :label="$t('useampi-opinto-oikeus')" :required="true">
                <template v-slot="{ uid }">
                  <p class="mb-3">
                    {{ $t('useampi-opinto-oikeus-suostumus-erikoistuja-ingressi') }}
                  </p>
                  <b-form-checkbox
                    :id="uid"
                    v-model="form.paataOpintooikeudet"
                    :state="validateState('paataOpintooikeudet')"
                    @input="$emit('skipRouteExitConfirm', false)"
                    class="py-0"
                  >
                    {{ $t('useampi-opinto-oikeus-suostumus-erikoistuja') }}
                    <label class="d-block">
                      <span v-for="(opintooikeus, index) in muutOpintooikeudet" :key="index">
                        {{ opintooikeus.erikoisalaNimi }},
                        {{ $t(`yliopisto-nimi.${opintooikeus.yliopistoNimi}`) }}
                        <br />
                      </span>
                    </label>
                  </b-form-checkbox>
                  <b-form-invalid-feedback :id="`${uid}-feedback`">
                    {{ $t('pakollinen-tieto') }}
                  </b-form-invalid-feedback>
                </template>
              </elsa-form-group>
            </b-col>
          </b-row>
          <hr />
          <b-row v-if="!koulutussopimuksenHyvaksynta">
            <b-col>
              <elsa-form-group :label="$t('koulutussopimus')" :required="true">
                <template v-slot="{ uid }">
                  <b-form-checkbox
                    :id="uid"
                    v-model="form.koulutussopimusHyvaksytty"
                    @input="$emit('skipRouteExitConfirm', false)"
                    :state="validateState('koulutussopimusHyvaksytty')"
                    class="py-0"
                  >
                    {{ $t('vastuuhenkilon-arvio-koulutussopimus-varmistus') }}
                  </b-form-checkbox>
                  <b-form-invalid-feedback :id="`${uid}-feedback`">
                    {{ $t('pakollinen-tieto') }}
                  </b-form-invalid-feedback>
                </template>
              </elsa-form-group>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <elsa-form-group :label="$t('koulutussuunnitelma')" :required="true">
                <template v-slot="{ uid }">
                  <b-form-checkbox
                    :id="uid"
                    v-model="form.koulutussuunnitelmaHyvaksytty"
                    @input="$emit('skipRouteExitConfirm', false)"
                    :state="validateState('koulutussuunnitelmaHyvaksytty')"
                    class="py-0"
                  >
                    {{ $t('vastuuhenkilon-arvio-koulutussuunnitelma-varmistus') }}
                  </b-form-checkbox>
                  <b-form-invalid-feedback :id="`${uid}-feedback`">
                    {{ $t('pakollinen-tieto') }}
                  </b-form-invalid-feedback>
                </template>
              </elsa-form-group>
            </b-col>
          </b-row>
          <hr />
        </div>
        <div v-else>
          <b-row>
            <b-col lg="4">
              <h5>{{ $t('sahkopostiosoite') }}</h5>
              <p>{{ account.erikoistuvaLaakari.sahkoposti }}</p>
            </b-col>

            <b-col lg="4">
              <h5>{{ $t('matkapuhelinnumero') }}</h5>
              <p>{{ account.erikoistuvaLaakari.puhelinnumero }}</p>
            </b-col>
          </b-row>
          <hr />
          <div v-if="muutOpintooikeudet">
            <h3 class="mb-3">{{ $t('useampi-opinto-oikeus') }}</h3>
            <p>
              {{ $t('useampi-opinto-oikeus-suostumus-erikoistuja') }}
              <label class="d-block">
                <span v-for="(opintooikeus, index) in muutOpintooikeudet" :key="index">
                  {{ opintooikeus.erikoisalaNimi }},
                  {{ $t(`yliopisto-nimi.${opintooikeus.yliopistoNimi}`) }}
                  <br />
                </span>
              </label>
            </p>
            <hr />
          </div>
          <div v-if="!koulutussopimuksenHyvaksynta">
            <h3 class="mb-3">{{ $t('koulutussopimus') }}</h3>
            <p>
              {{ $t('vastuuhenkilon-arvio-koulutussopimus-varmistus') }}
            </p>
          </div>
          <h3 class="mb-3">{{ $t('koulutussuunnitelma') }}</h3>
          <p>
            {{ $t('vastuuhenkilon-arvio-koulutussuunnitelma-varmistus') }}
          </p>
          <hr />
        </div>
        <b-row>
          <b-col v-if="waitingForErikoistuva || acceptedByEveryone">
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
                {{ formData.vastuuhenkilo.nimi }}
                {{ formData.vastuuhenkilo.nimike ? ', ' + formData.vastuuhenkilo.nimike : '' }}
              </p>
            </elsa-form-group>
          </b-col>
        </b-row>
        <div v-if="waitingForErikoistuva || acceptedByEveryone">
          <hr />
          <koejakson-vaihe-allekirjoitukset
            :allekirjoitukset="allekirjoitukset"
            title="hyvaksymispaivamaarat"
          />
        </div>
        <div v-if="!account.impersonated && (editable || waitingForErikoistuva)">
          <hr />
          <b-row>
            <b-col class="text-right">
              <elsa-button variant="back" :to="{ name: 'koejakso' }">
                {{ $t('peruuta') }}
              </elsa-button>
              <elsa-button
                v-if="!loading"
                @click="onConfirm(waitingForErikoistuva ? 'confirm-sign' : 'confirm-send')"
                :disabled="hasTyoskentelyjaksoErrors"
                :loading="buttonStates.primaryButtonLoading"
                variant="primary"
                class="ml-4 px-6"
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
  import { Component, Vue } from 'vue-property-decorator'
  import { validationMixin } from 'vuelidate'
  import { email, required, requiredIf } from 'vuelidate/lib/validators'

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
    Opintooikeus,
    VastuuhenkilonArvioLomake,
    VastuuhenkilonArvioLomakeErikoistuva
  } from '@/types'
  import { LomakeTilat } from '@/utils/constants'
  import { checkCurrentRouteAndRedirect } from '@/utils/functions'
  import * as allekirjoituksetHelper from '@/utils/koejaksonVaiheAllekirjoitusMapper'
  import { toastFail, toastSuccess } from '@/utils/toast'

  @Component({
    mixins: [validationMixin],
    components: {
      ErikoistuvaDetails,
      ElsaFormGroup,
      ElsaFormMultiselect,
      ElsaButton,
      ElsaConfirmationModal,
      KoejaksonVaiheAllekirjoitukset
    }
  })
  export default class ErikoistuvaArviointilomakeVastuuhenkilonArvio extends Vue {
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
      erikoistuvanSahkoposti: this.account.erikoistuvaLaakari.sahkoposti,
      erikoistuvanPuhelinnumero: this.account.erikoistuvaLaakari.puhelinnumero,
      muutOpintooikeudet: [],
      paataOpintooikeudet: false,
      id: null,
      muokkauspaiva: '',
      koejaksoHyvaksytty: null,
      vastuuhenkilo: null,
      vastuuhenkiloAllekirjoittanut: null,
      perusteluHylkaamiselle: null,
      hylattyArviointiKaytyLapiKeskustellen: null,
      vastuuhenkilonKuittausaika: undefined
    }
    formData: VastuuhenkilonArvioLomakeErikoistuva = {
      muutOpintooikeudet: [],
      paataOpintooikeudet: false,
      koulutussopimusHyvaksytty: true,
      vastuuhenkilo: null,
      tyoskentelyjaksoLiitetty: false,
      tyoskentelyjaksonPituusRiittava: false,
      tyotodistusLiitetty: false
    }
    loading = true
    muutOpintooikeudet: Opintooikeus[] = []
    koulutussopimuksenHyvaksynta = false

    validations() {
      return {
        form: {
          erikoistuvanSahkoposti: {
            required,
            email
          },
          erikoistuvanPuhelinnumero: {
            required
          },
          paataOpintooikeudet: {
            checked: (value: boolean) => value === true,
            required: requiredIf(() => {
              return this.muutOpintooikeudet
            })
          },
          koulutussopimusHyvaksytty: {
            checked: (value: boolean) => {
              return this.koulutussopimuksenHyvaksynta || value === true
            },
            required: requiredIf(() => {
              return !this.koulutussopimuksenHyvaksynta
            })
          },
          koulutussuunnitelmaHyvaksytty: {
            checked: (value: boolean) => value === true
          }
        }
      }
    }

    get account() {
      return store.getters['auth/account']
    }

    get editable() {
      if (this.account.impersonated) {
        return false
      }
      return this.koejaksoData.vastuuhenkilonArvionTila === LomakeTilat.UUSI
    }

    validateState(name: string) {
      const { $dirty, $error } = this.$v.form[name] as any
      return $dirty ? !$error : null
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

    optionDisplayName(option: any) {
      return option.nimike ? option.nimi + ', ' + option.nimike : option.nimi
    }

    hideModal(id: string) {
      return this.$bvModal.hide(id)
    }

    onConfirm(modalId: string) {
      this.$v.form.$touch()

      if (this.$v.form.$anyError) {
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
        this.$emit('skipRouteExitConfirm', true)
        checkCurrentRouteAndRedirect(this.$router, '/koejakso')
      } catch (err) {
        toastFail(this, this.$t('vastuuhenkilon-arvio-lahetys-epaonnistui'))
      }
    }

    async onSign() {
      try {
        this.buttonStates.primaryButtonLoading = true
        await store.dispatch('erikoistuva/putVastuuhenkilonArvio', this.form)
        this.form.erikoistuvanAllekirjoitusaika =
          this.koejaksoData.vastuuhenkilonArvio.erikoistuvanAllekirjoitusaika
        this.buttonStates.primaryButtonLoading = false
        toastSuccess(this, this.$t('vastuuhenkilon-arvio-allekirjoitettu-onnistuneesti'))
        this.$emit('skipRouteExitConfirm', true)
        checkCurrentRouteAndRedirect(this.$router, '/koejakso')
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
      this.muutOpintooikeudet = this.formData.muutOpintooikeudet
      this.koulutussopimuksenHyvaksynta = this.formData.koulutussopimusHyvaksytty

      if (this.editable) {
        this.form.vastuuhenkilo = this.formData.vastuuhenkilo
        this.form.erikoistuvanSahkoposti = this.account.erikoistuvaLaakari.sahkoposti
        this.form.erikoistuvanPuhelinnumero = this.account.erikoistuvaLaakari.puhelinnumero
      }

      this.loading = false
    }
  }
</script>
