<template>
  <b-form @submit.stop.prevent="onSubmit">
    <elsa-form-group :label="$t('koulutusjakson-nimi')" :required="true">
      <template v-slot="{ uid }">
        <b-form-input
          :id="uid"
          v-model="form.nimi"
          @input="$emit('skipRouteExitConfirm', false)"
          :state="validateState('nimi')"
        ></b-form-input>
        <b-form-invalid-feedback :id="`${uid}-feedback`">
          {{ $t('pakollinen-tieto') }}
        </b-form-invalid-feedback>
      </template>
    </elsa-form-group>
    <elsa-form-group
      :label="$t('tyoskentelyjakso')"
      :add-new-enabled="true"
      :add-new-label="$t('lisaa-tyoskentelyjakso')"
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
        <div
          :id="uid"
          v-for="(tyoskentelyjakso, index) in form.tyoskentelyjaksot"
          :key="index"
          class="mb-2"
        >
          <elsa-form-multiselect
            :id="uid"
            :value="form.tyoskentelyjaksot"
            v-model="form.tyoskentelyjaksot[index]"
            @input="$emit('skipRouteExitConfirm', false)"
            :options="tyoskentelyjaksotFiltered"
            label="label"
            track-by="id"
            @select="onTyoskentelyjaksoSelect"
          />
          <elsa-button
            v-if="index !== 0"
            @click="deleteTyoskentelyjakso(index)"
            variant="link"
            size="sm"
            class="text-decoration-none shadow-none p-0"
          >
            <font-awesome-icon :icon="['far', 'trash-alt']" fixed-width size="sm" />
            {{ $t('poista-tyoskentelyjakso') }}
          </elsa-button>
        </div>
        <elsa-button
          @click="addTyoskentelyjakso"
          variant="link"
          size="sm"
          class="text-decoration-none shadow-none p-0"
        >
          <font-awesome-icon icon="plus" fixed-width size="sm" />
          {{ $t('useampi-jakso') | lowercase }}
        </elsa-button>
      </template>
    </elsa-form-group>
    <elsa-form-group :label="$t('osaamistavoitteet-omalta-erikoisalalta')">
      <template v-slot="{ uid }">
        <elsa-form-multiselect
          :id="uid"
          v-model="form.osaamistavoitteet"
          @input="$emit('skipRouteExitConfirm', false)"
          :options="arvioitavanKokonaisuudenKategoriat"
          group-values="arvioitavatKokonaisuudet"
          group-label="nimi"
          :group-select="false"
          label="nimi"
          track-by="id"
          :allow-empty="true"
          :multiple="true"
          :taggable="true"
        >
          <template slot="option" slot-scope="props">
            <span v-if="props.option.$isLabel">{{ props.option.$groupLabel }}</span>
            <span v-else class="d-inline-block ml-3">{{ props.option.nimi }}</span>
          </template>
        </elsa-form-multiselect>
      </template>
    </elsa-form-group>
    <elsa-form-group :label="$t('muut-osaamistavoitteet')">
      <template v-slot="{ uid }">
        <b-form-textarea
          :id="uid"
          v-model="form.muutOsaamistavoitteet"
          @input="$emit('skipRouteExitConfirm', false)"
          rows="5"
        />
      </template>
    </elsa-form-group>
    <hr />
    <div class="d-flex flex-row-reverse flex-wrap">
      <elsa-button :loading="params.saving" type="submit" variant="primary" class="ml-2 mb-2">
        {{ $t('tallenna-koulutusjakso') }}
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
  import { required } from 'vuelidate/lib/validators'

  import ElsaButton from '@/components/button/button.vue'
  import ElsaFormGroup from '@/components/form-group/form-group.vue'
  import ElsaFormMultiselect from '@/components/multiselect/multiselect.vue'
  import TyoskentelyjaksoForm from '@/forms/tyoskentelyjakso-form.vue'
  import TyoskentelyjaksoMixin from '@/mixins/tyoskentelyjakso'
  import {
    ArvioitavanKokonaisuudenKategoria,
    Erikoisala,
    Koulutusjakso,
    Kunta,
    Tyoskentelyjakso
  } from '@/types'
  import { tyoskentelyjaksoLabel } from '@/utils/tyoskentelyjakso'

  @Component({
    components: {
      ElsaFormGroup,
      ElsaButton,
      ElsaFormMultiselect,
      TyoskentelyjaksoForm
    },
    validations: {
      form: {
        nimi: {
          required
        }
      }
    }
  })
  export default class KoulutusjaksoForm extends Mixins(validationMixin, TyoskentelyjaksoMixin) {
    @Prop({ required: false, default: () => [] })
    arvioitavanKokonaisuudenKategoriat!: ArvioitavanKokonaisuudenKategoria[]

    @Prop({ required: false, default: () => [] })
    kunnat!: Kunta[]

    @Prop({ required: false, default: () => [] })
    erikoisalat!: Erikoisala[]

    @Prop({
      required: false,
      type: Object,
      default: () => ({
        id: null,
        nimi: null,
        muutOsaamistavoitteet: null,
        luotu: null,
        tallennettu: null,
        lukittu: false,
        tyoskentelyjaksot: [
          {
            alkamispaiva: null,
            paattymispaiva: null,
            minPaattymispaiva: null,
            osaaikaprosentti: 100,
            tyoskentelypaikka: {
              nimi: null,
              kunta: { abbreviation: null },
              tyyppi: null,
              muuTyyppi: null
            },
            kaytannonKoulutus: null,
            omaaErikoisalaaTukeva: null,
            hyvaksyttyAiempaanErikoisalaan: null
          }
        ],
        osaamistavoitteet: [],
        koulutussuunnitelma: null
      })
    })
    value!: Koulutusjakso
    form!: Koulutusjakso
    params = {
      saving: false
    }

    mounted() {
      if (this.value.id) {
        this.form = {
          ...this.value,
          tyoskentelyjaksot: this.value.tyoskentelyjaksot
            .filter((tj) => !tj.hyvaksyttyAiempaanErikoisalaan)
            .map((tj) => ({
              ...tj,
              label: tyoskentelyjaksoLabel(this, tj)
            }))
        }
        if (this.form.tyoskentelyjaksot.length === 0) {
          this.form.tyoskentelyjaksot = [
            {
              alkamispaiva: null,
              paattymispaiva: null,
              minPaattymispaiva: null,
              osaaikaprosentti: 100,
              tyoskentelypaikka: {
                nimi: null,
                kunta: { abbreviation: null },
                tyyppi: null,
                muuTyyppi: null
              },
              kaytannonKoulutus: null,
              omaaErikoisalaaTukeva: null,
              hyvaksyttyAiempaanErikoisalaan: null
            }
          ]
        }
      } else {
        this.form = this.value
      }
    }

    validateState(name: string) {
      const { $dirty, $error } = this.$v.form[name] as any
      return $dirty ? ($error ? false : null) : null
    }

    onInput(value: Tyoskentelyjakso, index: number) {
      this.form.tyoskentelyjaksot[index] = value
    }

    addTyoskentelyjakso() {
      this.form.tyoskentelyjaksot.push({
        alkamispaiva: null,
        paattymispaiva: null,
        minPaattymispaiva: null,
        osaaikaprosentti: 100,
        tyoskentelypaikka: {
          nimi: null,
          kunta: { abbreviation: null },
          tyyppi: null,
          muuTyyppi: null
        },
        kaytannonKoulutus: null,
        omaaErikoisalaaTukeva: null,
        hyvaksyttyAiempaanErikoisalaan: null
      })
      this.$emit('skipRouteExitConfirm', false)
    }

    deleteTyoskentelyjakso(index: number) {
      const tyoskentelyjaksot = [...this.form.tyoskentelyjaksot]
      tyoskentelyjaksot.splice(index, 1)
      this.form = {
        ...this.form,
        tyoskentelyjaksot
      }
      this.$emit('skipRouteExitConfirm', false)
    }

    onSubmit() {
      this.$v.form.$touch()
      if (this.$v.form.$anyError) {
        return
      }
      this.$emit(
        'submit',
        {
          ...this.form,
          tyoskentelyjaksot: this.form.tyoskentelyjaksot.filter(
            (tyoskentelyjakso) => tyoskentelyjakso && tyoskentelyjakso.id
          )
        },
        this.params
      )
    }

    onCancel() {
      this.$emit('cancel')
    }

    get tyoskentelyjaksotFiltered() {
      return ((this as any).tyoskentelyjaksotFormatted as Tyoskentelyjakso[]).filter(
        (tyoskentelyjakso) =>
          !this.form.tyoskentelyjaksot?.find((t) => t?.id === tyoskentelyjakso.id)
      )
    }
  }
</script>
