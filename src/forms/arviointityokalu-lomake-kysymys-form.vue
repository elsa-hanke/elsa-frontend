<template>
  <div
    v-if="kysymys !== null && childDataReceived"
    class="kysymys-container border rounded pt-1 pb-4 mb-4 p-2"
  >
    <div class="d-flex align-items-start">
      <font-awesome-icon
        class="drag-handle text-muted"
        style="cursor: grab; margin-right: 10px"
        :icon="['fas', 'bars']"
      />
      <div class="flex-grow-1">
        <b-form-row>
          <div class="d-flex col-sm-12 col-md-12 justify-content-between align-items-start">
            <div class="d-flex flex-grow-1 pr-md-3">
              <elsa-form-group :label="$t('kysymys')" class="w-100" :required="true">
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
            </div>
            <elsa-button
              variant="link"
              class="text-decoration-none shadow-none p-0"
              @click="onDeleteKysymys"
            >
              <font-awesome-icon
                :icon="['far', 'trash-alt']"
                fixed-width
                size="lg"
                class="text-primary"
              />
            </elsa-button>
          </div>
        </b-form-row>
        <b-form-row v-if="kysymys.tyyppi === arviointityokaluKysymysTyyppit.TEKSTIKENTTAKYSYMYS">
          <b-form-group class="col-sm-12 col-md-12 pr-md-3" :required="false">
            <template #default="{ uid }">
              <b-form-textarea :id="uid" rows="3" disabled :placeholder="$t('vastaus')" />
            </template>
          </b-form-group>
        </b-form-row>
        <div
          v-for="(vaihtoehto, index) in kysymys.vaihtoehdot"
          :key="index"
          class="d-flex align-items-center col-sm-12 col-md-12 container"
        >
          <span class="fake-checkbox mb-2"></span>
          <b-form-group class="flex-grow-1 mb-2 mr-3">
            <template #default="{ uid }">
              <b-form-input
                :id="uid"
                v-model="vaihtoehto.teksti"
                class="ml-2"
                @input="$emit('skipRouteExitConfirm', false)"
              ></b-form-input>
            </template>
          </b-form-group>
          <elsa-button
            variant="link"
            class="text-decoration-none shadow-none p-0"
            @click="deleteVastausVaihtoehto(Number(index))"
          >
            <font-awesome-icon
              :icon="['far', 'trash-alt']"
              fixed-width
              size="lg"
              class="text-primary"
            />
          </elsa-button>
        </div>
        <b-form-row>
          <div class="col-sm-12 col-md-12 pr-md-3 d-flex align-items-end">
            <elsa-button
              v-if="kysymys.tyyppi === arviointityokaluKysymysTyyppit.VALINTAKYSYMYS"
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
    </div>
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

    @Prop({ required: true, type: Number })
    index?: number

    validateState(name: string) {
      const { $dirty, $error } = this.kysymys[name] as any
      return $dirty ? ($error ? false : null) : null
    }

    onAddVastausVaihtoehto() {
      this.kysymys.vaihtoehdot.push({
        teksti: '',
        valittu: false
      })
    }

    deleteVastausVaihtoehto(index: number) {
      const vaihtoehdot = [...this.kysymys.vaihtoehdot]
      vaihtoehdot.splice(index, 1)
      this.kysymys.vaihtoehdot = vaihtoehdot
      this.$emit('skipRouteExitConfirm', false)
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

    onDeleteKysymys() {
      this.$emit('delete', this.index)
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

  .drag-handle {
    cursor: grab;
  }

  .kysymys-container {
    background-color: #ffffff;
  }
</style>
