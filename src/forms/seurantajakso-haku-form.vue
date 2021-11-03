<template>
  <b-form @submit.stop.prevent="onSubmit">
    <elsa-form-group
      :label="$t('koulutusjakso')"
      :add-new-enabled="true"
      :add-new-label="$t('lisaa-koulutusjakso')"
      @submit="onKoulutusjaksoSubmit"
    >
      <template v-slot:modal-content="{ submit, cancel }">
        <koulutusjakso-form
          :tyoskentelyjaksot="tyoskentelyjaksot"
          :kunnat="kunnat"
          :arvioitavan-kokonaisuuden-kategoriat="arvioitavanKokonaisuudenKategoriat"
          @submit="submit"
          @cancel="cancel"
        />
      </template>
      <template v-slot="{ uid }">
        <div
          :id="uid"
          v-for="(koulutusjakso, index) in form.koulutusjaksot"
          :key="koulutusjakso.id"
          class="mb-1"
        >
          <elsa-form-multiselect
            :id="uid"
            :value="form.koulutusjaksot"
            v-model="form.koulutusjaksot[index]"
            :options="koulutusjaksotFiltered"
            :customLabel="koulutusjaksoLabel"
            label="label"
            track-by="id"
          />
          <elsa-button
            v-if="index !== 0"
            @click="deleteKoulutusjakso(index)"
            variant="link"
            size="sm"
            class="text-decoration-none shadow-none p-0"
          >
            <font-awesome-icon :icon="['far', 'trash-alt']" fixed-width size="sm" />
            {{ $t('poista-koulutusjakso') }}
          </elsa-button>
        </div>
        <small class="form-text text-muted">
          {{ $t('seurantajakso-koulutusjakso-help') }}
        </small>
        <elsa-button
          @click="addKoulutusjakso"
          variant="link"
          size="sm"
          class="text-decoration-none shadow-none p-0"
        >
          <font-awesome-icon icon="plus" fixed-width size="sm" />
          {{ $t('useampi-koulutusjakso') | lowercase }}
        </elsa-button>
        <b-form-invalid-feedback :id="`${uid}-feedback`">
          {{ $t('pakollinen-tieto') }}
        </b-form-invalid-feedback>
      </template>
    </elsa-form-group>
    <b-form-row>
      <elsa-form-group
        :label="$t('seurantajakso-alkaa')"
        class="col-sm-12 col-md-6 pr-md-3 mb-md-0"
        :required="true"
      >
        <template v-slot="{ uid }">
          <elsa-form-datepicker
            :id="uid"
            v-model="form.alkamispaiva"
            :state="validateState('alkamispaiva')"
            :max="maxAlkamispaiva"
          ></elsa-form-datepicker>
          <b-form-invalid-feedback :id="`${uid}-feedback`">
            {{ $t('pakollinen-tieto') }}
          </b-form-invalid-feedback>
        </template>
      </elsa-form-group>
      <elsa-form-group
        :label="$t('seurantajakso-paattyy')"
        class="col-sm-12 col-md-6 pl-md-3 mb-0"
        :required="true"
      >
        <template v-slot="{ uid }">
          <elsa-form-datepicker
            :id="uid"
            v-model="form.paattymispaiva"
            :state="validateState('paattymispaiva')"
            :min="minPaattymispaiva"
            :aria-describedby="`${uid}-help`"
            class="datepicker-range"
          />
          <b-form-invalid-feedback :id="`${uid}-feedback`">
            {{ $t('pakollinen-tieto') }}
          </b-form-invalid-feedback>
        </template>
      </elsa-form-group>
      <small class="form-text text-muted pl-1">
        {{ $t('seurantajakso-aikajakso-help') }}
      </small>
    </b-form-row>
    <div class="d-flex flex-row-reverse flex-wrap">
      <elsa-button :loading="params.saving" type="submit" variant="primary" class="ml-2 mb-2">
        {{ $t('hae-tiedot') }}
      </elsa-button>
      <elsa-button variant="back" @click.stop.prevent="onCancel" class="mb-2">
        {{ $t('peruuta') }}
      </elsa-button>
    </div>
  </b-form>
</template>

