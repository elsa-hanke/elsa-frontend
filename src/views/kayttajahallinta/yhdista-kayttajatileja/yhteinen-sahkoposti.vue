<template>
  <b-form>
    <b-row lg class="mt-4">
      <b-col>
        <h1>{{ $t('maarita-kayttajatileille-yhteinen-sahkopostiosoite') }}</h1>
      </b-col>
    </b-row>
    <b-row lg class="mt-4">
      <elsa-form-group :label="$t('sahkopostiosoite')" :required="true" class="col-12">
        <template #default="{ uid }">
          <b-form-input
            :id="uid"
            v-model="form.yhteinenSahkoposti"
            :state="validateState('yhteinenSahkoposti')"
            @input="$v.form.yhteinenSahkoposti.$touch()"
          ></b-form-input>
          <b-form-invalid-feedback
            v-if="$v.form.yhteinenSahkoposti.$error && !$v.form.yhteinenSahkoposti.required"
            :id="`${uid}-feedback`"
          >
            {{ $t('pakollinen-tieto') }}
          </b-form-invalid-feedback>
          <b-form-invalid-feedback
            v-if="$v.form.yhteinenSahkoposti.$error && !$v.form.yhteinenSahkoposti.email"
            :id="`${uid}-feedback`"
          >
            {{ $t('sahkopostiosoite-ei-kelvollinen') }}
          </b-form-invalid-feedback>
        </template>
      </elsa-form-group>
    </b-row>
    <b-row lg>
      <elsa-form-group :label="$t('vahvista-sahkopostiosoite')" :required="true" class="col-12">
        <template #default="{ uid }">
          <b-form-input
            :id="uid"
            v-model="form.yhteinenSahkopostiUudelleen"
            :state="validateState('yhteinenSahkopostiUudelleen')"
            @input="$v.form.yhteinenSahkopostiUudelleen.$touch()"
          ></b-form-input>
          <b-form-invalid-feedback
            v-if="
              $v.form.yhteinenSahkopostiUudelleen.$error &&
              !$v.form.yhteinenSahkopostiUudelleen.required
            "
            :id="`${uid}-feedback`"
          >
            {{ $t('pakollinen-tieto') }}
          </b-form-invalid-feedback>
          <b-form-invalid-feedback
            v-if="
              $v.form.yhteinenSahkopostiUudelleen.$error &&
              !$v.form.yhteinenSahkopostiUudelleen.email
            "
            :id="`${uid}-feedback`"
          >
            {{ $t('sahkopostiosoite-ei-kelvollinen') }}
          </b-form-invalid-feedback>
          <b-form-invalid-feedback
            v-if="
              $v.form.yhteinenSahkopostiUudelleen.$error &&
              $v.form.yhteinenSahkopostiUudelleen.required &&
              $v.form.yhteinenSahkopostiUudelleen.email &&
              !$v.form.yhteinenSahkopostiUudelleen.sameAsSahkoposti
            "
            :id="`${uid}-feedback`"
          >
            {{ $t('sahkopostiosoitteet-eivat-tasmaa') }}
          </b-form-invalid-feedback>
        </template>
      </elsa-form-group>
    </b-row>
  </b-form>
</template>

<script lang="ts">
  import Component from 'vue-class-component'
  import { Mixins, Prop, Watch } from 'vue-property-decorator'
  import { validationMixin } from 'vuelidate'
  import { required, email, sameAs } from 'vuelidate/lib/validators'

  import ElsaButton from '@/components/button/button.vue'
  import ElsaFormGroup from '@/components/form-group/form-group.vue'
  import ElsaFormMultiselect from '@/components/multiselect/multiselect.vue'
  import UserAvatar from '@/components/user-avatar/user-avatar.vue'
  import { YhdistaKayttajatilejaForm } from '@/types'

  @Component({
    components: {
      ElsaFormGroup,
      ElsaFormMultiselect,
      UserAvatar,
      ElsaButton
    }
  })
  export default class YhteinenSahkoposti extends Mixins(validationMixin) {
    @Prop({ required: true })
    form!: YhdistaKayttajatilejaForm

    validations() {
      return {
        form: {
          yhteinenSahkoposti: {
            required,
            email
          },
          yhteinenSahkopostiUudelleen: {
            required,
            email,
            sameAsSahkoposti: sameAs('yhteinenSahkoposti')
          }
        }
      }
    }

    validateState(name: string) {
      const { $dirty, $error } = this.$v.form[name] as any
      return $dirty ? ($error ? false : null) : null
    }

    get isFormValid() {
      const isYhteinenSahkopostiValid =
        this.$v.form?.yhteinenSahkoposti?.$pending === false &&
        !this.$v.form?.yhteinenSahkoposti.$invalid
      const isYhteinenSahkopostiUudelleenValid =
        this.$v.form?.yhteinenSahkopostiUudelleen?.$pending === false &&
        !this.$v.form?.yhteinenSahkopostiUudelleen.$invalid
      return isYhteinenSahkopostiValid && isYhteinenSahkopostiUudelleenValid
    }

    @Watch('isFormValid')
    onFormValidityChange(newVal: boolean) {
      this.form.formValid = newVal
    }
  }
</script>
