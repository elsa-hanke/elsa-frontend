<template>
  <div v-if="kysymys !== null && childDataReceived" class="border rounded pt-1 pb-4 mb-4 p-2">
    <b-form-row>
      <elsa-form-group :label="$t('kysymys')" class="col-sm-12 col-md-12 pr-md-3" :required="true">
        <template #default="{ uid }">
          <b-form-input
            :id="uid"
            v-model="kysymys.otsikko"
            :state="validateState('otsikko')"
            @input="$emit('skipRouteExitConfirm', false)"
          ></b-form-input>
          <b-form-invalid-feedback :id="`${uid}-feedback`">
            {{ $t('pakollinen-tieto') }}
          </b-form-invalid-feedback>
        </template>
      </elsa-form-group>
    </b-form-row>
    <b-form-row v-if="kysymys.tyyppi === 'tekstikenttakysymys'">
      <b-form-group class="col-sm-12 col-md-12 pr-md-3" :required="false">
        <template #default="{ uid }">
          <b-form-textarea :id="uid" rows="3" disabled :placeholder="$t('vastaus')" />
        </template>
      </b-form-group>
    </b-form-row>
    <div v-for="(vaihtoehto, index) in kysymys.vaihtoehdot" :key="index">
      <b-form-group class="col-sm-12 col-md-12 mb-2">
        <template #default="{ uid }">
          <b-form-input
            :id="uid"
            v-model="vaihtoehto.teksti"
            @input="$emit('skipRouteExitConfirm', false)"
          ></b-form-input>
        </template>
      </b-form-group>
    </div>
    <b-form-row>
      <div class="col-sm-12 col-md-12 pr-md-3 d-flex align-items-end">
        <elsa-button
          v-if="kysymys.tyyppi === 'valintakysymys'"
          variant="link"
          class="shadow-none p-0 mt-2 d-block"
          @click.stop.prevent="onAddVastausVaihtoehto"
        >
          {{ $t('lisaa-vastausvaihtoehto') }}
        </elsa-button>
        <b-form-checkbox
          v-model="kysymys.pakollinen"
          class="py-0 ml-auto"
          @input="$emit('skipRouteExitConfirm', false)"
        >
          {{ $t('pakollinen-kysymys') }}
        </b-form-checkbox>
      </div>
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

    onAddVastausVaihtoehto() {
      /* */
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
