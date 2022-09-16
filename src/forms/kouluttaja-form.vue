<template>
  <b-form @submit.stop.prevent="onSubmit">
    <elsa-form-group :label="$t('kouluttajan-nimi')" :required="true">
      <template v-slot="{ uid }">
        <b-form-input
          :id="uid"
          v-model="value.nimi"
          :state="validateState('nimi')"
          @input="$emit('skipRouteExitConfirm', false)"
        ></b-form-input>
        <b-form-invalid-feedback :id="`${uid}-feedback`">
          {{ $t('pakollinen-tieto') }}
        </b-form-invalid-feedback>
      </template>
    </elsa-form-group>
    <elsa-form-group :label="$t('kouluttajan-sahkoposti')" :required="true">
      <template v-slot="{ uid }">
        <b-form-input
          :id="uid"
          v-model="value.sahkoposti"
          :state="validateState('sahkoposti')"
          @input="$emit('skipRouteExitConfirm', false)"
        />
        <b-form-invalid-feedback :id="`${uid}-feedback`">
          {{ $t('pakollinen-tieto') }}
        </b-form-invalid-feedback>
      </template>
    </elsa-form-group>
    <div class="text-right">
      <elsa-button variant="back" @click.stop.prevent="onCancel">{{ $t('peruuta') }}</elsa-button>
      <elsa-button :loading="params.saving" type="submit" variant="primary" class="ml-2">
        {{ $t('lisaa') }}
      </elsa-button>
    </div>
    <div class="row">
      <elsa-form-error :active="this.$v.$anyError" />
    </div>
  </b-form>
</template>

<script lang="ts">
  import Component from 'vue-class-component'
  import { Mixins } from 'vue-property-decorator'
  import { validationMixin } from 'vuelidate'
  import { required, email } from 'vuelidate/lib/validators'

  import ElsaButton from '@/components/button/button.vue'
  import ElsaFormError from '@/components/form-error/form-error.vue'
  import ElsaFormGroup from '@/components/form-group/form-group.vue'

  @Component({
    components: {
      ElsaFormGroup,
      ElsaFormError,
      ElsaButton
    },
    validations: {
      value: {
        nimi: {
          required
        },
        sahkoposti: {
          required,
          email
        }
      }
    }
  })
  export default class KouluttajaForm extends Mixins(validationMixin) {
    value = {
      nimi: null,
      sahkoposti: null
    }
    params = {
      saving: false
    }

    validateState(name: string) {
      const { $dirty, $error } = this.$v.value[name] as any
      return $dirty ? ($error ? false : null) : null
    }

    onSubmit() {
      this.$v.value.$touch()
      if (this.$v.value.$anyError) {
        return
      }
      this.$emit('submit', this.value, this.params)
    }

    onCancel() {
      this.$emit('cancel')
    }
  }
</script>
