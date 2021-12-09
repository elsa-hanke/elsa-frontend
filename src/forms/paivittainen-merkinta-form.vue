<template>
  <b-form @submit.stop.prevent="onSubmit">
    <elsa-form-group :label="$t('paivamaara')" :required="true">
      <template v-slot="{ uid }">
        <elsa-form-datepicker
          ref="paivamaara"
          v-if="childDateReceived"
          :id="uid"
          :value.sync="form.paivamaara"
          @input="$emit('skipRouteExitConfirm', false)"
        ></elsa-form-datepicker>
      </template>
    </elsa-form-group>
    <elsa-form-group :label="$t('aihe')" :required="true">
      <template v-slot="{ uid, ariaDescribedby }">
        <b-form-checkbox-group
          :id="uid"
          v-model="form.aihekategoriat"
          @input="$emit('skipRouteExitConfirm', false)"
          :state="validateState('aihekategoriat')"
          :aria-describedby="ariaDescribedby"
          name="paivakirja-merkinta-aihe"
          stacked
          @change="onAihekategoriatChanged"
        >
          <div v-for="aihekategoria in aihekategoriatSorted" :key="aihekategoria.id">
            <b-form-checkbox :value="aihekategoria">
              {{ aihekategoria.nimi }}
              <p v-if="aihekategoria.kuvaus" class="mb-0">
                <small>{{ aihekategoria.kuvaus }}</small>
              </p>
            </b-form-checkbox>
            <div v-if="aihekategoria.teoriakoulutus && koulutuksetSelected" class="pl-4">
              <div class="font-weight-500">
                {{ $t('voit-valita-teoriakoulutuksen-johon-merkinta-liittyy') }}
              </div>
              <elsa-form-multiselect
                v-model="form.teoriakoulutus"
                @input="$emit('skipRouteExitConfirm', false)"
                :options="teoriakoulutukset"
                label="koulutuksenNimi"
                track-by="id"
              />
            </div>
            <div v-if="aihekategoria.muunAiheenNimi && muuAiheSelected" class="pl-4">
              <b-form-input
                v-model="form.muunAiheenNimi"
                @input="$emit('skipRouteExitConfirm', false)"
                :state="validateState('muunAiheenNimi')"
                :aria-describedby="`${uid}-feedback`"
              ></b-form-input>
              <b-form-invalid-feedback>
                {{ $t('pakollinen-tieto') }}
              </b-form-invalid-feedback>
            </div>
          </div>
        </b-form-checkbox-group>
        <b-form-invalid-feedback :id="`${uid}-feedback`">
          {{ $t('pakollinen-tieto') }}
        </b-form-invalid-feedback>
      </template>
    </elsa-form-group>
    <elsa-form-group :label="$t('oppimistapahtuma')" :required="true">
      <template v-slot="{ uid }">
        <b-form-input
          :id="uid"
          v-model="form.oppimistapahtumanNimi"
          @input="$emit('skipRouteExitConfirm', false)"
          :state="validateState('oppimistapahtumanNimi')"
          :aria-describedby="`${uid}-feedback`"
        ></b-form-input>
        <b-form-invalid-feedback :id="`${uid}-feedback`">
          {{ $t('pakollinen-tieto') }}
        </b-form-invalid-feedback>
      </template>
    </elsa-form-group>
    <elsa-form-group :label="$t('ajatuksia-opitusta-ja-sen-soveltamisesta')">
      <template #label-help>
        <elsa-popover>
          <template>
            <p>{{ $t('ajatuksia-opitusta-ja-sen-soveltamisesta-ohje1') }}</p>
            <p class="mb-0">{{ $t('ajatuksia-opitusta-ja-sen-soveltamisesta-ohje2') }}</p>
          </template>
        </elsa-popover>
      </template>
      <template v-slot="{ uid }">
        <b-form-textarea
          :id="uid"
          v-model="form.reflektio"
          @input="$emit('skipRouteExitConfirm', false)"
          rows="5"
        ></b-form-textarea>
      </template>
    </elsa-form-group>
    <b-form-checkbox
      v-model="form.yksityinen"
      @input="$emit('skipRouteExitConfirm', false)"
      class="py-0"
    >
      {{ $t('piilota-kouluttajilta-kuvaus') }}
    </b-form-checkbox>
    <hr />
    <div class="d-flex flex-row-reverse flex-wrap">
      <elsa-button :loading="params.saving" type="submit" variant="primary" class="ml-2 mb-2">
        {{ $t('tallenna-merkinta') }}
      </elsa-button>
      <elsa-button variant="back" @click.stop.prevent="onCancel" class="mb-2">
        {{ $t('peruuta') }}
      </elsa-button>
    </div>
  </b-form>
