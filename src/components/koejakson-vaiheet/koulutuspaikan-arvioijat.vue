<template>
  <b-row>
    <b-col v-if="!isReadonly" lg="10">
      <h3>{{ $t('koulutuspaikan-arvioijat') }}</h3>
      <div v-if="!loading">
        <elsa-form-group
          :label="$t('lahikouluttaja')"
          :add-new-enabled="true"
          :add-new-label="$t('lisaa-kouluttaja')"
          :required="true"
          @submit="onLahikouluttajaSubmit"
        >
          <template v-slot:modal-content="{ submit, cancel }">
            <kouluttaja-form @submit="submit" @cancel="cancel" />
          </template>
          <template v-slot="{ uid }">
            <elsa-form-multiselect
              v-model="form.lahikouluttaja"
              :id="uid"
              :options="lahikouluttajatList"
              :state="validateState('lahikouluttaja')"
              label="nimi"
              track-by="nimi"
              @select="onLahikouluttajaSelect"
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

        <elsa-form-group
          :label="$t('lahiesimies-tai-muu')"
          :add-new-enabled="true"
          :add-new-label="$t('lisaa-henkilo')"
          :required="true"
          @submit="onLahiesimiesSubmit"
        >
          <template v-slot:modal-content="{ submit, cancel }">
            <kouluttaja-form @submit="submit" @cancel="cancel" />
          </template>
          <template v-slot="{ uid }">
            <elsa-form-multiselect
              v-model="form.lahiesimies"
              :id="uid"
              :options="lahiesimiesList"
              :state="validateState('lahiesimies')"
              label="nimi"
              track-by="nimi"
              @select="onLahiesimiesSelect"
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
      </div>
      <div v-else class="text-center">
        <b-spinner variant="primary" :label="$t('ladataan')" />
      </div>
    </b-col>
    <b-col v-else lg="10">
      <h3>{{ $t('koulutuspaikan-arvioijat') }}</h3>
      <h5>{{ $t('lahikouluttaja') }}</h5>
      <p>{{ lahikouluttaja.nimi }}</p>
      <h5>{{ $t('lahiesimies-tai-muu') }}</h5>
      <p>{{ lahiesimies.nimi }}</p>
    </b-col>
  </b-row>
</template>

<script lang="ts">
  import axios from 'axios'
  import { Component, Prop, Mixins } from 'vue-property-decorator'
  import { validationMixin } from 'vuelidate'
  import { required } from 'vuelidate/lib/validators'

  import ElsaFormGroup from '@/components/form-group/form-group.vue'
  import ElsaFormMultiselect from '@/components/multiselect/multiselect.vue'
  import KouluttajaForm from '@/forms/kouluttaja-form.vue'
  import store from '@/store'
  import { KoejaksonVaiheHyvaksyja } from '@/types'
  import { toastFail, toastSuccess } from '@/utils/toast'

  @Component({
    components: {
      ElsaFormGroup,
      ElsaFormMultiselect,
      KouluttajaForm
    }
  })
  export default class KoulutuspaikanArvioijat extends Mixins(validationMixin) {
    validations() {
      return {
        form: {
          lahikouluttaja: {
            nimi: {
              required
            }
          },
          lahiesimies: {
            nimi: {
              required
            }
          }
        }
      }
    }

    @Prop({ required: true, default: null })
    lahikouluttaja!: KoejaksonVaiheHyvaksyja | null

    @Prop({ required: true, default: null })
    lahiesimies!: KoejaksonVaiheHyvaksyja | null

    @Prop({ required: false, default: false })
    isReadonly!: boolean

    form = {
      lahikouluttaja: null,
      lahiesimies: null
    } as any

    loading = true

    get kouluttajat() {
      return store.getters['erikoistuva/kouluttajat']
    }

    get lahikouluttajatList() {
      return this.kouluttajat?.map((k: any) => {
        if (this.lahiesimies?.id === k.id) {
          return {
            ...k,
            $isDisabled: true
          }
        }
        return k
      })
    }

    get lahiesimiesList() {
      return this.kouluttajat?.map((k: any) => {
        if (this.lahikouluttaja?.id === k.id) {
          return {
            ...k,
            $isDisabled: true
          }
        }
        return k
      })
    }

    onLahikouluttajaSelect(lahikouluttaja: KoejaksonVaiheHyvaksyja) {
      this.form.lahikouluttaja = lahikouluttaja
      this.$emit('lahikouluttajaSelect', this.form.lahikouluttaja)
    }

    onLahiesimiesSelect(lahiesimies: KoejaksonVaiheHyvaksyja) {
      this.form.lahiesimies = lahiesimies
      this.$emit('lahiesimiesSelect', this.form.lahiesimies)
    }

    async onLahikouluttajaSubmit(value: any, params: any, modal: any) {
      params.saving = true
      await this.onKoejaksonVaiheHyvaksyjaSubmit(value, modal, false)
      params.saving = false
    }

    async onLahiesimiesSubmit(value: any, params: any, modal: any) {
      params.saving = true
      await this.onKoejaksonVaiheHyvaksyjaSubmit(value, modal, true)
      params.saving = false
    }

    private async onKoejaksonVaiheHyvaksyjaSubmit(value: any, modal: any, isLahiesimies: boolean) {
      try {
        const koejaksonVaiheHyvaksyja = (
          await axios.post('/erikoistuva-laakari/lahikouluttajat', value)
        ).data
        modal.hide('confirm')
        toastSuccess(this, this.$t('uusi-kouluttaja-lisatty'))
        await store.dispatch('erikoistuva/getKouluttajat')
        if (isLahiesimies) {
          this.onLahiesimiesSelect(koejaksonVaiheHyvaksyja)
        } else {
          this.onLahikouluttajaSelect(koejaksonVaiheHyvaksyja)
        }
      } catch (err) {
        toastFail(
          this,
          this.$t('uuden-kouluttajan-lisaaminen-epaonnistui', {
            virhe: err.response.data.title
          })
        )
      }
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
      return !this.$v.$anyError
    }

    async mounted() {
      await store.dispatch('erikoistuva/getKouluttajat')
      this.form.lahikouluttaja = this.lahikouluttaja?.id ? this.lahikouluttaja : null
      this.form.lahiesimies = this.lahiesimies?.id ? this.lahiesimies : null
      this.loading = false
    }
  }
</script>
