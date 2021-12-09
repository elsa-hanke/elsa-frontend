<template>
  <b-form @submit.stop.prevent="onSubmit">
    <b-row>
      <b-col lg="8">
        <h5>{{ $t('opinto-oikeuden-alkamispäivä') }}</h5>
        <p>
          {{ $date(this.form.opintooikeudenMyontamispaiva) }}
        </p>
      </b-col>
    </b-row>
    <b-row>
      <b-col lg="4">
        <elsa-form-group :label="$t('koejakson-alkamispäivä')" :required="true">
          <template #label-help>
            <elsa-popover>
              <template>
                <h3>{{ $t('koejakson-alkamispäivä') }}</h3>
                <p class="mb-0">{{ $t('koejakson-alkamis-tooltip') }}</p>
              </template>
            </elsa-popover>
          </template>
          <template v-slot="{ uid }">
            <elsa-form-datepicker
              :id="uid"
              v-model="form.koejaksonAlkamispaiva"
              @input="$emit('skipRouteExitConfirm', false)"
              :state="validateState('koejaksonAlkamispaiva')"
              :min="form.opintooikeudenMyontamispaiva"
              :max="maxKoejaksonAlkamispaiva"
              :disabled="
                !form.opintooikeudenMyontamispaiva &&
                !account.erikoistuvaLaakari.opintooikeudenMyontamispaiva
              "
            ></elsa-form-datepicker>
            <b-form-invalid-feedback :id="`${uid}-feedback`">
              {{ $t('pakollinen-tieto') }}
            </b-form-invalid-feedback>
          </template>
        </elsa-form-group>
      </b-col>
    </b-row>
    <b-row>
      <b-col lg="5">
        <elsa-form-group :label="$t('sahkopostiosoite')" :required="true">
          <template v-slot="{ uid }">
            <b-form-input
              :id="uid"
              v-model="form.erikoistuvanSahkoposti"
              @input="$emit('skipRouteExitConfirm', false)"
              :state="validateState('erikoistuvanSahkoposti')"
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
      <b-col lg="3">
        <elsa-form-group :label="$t('puhelin-virka-aikaan')" :required="true">
          <template v-slot="{ uid }">
            <b-form-input
              :id="uid"
              v-model="form.erikoistuvanPuhelinnumero"
              @input="$emit('skipRouteExitConfirm', false)"
              :state="validateState('erikoistuvanPuhelinnumero')"
            />
            <b-form-invalid-feedback :id="`${uid}-feedback`">
              {{ $t('pakollinen-tieto') }}
            </b-form-invalid-feedback>
          </template>
        </elsa-form-group>
      </b-col>
    </b-row>
    <hr />
    <b-row>
      <b-col>
        <h3>{{ $t('koulutuspaikan-tiedot') }}</h3>
      </b-col>
    </b-row>
    <b-row>
      <b-col lg="8">
        <koulutuspaikka-details
          v-for="(koulutuspaikka, index) in form.koulutuspaikat"
          ref="koulutuspaikkaDetails"
          :key="index"
          :koulutuspaikka="koulutuspaikka"
          :erikoistuvanYliopisto="form.erikoistuvanYliopisto"
          :yliopistot="yliopistot"
        ></koulutuspaikka-details>
        <elsa-button
          v-if="form.koulutuspaikat.length >= 2"
          @click="deleteKoulutuspaikka"
          variant="outline-primary"
          class="border-0 p-0"
        >
          <font-awesome-icon :icon="['far', 'trash-alt']" fixed-width size="lg" />
          {{ $t('poista-toimipaikka') }}
        </elsa-button>
        <elsa-button
          v-else
          @click="addKoulutuspaikka"
          variant="outline-primary"
          class="border-0 p-0"
        >
          + {{ $t('toinen-toimipaikka') }}
        </elsa-button>
      </b-col>
    </b-row>
    <hr />
    <b-row>
      <b-col lg="8">
        <h3>{{ $t('koulutuspaikan-lahikouluttaja') }}</h3>
        <kouluttaja-details
          v-for="(k, index) in form.kouluttajat"
          ref="kouluttajaDetails"
          :key="index"
          :index="index"
          :kouluttaja="k"
          :kouluttajat="kouluttajatList"
          @kouluttajaSelected="selectKouluttaja"
        ></kouluttaja-details>
        <elsa-button
          v-if="form.kouluttajat.length >= 2"
          @click="deleteKouluttaja"
          variant="outline-primary"
          class="border-0 p-0"
        >
          <font-awesome-icon :icon="['far', 'trash-alt']" fixed-width size="lg" />
          {{ $t('lahikouluttaja-poista') }}
        </elsa-button>
        <elsa-button v-else @click="addKouluttaja" variant="outline-primary" class="border-0 p-0">
          + {{ $t('lahikouluttaja-toinen') }}
        </elsa-button>
      </b-col>
    </b-row>
    <hr />
    <b-row v-if="vastuuhenkilot !== null">
      <b-col lg="8">
        <h3>{{ $t('erikoisala-vastuuhenkilö') }}</h3>
        <elsa-form-group
          v-if="vastuuhenkilot.length > 1"
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
              :id="`${uid}-feedback`"
              :state="validateState('vastuuhenkilo')"
            >
              {{ $t('pakollinen-tieto') }}
            </b-form-invalid-feedback>
          </template>
        </elsa-form-group>
        <div v-if="vastuuhenkilot.length === 1">
          <h5>{{ $t('erikoisala-vastuuhenkilö-label') }}</h5>
          <p>{{ vastuuhenkilot[0].nimi }}, {{ vastuuhenkilot[0].nimike }}</p>
        </div>
      </b-col>
    </b-row>
    <hr />
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
          class="my-2 mr-3 d-block d-md-inline-block d-lg-block d-xl-inline-block"
          style="min-width: 14rem"
          variant="outline-primary"
          :disabled="buttonStates.primaryButtonLoading"
          :loading="buttonStates.secondaryButtonLoading"
          v-b-modal.confirm-save
        >
          {{ $t('tallenna-keskeneraisena') }}
        </elsa-button>
        <elsa-button
          class="my-2 d-block d-md-inline-block d-lg-block d-xl-inline-block"
          style="min-width: 14rem"
          :disabled="buttonStates.secondaryButtonLoading"
          :loading="buttonStates.primaryButtonLoading"
          @click="validateAndConfirm"
          variant="primary"
        >
          {{ $t('allekirjoita-laheta') }}
        </elsa-button>
      </b-col>
    </b-row>
    <elsa-confirmation-modal
      id="confirm-send"
      :title="$t('vahvista-lomakkeen-lahetys')"
      :text="$t('vahvista-koulutussopimus-lahetys')"
      :submitText="$t('allekirjoita-laheta')"
      @submit="onSubmit"
    />
    <elsa-confirmation-modal
      id="confirm-save"
      :title="$t('vahvista-tallennus-keskeneraisena-title')"
      :text="$t('vahvista-tallennus-keskeneraisena-body')"
      :submitText="$t('tallenna-keskeneraisena')"
      @submit="saveAndExit"
    />
  </b-form>
