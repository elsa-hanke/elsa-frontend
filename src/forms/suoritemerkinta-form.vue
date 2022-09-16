<template>
  <b-form @submit.stop.prevent="onSubmit">
    <elsa-form-group
      :label="$t('tyoskentelyjakso')"
      :add-new-enabled="true"
      :add-new-label="$t('lisaa-tyoskentelyjakso')"
      :required="true"
      @submit="onTyoskentelyjaksoSubmit"
    >
      <template v-slot:modal-content="{ submit, cancel }">
        <tyoskentelyjakso-form
          :kunnat="kunnat"
          :erikoisalat="erikoisalat"
          @submit="submit"
          @cancel="cancel"
        />
      </template>
      <template v-slot="{ uid }">
        <elsa-form-multiselect
          :id="uid"
          v-model="form.tyoskentelyjakso"
          @input="$emit('skipRouteExitConfirm', false)"
          :options="tyoskentelyjaksotFormatted"
          :state="validateState('tyoskentelyjakso')"
          label="label"
          track-by="id"
          @select="onTyoskentelyjaksoSelect"
        />
        <b-form-invalid-feedback :id="`${uid}-feedback`">
          {{ $t('pakollinen-tieto') }}
        </b-form-invalid-feedback>
      </template>
    </elsa-form-group>
    <elsa-form-group :label="$t('suorite')" :required="true">
      <template v-slot="{ uid }">
        <elsa-form-multiselect
          :id="uid"
          v-model="form.suorite"
          @input="$emit('skipRouteExitConfirm', false)"
          :options="suoritteenKategoriat"
          :state="validateState('suorite')"
          group-values="suoritteet"
          group-label="nimi"
          :group-select="false"
          label="nimi"
          track-by="id"
        >
          <template slot="option" slot-scope="props">
            <span v-if="props.option.$isLabel">{{ props.option.$groupLabel }}</span>
            <span v-else class="d-inline-block ml-3">{{ props.option.nimi }}</span>
          </template>
        </elsa-form-multiselect>
        <b-form-invalid-feedback :id="`${uid}-feedback`">
          {{ $t('pakollinen-tieto') }}
        </b-form-invalid-feedback>
      </template>
    </elsa-form-group>
    <elsa-form-group :label="arviointiAsteikonNimi">
      <template #label-help>
        <elsa-popover>
          <elsa-arviointiasteikon-taso-tooltip-content
            :arviointiasteikonNimi="arviointiAsteikonNimi"
            :arviointiasteikonTasot="arviointiasteikko.tasot"
          />
        </elsa-popover>
      </template>
      <template v-slot="{ uid }">
        <elsa-form-multiselect
          :id="uid"
          v-model="form.arviointiasteikonTaso"
          @input="$emit('skipRouteExitConfirm', false)"
          :options="arviointiasteikko.tasot"
          :custom-label="(value) => `${value.taso} ${value.nimi}`"
          track-by="taso"
        >
          <template slot="singleLabel" slot-scope="{ option }">
            <span class="font-weight-700">{{ option.taso }}</span>
            {{ $t('arviointiasteikon-taso-' + option.nimi) }}
          </template>
          <template slot="option" slot-scope="{ option }">
            <span class="font-weight-700">{{ option.taso }}</span>
            {{ $t('arviointiasteikon-taso-' + option.nimi) }}
          </template>
        </elsa-form-multiselect>
        <b-form-invalid-feedback :id="`${uid}-feedback`">
          {{ $t('pakollinen-tieto') }}
        </b-form-invalid-feedback>
      </template>
    </elsa-form-group>
    <b-form-row>
      <elsa-form-group :label="$t('vaativuustaso')" class="col-md-8">
        <template #label-help>
          <elsa-popover>
            <elsa-vaativuustaso-tooltip-content />
          </elsa-popover>
        </template>
        <template v-slot="{ uid }">
          <elsa-form-multiselect
            :id="uid"
            v-model="form.vaativuustaso"
            @input="$emit('skipRouteExitConfirm', false)"
            :options="vaativuustasot"
            :custom-label="(value) => `${value.arvo} ${value.nimi}`"
            track-by="arvo"
          >
            <template slot="singleLabel" slot-scope="{ option }">
              <span class="font-weight-700">{{ option.arvo }}</span>
              {{ $t(option.nimi) }}
            </template>
            <template slot="option" slot-scope="{ option }">
              <span class="font-weight-700">{{ option.arvo }}</span>
              {{ $t(option.nimi) }}
            </template>
          </elsa-form-multiselect>
          <b-form-invalid-feedback :id="`${uid}-feedback`">
            {{ $t('pakollinen-tieto') }}
          </b-form-invalid-feedback>
        </template>
      </elsa-form-group>
      <elsa-form-group :label="$t('suorituspaiva')" class="col-md-4" :required="true">
        <template v-slot="{ uid }">
          <elsa-form-datepicker
            ref="suorituspaiva"
            v-if="childDataReceived"
            :id="uid"
            :value.sync="form.suorituspaiva"
            @input="$emit('skipRouteExitConfirm', false)"
            :min="tyoskentelyjaksonAlkamispaiva"
            :minErrorText="$t('suorituspaiva-ei-voi-olla-ennen-tyoskentelyjakson-alkamista')"
            :max="tyoskentelyjaksonPaattymispaiva"
            :maxErrorText="$t('suorituspaiva-ei-voi-olla-tyoskentelyjakson-paattymisen-jalkeen')"
          ></elsa-form-datepicker>
        </template>
      </elsa-form-group>
    </b-form-row>
    <elsa-form-group :label="$t('lisatiedot')">
      <template v-slot="{ uid }">
        <b-form-textarea
          :id="uid"
          v-model="form.lisatiedot"
          @input="$emit('skipRouteExitConfirm', false)"
          rows="5"
        ></b-form-textarea>
      </template>
    </elsa-form-group>
    <div class="text-right">
      <elsa-button variant="back" :to="{ name: 'suoritemerkinnat' }">
        {{ $t('peruuta') }}
      </elsa-button>
      <elsa-button
        v-if="value.id"
        :loading="params.deleting"
        variant="outline-danger"
        @click="onSuoritemerkintaDelete"
      >
        {{ $t('poista-merkinta') }}
      </elsa-button>
      <elsa-button :loading="params.saving" type="submit" variant="primary" class="ml-2">
        {{ $t('tallenna') }}
      </elsa-button>
    </div>
    <div class="row">
      <elsa-form-error :active="this.$v.$anyError" />
    </div>
  </b-form>
