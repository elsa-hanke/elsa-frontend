<template>
  <b-form @submit.stop.prevent="onSubmit">
    <elsa-form-group :label="$t('rooli')" :required="true">
      <template v-slot="{ uid, ariaDescribedby }">
        <b-form-radio
          :id="uid"
          v-model="form.rooli"
          @input="$emit('skipRouteExitConfirm', false)"
          :aria-describedby="ariaDescribedby"
          :name="$t('erikoistuva-laakari')"
          :value="erikoistuvaLaakari"
        >
          {{ $t('erikoistuja') }}
        </b-form-radio>
      </template>
    </elsa-form-group>
    <b-form-row>
      <elsa-form-group :label="$t('etunimi')" class="col-sm-12 col-md-6 pr-md-3" :required="true">
        <template v-slot="{ uid }">
          <b-form-input
            :id="uid"
            v-model="form.erikoistuvaLaakari.etunimi"
            @input="$emit('skipRouteExitConfirm', false)"
            :state="validateErikoistuvaLaakariState('etunimi')"
          ></b-form-input>
          <b-form-invalid-feedback :id="`${uid}-feedback`">
            {{ $t('pakollinen-tieto') }}
          </b-form-invalid-feedback>
        </template>
      </elsa-form-group>
      <elsa-form-group :label="$t('sukunimi')" class="col-sm-12 col-md-6 pl-md-3" :required="true">
        <template v-slot="{ uid }">
          <b-form-input
            :id="uid"
            v-model="form.erikoistuvaLaakari.sukunimi"
            @input="$emit('skipRouteExitConfirm', false)"
            :state="validateErikoistuvaLaakariState('sukunimi')"
          ></b-form-input>
          <b-form-invalid-feedback :id="`${uid}-feedback`">
            {{ $t('pakollinen-tieto') }}
          </b-form-invalid-feedback>
        </template>
      </elsa-form-group>
    </b-form-row>
    <elsa-form-group :label="$t('sahkopostiosoite')" :required="true">
      <template v-slot="{ uid }">
        <b-form-input
          :id="uid"
          v-model="form.erikoistuvaLaakari.sahkopostiosoite"
          @input="$emit('skipRouteExitConfirm', false)"
          :state="validateErikoistuvaLaakariState('sahkopostiosoite')"
        ></b-form-input>
        <b-form-invalid-feedback :id="`${uid}-feedback`">
          {{ $t('pakollinen-tieto') }}
        </b-form-invalid-feedback>
      </template>
    </elsa-form-group>
    <elsa-form-group :label="$t('sahkopostiosoite-uudelleen')" :required="true">
      <template v-slot="{ uid }">
        <b-form-input
          :id="uid"
          v-model="form.erikoistuvaLaakari.sahkopostiosoiteUudelleen"
          @input="$emit('skipRouteExitConfirm', false)"
          :state="validateErikoistuvaLaakariState('sahkopostiosoiteUudelleen')"
        ></b-form-input>
        <b-form-invalid-feedback :id="`${uid}-feedback`">
          {{ $t('pakollinen-tieto') }}
        </b-form-invalid-feedback>
      </template>
    </elsa-form-group>
    <hr />
    <h2>{{ $t('opintooikeus') }}</h2>
    <div class="border rounded p-3 mb-4">
      <elsa-form-group :label="$t('yliopisto')" :required="true">
        <template v-slot="{ uid }">
          <elsa-form-multiselect
            :id="uid"
            v-model="form.erikoistuvaLaakari.yliopisto"
            @input="$emit('skipRouteExitConfirm', false)"
            :options="yliopistot"
            :state="validateErikoistuvaLaakariState('yliopisto')"
            :custom-label="(value) => $t(`yliopisto-nimi.${value.nimi}`)"
            track-by="id"
          />
          <b-form-invalid-feedback :id="`${uid}-feedback`">
            {{ $t('pakollinen-tieto') }}
          </b-form-invalid-feedback>
        </template>
      </elsa-form-group>
      <elsa-form-group :label="$t('erikoisala')" :required="true">
        <template v-slot="{ uid }">
          <elsa-form-multiselect
            :id="uid"
            v-model="form.erikoistuvaLaakari.erikoisala"
            @input="$emit('skipRouteExitConfirm', false)"
            :options="erikoisalatSorted"
            :state="validateErikoistuvaLaakariState('erikoisala')"
            label="nimi"
            track-by="id"
            @select="onErikoisalaSelected"
          />
          <b-form-invalid-feedback :id="`${uid}-feedback`">
            {{ $t('pakollinen-tieto') }}
          </b-form-invalid-feedback>
        </template>
      </elsa-form-group>
      <elsa-form-group :label="$t('opiskelijatunnus')">
        <template v-slot="{ uid }">
          <b-form-input
            :id="uid"
            v-model="form.erikoistuvaLaakari.opiskelijatunnus"
            @input="$emit('skipRouteExitConfirm', false)"
          ></b-form-input>
          <b-form-invalid-feedback :id="`${uid}-feedback`">
            {{ $t('pakollinen-tieto') }}
          </b-form-invalid-feedback>
        </template>
      </elsa-form-group>
      <b-form-row>
        <elsa-form-group
          :label="$t('opintooikeuden-alkupvm')"
          class="col-xs-12 col-sm-6 pr-sm-3"
          :required="true"
        >
          <template v-slot="{ uid }">
            <elsa-form-datepicker
              ref="opiskeluoikeudenAlkamispaiva"
              :id="uid"
              :value.sync="form.erikoistuvaLaakari.opintooikeusAlkaa"
              @input="onOpiskeluoikeudenAlkamispaivaChange"
              :max="maxAlkamispaiva"
              :maxErrorText="$t('alkamispaiva-ei-voi-olla-paattymispaivan-jalkeen')"
            ></elsa-form-datepicker>
          </template>
        </elsa-form-group>
        <elsa-form-group
          :label="$t('opintooikeuden-loppupvm')"
          class="col-xs-12 col-sm-6 pl-sm-3"
          :required="true"
        >
          <template v-slot="{ uid }">
            <elsa-form-datepicker
              ref="opiskeluoikeudenPaattymispaiva"
              :id="uid"
              :value.sync="form.erikoistuvaLaakari.opintooikeusPaattyy"
              @input="$emit('skipRouteExitConfirm', false)"
              :min="minPaattymispaiva"
              :minErrorText="$t('paattymispaiva-ei-voi-olla-ennen-alkamispaivaa')"
              class="datepicker-range"
            ></elsa-form-datepicker>
          </template>
        </elsa-form-group>
      </b-form-row>
      <elsa-form-group :label="$t('asetus')" :required="true">
        <template v-slot="{ uid }">
          <b-form-radio-group
            :id="uid"
            v-model="form.erikoistuvaLaakari.asetusId"
            @input="$emit('skipRouteExitConfirm', false)"
            :options="asetuksetSorted"
            value-field="id"
            text-field="nimi"
            stacked
            :state="validateErikoistuvaLaakariState('asetusId')"
          />
        </template>
      </elsa-form-group>
      <elsa-form-group :label="$t('kaytossa-oleva-opintoopas')" :required="true">
        <template v-slot="{ uid }">
          <elsa-form-multiselect
            :id="uid"
            v-model="form.erikoistuvaLaakari.opintoopas"
            @input="$emit('skipRouteExitConfirm', false)"
            :options="opintooppaatFilteredAndSorted"
            :state="validateErikoistuvaLaakariState('opintoopas')"
            label="nimi"
            value-field="id"
            track-by="id"
          />
          <b-form-invalid-feedback :id="`${uid}-feedback`">
            {{ $t('pakollinen-tieto') }}
          </b-form-invalid-feedback>
        </template>
      </elsa-form-group>
      <elsa-form-group :label="$t('osaamisen-arvioinnin-oppaan-paivamaara')" :required="true">
        <template v-slot="{ uid }">
          <elsa-form-datepicker
            ref="osaamisenArvioinninOppaanPvm"
            :id="uid"
            :value.sync="form.erikoistuvaLaakari.osaamisenArvioinninOppaanPvm"
            @input="$emit('skipRouteExitConfirm', false)"
          ></elsa-form-datepicker>
        </template>
      </elsa-form-group>
    </div>
    <div class="d-flex flex-row-reverse flex-wrap">
      <elsa-button :loading="params.saving" type="submit" variant="primary" class="ml-2 mb-2">
        {{ $t('tallenna') }}
      </elsa-button>
      <elsa-button variant="back" @click.stop.prevent="onCancel" class="mb-2">
        {{ $t('peruuta') }}
      </elsa-button>
    </div>
  </b-form>
