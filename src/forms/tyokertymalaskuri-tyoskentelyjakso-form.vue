<template>
  <b-form @submit.stop.prevent="onSubmit">
    <elsa-form-group :label="$t('tyoskentelypaikka')" :required="!value.tapahtumia">
      <template #default="{ uid }">
        <div>
          <b-form-input
            :id="uid"
            v-model="form.tyoskentelypaikka.nimi"
            :state="validateState('tyoskentelypaikka.nimi')"
            @input="$emit('skipRouteExitConfirm', false)"
          ></b-form-input>
          <b-form-invalid-feedback :id="`${uid}-feedback`">
            {{ $t('pakollinen-tieto') }}
          </b-form-invalid-feedback>
        </div>
      </template>
    </elsa-form-group>
    <elsa-form-group :label="$t('kaytannon-koulutus')" :required="true">
      <template #default="{ uid }">
        <div>
          <b-form-radio
            v-model="form.kaytannonKoulutus"
            name="kaytannon-koulutus-tyyppi"
            :value="omanErikoisalanKoulutus"
            @input="$emit('skipRouteExitConfirm', false)"
          >
            {{ $t('oman-erikoisalan-koulutus') }}
          </b-form-radio>
          <b-form-radio
            v-model="form.kaytannonKoulutus"
            name="kaytannon-koulutus-tyyppi"
            :value="muuErikoisala"
            @input="$emit('skipRouteExitConfirm', false)"
          >
            {{ $t('muu-erikoisala') }}
          </b-form-radio>
          <b-form-radio
            v-model="form.kaytannonKoulutus"
            name="kaytannon-koulutus-tyyppi"
            :value="kahdenVuodenKliininenTyokokemus"
            @input="$emit('skipRouteExitConfirm', false)"
          >
            {{ $t('kahden-vuoden-kliininen-tyokokemus') }}
          </b-form-radio>
          <b-form-radio
            v-model="form.kaytannonKoulutus"
            name="kaytannon-koulutus-tyyppi"
            :value="terveyskeskustyo"
            @input="$emit('skipRouteExitConfirm', false)"
          >
            {{ $t('pakollinen-terveyskeskuskoulutusjakso') }}
          </b-form-radio>
          <b-form-invalid-feedback :id="`${uid}-feedback`">
            {{ $t('pakollinen-tieto') }}
          </b-form-invalid-feedback>
        </div>
      </template>
    </elsa-form-group>
    <b-form-row>
      <elsa-form-group
        :label="$t('alkamispaiva')"
        class="col-xs-12 col-sm-6 pr-sm-3"
        :required="!value.tapahtumia"
      >
        <template #default="{ uid }">
          <div>
            <elsa-form-datepicker
              v-if="childDataReceived"
              :id="uid"
              ref="alkamispaiva"
              :value.sync="form.alkamispaiva"
              :max="maxAlkamispaiva"
              :max-error-text="
                value.tapahtumia
                  ? $t('tyoskentelyjakso-datepicker-help')
                  : $t('alkamispaiva-ei-voi-olla-paattymispaivan-jalkeen')
              "
              @input="$emit('skipRouteExitConfirm', false)"
            ></elsa-form-datepicker>
            <!--
            <small v-if="value.tapahtumia" class="form-text text-muted">
              {{ $t('tyoskentelyjakso-paattymispaiva-help') }}
            </small>
            -->
          </div>
        </template>
      </elsa-form-group>
      <elsa-form-group :label="$t('paattymispaiva')" class="col-xs-12 col-sm-6 pl-sm-3">
        <template #default="{ uid }">
          <elsa-form-datepicker
            v-if="childDataReceived"
            :id="uid"
            ref="paattymispaiva"
            :value.sync="form.paattymispaiva"
            :min="minPaattymispaiva"
            :min-error-text="
              value.tapahtumia
                ? $t('tyoskentelyjakso-datepicker-help')
                : $t('paattymispaiva-ei-voi-olla-ennen-alkamispaivaa')
            "
            :required="false"
            :aria-describedby="`${uid}-help`"
            class="datepicker-range"
            @input="$emit('skipRouteExitConfirm', false)"
          />
          <small v-if="value.tapahtumia" class="form-text text-muted">
            {{ $t('tyoskentelyjakso-paattymispaiva-help') }}
          </small>
          <!--
          <small v-else class="form-text text-muted">
            {{ $t('jata-tyhjaksi-jos-ei-tiedossa') }}
          </small>
          -->
        </template>
      </elsa-form-group>
    </b-form-row>
    <elsa-form-group
      :label="$t('tyoaika-taydesta-tyopaivasta') + ' (50–100 %)'"
      :required="!value.tapahtumia"
    >
      <template #default="{ uid }">
        <div>
          <div class="d-flex align-items-center">
            <b-form-input
              :id="uid"
              :value="form.osaaikaprosentti"
              :state="validateState('osaaikaprosentti')"
              type="number"
              step="any"
              class="col-sm-3"
              @input="onOsaaikaprosenttiInput"
            />
            <span class="mx-3">%</span>
          </div>
          <!--
          <small class="d-flex form-text text-muted">
            {{ $t('alle-50-osaaikaisuus-ei-kerryta') }}
          </small>
          -->
          <b-form-invalid-feedback
            :id="`${uid}-feedback`"
            :style="{
              display: validateState('osaaikaprosentti') === false ? 'block' : 'none'
            }"
          >
            {{ $t('osaaikaprosentti-validointivirhe') }} 50–100 %
          </b-form-invalid-feedback>
        </div>
      </template>
    </elsa-form-group>
    <hr />
    <div>
      <div v-for="(poissaolo, index) in form.poissaolot" :key="index">
        <tyokertymalaskuri-tyoskentelyjakso-poissaolo-form
          :poissaolo="poissaolo"
          :poissaolon-syyt-sorted="poissaolonSyytSorted"
          :child-data-received="childDataReceived"
          :tyojakso-alkamispaiva="form.alkamispaiva"
          :tyojakso-paattymispaiva="form.paattymispaiva"
          @input="onPoissaoloInput($event, index)"
        />
        <elsa-button
          variant="link"
          size="sm"
          class="text-decoration-none shadow-none p-0"
          @click="removePoissaolo(index)"
        >
          <font-awesome-icon :icon="['far', 'trash-alt']" fixed-width size="sm" />
          {{ $t('poista-poissaolo') }}
        </elsa-button>
        <hr />
      </div>
      <b-button variant="outline-primary" @click="addPoissaolo">
        {{ $t('lisaa-jaksolle-poissaolo') }}
      </b-button>
    </div>
    <hr />
    <div class="d-flex flex-row-reverse flex-wrap">
      <elsa-button :loading="params.saving" type="submit" variant="primary" class="ml-2 mb-2">
        {{ editing ? $t('tallenna') : $t('tallenna-jakso') }}
      </elsa-button>
      <elsa-button variant="back" class="mb-2" @click.stop.prevent="onCancel">
        {{ $t('peruuta') }}
      </elsa-button>
    </div>
    <div class="row">
      <elsa-form-error :active="$v.$anyError" />
    </div>
  </b-form>
