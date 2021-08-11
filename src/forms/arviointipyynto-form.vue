<template>
  <b-form @submit.stop.prevent="onSubmit">
    <elsa-form-group :label="$t('erikoistuva-laakari')">
      <template v-slot="{ uid }">
        <user-avatar :id="uid" />
      </template>
    </elsa-form-group>
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
    <elsa-form-group :label="$t('epa-osaamisalue')" :required="true">
      <template v-slot="{ uid }">
        <elsa-form-multiselect
          :id="uid"
          v-model="form.epaOsaamisalue"
          :options="epaOsaamisalueenKategoriat"
          :state="validateState('epaOsaamisalue')"
          group-values="epaOsaamisalueet"
          group-label="nimi"
          :group-select="false"
          label="nimi"
          track-by="id"
        >
          <template slot="option" slot-scope="props">
            <span v-if="props.option.$isLabel">{{ props.option.$groupLabel }}</span>
            <span v-else class="ml-3">{{ props.option.nimi }}</span>
          </template>
        </elsa-form-multiselect>
        <b-form-invalid-feedback :id="`${uid}-feedback`">
          {{ $t('pakollinen-tieto') }}
        </b-form-invalid-feedback>
      </template>
    </elsa-form-group>
    <elsa-form-group :label="$t('arvioitava-tapahtuma')" :required="true">
      <template v-slot="{ uid }">
        <b-form-input
          :id="uid"
          v-model="form.arvioitavaTapahtuma"
          :state="validateState('arvioitavaTapahtuma')"
          :aria-describedby="`${uid}-feedback`"
        ></b-form-input>
        <b-form-invalid-feedback :id="`${uid}-feedback`">
          {{ $t('pakollinen-tieto') }}
        </b-form-invalid-feedback>
      </template>
    </elsa-form-group>
    <b-form-row>
      <elsa-form-group
        :label="$t('kouluttaja-tai-vastuuhenkilo')"
        :add-new-enabled="!editing"
        :add-new-label="$t('lisaa-kouluttaja')"
        :required="true"
        class="col-md-8"
        @submit="onKouluttajaSubmit"
      >
        <template v-slot:modal-content="{ submit, cancel }">
          <kouluttaja-form @submit="submit" @cancel="cancel" />
        </template>
        <template v-slot="{ uid }">
          <elsa-form-multiselect
            :id="uid"
            v-model="form.kouluttajaOrVastuuhenkilo"
            :options="kouluttajatAndVastuuhenkilot"
            :state="validateState('kouluttajaOrVastuuhenkilo')"
            :disabled="editing"
            label="nimi"
            track-by="nimi"
          >
            <template v-slot:option="{ option }">
              <user-avatar
                :display-name="option.nimi"
                :src-content-type="option.profiilikuvaContentType"
                :src-base64="option.profiilikuva"
              />
            </template>
          </elsa-form-multiselect>
          <b-form-invalid-feedback :id="`${uid}-feedback`">
            {{ $t('pakollinen-tieto') }}
          </b-form-invalid-feedback>
        </template>
      </elsa-form-group>
      <elsa-form-group :label="$t('ajankohta')" class="col-md-4" :required="true">
        <template v-slot="{ uid }">
          <elsa-form-datepicker
            :id="uid"
            v-model="form.tapahtumanAjankohta"
            :state="validateState('tapahtumanAjankohta')"
            :min="tyoskentelyjaksonAlkamispaiva"
            :max="tyoskentelyjaksonPaattymispaiva"
          ></elsa-form-datepicker>
          <b-form-invalid-feedback :id="`${uid}-feedback`">
            {{ $t('pakollinen-tieto') }}
          </b-form-invalid-feedback>
        </template>
      </elsa-form-group>
    </b-form-row>
    <elsa-form-group :label="$t('lisatiedot')">
      <template v-slot="{ uid }">
        <b-form-textarea :id="uid" v-model="form.lisatiedot" rows="5"></b-form-textarea>
      </template>
    </elsa-form-group>
    <div class="text-right">
      <elsa-button variant="back" :to="{ name: 'arvioinnit' }">{{ $t('peruuta') }}</elsa-button>
      <elsa-button
        v-if="editing"
        :loading="params.deleting"
        variant="outline-danger"
        class="ml-2"
        @click="onArviointipyyntoDelete"
      >
        {{ $t('poista-arviointipyynto') }}
      </elsa-button>
      <elsa-button :loading="params.saving" type="submit" variant="primary" class="ml-2">
        {{ editing ? $t('tallenna') : $t('laheta') }}
      </elsa-button>
    </div>
  </b-form>
</template>

