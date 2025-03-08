<template>
  <b-form @submit.stop.prevent="onSubmit">
    <div>lomakkeet</div>
    <div class="d-flex flex-row-reverse flex-wrap">
      <elsa-button :loading="params.saving" type="submit" variant="primary" class="ml-2 mb-2">
        {{
          editing
            ? $t('lisaa-vastaukset-ja-palaa-arviointiin')
            : $t('lisaa-vastaukset-ja-palaa-arviointiin')
        }}
      </elsa-button>
      <elsa-button variant="back" class="mb-2" @click.stop.prevent="onCancel">
        {{ $t('peruuta') }}
      </elsa-button>
    </div>
    <div class="row">
      <elsa-form-error :active="$v.$anyError" />
    </div>
  </b-form>
</template>

<script lang="ts">
  import Component from 'vue-class-component'
  import { Vue } from 'vue-property-decorator'
  import { between, integer, required } from 'vuelidate/lib/validators'

  import AsiakirjatContent from '@/components/asiakirjat/asiakirjat-content.vue'
  import AsiakirjatUpload from '@/components/asiakirjat/asiakirjat-upload.vue'
  import ElsaButton from '@/components/button/button.vue'
  import ElsaFormDatepicker from '@/components/datepicker/datepicker.vue'
  import ElsaFormError from '@/components/form-error/form-error.vue'
  import ElsaFormGroup from '@/components/form-group/form-group.vue'
  import ElsaFormMultiselect from '@/components/multiselect/multiselect.vue'
  import ElsaPoissaolonSyyt from '@/components/poissaolon-syyt/poissaolon-syyt.vue'
  import ElsaPopover from '@/components/popover/popover.vue'
  import TyokertymalaskuriTyoskentelyjaksoPoissaoloForm from '@/forms/tyokertymalaskuri-tyoskentelyjakso-poissaolo-form.vue'
  import KouluttajaKoulutussopimusForm from '@/views/koejakso/kouluttaja/kouluttaja-koulutussopimus-form.vue'

  @Component({
    components: {
      TyokertymalaskuriTyoskentelyjaksoPoissaoloForm,
      ElsaPoissaolonSyyt,
      KouluttajaKoulutussopimusForm,
      AsiakirjatContent,
      AsiakirjatUpload,
      ElsaButton,
      ElsaFormGroup,
      ElsaFormError,
      ElsaFormMultiselect,
      ElsaFormDatepicker,
      ElsaPopover
    },
    validations: {
      form: {
        tyoskentelypaikka: {
          required,
          nimi: {
            required
          }
        },
        osaaikaprosentti: {
          required,
          integer,
          between: between(50, 100)
        },
        kaytannonKoulutus: {
          required
        },
        kahdenvuodenosaaikaprosentti: {
          required,
          integer,
          between: between(1, 100)
        }
      }
    }
  })
  export default class ArviointityokalutArvioijaForm extends Vue {
    params = {
      saving: false,
      deleting: false
    }
    childDataReceived = false
    editing = false

    async mounted() {
      /* */
    }

    validateState(name: string) {
      const get = (obj: any, path: any, defaultValue = undefined) => {
        const travel = (regexp: any) =>
          String.prototype.split
            .call(path, regexp)
            .filter(Boolean)
            .reduce((res, key) => (res !== null && res !== undefined ? res[key] : res), obj)
        const result = travel(/[,[\]]+?/) || travel(/[,[\].]+?/)
        return result === undefined || result === obj ? defaultValue : result
      }
      const { $dirty, $error } = get(this.$v.form, name)
      return $dirty ? ($error ? false : null) : null
    }

    validateForm(): boolean {
      this.$v.form.$touch()
      return !this.$v.$anyError
    }

    onSubmit() {
      // this.$emit('submit', submitData, this.params)
    }

    onCancel() {
      this.$emit('skipRouteExitConfirm', true)
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