</template>

<script lang="ts">
  import Component from 'vue-class-component'
  import { Mixins, Prop } from 'vue-property-decorator'
  import { validationMixin } from 'vuelidate'
  import { required, requiredIf } from 'vuelidate/lib/validators'

  import ElsaButton from '@/components/button/button.vue'
  import ElsaFormDatepicker from '@/components/datepicker/datepicker.vue'
  import ElsaFormGroup from '@/components/form-group/form-group.vue'
  import ElsaFormMultiselect from '@/components/multiselect/multiselect.vue'
  import ElsaPopover from '@/components/popover/popover.vue'
  import { PaivakirjaAihekategoria, Paivakirjamerkinta, Teoriakoulutus } from '@/types'
  import { paivakirjamerkintaMuuAiheId } from '@/utils/constants'

  @Component({
    components: {
      ElsaFormGroup,
      ElsaFormDatepicker,
      ElsaButton,
      ElsaPopover,
      ElsaFormMultiselect
    },
    validations: {
      form: {
        oppimistapahtumanNimi: {
          required
        },
        aihekategoriat: {
          required
        },
        muunAiheenNimi: {
          required: requiredIf((value: Paivakirjamerkinta) => {
            return value.aihekategoriat.find((aihe) => aihe.id === paivakirjamerkintaMuuAiheId)
          })
        }
      }
    }
  })
  export default class PaivittainenMerkintaForm extends Mixins(validationMixin) {
    $refs!: {
      paivamaara: ElsaFormDatepicker
    }

    @Prop({ required: false, default: () => [] })
    aihekategoriat!: PaivakirjaAihekategoria[]

    @Prop({ required: false, default: () => [] })
    teoriakoulutukset!: Teoriakoulutus[]

    @Prop({
      required: false,
      type: Object
    })
    value!: Paivakirjamerkinta

    form: Paivakirjamerkinta = {
      paivamaara: null,
      oppimistapahtumanNimi: null,
      muunAiheenNimi: null,
      reflektio: null,
      yksityinen: false,
      aihekategoriat: [],
      teoriakoulutus: null
    }
    params = {
      saving: false
    }
    childDateReceived = false

    async mounted() {
      this.form = {
        ...this.value
      }
      this.childDateReceived = true
    }

    validateState(name: string) {
      const { $dirty, $error } = this.$v.form[name] as any
      return $dirty ? ($error ? false : null) : null
    }

    validateForm(): boolean {
      this.$v.form.$touch()
      return !this.$v.$anyError
    }

    onSubmit() {
      const validations = [this.validateForm(), this.$refs.paivamaara.validateForm()]

      if (validations.includes(false)) {
        return
      }
      this.$emit('submit', { ...this.form }, this.params)
    }

    onCancel() {
      this.$emit('cancel')
    }

    onAihekategoriatChanged() {
      if (!this.koulutuksetSelected) {
        this.form.teoriakoulutus = null
      }
      if (!this.muuAiheSelected) {
        this.form.muunAiheenNimi = null
      }
    }

    get koulutuksetSelected() {
      return this.form.aihekategoriat.find((aihe) => aihe.teoriakoulutus)
    }

    get muuAiheSelected() {
      return this.form.aihekategoriat.find((aihe) => aihe.muunAiheenNimi)
    }

    get aihekategoriatSorted() {
      return this.aihekategoriat?.sort(
        (a, b) => (a.jarjestysnumero ?? 0) - (b.jarjestysnumero ?? 0)
      )
    }
  }
</script>