<script lang="ts">
  import Component from 'vue-class-component'
  import axios from 'axios'
  import { Prop, Mixins } from 'vue-property-decorator'
  import { validationMixin } from 'vuelidate'
  import { required } from 'vuelidate/lib/validators'
  import TyoskentelyjaksoMixin from '@/mixins/tyoskentelyjakso'
  import KouluttajaForm from '@/forms/kouluttaja-form.vue'
  import TyoskentelyjaksoForm from '@/forms/tyoskentelyjakso-form.vue'
  import UserAvatar from '@/components/user-avatar/user-avatar.vue'
  import ElsaFormGroup from '@/components/form-group/form-group.vue'
  import ElsaFormMultiselect from '@/components/multiselect/multiselect.vue'
  import ElsaFormDatepicker from '@/components/datepicker/datepicker.vue'
  import ElsaButton from '@/components/button/button.vue'
  import { toastSuccess, toastFail } from '@/utils/toast'

  @Component({
    components: {
      KouluttajaForm,
      TyoskentelyjaksoForm,
      ElsaFormGroup,
      ElsaFormMultiselect,
      UserAvatar,
      ElsaFormDatepicker,
      ElsaButton
    },
    validations: {
      form: {
        tyoskentelyjakso: {
          required
        },
        epaOsaamisalue: {
          required
        },
        arvioitavaTapahtuma: {
          required
        },
        kouluttajaOrVastuuhenkilo: {
          required
        },
        tapahtumanAjankohta: {
          required
        }
      }
    }
  })
  export default class ArviointipyyntoForm extends Mixins(validationMixin, TyoskentelyjaksoMixin) {
    @Prop({ required: false, default: () => [] })
    tyoskentelyjaksot!: any[]

    @Prop({ required: false, default: () => [] })
    kunnat!: any[]

    @Prop({ required: false, default: () => [] })
    erikoisalat!: any[]

    @Prop({ required: false, default: () => [] })
    epaOsaamisalueenKategoriat!: any[]

    @Prop({ required: false, default: () => [] })
    kouluttajatAndVastuuhenkilot!: any[]

    @Prop({ required: false, default: false })
    editing!: boolean

    @Prop({
      required: false,
      type: Object,
      default: () => ({
        tyoskentelyjakso: null,
        epaOsaamisalue: null,
        arvioitavaTapahtuma: null,
        kouluttajaOrVastuuhenkilo: null,
        tapahtumanAjankohta: null,
        lisatiedot: null
      })
    })
    value!: any

    form = {
      tyoskentelyjakso: null,
      epaOsaamisalue: null,
      arvioitavaTapahtuma: null,
      kouluttajaOrVastuuhenkilo: null,
      tapahtumanAjankohta: null,
      lisatiedot: null
    } as any
    params = {
      saving: false,
      deleting: false
    }

    mounted() {
      this.form.tyoskentelyjakso = this.value.tyoskentelyjakso
      this.form.epaOsaamisalue = this.value.epaOsaamisalue
      this.form.arvioitavaTapahtuma = this.value.arvioitavaTapahtuma
      this.form.kouluttajaOrVastuuhenkilo = this.value.kouluttajaOrVastuuhenkilo
      this.form.tapahtumanAjankohta = this.value.tapahtumanAjankohta
      this.form.lisatiedot = this.value.lisatiedot
    }

    validateState(name: string) {
      const { $dirty, $error } = this.$v.form[name] as any
      return $dirty ? ($error ? false : null) : null
    }

    onSubmit() {
      this.$v.form.$touch()
      if (this.$v.form.$anyError) {
        return
      }
      this.$emit(
        'submit',
        {
          tyoskentelyjaksoId: this.form.tyoskentelyjakso?.id,
          arvioitavaOsaalueId: this.form.epaOsaamisalue?.id,
          arvioitavaTapahtuma: this.form.arvioitavaTapahtuma,
          arvioinninAntajaId: this.form.kouluttajaOrVastuuhenkilo?.id,
          tapahtumanAjankohta: this.form.tapahtumanAjankohta,
          lisatiedot: this.form.lisatiedot
        },
        this.params
      )
    }

    onArviointipyyntoDelete() {
      this.$emit('delete', this.params)
    }

    async onKouluttajaSubmit(value: any, params: any, modal: any) {
      params.saving = true
      try {
        const kouluttaja = (await axios.post('/erikoistuva-laakari/lahikouluttajat', value)).data
        this.kouluttajatAndVastuuhenkilot.push(kouluttaja)
        this.form.kouluttajaOrVastuuhenkilo = kouluttaja
        modal.hide('confirm')
        toastSuccess(this, this.$t('uusi-kouluttaja-lisatty'))
      } catch (err) {
        toastFail(
          this,
          this.$t('uuden-kouluttajan-lisaaminen-epaonnistui', {
            virhe: err.response.data.title
          })
        )
      }
      params.saving = false
    }
  }
</script>