<script lang="ts">
  import { BModal } from 'bootstrap-vue'
  import Vue from 'vue'
  import Component from 'vue-class-component'
  import { Mixins, Prop } from 'vue-property-decorator'
  import { validationMixin } from 'vuelidate'
  import { required } from 'vuelidate/lib/validators'

  import { postKoulutusjakso } from '@/api/erikoistuva'
  import ElsaButton from '@/components/button/button.vue'
  import ElsaFormDatepicker from '@/components/datepicker/datepicker.vue'
  import ElsaFormGroup from '@/components/form-group/form-group.vue'
  import ElsaFormMultiselect from '@/components/multiselect/multiselect.vue'
  import KoulutusjaksoForm from '@/forms/koulutusjakso-form.vue'
  import TyoskentelyjaksoMixin from '@/mixins/tyoskentelyjakso'
  import {
    ArvioitavanKokonaisuudenKategoria,
    Erikoisala,
    Koulutusjakso,
    Kunta,
    Seurantajakso
  } from '@/types'
  import { toastFail, toastSuccess } from '@/utils/toast'

  @Component({
    components: {
      ElsaButton,
      ElsaFormDatepicker,
      ElsaFormGroup,
      ElsaFormMultiselect,
      KoulutusjaksoForm
    },
    validations: {
      form: {
        alkamispaiva: {
          required
        },
        paattymispaiva: {
          required
        }
      }
    }
  })
  export default class SeurantajaksoHakuForm extends Mixins(
    validationMixin,
    TyoskentelyjaksoMixin
  ) {
    @Prop({ required: false, default: () => [] })
    arvioitavanKokonaisuudenKategoriat!: ArvioitavanKokonaisuudenKategoria[]

    @Prop({ required: false, default: () => [] })
    kunnat!: Kunta[]

    @Prop({ required: false, default: () => [] })
    erikoisalat!: Erikoisala[]

    @Prop({ required: false, default: () => [] })
    koulutusjaksot!: Koulutusjakso[]

    @Prop({
      required: false,
      default: () => null
    })
    seurantajakso!: Seurantajakso | null

    form: Seurantajakso = {
      alkamispaiva: null,
      paattymispaiva: null,
      koulutusjaksot: [
        {
          id: null,
          nimi: null,
          muutOsaamistavoitteet: null,
          luotu: null,
          tallennettu: null,
          lukittu: null,
          tyoskentelyjaksot: [],
          osaamistavoitteet: [],
          koulutussuunnitelma: null
        }
      ]
    }

    params = {
      saving: false
    }

    mounted() {
      if (this.seurantajakso) {
        this.form = {
          ...this.seurantajakso
        }
      }
    }

    validateState(name: string) {
      const { $dirty, $error } = this.$v.form[name] as any
      return $dirty ? ($error ? false : null) : null
    }

    get maxAlkamispaiva() {
      return this.form.paattymispaiva
    }

    get minPaattymispaiva() {
      return this.form.alkamispaiva
    }

    get koulutusjaksotFiltered() {
      return this.koulutusjaksot?.filter(
        (koulutusjakso) => !this.form.koulutusjaksot?.find((t) => t.id === koulutusjakso.id)
      )
    }

    koulutusjaksoLabel(koulutusjakso: Koulutusjakso): string {
      return koulutusjakso.nimi || ''
    }

    addKoulutusjakso() {
      this.form.koulutusjaksot.push({
        id: null,
        nimi: null,
        muutOsaamistavoitteet: null,
        luotu: null,
        tallennettu: null,
        lukittu: null,
        tyoskentelyjaksot: [],
        osaamistavoitteet: [],
        koulutussuunnitelma: null
      })
    }

    deleteKoulutusjakso(index: number) {
      Vue.delete(this.form.koulutusjaksot, index)
    }

    async onKoulutusjaksoSubmit(data: Koulutusjakso, params: { saving: boolean }, modal: BModal) {
      params.saving = true
      try {
        const koulutusjakso = (await postKoulutusjakso(data)).data
        this.koulutusjaksot.push(koulutusjakso)
        modal.hide('confirm')
        toastSuccess(this, this.$t('koulutusjakso-lisatty'))
      } catch (err) {
        toastFail(this, this.$t('uuden-koulutusjakson-lisaaminen-epaonnistui'))
      }
      params.saving = false
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
          koulutusjaksot: this.form.koulutusjaksot.filter((koulutusjakso) => koulutusjakso.id)
        },
        this.params
      )
    }

    onCancel() {
      this.$emit('cancel')
    }
  }
</script>

<style lang="scss" scoped>
  @import '~@/styles/variables';
  @import '~bootstrap/scss/mixins/breakpoints';
</style>