</template>

<script lang="ts">
  import Component from 'vue-class-component'
  import { Mixins, Prop } from 'vue-property-decorator'
  import { validationMixin } from 'vuelidate'
  import { required, email, sameAs } from 'vuelidate/lib/validators'

  import ElsaButton from '@/components/button/button.vue'
  import ElsaFormDatepicker from '@/components/datepicker/datepicker.vue'
  import ElsaFormGroup from '@/components/form-group/form-group.vue'
  import ElsaFormMultiselect from '@/components/multiselect/multiselect.vue'
  import { Asetus, Erikoisala, UusiKayttaja, Yliopisto, Opintoopas } from '@/types'
  import { dateBetween } from '@/utils/date'
  import { ELSA_ROLE } from '@/utils/roles'
  import { sortByAsc } from '@/utils/sort'

  @Component({
    components: {
      ElsaFormGroup,
      ElsaButton,
      ElsaFormDatepicker,
      ElsaFormMultiselect
    },
    validations: {
      form: {
        rooli: {
          required
        },
        erikoistuvaLaakari: {
          etunimi: {
            required
          },
          sukunimi: {
            required
          },
          sahkopostiosoite: {
            required,
            email
          },
          sahkopostiosoiteUudelleen: {
            required,
            sameAsSahkopostiosoite: sameAs('sahkopostiosoite')
          },
          yliopisto: {
            required
          },
          erikoisala: {
            required
          },
          asetusId: {
            required
          },
          opintoopas: {
            required
          },
          osaamisenArvioinninOppaanPvm: {
            required
          }
        }
      }
    }
  })
  export default class KayttajaForm extends Mixins(validationMixin) {
    $refs!: {
      opiskeluoikeudenAlkamispaiva: ElsaFormDatepicker
      opiskeluoikeudenPaattymispaiva: ElsaFormDatepicker
      osaamisenArvioinninOppaanPvm: ElsaFormDatepicker
    }

    @Prop({ required: false, default: () => [] })
    yliopistot!: Yliopisto[]

    @Prop({ required: false, default: () => [] })
    erikoisalat!: Erikoisala[]

    @Prop({ required: false, default: () => [] })
    asetukset!: Asetus[]

    @Prop({ required: false, default: () => [] })
    opintooppaat!: Opintoopas[]

    form: UusiKayttaja = {
      rooli: ELSA_ROLE.ErikoistuvaLaakari,
      erikoistuvaLaakari: {
        etunimi: null,
        sukunimi: null,
        sahkopostiosoite: null,
        sahkopostiosoiteUudelleen: null,
        yliopisto: null,
        erikoisala: null,
        opiskelijatunnus: null,
        opintooikeusAlkaa: null,
        opintooikeusPaattyy: null,
        asetusId: null,
        opintoopas: null,
        osaamisenArvioinninOppaanPvm: null
      }
    }
    params = {
      saving: false
    }

    mounted() {
      if (this.asetuksetSorted && this.asetuksetSorted.length > 0) {
        this.form.erikoistuvaLaakari.asetusId = this.asetuksetSorted[0].id ?? null
      }
    }

    validateErikoistuvaLaakariState(name: string) {
      const { $dirty, $error } = this.$v.form.erikoistuvaLaakari?.[name] as any
      return $dirty ? ($error ? false : null) : null
    }

    get maxAlkamispaiva() {
      return this.form.erikoistuvaLaakari?.opintooikeusPaattyy
    }

    get minPaattymispaiva() {
      return this.form.erikoistuvaLaakari?.opintooikeusAlkaa
    }

    get erikoistuvaLaakari() {
      return ELSA_ROLE.ErikoistuvaLaakari
    }

    onOpiskeluoikeudenAlkamispaivaChange(value: string) {
      this.$emit('skipRouteExitConfirm', false)

      this.form.erikoistuvaLaakari.osaamisenArvioinninOppaanPvm = value

      const opintoopas = this.opintooppaatFilteredAndSorted.find((o) =>
        dateBetween(value, o.voimassaoloAlkaa, o.voimassaoloPaattyy ?? undefined)
      )
      if (opintoopas) {
        this.form.erikoistuvaLaakari.opintoopas = opintoopas
      }
    }

    onSubmit() {
      const validations = [
        this.validateForm(),
        this.$refs.opiskeluoikeudenAlkamispaiva.validateForm(),
        this.$refs.opiskeluoikeudenPaattymispaiva.validateForm(),
        this.$refs.osaamisenArvioinninOppaanPvm.validateForm()
      ]
      if (validations.includes(false)) {
        return
      }
      this.$emit('submit', this.form, this.params)
    }

    validateForm(): boolean {
      this.$v.form.$touch()
      return !this.$v.$anyError
    }

    onCancel() {
      this.$emit('cancel')
    }

    onErikoisalaSelected() {
      this.form.erikoistuvaLaakari.opintoopas = null
    }

    get opintooppaatFilteredAndSorted() {
      let opintooppaat: Opintoopas[]
      if (this.form.erikoistuvaLaakari.erikoisala) {
        opintooppaat = this.opintooppaat.filter(
          (o) => o.erikoisala.id === this.form.erikoistuvaLaakari.erikoisala?.id
        )
      } else {
        opintooppaat = this.opintooppaat
      }
      return opintooppaat.sort((a, b) => sortByAsc(a.nimi, b.nimi))
    }

    get asetuksetSorted() {
      if (this.asetukset) {
        return this.asetukset.sort((a, b) => (a.id ?? 0) - (b.id ?? 0)).reverse()
      } else {
        return []
      }
    }

    get erikoisalatSorted() {
      return this.erikoisalat.sort((a, b) => sortByAsc(a.nimi, b.nimi))
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
