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
            v-model="selectedAnswer"
            rows="3"
            :disabled="!answerMode"
            :placeholder="$t('vastaus')"
            :state="isAnswerValid"
            @input="updateAnswer($event)"
          />
          <b-form-invalid-feedback :id="`${uid}-feedback`">
            {{ $t('pakollinen-tieto') }}
          </b-form-invalid-feedback>
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
            <template v-if="!answerMode">
              <span class="fake-checkbox m-sm-1"></span>
              <p class="mb-0 ml-2">
                {{ vaihtoehto.teksti }}
              </p>
            </template>
            <template v-else>
              <b-form-radio
                v-model="selectedAnswer"
                :value="vaihtoehto.id"
                class="custom-radio ml-2"
                :state="isAnswerValid"
                @change="updateAnswer(vaihtoehto.id)"
              >
                {{ vaihtoehto.teksti }}
              </b-form-radio>
            </template>
          </b-form-row>
        </b-form-row>
      </elsa-form-group>
    </b-form-row>
  </div>
</template>

<script lang="ts">
  import Component from 'vue-class-component'
  import { Vue, Prop } from 'vue-property-decorator'

  import ElsaButton from '@/components/button/button.vue'
  import ElsaFormDatepicker from '@/components/datepicker/datepicker.vue'
  import ElsaFormError from '@/components/form-error/form-error.vue'
  import ElsaFormGroup from '@/components/form-group/form-group.vue'
  import ElsaFormMultiselect from '@/components/multiselect/multiselect.vue'
  import ElsaPopover from '@/components/popover/popover.vue'
  import { ArviointityokaluKysymys, SuoritusarviointiArviointityokaluVastaus } from '@/types'
  import { ArviointityokaluKysymysTyyppi } from '@/utils/constants'

  @Component({
    components: {
      ElsaButton,
      ElsaFormGroup,
      ElsaFormError,
      ElsaFormMultiselect,
      ElsaFormDatepicker,
      ElsaPopover
    },
    validations: {}
  })
  export default class ArviointityokaluLomakeKysymysForm extends Vue {
    @Prop({ required: true, type: Number, default: 0 })
    arviointityokaluId: number | undefined

    @Prop({ type: Object, required: true })
    kysymys!: ArviointityokaluKysymys

    @Prop({ type: Object, default: null })
    vastaus!: SuoritusarviointiArviointityokaluVastaus | null

    @Prop({ type: Boolean, default: false })
    childDataReceived!: boolean

    @Prop({ type: Boolean, default: false })
    answerMode!: boolean

    @Prop({ required: true, type: Number })
    index?: number

    selectedAnswer: string | number | null = null

    mounted() {
      if (this.vastaus) {
        this.selectedAnswer = this.vastaus.valittuVaihtoehtoId || this.vastaus.tekstiVastaus || null
      }
      this.$parent.$on('validate-all-kysymykset', this.validateForm)
    }

    beforeDestroy() {
      this.$parent.$off('validate-all-kysymykset', this.validateForm)
    }

    validateForm(): boolean {
      return !this.$v.$anyError
    }

    get isAnswerValid() {
      if (!this.kysymys.pakollinen) return null
      return this.selectedAnswer !== null && this.selectedAnswer !== '' ? null : false
    }

    get arviointityokaluKysymysTyyppit() {
      return ArviointityokaluKysymysTyyppi
    }

    updateAnswer(value: string | number | undefined) {
      this.$emit('update-answer', {
        arviointityokaluId: this.arviointityokaluId,
        arviointityokaluKysymysId: this.kysymys.id,
        tekstiVastaus: typeof value === 'string' ? value : null,
        valittuVaihtoehtoId: typeof value === 'number' ? value : null
      })
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

  .custom-radio {
    .custom-control-input:checked ~ .custom-control-label::before {
      background-color: #007bff;
      border-color: #007bff;
    }

    .custom-control-label::before {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      border: 2px solid #b1b1b1;
      background-color: #f5f5f6;
      flex-shrink: 0;
    }

    .custom-control-label::after {
      top: 5px;
      left: 5px;
      width: 20px;
      height: 20px;
      border-radius: 50%;
    }
  }
</style>
