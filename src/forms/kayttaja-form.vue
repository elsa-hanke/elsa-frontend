<template>
  <b-form @submit.stop.prevent="onSubmit">
    <elsa-form-group :label="$t('rooli')" :required="true">
      <template v-slot="{ uid, ariaDescribedby }">
        <b-form-radio
          :id="uid"
          v-model="form.rooli"
          :aria-describedby="ariaDescribedby"
          :name="$t('erikoistuva-laakari')"
          value="erikoistuva-laakari"
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
            v-model="form.etunimi"
            :state="validateState('etunimi')"
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
            v-model="form.sukunimi"
            :state="validateState('sukunimi')"
          ></b-form-input>
          <b-form-invalid-feedback :id="`${uid}-feedback`">
            {{ $t('pakollinen-tieto') }}
          </b-form-invalid-feedback>
        </template>
      </elsa-form-group>
    </b-form-row>
    <elsa-form-group :label="$t('yliopisto')" :required="true">
      <template v-slot="{ uid }">
        <b-form-input
          :id="uid"
          v-model="form.yliopisto"
          :state="validateState('yliopisto')"
        ></b-form-input>
        <b-form-invalid-feedback :id="`${uid}-feedback`">
          {{ $t('pakollinen-tieto') }}
        </b-form-invalid-feedback>
      </template>
    </elsa-form-group>
    <elsa-form-group :label="$t('erikoisala')" :required="true">
      <template v-slot="{ uid }">
        <b-form-input
          :id="uid"
          v-model="form.erikoisala"
          :state="validateState('erikoisala')"
        ></b-form-input>
        <b-form-invalid-feedback :id="`${uid}-feedback`">
          {{ $t('pakollinen-tieto') }}
        </b-form-invalid-feedback>
      </template>
    </elsa-form-group>
    <elsa-form-group :label="$t('opiskelijatunnus')" :required="true">
      <template v-slot="{ uid }">
        <b-form-input
          :id="uid"
          v-model="form.opiskelijatunnus"
          :state="validateState('opiskelijatunnus')"
        ></b-form-input>
        <b-form-invalid-feedback :id="`${uid}-feedback`">
          {{ $t('pakollinen-tieto') }}
        </b-form-invalid-feedback>
      </template>
    </elsa-form-group>
    <b-form-row>
      <elsa-form-group
        :label="$t('opiskeluoikeuden-alkupvm')"
        class="col-sm-12 col-md-6 pr-md-3"
        :required="true"
      >
        <template v-slot="{ uid }">
          <elsa-form-datepicker
            :id="uid"
            v-model="form.opiskeluoikeusAlkaa"
            :state="validateState('opiskeluoikeusAlkaa')"
            :max="maxAlkamispaiva"
          ></elsa-form-datepicker>
          <b-form-invalid-feedback :id="`${uid}-feedback`">
            {{ $t('pakollinen-tieto') }}
          </b-form-invalid-feedback>
        </template>
      </elsa-form-group>
      <elsa-form-group
        :label="$t('opiskeluoikeuden-loppupvm')"
        class="col-sm-12 col-md-6 pl-md-3"
        :required="true"
      >
        <template v-slot="{ uid }">
          <elsa-form-datepicker
            :id="uid"
            v-model="form.opiskeluoikeusPaattyy"
            :state="validateState('opiskeluoikeusPaattyy')"
            :min="minPaattymispaiva"
            class="datepicker-range"
          ></elsa-form-datepicker>
          <b-form-invalid-feedback :id="`${uid}-feedback`">
            {{ $t('pakollinen-tieto') }}
          </b-form-invalid-feedback>
        </template>
      </elsa-form-group>
    </b-form-row>
    <elsa-form-group :label="$t('kaytossa-olevan-opetussuunnitelman-paivamaara')" :required="true">
      <template v-slot="{ uid }">
        <elsa-form-datepicker
          :id="uid"
          v-model="form.opintosuunnitelmaKaytossaPvm"
          :state="validateState('opintosuunnitelmaKaytossaPvm')"
        ></elsa-form-datepicker>
        <b-form-invalid-feedback :id="`${uid}-feedback`">
          {{ $t('pakollinen-tieto') }}
        </b-form-invalid-feedback>
      </template>
    </elsa-form-group>
    <elsa-form-group :label="$t('sahkopostiosoite')" :required="true">
      <template v-slot="{ uid }">
        <b-form-input
          :id="uid"
          v-model="form.sahkopostiosoite"
          :state="validateState('sahkopostiosoite')"
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
          v-model="form.sahkopostiosoiteUudelleen"
          :state="validateState('sahkopostiosoiteUudelleen')"
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
  import { Mixins } from 'vue-property-decorator'
  import { validationMixin } from 'vuelidate'
  import { required, email, sameAs } from 'vuelidate/lib/validators'

  import ElsaButton from '@/components/button/button.vue'
  import ElsaFormDatepicker from '@/components/datepicker/datepicker.vue'
  import ElsaFormGroup from '@/components/form-group/form-group.vue'

  @Component({
    components: {
      ElsaFormGroup,
      ElsaButton,
      ElsaFormDatepicker
    },
    validations: {
      form: {
        rooli: {
          required
        },
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
        opiskeluoikeusAlkaa: {
          required
        },
        opiskeluoikeusPaattyy: {
          required
        },
        opintosuunnitelmaKaytossaPvm: {
          required
        },
        sahkopostiosoite: {
          required,
          email
        },
        sahkopostiosoiteUudelleen: {
          required,
          sameAsPassword: sameAs('sahkopostiosoite')
        }
      }
    }
  })
  export default class KayttajaForm extends Mixins(validationMixin) {
    form = {
      rooli: 'erikoistuva-laakari',
      etunimi: null,
      sukunimi: null,
      yliopisto: null,
      erikoisala: null,
      opiskelijatunnus: null,
      opiskeluoikeusAlkaa: null,
      opiskeluoikeusPaattyy: null,
      opintosuunnitelmaKaytossaPvm: null,
      sahkopostiosoite: null
    }
    params = {
      saving: false
    }

    validateState(name: string) {
      const { $dirty, $error } = this.$v.form[name] as any
      return $dirty ? ($error ? false : null) : null
    }

    get maxAlkamispaiva() {
      return this.form.opiskeluoikeusPaattyy
    }

    get minPaattymispaiva() {
      return this.form.opiskeluoikeusAlkaa
    }

    onSubmit() {
      this.$v.form.$touch()
      if (this.$v.form.$anyError) {
        return
      }
      this.$emit('submit', this.form, this.params)
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
    left: -2rem;
    padding: 0.375rem 0.75rem;
    @include media-breakpoint-down(sm) {
      display: none;
    }
  }
</style>
