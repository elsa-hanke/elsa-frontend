<template>
  <div v-if="kysymys !== null && childDataReceived">
    <b-form-row v-if="kysymys.tyyppi === arviointityokaluKysymysTyyppit.TEKSTIKENTTAKYSYMYS">
      <elsa-form-group
        :label="kysymys.otsikko"
        :required="kysymys.pakollinen"
        class="col-sm-12 col-md-12 pr-md-3"
      >
        <template #default="{ uid }">
          <b-form-textarea
            :id="uid"
            rows="3"
            :disabled="!answerMode"
            :placeholder="$t('vastaus')"
          />
        </template>
      </elsa-form-group>
    </b-form-row>
    <b-form-row v-else>
      <elsa-form-group
        :label="kysymys.otsikko"
        :required="kysymys.pakollinen"
        class="col-sm-12 col-md-12"
      >
        <b-form-row
          v-for="(vaihtoehto, index) in kysymys.vaihtoehdot"
          :key="index"
          class="d-flex align-items-center"
        >
          <b-form-row class="col-sm-12 col-md-12 d-flex align-items-center">
            <span class="fake-checkbox m-sm-1"></span>
            <p class="mb-0 ml-2">
              {{ vaihtoehto.teksti }}
            </p>
          </b-form-row>
        </b-form-row>
      </elsa-form-group>
    </b-form-row>
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
  import { ArviointityokaluKysymysTyyppi } from '@/utils/constants'

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

    @Prop({ type: Boolean, default: false })
    answerMode!: boolean

    @Prop({ required: true, type: Number })
    index?: number

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

    get arviointityokaluKysymysTyyppit() {
      return ArviointityokaluKysymysTyyppi
    }
  }
</script>

<style lang="scss" scoped>
  @import '~@/styles/variables';
  @import '~bootstrap/scss/mixins/breakpoints';

  .fake-checkbox {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background-color: #f5f5f6;
    border: 2px solid #b1b1b1;
    flex-shrink: 0;
  }
</style>