</template>

<script lang="ts">
  import Component from 'vue-class-component'
  import { Mixins, Prop } from 'vue-property-decorator'
  import { validationMixin } from 'vuelidate'
  import { required } from 'vuelidate/lib/validators'

  import ElsaArviointiasteikonTasoTooltipContent from '@/components/arviointiasteikon-taso/arviointiasteikon-taso-tooltip.vue'
  import ElsaButton from '@/components/button/button.vue'
  import ElsaFormDatepicker from '@/components/datepicker/datepicker.vue'
  import ElsaFormError from '@/components/form-error/form-error.vue'
  import ElsaFormGroup from '@/components/form-group/form-group.vue'
  import ElsaFormMultiselect from '@/components/multiselect/multiselect.vue'
  import ElsaPopover from '@/components/popover/popover.vue'
  import ElsaVaativuustasoTooltipContent from '@/components/vaativuustaso/vaativuustaso-tooltip-content.vue'
  import TyoskentelyjaksoForm from '@/forms/tyoskentelyjakso-form.vue'
  import TyoskentelyjaksoMixin from '@/mixins/tyoskentelyjakso'
  import {
    Arviointiasteikko,
    ArviointiasteikonTaso,
    Erikoisala,
    Kunta,
    Suoritemerkinta,
    SuoritteenKategoria,
    Vaativuustaso
  } from '@/types'
  import { vaativuustasot, ArviointiasteikkoTyyppi } from '@/utils/constants'

  @Component({
    components: {
      TyoskentelyjaksoForm,
      ElsaFormGroup,
      ElsaFormError,
      ElsaFormMultiselect,
      ElsaPopover,
      ElsaFormDatepicker,
      ElsaButton,
      ElsaVaativuustasoTooltipContent,
      ElsaArviointiasteikonTasoTooltipContent
    },
    validations: {
      form: {
        tyoskentelyjakso: {
          required
        },
        suorite: {
          required
        }
      }
    }
  })
  export default class SuoritemerkintaForm extends Mixins(validationMixin, TyoskentelyjaksoMixin) {
    $refs!: {
      suorituspaiva: ElsaFormDatepicker
    }

    @Prop({ required: false, default: () => [] })
    suoritteenKategoriat!: SuoritteenKategoria[]

    @Prop({ required: true })
    arviointiasteikko!: Arviointiasteikko

    @Prop({ required: false })
    arviointiasteikonTaso?: ArviointiasteikonTaso

    @Prop({ required: false, default: () => [] })
    kunnat!: Kunta[]

    @Prop({ required: false, default: () => [] })
    erikoisalat!: Erikoisala[]

    @Prop({
      required: false,
      default: () => ({
        tyoskentelyjakso: null,
        suorite: null,
        vaativuustaso: null,
        arviointiasteikonTaso: null,
        suorituspaiva: null,
        lisatiedot: null
      })
    })
    value!: Suoritemerkinta

    form!: Suoritemerkinta
    vaativuustasot = vaativuustasot
    params = {
      saving: false,
      deleting: false
    }
    childDataReceived = false

    mounted() {
      this.form = {
        tyoskentelyjakso: this.value.tyoskentelyjakso,
        suorite: this.value.suorite,
        vaativuustaso: vaativuustasot.find((taso) => taso.arvo === this.value.vaativuustaso),
        arviointiasteikonTaso: this.arviointiasteikonTaso,
        suorituspaiva: this.value.suorituspaiva,
        lisatiedot: this.value.lisatiedot
      }
      this.childDataReceived = true
    }

    validateForm(): boolean {
      this.$v.form.$touch()
      return !this.$v.$anyError
    }

    validateState(name: string) {
      const { $dirty, $error } = this.$v.form[name] as any
      return $dirty ? ($error ? false : null) : null
    }

    get arviointiAsteikonNimi() {
      return this.arviointiasteikko?.nimi === ArviointiasteikkoTyyppi.EPA
        ? this.$t('luottamuksen-taso')
        : this.$t('etappi')
    }

    onSubmit() {
      const validations = [this.validateForm(), this.$refs.suorituspaiva.validateForm()]
      if (validations.includes(false)) {
        return
      }

      this.$emit(
        'submit',
        {
          tyoskentelyjaksoId: this.form?.tyoskentelyjakso.id,
          suoriteId: this.form?.suorite.id,
          vaativuustaso: (this.form?.vaativuustaso as Vaativuustaso)?.arvo,
          arviointiasteikonTaso: (this.form?.arviointiasteikonTaso as ArviointiasteikonTaso)?.taso,
          suorituspaiva: this.form?.suorituspaiva,
          lisatiedot: this.form?.lisatiedot
        },
        this.params
      )
    }

    onSuoritemerkintaDelete() {
      this.$emit('delete', this.params)
    }
  }
</script>
