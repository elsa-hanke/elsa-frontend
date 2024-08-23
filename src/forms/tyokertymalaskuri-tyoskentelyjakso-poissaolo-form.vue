<template>
  <div v-if="poissaolo !== null && childDataReceived">
    <h3>{{ $t('poissaolo') }}</h3>
    <elsa-form-group :label="$t('poissaolon-syy')" :required="true">
      <template #label-help>
        <elsa-popover :title="$t('poissaolon-syy')">
          <elsa-poissaolon-syyt />
        </elsa-popover>
      </template>
      <template #default="{ uid }">
        <elsa-form-multiselect
          :id="uid"
          v-model="poissaolo.poissaolonSyy"
          :options="poissaolonSyytSorted"
          :state="validateState('poissaolonSyy')"
          label="nimi"
          track-by="id"
          @input="$emit('input', poissaolo)"
        />
        <b-form-invalid-feedback :id="`${uid}-feedback`">
          {{ $t('pakollinen-tieto') }}
        </b-form-invalid-feedback>
      </template>
    </elsa-form-group>
    <b-form-row>
      <elsa-form-group
        :label="$t('alkamispaiva')"
        class="col-xs-12 col-sm-6 pr-sm-3"
        :required="true"
      >
        <template #default="{ uid }">
          <elsa-form-datepicker
            v-if="childDataReceived"
            :id="uid"
            ref="alkamispaiva"
            v-model="poissaolo.alkamispaiva"
            :min="minAlkamispaiva"
            :max="maxAlkamispaiva"
            @input="$emit('input', poissaolo)"
          ></elsa-form-datepicker>
        </template>
      </elsa-form-group>
      <elsa-form-group
        :label="$t('paattymispaiva')"
        class="col-xs-12 col-sm-6 pl-sm-3"
        :required="true"
      >
        <template #default="{ uid }">
          <elsa-form-datepicker
            v-if="childDataReceived"
            :id="uid"
            ref="paattymispaiva"
            v-model="poissaolo.paattymispaiva"
            :min="minPaattymispaiva"
            :max="maxPaattymispaiva"
            class="datepicker-range"
            @input="$emit('input', poissaolo)"
          ></elsa-form-datepicker>
          <b-form-invalid-feedback :id="`${uid}-feedback`">
            {{ $t('pakollinen-tieto') }}
          </b-form-invalid-feedback>
        </template>
      </elsa-form-group>
    </b-form-row>
    <b-form-checkbox
      v-model="poissaolo.kokoTyoajanPoissaolo"
      :class="{ 'mb-3': !poissaolo.kokoTyoajanPoissaolo }"
      @change="$emit('input', poissaolo)"
    >
      {{ $t('koko-tyoajan-poissaolo') }}
    </b-form-checkbox>
  </div>
</template>

<script lang="ts">
  import Component from 'vue-class-component'
  import { Vue, Prop } from 'vue-property-decorator'
  import { between, integer, required, requiredIf } from 'vuelidate/lib/validators'

  import ElsaButton from '@/components/button/button.vue'
  import ElsaFormDatepicker from '@/components/datepicker/datepicker.vue'
  import ElsaFormError from '@/components/form-error/form-error.vue'
  import ElsaFormGroup from '@/components/form-group/form-group.vue'
  import ElsaFormMultiselect from '@/components/multiselect/multiselect.vue'
  import ElsaPoissaolonSyyt from '@/components/poissaolon-syyt/poissaolon-syyt.vue'
  import ElsaPopover from '@/components/popover/popover.vue'

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
      form: {
        poissaolonSyy: {
          required
        },
        tyoskentelyjakso: {
          required
        },
        kokoTyoajanPoissaolo: {
          required
        },
        poissaoloprosentti: {
          required: requiredIf((poissaolo) => {
            return poissaolo.kokoTyoajanPoissaolo === false
          }),
          between: between(0, 100),
          integer
        }
      }
    }
  })
  export default class TyokertymalaskuriTyoskentelyjaksoPoissaoloForm extends Vue {
    @Prop({ type: Object, required: true })
    poissaolo!: any

    @Prop({ type: Array, required: true })
    poissaolonSyytSorted!: any[]

    @Prop({ type: Boolean, default: false })
    childDataReceived!: boolean

    @Prop({ type: String, required: true })
    tyojaksoAlkamispaiva!: string

    @Prop({ type: String, required: true })
    tyojaksoPaattymispaiva!: string

    validateState(name: string) {
      const { $dirty, $error } = this.poissaolo[name] as any
      return $dirty ? ($error ? false : null) : null
    }

    get minAlkamispaiva() {
      return this.tyojaksoAlkamispaiva
    }

    get maxAlkamispaiva() {
      return this.tyojaksoPaattymispaiva
    }

    get minPaattymispaiva() {
      return this.tyojaksoAlkamispaiva
    }

    get maxPaattymispaiva() {
      return this.tyojaksoPaattymispaiva
    }

    get isParentDatesSelected() {
      return this.tyojaksoAlkamispaiva && this.tyojaksoPaattymispaiva
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
