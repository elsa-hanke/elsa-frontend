<template>
  <div>
    <b-row class="mb-3">
      <b-col>
        <h5>{{ $t('lahikouluttajan-nimi') }}</h5>
        <p>{{ kouluttaja.nimi }}</p>
      </b-col>
    </b-row>
    <b-row>
      <b-col lg="4">
        <elsa-form-group :label="$t('lahikouluttajan-nimike')" :required="true">
          <template v-slot="{ uid }">
            <b-form-input
              :id="uid"
              v-model="form.nimike"
              @input="$emit('skipRouteExitConfirm', false)"
              :state="validateState('nimike')"
            />
            <b-form-invalid-feedback :id="`${uid}-feedback`">
              {{ $t('pakollinen-tieto') }}
            </b-form-invalid-feedback>
          </template>
        </elsa-form-group>
      </b-col>
    </b-row>

    <b-row>
      <b-col lg="4">
        <elsa-form-group :label="$t('toimipaikka')" :required="true">
          <template v-slot="{ uid }">
            <b-form-input
              :id="uid"
              v-model="form.toimipaikka"
              @input="$emit('skipRouteExitConfirm', false)"
              :state="validateState('toimipaikka')"
            />
            <b-form-invalid-feedback :id="`${uid}-feedback`">
              {{ $t('pakollinen-tieto') }}
            </b-form-invalid-feedback>
          </template>
        </elsa-form-group>
      </b-col>
    </b-row>

    <b-row>
      <b-col lg="4">
        <elsa-form-group :label="$t('lahiosoite')" :required="true">
          <template v-slot="{ uid }">
            <b-form-input
              :id="uid"
              v-model="form.lahiosoite"
              @input="$emit('skipRouteExitConfirm', false)"
              :state="validateState('lahiosoite')"
            />
            <b-form-invalid-feedback :id="`${uid}-feedback`">
              {{ $t('pakollinen-tieto') }}
            </b-form-invalid-feedback>
          </template>
        </elsa-form-group>
      </b-col>

      <b-col lg="4">
        <elsa-form-group :label="$t('postitoimipaikka')" :required="true">
          <template v-slot="{ uid }">
            <b-form-input
              :id="uid"
              v-model="form.postitoimipaikka"
              @input="$emit('skipRouteExitConfirm', false)"
              :state="validateState('postitoimipaikka')"
            />
            <b-form-invalid-feedback :id="`${uid}-feedback`">
              {{ $t('pakollinen-tieto') }}
            </b-form-invalid-feedback>
          </template>
        </elsa-form-group>
      </b-col>
    </b-row>

    <b-row>
      <b-col lg="4">
        <elsa-form-group :label="$t('sahkopostiosoite')" :required="true">
          <template v-slot="{ uid }">
            <b-form-input
              :id="uid"
              v-model="form.sahkoposti"
              @input="$emit('skipRouteExitConfirm', false)"
              :state="validateState('sahkoposti')"
            />
            <b-form-invalid-feedback v-if="!$v.form.sahkoposti.required" :id="`${uid}-feedback`">
              {{ $t('pakollinen-tieto') }}
            </b-form-invalid-feedback>
            <b-form-invalid-feedback
              v-if="!$v.form.sahkoposti.email"
              :state="validateState('sahkoposti')"
              :id="`${uid}-feedback`"
            >
              {{ $t('sahkopostiosoite-ei-kelvollinen') }}
            </b-form-invalid-feedback>
          </template>
        </elsa-form-group>
      </b-col>

      <b-col lg="4">
        <elsa-form-group :label="$t('puhelin-virka-aikaan')" :required="true">
          <template v-slot="{ uid }">
            <b-form-input
              :id="uid"
              v-model="form.puhelin"
              @input="$emit('skipRouteExitConfirm', false)"
              :state="validateState('puhelin')"
            />
            <b-form-invalid-feedback :id="`${uid}-feedback`">
              {{ $t('pakollinen-tieto') }}
            </b-form-invalid-feedback>
          </template>
        </elsa-form-group>
      </b-col>
    </b-row>
  </div>
</template>

<script lang="ts">
  import _get from 'lodash/get'
  import Component from 'vue-class-component'
  import { Prop, Mixins } from 'vue-property-decorator'
  import { validationMixin } from 'vuelidate'
  import { email, required } from 'vuelidate/lib/validators'

  import ElsaFormGroup from '@/components/form-group/form-group.vue'
  import { Kouluttaja } from '@/types'
  import { defaultKouluttaja } from '@/utils/constants'

  @Component({
    components: {
      ElsaFormGroup
    },
    validations: {
      form: {
        nimike: {
          required
        },
        toimipaikka: {
          required
        },
        lahiosoite: {
          required
        },
        postitoimipaikka: {
          required
        },
        sahkoposti: {
          required,
          email
        },
        puhelin: {
          required
        }
      }
    }
  })
  export default class KouluttajaKoulutussopimusForm extends Mixins(validationMixin) {
    @Prop({ required: true, default: {} })
    kouluttaja!: Kouluttaja

    @Prop({ required: true })
    index!: number

    form: Kouluttaja = defaultKouluttaja

    get kouluttajaIndex() {
      return this.index
    }

    validateState(value: string) {
      const form = this.$v.form
      const { $dirty, $error } = _get(form, value) as any
      return $dirty ? ($error ? false : null) : null
    }

    checkForm() {
      this.$v.$touch()
      if (this.$v.$anyError) {
        return
      }

      this.$emit('ready', this.kouluttajaIndex, this.form)
    }

    mounted() {
      this.form = this.kouluttaja
    }
  }
</script>
