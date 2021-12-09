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
    <elsa-form-group :label="$t('yliopisto')" :required="true">
      <template v-slot="{ uid }">
        <elsa-form-multiselect
          :id="uid"
          v-model="form.erikoistuvaLaakari.yliopisto"
          @input="$emit('skipRouteExitConfirm', false)"
          :options="yliopistot"
          :state="validateErikoistuvaLaakariState('yliopisto')"
          label="nimi"
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
          :options="erikoisalat"
          :state="validateErikoistuvaLaakariState('erikoisala')"
          label="nimi"
          track-by="id"
        />
        <b-form-invalid-feedback :id="`${uid}-feedback`">
          {{ $t('pakollinen-tieto') }}
        </b-form-invalid-feedback>
      </template>
    </elsa-form-group>
    <elsa-form-group :label="$t('opiskelijatunnus')" :required="true">
      <template v-slot="{ uid }">
        <b-form-input
          :id="uid"
          v-model="form.erikoistuvaLaakari.opiskelijatunnus"
          @input="$emit('skipRouteExitConfirm', false)"
          :state="validateErikoistuvaLaakariState('opiskelijatunnus')"
        ></b-form-input>
        <b-form-invalid-feedback :id="`${uid}-feedback`">
          {{ $t('pakollinen-tieto') }}
        </b-form-invalid-feedback>
      </template>
    </elsa-form-group>
    <b-form-row>
      <elsa-form-group
        :label="$t('opiskeluoikeuden-alkupvm')"
        class="col-xs-12 col-sm-6 pr-sm-3"
        :required="true"
      >
        <template v-slot="{ uid }">
          <elsa-form-datepicker
            ref="opiskeluoikeudenAlkamispaiva"
            :id="uid"
            :value.sync="form.erikoistuvaLaakari.opintooikeusAlkaa"
            @input="$emit('skipRouteExitConfirm', false)"
            :max="maxAlkamispaiva"
            :maxErrorText="$t('alkamispaiva-ei-voi-olla-paattymispaivan-jalkeen')"
          ></elsa-form-datepicker>
        </template>
      </elsa-form-group>
      <elsa-form-group
        :label="$t('opiskeluoikeuden-loppupvm')"
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
    <elsa-form-group :label="$t('kaytossa-olevan-opetussuunnitelman-paivamaara')" :required="true">
      <template v-slot="{ uid }">
        <elsa-form-datepicker
          ref="opetussuunnitelmaKaytossaPvm"
          :id="uid"
          :value.sync="form.erikoistuvaLaakari.opintosuunnitelmaKaytossaPvm"
          @input="$emit('skipRouteExitConfirm', false)"
        ></elsa-form-datepicker>
      </template>
    </elsa-form-group>
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
  import { UusiKayttaja } from '@/types'
  import { ELSA_ROLE } from '@/utils/roles'

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
          yliopisto: {
            required
          },
          erikoisala: {
            required
          },
          opiskelijatunnus: {
            required
          },
          sahkopostiosoite: {
            required,
            email
          },
          sahkopostiosoiteUudelleen: {
            required,
            sameAsSahkopostiosoite: sameAs('sahkopostiosoite')
          }
        }
      }
    }
  })
  export default class KayttajaForm extends Mixins(validationMixin) {
    $refs!: {
      opiskeluoikeudenAlkamispaiva: ElsaFormDatepicker
      opiskeluoikeudenPaattymispaiva: ElsaFormDatepicker
      opetussuunnitelmaKaytossaPvm: ElsaFormDatepicker
    }

    @Prop({ required: false, default: () => [] })
    yliopistot!: any[]

    @Prop({ required: false, default: () => [] })
    erikoisalat!: any[]

    form: UusiKayttaja = {
      rooli: ELSA_ROLE.ErikoistuvaLaakari,
      erikoistuvaLaakari: {
        etunimi: null,
        sukunimi: null,
        yliopisto: null,
        erikoisala: null,
        opiskelijatunnus: null,
        opintooikeusAlkaa: null,
        opintooikeusPaattyy: null,
        opintosuunnitelmaKaytossaPvm: null,
        sahkopostiosoite: null,
        sahkopostiosoiteUudelleen: null
      }
    }
    params = {
      saving: false
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

    onSubmit() {
      const validations = [
        this.validateForm(),
        this.$refs.opiskeluoikeudenAlkamispaiva.validateForm(),
        this.$refs.opiskeluoikeudenPaattymispaiva.validateForm(),
        this.$refs.opetussuunnitelmaKaytossaPvm.validateForm()
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
