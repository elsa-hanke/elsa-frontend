<template>
  <div v-if="kysymys !== null && childDataReceived" class="border rounded pt-1 pb-1 mb-4 p-2">
    <h3>{{ $t('kysymys') }}</h3>
    todo
  </div>
</template>

<script lang="ts">
  import Component from 'vue-class-component'
  import { Vue, Prop } from 'vue-property-decorator'
  import { required } from 'vuelidate/lib/validators'

  import ElsaButton from '@/components/button/button.vue'
  import ElsaFormDatepicker from '@/components/datepicker/datepicker.vue'
  import ElsaFormError from '@/components/form-error/form-error.vue'
  import ElsaFormGroup from '@/components/form-group/form-group.vue'
  import ElsaFormMultiselect from '@/components/multiselect/multiselect.vue'
  import ElsaPoissaolonSyyt from '@/components/poissaolon-syyt/poissaolon-syyt.vue'
  import ElsaPopover from '@/components/popover/popover.vue'
  import { ArviointityokaluKysymys } from '@/types'

  @Component({
    components: {
      ElsaPoissaolonSyyt,
      ElsaButton,
      ElsaFormGroup,
      ElsaFormError,
      ElsaFormMultiselect,
      ElsaFormDatepicker,
      ElsaPopover
    },
    validations: {
      kysymys: {
        otsikko: required
      }
    }
  })
  export default class ArviointityokaluLomakeKysymysForm extends Vue {
    @Prop({ type: Object, required: true })
    kysymys!: ArviointityokaluKysymys | any

    @Prop({ type: Boolean, default: false })
    childDataReceived!: boolean

    validateState(name: string) {
      const { $dirty, $error } = this.kysymys[name] as any
      return $dirty ? ($error ? false : null) : null
    }

    mounted() {
      this.$parent.$on('validate-all-kysymykset', this.validateForm)
    }

    beforeDestroy() {
      this.$parent.$off('validate-all-kysymykset', this.validateForm)
    }

    validateForm(): boolean {
      this.$v.poissaolo.$touch()
      return !this.$v.$anyError
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
