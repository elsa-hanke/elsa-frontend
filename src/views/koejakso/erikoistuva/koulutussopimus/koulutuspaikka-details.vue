<template>
  <div>
    <elsa-form-group :label="$t('toimipaikan-nimi')" :required="true">
      <template v-slot="{ uid }">
        <b-form-input :id="uid" v-model="form.nimi" :state="validateState('nimi')" name="nimi" />
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
          v-model="form.yliopisto"
          :state="validateState('yliopisto')"
          :options="yliopistotOptions"
          stacked
          class="pl-4"
        ></b-form-radio-group>
        <b-form-invalid-feedback :id="`${uid}-feedback`" :state="validateState('yliopisto')">
          {{ $t('pakollinen-tieto') }}
        </b-form-invalid-feedback>
      </template>
    </elsa-form-group>
  </div>
</template>

<script lang="ts">
  import Component from 'vue-class-component'
  import { Vue, Prop } from 'vue-property-decorator'
  import { required, requiredIf } from 'vuelidate/lib/validators'

  import ElsaButton from '@/components/button/button.vue'
  import ElsaFormGroup from '@/components/form-group/form-group.vue'
  import { Koulutuspaikka } from '@/types'
  import { defaultKoulutuspaikka } from '@/utils/constants'

  @Component({
    components: {
      ElsaFormGroup,
      ElsaButton
    },
    validations: {
      form: {
        nimi: {
          required
        },
        toimipaikallaKoulutussopimus: {
          required
        },
        yliopisto: {
          required: requiredIf((value) => {
            return value.toimipaikallaKoulutussopimus === false
          })
        }
      }
    }
  })
  export default class KoulutuspaikkaDetails extends Vue {
    @Prop({ required: true, default: () => [] })
    yliopistot!: []

    @Prop({ required: true, default: null })
    koulutuspaikka!: Koulutuspaikka

    @Prop({ required: true, type: String })
    erikoistuvanYliopisto!: string

    form: Koulutuspaikka = defaultKoulutuspaikka

    validateState(name: string) {
      const { $dirty, $error } = this.$v.form[name] as any
      return $dirty ? !$error : null
    }

    checkForm(): boolean {
      this.$v.form.$touch()
      if (this.$v.$anyError) {
        return false
      }
      return true
    }

    mounted(): void {
      this.form = this.koulutuspaikka
      this.form.toimipaikallaKoulutussopimus =
        this.koulutuspaikka.yliopisto === this.erikoistuvanYliopisto

      if (this.koulutuspaikka.yliopisto === '') {
        this.form.toimipaikallaKoulutussopimus = true
      }
    }

    get yliopistotOptions() {
      return this.yliopistot.map((y: any) => ({ text: y.nimi, value: y.nimi }))
    }
  }
</script>