</template>

<script lang="ts">
  import { format } from 'date-fns'
  import _get from 'lodash/get'
  import Component from 'vue-class-component'
  import { Vue, Prop, Mixins } from 'vue-property-decorator'
  import { validationMixin } from 'vuelidate'
  import { required, email } from 'vuelidate/lib/validators'

  import ElsaButton from '@/components/button/button.vue'
  import ElsaFormDatepicker from '@/components/datepicker/datepicker.vue'
  import ElsaFormGroup from '@/components/form-group/form-group.vue'
  import ElsaConfirmationModal from '@/components/modal/confirmation-modal.vue'
  import ElsaPopover from '@/components/popover/popover.vue'
  import {
    KoejaksonVaiheButtonStates,
    Kouluttaja,
    KoulutussopimusLomake,
    UserAccount,
    Vastuuhenkilo
  } from '@/types'
  import { defaultKouluttaja, defaultKoulutuspaikka } from '@/utils/constants'
  import KouluttajaDetails from '@/views/koejakso/erikoistuva/koulutussopimus/kouluttaja-details.vue'
  import KoulutuspaikkaDetails from '@/views/koejakso/erikoistuva/koulutussopimus/koulutuspaikka-details.vue'

  @Component({
    components: {
      KoulutuspaikkaDetails,
      KouluttajaDetails,
      ElsaFormGroup,
      ElsaFormDatepicker,
      ElsaButton,
      ElsaPopover,
      ElsaConfirmationModal
    },
    validations: {
      form: {
        opintooikeudenMyontamispaiva: {
          required
        },
        koejaksonAlkamispaiva: {
          required
        },
        erikoistuvanSahkoposti: {
          required,
          email
        },
        erikoistuvanPuhelinnumero: {
          required
        },
        vastuuhenkilo: {
          id: {
            required
          }
        }
      }
    }
  })
  export default class KoulutussopimusForm extends Mixins(validationMixin) {
    $refs!: {
      kouluttajaDetails: any
      koulutuspaikkaDetails: any
    }

    @Prop({ required: true, default: {} })
    data!: KoulutussopimusLomake

    @Prop({ required: true, default: {} })
    account!: UserAccount

    @Prop({ required: true, default: () => [] })
    kouluttajat!: Kouluttaja[]

    @Prop({ required: true, default: () => [] })
    vastuuhenkilot!: Vastuuhenkilo[]

    @Prop({ required: true, default: () => [] })
    yliopistot!: []

    form: KoulutussopimusLomake = {
      id: null,
      erikoistuvanNimi: '',
      erikoistuvanErikoisala: '',
      erikoistuvanOpiskelijatunnus: '',
      erikoistuvanPuhelinnumero: '',
      erikoistuvanSahkoposti: '',
      erikoistuvanSyntymaaika: '',
      erikoistuvanYliopisto: '',
      koejaksonAlkamispaiva: '',
      korjausehdotus: '',
      kouluttajat: [],
      koulutuspaikat: [],
      lahetetty: false,
      muokkauspaiva: '',
      opintooikeudenMyontamispaiva: '',
      opintooikeudenPaattymispaiva: '',
      vastuuhenkilo: undefined,
      yliopistot: [],
      vastuuhenkilot: []
    }
    selected: any = {
      vastuuhenkilo: null
    }
    buttonStates: KoejaksonVaiheButtonStates = {
      primaryButtonLoading: false,
      secondaryButtonLoading: false
    }

    validateState(value: string) {
      const form = this.$v.form
      const { $dirty, $error } = _get(form, value) as any
      return $dirty ? ($error ? false : null) : null
    }

    get koejaksonPaattymispaiva() {
      return ''
    }

    addKoulutuspaikka() {
      this.form.koulutuspaikat.push(Object.assign({}, defaultKoulutuspaikka))
      this.$emit('skipRouteExitConfirm', false)
    }

    deleteKoulutuspaikka() {
      this.form.koulutuspaikat.pop()
      this.$emit('skipRouteExitConfirm', false)
    }

    selectKouluttaja(kouluttaja: Kouluttaja, index: number) {
      Vue.set(this.form.kouluttajat, index, kouluttaja)
      this.$emit('skipRouteExitConfirm', false)
    }

    addKouluttaja() {
      this.form.kouluttajat.push(defaultKouluttaja)
      this.$emit('skipRouteExitConfirm', false)
    }

    deleteKouluttaja() {
      this.form.kouluttajat.pop()
      this.$emit('skipRouteExitConfirm', false)
    }

    get kouluttajatList() {
      const selectedKouluttajat = this.form.kouluttajat[0]?.kayttajaId
        ? this.form.kouluttajat.map((k) => k.kayttajaId)
        : null

      return this.kouluttajat.map((k) => {
        if (selectedKouluttajat?.includes(k.id)) {
          return {
            ...k,
            $isDisabled: true
          }
        }
        return k
      })
    }

    get maxKoejaksonAlkamispaiva() {
      const dateFormat = 'yyyy-MM-dd'
      if (!this.account.erikoistuvaLaakari.opintooikeudet[0]?.opintooikeudenPaattymispaiva) {
        return null
      }

      const d = new Date(
        this.account.erikoistuvaLaakari.opintooikeudet[0]?.opintooikeudenPaattymispaiva
      )
      // Koejakson voi aloittaa viimeistään 6kk ennen määrä-aikaisen
      // opinto-oikeuden päättymispäivää, koska koejakson kesto on 6kk.
      d.setMonth(d.getMonth() - 6)
      return format(d, dateFormat)
    }

    get vastuuhenkilotOptions() {
      return this.vastuuhenkilot.map((v: any) => ({ text: `${v.nimi}, ${v.nimike}`, value: v.id }))
    }

    updateVastuuhenkilo(id: number) {
      this.form.vastuuhenkilo = this.vastuuhenkilot.filter((a) => a.id === id)[0]
      this.$emit('skipRouteExitConfirm', false)
    }

    saveAndExit() {
      this.$emit('saveAndExit', this.form, this.buttonStates)
    }

    validateAndConfirm() {
      let childFormsValid = true
      this.$v.form.$touch()
      this.$refs.kouluttajaDetails.forEach((k: any) => {
        if (!k.checkForm()) {
          childFormsValid = false
        }
      })

      this.$refs.koulutuspaikkaDetails.forEach((k: any) => {
        if (!k.checkForm()) {
          childFormsValid = false
        }
      })

      if (this.$v.form.$anyError || !childFormsValid) {
        return
      }

      return this.$bvModal.show('confirm-send')
    }

    onSubmit() {
      this.$emit('submit', this.form, this.buttonStates)
    }

    mounted(): void {
      if (this.data !== null) {
        this.form = this.data
        this.selected.vastuuhenkilo = this.data.vastuuhenkilo?.id
      } else {
        this.form.kouluttajat.push(defaultKouluttaja)
        // Luo kopio defaultKoulutuspaikasta, koska muutoin mahdollinen toinen koulutuspaikka mäppäytyy samaan objektiin.
        this.form.koulutuspaikat.push(Object.assign({}, defaultKoulutuspaikka))
      }

      if (this.vastuuhenkilot.length === 1) {
        this.form.vastuuhenkilo = this.vastuuhenkilot[0]
      }

      // Asetetaan ei-muokattavien kenttien arvot
      this.form.erikoistuvanNimi = `${this.account.firstName} ${this.account.lastName}`
      this.form.erikoistuvanOpiskelijatunnus = this.account.erikoistuvaLaakari.opintooikeudet[0]?.opiskelijatunnus
      this.form.erikoistuvanErikoisala = this.account.erikoistuvaLaakari.opintooikeudet[0]?.erikoisalaNimi
      this.form.erikoistuvanSyntymaaika = this.account.erikoistuvaLaakari.syntymaaika
      this.form.erikoistuvanYliopisto = this.account.erikoistuvaLaakari.yliopisto
      this.form.opintooikeudenMyontamispaiva = this.account.erikoistuvaLaakari.opintooikeudet[0]?.opintooikeudenMyontamispaiva

      // Asetetaan arvot kentille, jotka saatavissa erikoistuvan lääkärin tiedoista, mutta jotka
      // käyttäjä on saattanut yliajaa lomakkeen välitallennuksen yhteydessä. Kuitenkaan opinto-oikeuden
      // alkamispäivää käyttäjä ei voi yliajaa, mikäli se on saatu opintotietojärjestelmästä.
      if (!this.form.erikoistuvanPuhelinnumero) {
        this.form.erikoistuvanPuhelinnumero =
          this.account.erikoistuvaLaakari.puhelinnumero ?? this.account.phoneNumber
      }
      if (!this.form.erikoistuvanSahkoposti) {
        this.form.erikoistuvanSahkoposti = this.account.email
      }
    }
  }
</script>
