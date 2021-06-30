<template>
  <div>
    <elsa-form-group :label="$t('toimipaikan-nimi')" :required="true">
      <template v-slot="{ uid }">
        <b-form-input :id="uid" v-model="koulutuspaikka.nimi" />
        <b-form-invalid-feedback :id="`${uid}-feedback`">
          {{ $t('pakollinen-tieto') }}
        </b-form-invalid-feedback>
      </template>
    </elsa-form-group>
    <elsa-form-group :label="$t('toimipaikalla-koulutussopimus.header')" :required="true">
      <template v-slot="{ uid }">
        <b-form-radio-group
          :id="uid"
          v-model="form.toimipaikallaKoulutussopimus"
          :state="validateState('toimipaikallaKoulutussopimus')"
          name="toimipaikalla-koulutussopimus"
          stacked
        >
          <b-form-radio :value="true">
            {{ $t('kylla') }}
          </b-form-radio>
          <b-form-radio :value="false">
            {{ $t('toimipaikalla-koulutussopimus.ei-sopimusta') }}
          </b-form-radio>
        </b-form-radio-group>
        <b-form-radio-group
          v-if="form.toimipaikallaKoulutussopimus === false"
          v-model="koulutuspaikka.yliopisto"
          :options="yliopistotOptions"
          name="koulutuspaikat"
          stacked
          class="pl-4"
        ></b-form-radio-group>
        <b-form-invalid-feedback :id="`${uid}-feedback`">
          {{ $t('pakollinen-tieto') }}
        </b-form-invalid-feedback>
      </template>
    </elsa-form-group>
  </div>
</template>

<script lang="ts">
  import Component from 'vue-class-component'
  import { Prop, Mixins } from 'vue-property-decorator'
  import { validationMixin } from 'vuelidate'
  import { required } from 'vuelidate/lib/validators'
  import ElsaButton from '@/components/button/button.vue'
  import ElsaFormGroup from '@/components/form-group/form-group.vue'
  import { Koulutuspaikka } from '@/types'

  @Component({
    components: {
      ElsaFormGroup,
      ElsaButton
    },
    validations: {
      form: {
        toimipaikallaKoulutussopimus: {
          required
        }
      }
    }
  })
  export default class KoulutuspaikkaDetails extends Mixins(validationMixin) {
    @Prop({ required: true, default: () => [] })
    yliopistot!: []

    @Prop({
      type: Object,
      default: {}
    })
    koulutuspaikka!: Koulutuspaikka
    form = {
      toimipaikallaKoulutussopimus: null
    } as any

    validateState(name: string) {
      const { $dirty, $error } = this.$v.form[name] as any
      return $dirty ? ($error ? false : null) : null
    }

    mounted(): void {
      if (!this.koulutuspaikka.yliopisto) {
        this.form.toimipaikallaKoulutussopimus = true
      }
    }

    get yliopistotOptions() {
      return this.yliopistot.map((y: any) => ({ text: y.nimi, value: y.nimi }))
    }
  }
</script>
