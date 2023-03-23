<template>
  <b-form @submit.stop.prevent="onSubmit">
    <p>{{ $t('lisaa-kouluttaja-info-1') }}</p>
    <p>{{ $t('lisaa-kouluttaja-info-2') }}</p>
    <b-form-row>
      <elsa-form-group
        :label="$t('kouluttajan-etunimi')"
        class="col-sm-12 col-md-5 pr-md-3"
        :required="true"
      >
        <template #default="{ uid }">
          <b-form-input
            :id="uid"
            v-model="form.etunimi"
            :state="validateState('etunimi')"
            @input="$emit('skipRouteExitConfirm', false)"
          ></b-form-input>
          <b-form-invalid-feedback :id="`${uid}-feedback`">
            {{ $t('pakollinen-tieto') }}
          </b-form-invalid-feedback>
        </template>
      </elsa-form-group>
      <elsa-form-group
        :label="$t('kouluttajan-sukunimi')"
        class="col-sm-12 col-md-7 pl-md-3"
        :required="true"
      >
        <template #default="{ uid }">
          <b-form-input
            :id="uid"
            v-model="form.sukunimi"
            :state="validateState('sukunimi')"
            @input="$emit('skipRouteExitConfirm', false)"
          ></b-form-input>
          <b-form-invalid-feedback :id="`${uid}-feedback`">
            {{ $t('pakollinen-tieto') }}
          </b-form-invalid-feedback>
        </template>
      </elsa-form-group>
    </b-form-row>
    <elsa-form-group :label="$t('kouluttajan-sahkoposti')" :required="true">
      <template #default="{ uid }">
        <b-form-input
          :id="uid"
          v-model="form.sahkoposti"
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
      <elsa-button :loading="params.saving" type="submit" variant="primary" class="ml-2 pr-5 pl-5">
        {{ $t('lisaa') }}
      </elsa-button>
    </div>
  </b-form>
</template>

<script lang="ts">
  import Component from 'vue-class-component'
  import { Mixins } from 'vue-property-decorator'
  import { validationMixin } from 'vuelidate'
  import { required, email } from 'vuelidate/lib/validators'

  import ElsaButton from '@/components/button/button.vue'
  import ElsaFormGroup from '@/components/form-group/form-group.vue'
  import { UusiKouluttaja } from '@/types'

  @Component({
    components: {
      ElsaFormGroup,
      ElsaButton
    },
    validations: {
      form: {
        etunimi: {
          required
        },
        sukunimi: {
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
    form: Partial<UusiKouluttaja> = {}
    params = {
      saving: false
    }

    validateState(name: string) {
      const { $dirty, $error } = this.$v.form[name] as any
      return $dirty ? ($error ? false : null) : null
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