</template>

<script lang="ts">
  import axios from 'axios'
  import Component from 'vue-class-component'
  import { Prop, Vue } from 'vue-property-decorator'
  import { between, integer, required, requiredIf } from 'vuelidate/lib/validators'

  import AsiakirjatContent from '@/components/asiakirjat/asiakirjat-content.vue'
  import AsiakirjatUpload from '@/components/asiakirjat/asiakirjat-upload.vue'
  import ElsaButton from '@/components/button/button.vue'
  import ElsaFormDatepicker from '@/components/datepicker/datepicker.vue'
  import ElsaFormError from '@/components/form-error/form-error.vue'
  import ElsaFormGroup from '@/components/form-group/form-group.vue'
  import ElsaFormMultiselect from '@/components/multiselect/multiselect.vue'
  import ElsaPoissaolonSyyt from '@/components/poissaolon-syyt/poissaolon-syyt.vue'
  import ElsaPopover from '@/components/popover/popover.vue'
  import TyokertymalaskuriTyoskentelyjaksoPoissaoloForm from '@/forms/tyokertymalaskuri-tyoskentelyjakso-poissaolo-form.vue'
  import {
    LaillistamistiedotLomakeKoulutettava,
    PoissaolonSyy,
    TyokertymaLaskuriTyoskentelyjaksoForm,
    Tyoskentelyjakso
  } from '@/types'
  import {
    KaytannonKoulutusTyyppi,
    PoissaolonSyyTyyppi,
    TyoskentelyjaksoTyyppi
  } from '@/utils/constants'
  import { sortByAsc } from '@/utils/sort'
  import { toastFail } from '@/utils/toast'
  import { tyoskentelypaikkaTyyppiLabel } from '@/utils/tyoskentelyjakso'
  import KouluttajaKoulutussopimusForm from '@/views/koejakso/kouluttaja/kouluttaja-koulutussopimus-form.vue'

  @Component({
    components: {
      TyokertymalaskuriTyoskentelyjaksoPoissaoloForm,
      ElsaPoissaolonSyyt,
      KouluttajaKoulutussopimusForm,
      AsiakirjatContent,
      AsiakirjatUpload,
      ElsaButton,
      ElsaFormGroup,
      ElsaFormError,
      ElsaFormMultiselect,
      ElsaFormDatepicker,
      ElsaPopover
    },
    validations: {
      form: {
        tyoskentelypaikka: {
          required,
          nimi: {
            required
          },
          kunta: {
            required
          },
          tyyppi: {
            required
          },
          muuTyyppi: {
            required: requiredIf((value) => {
              return value.tyyppi === 'MUU'
            })
          }
        },
        osaaikaprosentti: {
          required,
          integer,
          between: between(50, 100)
        }
      }
    }
  })
  export default class TyokertymalaskuriTyoskentelyjaksoForm extends Vue {
    $refs!: {
      alkamispaiva: ElsaFormDatepicker
      paattymispaiva: ElsaFormDatepicker
    }

    @Prop({ required: false, default: false })
    editing!: boolean

    @Prop({
      required: false,
      type: Object,
      default: () => ({
        alkamispaiva: null,
        paattymispaiva: null,
        osaaikaprosentti: null,
        tyoskentelypaikka: {
          nimi: null,
          tyyppi: null,
          muuTyyppi: null
        }
      })
    })
    value!: Tyoskentelyjakso

    form: TyokertymaLaskuriTyoskentelyjaksoForm = {
      alkamispaiva: null,
      paattymispaiva: null,
      minPaattymispaiva: null,
      maxAlkamispaiva: null,
      osaaikaprosentti: 100,
      tyoskentelypaikka: {
        nimi: null,
        tyyppi: null,
        muuTyyppi: null
      },
      kaytannonKoulutus: null,
      poissaolot: []
    }
    tyypit = [
      { text: this.$t('terveyskeskus'), value: TyoskentelyjaksoTyyppi.TERVEYSKESKUS },
      {
        text: this.$t('keskussairaala-tai-aluesairaala'),
        value: TyoskentelyjaksoTyyppi.KESKUSSAIRAALA
      },
      {
        text: this.$t('yliopistollinen-sairaala'),
        value: TyoskentelyjaksoTyyppi.YLIOPISTOLLINEN_SAIRAALA
      }
    ]
    params = {
      saving: false,
      deleting: false
    }
    childDataReceived = false

    laillistamisTiedotForm: LaillistamistiedotLomakeKoulutettava = {
      laillistamistiedotAdded: false,
      ensimmainenTyoskentelyjakso: false,
      laillistamispaiva: null,
      laillistamispaivanLiite: null,
      laakarikoulutusSuoritettuSuomiTaiBelgia: false
    }

    poissaolonSyyt: PoissaolonSyy[] = []

    async mounted() {
      await this.fetchPoissaolonSyyt()

      // this.form = {
      //   ...this.value
      // }
      this.childDataReceived = true
    }

    async fetchPoissaolonSyyt() {
      try {
        this.poissaolonSyyt = (await axios.get(`/julkinen/poissaolon-syyt`)).data
      } catch {
        toastFail(this, this.$t('poissaolon-syiden-hakeminen-epaonnistui'))
      }
    }

    validateState(name: string) {
      const get = (obj: any, path: any, defaultValue = undefined) => {
        const travel = (regexp: any) =>
          String.prototype.split
            .call(path, regexp)
            .filter(Boolean)
            .reduce((res, key) => (res !== null && res !== undefined ? res[key] : res), obj)
        const result = travel(/[,[\]]+?/) || travel(/[,[\].]+?/)
        return result === undefined || result === obj ? defaultValue : result
      }
      const { $dirty, $error } = get(this.$v.form, name)
      return $dirty ? ($error ? false : null) : null
    }

    validateForm(): boolean {
      this.$v.form.$touch()
      return !this.$v.$anyError
    }

    validatePoissaolot() {
      let isValid = true
      this.form.poissaolot.forEach((poissaolo) => {
        if (!poissaolo.alkamispaiva || !poissaolo.paattymispaiva) {
          isValid = false
          this.$set(poissaolo, 'invalid', true)
        } else {
          this.$set(poissaolo, 'invalid', false)
        }
      })
      return isValid
    }

    async onSubmit() {
      const validations = [
        this.validateForm(),
        this.$refs.alkamispaiva ? this.$refs.alkamispaiva.validateForm() : true,
        this.$refs.paattymispaiva.validateForm()
      ]
      if (validations.includes(false)) {
        return
      }

      const submitData = {
        tyoskentelyjakso: {
          ...this.form,
          tyoskentelypaikka: {
            ...this.form.tyoskentelypaikka
          }
        }
      }
      this.$emit('submit', submitData, this.params)
    }

    onOsaaikaprosenttiInput(value: string) {
      if (value === '') {
        this.form.osaaikaprosentti = null
      } else {
        this.form.osaaikaprosentti = parseFloat(value)
      }
      this.$emit('skipRouteExitConfirm', false)
    }

    onCancel() {
      this.$emit('cancel')
    }

    get maxAlkamispaiva() {
      if (this.value.tapahtumia) {
        return this.form.maxAlkamispaiva
      } else {
        return this.form.paattymispaiva
      }
    }

    get minPaattymispaiva() {
      if (this.value.tapahtumia) {
        return this.form.minPaattymispaiva
      } else {
        return this.form.alkamispaiva
      }
    }

    get tyyppiLabel() {
      if (this.form?.tyoskentelypaikka?.tyyppi) {
        return tyoskentelypaikkaTyyppiLabel(this, this.form?.tyoskentelypaikka?.tyyppi)
      }
      return undefined
    }

    get omanErikoisalanKoulutus() {
      return KaytannonKoulutusTyyppi.OMAN_ERIKOISALAN_KOULUTUS
    }

    get muuErikoisala() {
      return KaytannonKoulutusTyyppi.MUU_ERIKOISALA
    }

    get kahdenVuodenKliininenTyokokemus() {
      return KaytannonKoulutusTyyppi.KAHDEN_VUODEN_KLIININEN_TYOKOKEMUS
    }

    get terveyskeskustyo() {
      return KaytannonKoulutusTyyppi.TERVEYSKESKUSTYO
    }

    get poissaolonSyytSorted() {
      return [...this.poissaolonSyyt.sort((a, b) => sortByAsc(a.nimi, b.nimi))]
    }

    get minAlkamispaiva() {
      return this.form.alkamispaiva
    }

    get alkamispaivaInitialDate() {
      return this.form.alkamispaiva
    }

    get paattymispaivaInitialDate() {
      return this.form.alkamispaiva
    }

    get maxPaattymispaiva() {
      return this.form.paattymispaiva
    }

    addPoissaolo() {
      this.form.poissaolot.push({
        poissaolonSyyId: 0,
        poissaolonSyy: {
          id: 0,
          nimi: '',
          vahennystyyppi: PoissaolonSyyTyyppi.VAHENNETAAN_SUORAAN,
          voimassaolonAlkamispaiva: '',
          voimassaolonPaattymispaiva: null
        },
        tyoskentelyjaksoId: 0,
        kokoTyoajanPoissaolo: false
      })
    }

    removePoissaolo(index: number) {
      this.form.poissaolot.splice(index, 1)
    }

    onPoissaoloInput(updatedPoissaolo: any, index: number) {
      this.$set(this.form.poissaolot, index, updatedPoissaolo)
    }

    saveToLocalStorage() {
      localStorage.setItem('tyokertyma-lomake', JSON.stringify(this.$data))
    }

    loadFromLocalStorage() {
      const savedData = localStorage.getItem('tyokertyma-lomake')
      if (savedData) {
        this.form = JSON.parse(savedData)
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '~@/styles/variables';
  @import '~bootstrap/scss/mixins/breakpoints';

  .datepicker-range::before {
    content: '–';
    position: absolute;
    left: -1.5rem;
    padding: 0.375rem 0.75rem;
    @include media-breakpoint-down(xs) {
      display: none;
    }
  }
</style>
