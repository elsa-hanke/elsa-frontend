<template>
  <elsa-form-group
    :label="$t('lahikouluttaja')"
    :add-new-enabled="true"
    :add-new-label="$t('lisaa-kouluttaja')"
    :required="true"
    @submit="onKouluttajaSubmit"
  >
    <template v-slot:modal-content="{ submit, cancel }">
      <kouluttaja-form @submit="submit" @cancel="cancel" />
    </template>
    <template v-slot="{ uid }">
      <elsa-form-multiselect
        v-model="form.kouluttaja"
        :id="uid"
        :options="kouluttajat"
        :state="validateState('kouluttaja')"
        label="nimi"
        track-by="id"
        @select="onKouluttajaSelect"
      >
        <template v-slot:option="{ option }">
          <div v-if="option.nimi">{{ optionDisplayName(option) }}</div>
        </template>
      </elsa-form-multiselect>
      <b-form-invalid-feedback :id="`${uid}-feedback`">
        {{ $t('pakollinen-tieto') }}
      </b-form-invalid-feedback>
    </template>
  </elsa-form-group>
</template>

<script lang="ts">
  import { toastFail, toastSuccess } from '@/utils/toast'
  import axios from 'axios'
  import store from '@/store'
  import Component from 'vue-class-component'
  import { Prop, Mixins } from 'vue-property-decorator'
  import { validationMixin } from 'vuelidate'
  import { required } from 'vuelidate/lib/validators'
  import Avatar from 'vue-avatar'
  import ElsaButton from '@/components/button/button.vue'
  import ElsaFormGroup from '@/components/form-group/form-group.vue'
  import KouluttajaForm from '@/forms/kouluttaja-form.vue'
  import ElsaFormMultiselect from '@/components/multiselect/multiselect.vue'
  import { Kouluttaja } from '@/types'
  import { defaultKouluttaja } from '@/utils/constants'

  @Component({
    components: {
      ElsaFormGroup,
      ElsaButton,
      KouluttajaForm,
      ElsaFormMultiselect,
      Avatar
    },
    validations: {
      form: {
        kouluttaja: {
          id: {
            required
          }
        }
      }
    }
  })
  export default class KouluttajaDetails extends Mixins(validationMixin) {
    @Prop({ required: true, default: null })
    kouluttaja!: Kouluttaja

    @Prop({ required: false, default: () => [] })
    kouluttajat!: Kouluttaja[]

    @Prop({ required: true, default: null })
    index!: number

    async onKouluttajaSubmit(value: any, modal: any) {
      try {
        await axios.post('/erikoistuva-laakari/lahikouluttajat', value)
        modal.hide('confirm')
        toastSuccess(this, this.$t('uusi-kouluttaja-lisatty'))
        await store.dispatch('erikoistuva/getKouluttajat')
      } catch (err) {
        toastFail(
          this,
          this.$t('uuden-kouluttajan-lisaaminen-epaonnistui', {
            virhe: err.response.data.title
          })
        )
      }
    }

    form = {
      kouluttaja: null
    } as any

    mounted(): void {
      if (this.kouluttaja.kayttajaId) {
        this.form.kouluttaja = this.kouluttaja
      }
    }

    onKouluttajaSelect(kouluttaja: any) {
      const value = {
        ...defaultKouluttaja,
        kayttajaId: kouluttaja.id,
        nimi: kouluttaja.nimi
      }
      this.form.kouluttaja = value
      this.$emit('kouluttajaSelected', value, this.index)
    }

    optionDisplayName(option: any) {
      return option.nimike ? option.nimi + ', ' + option.nimike : option.nimi
    }

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
  }
</script>
