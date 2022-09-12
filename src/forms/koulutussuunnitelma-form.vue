<template>
  <b-form @submit.stop.prevent="onSubmit">
    <p class="mb-3">
      {{ $t('henkilokohtainen-koulutussuunnitelma-liitteena-kuvaus') }}
    </p>
    <asiakirjat-upload
      :isPrimaryButton="false"
      :allowMultiplesFiles="false"
      :existingFileNamesInCurrentView="motivaatiokirjeAsiakirjatTableItems.map((k) => k.nimi)"
      :existingFileNamesInOtherViews="reservedAsiakirjaNimet"
      :buttonText="$t('lisaa-liitetiedosto')"
      :wrongFileTypeErrorMessage="$t('sallitut-tiedostoformaatit-pdf')"
      :allowedFileTypes="['application/pdf']"
      @selectedFiles="onKoulutussuunnitelmaFileAdded"
    />
    <asiakirjat-content
      class="px-0 col-md-6 col-lg-12 col-xl-6"
      :asiakirjat="koulutussuunnitelmaAsiakirjatTableItems"
      :sortingEnabled="false"
      :paginationEnabled="false"
      :enableSearch="false"
      :showInfoIfEmpty="false"
      @deleteAsiakirja="onKoulutussuunnitelmaFileDeleted"
    />
    <hr class="mt-0" />
    <elsa-form-group :label="$t('motivaatiokirje')">
      <template v-slot="{ uid }">
        <p class="mb-3">{{ $t('motivaatiokirje-kuvas') }}</p>
        <asiakirjat-upload
          :isPrimaryButton="false"
          :allowMultiplesFiles="false"
          :existingFileNamesInCurrentView="
            koulutussuunnitelmaAsiakirjatTableItems.map((k) => k.nimi)
          "
          :existingFileNamesInOtherViews="reservedAsiakirjaNimet"
          :buttonText="$t('lisaa-liitetiedosto')"
          :wrongFileTypeErrorMessage="$t('sallitut-tiedostoformaatit-pdf')"
          :allowedFileTypes="['application/pdf']"
          @selectedFiles="onMotivaatiokirjeFileAdded"
        />
        <asiakirjat-content
          class="px-0 col-md-6 col-lg-12 col-xl-6"
          :asiakirjat="motivaatiokirjeAsiakirjatTableItems"
          :sortingEnabled="false"
          :paginationEnabled="false"
          :enableSearch="false"
          :showInfoIfEmpty="false"
          @deleteAsiakirja="onMotivaatiokirjeFileDeleted"
        />
        <b-form-textarea
          :id="uid"
          v-model="form.motivaatiokirje"
          @input="$emit('skipRouteExitConfirm', false)"
          rows="3"
        />
      </template>
    </elsa-form-group>
    <elsa-form-group
      :label="$t('opiskelu-ja-tyohistoria')"
      :help="$t('opiskelu-ja-tyohistoria-tooltip')"
    >
      <template #label-right>
        <b-form-checkbox
          v-model="form.opiskeluJaTyohistoriaYksityinen"
          @input="$emit('skipRouteExitConfirm', false)"
          class="py-0"
        >
          {{ $t('piilota-kouluttajilta-kuvaus') }}
        </b-form-checkbox>
      </template>
      <template v-slot="{ uid }">
        <b-form-textarea
          :id="uid"
          v-model="form.opiskeluJaTyohistoria"
          @input="$emit('skipRouteExitConfirm', false)"
          rows="3"
        />
      </template>
    </elsa-form-group>
    <elsa-form-group :label="$t('vahvuudet')" :help="$t('vahvuudet-tooltip')">
      <template #label-right>
        <b-form-checkbox v-model="form.vahvuudetYksityinen" class="py-0">
          {{ $t('piilota-kouluttajilta-kuvaus') }}
        </b-form-checkbox>
      </template>
      <template v-slot="{ uid }">
        <b-form-textarea
          :id="uid"
          v-model="form.vahvuudet"
          @input="$emit('skipRouteExitConfirm', false)"
          rows="3"
        />
      </template>
    </elsa-form-group>
    <elsa-form-group
      :label="$t('tulevaisuuden-visiointi')"
      :help="$t('tulevaisuuden-visiointi-tooltip')"
    >
      <template #label-right>
        <b-form-checkbox
          v-model="form.tulevaisuudenVisiointiYksityinen"
          @input="$emit('skipRouteExitConfirm', false)"
          class="py-0"
        >
          {{ $t('piilota-kouluttajilta-kuvaus') }}
        </b-form-checkbox>
      </template>
      <template v-slot="{ uid }">
        <b-form-textarea
          :id="uid"
          v-model="form.tulevaisuudenVisiointi"
          @input="$emit('skipRouteExitConfirm', false)"
          rows="3"
        />
      </template>
    </elsa-form-group>
    <elsa-form-group
      :label="$t('osaamisen-kartuttaminen')"
      :help="$t('osaamisen-kartuttaminen-tooltip')"
    >
      <template #label-right>
        <b-form-checkbox
          v-model="form.osaamisenKartuttaminenYksityinen"
          @input="$emit('skipRouteExitConfirm', false)"
          class="py-0"
        >
          {{ $t('piilota-kouluttajilta-kuvaus') }}
        </b-form-checkbox>
      </template>
      <template v-slot="{ uid }">
        <b-form-textarea
          :id="uid"
          v-model="form.osaamisenKartuttaminen"
          @input="$emit('skipRouteExitConfirm', false)"
          rows="3"
        />
      </template>
    </elsa-form-group>
    <elsa-form-group :label="$t('elamankentta')" :help="$t('elamankentta-tooltip')">
      <template #label-right>
        <b-form-checkbox
          v-model="form.elamankenttaYksityinen"
          @input="$emit('skipRouteExitConfirm', false)"
          class="py-0"
        >
          {{ $t('piilota-kouluttajilta-kuvaus') }}
        </b-form-checkbox>
      </template>
      <template v-slot="{ uid }">
        <b-form-textarea
          :id="uid"
          v-model="form.elamankentta"
          @input="$emit('skipRouteExitConfirm', false)"
          rows="3"
        />
      </template>
    </elsa-form-group>
    <div class="d-flex flex-row-reverse flex-wrap">
      <elsa-button :loading="params.saving" type="submit" variant="primary" class="ml-2 mb-2">
        {{ $t('tallenna') }}
      </elsa-button>
      <elsa-button variant="back" @click.stop.prevent="onCancel" class="mb-2">
        {{ $t('peruuta') }}
      </elsa-button>
    </div>
    <div class="row">
      <elsa-form-error :active="this.$v.$anyError" />
    </div>
  </b-form>
</template>

<script lang="ts">
  import Component from 'vue-class-component'
  import { Vue, Mixins, Prop } from 'vue-property-decorator'
  import { validationMixin } from 'vuelidate'

  import AsiakirjatContent from '@/components/asiakirjat/asiakirjat-content.vue'
  import AsiakirjatUpload from '@/components/asiakirjat/asiakirjat-upload.vue'
  import ElsaButton from '@/components/button/button.vue'
  import ElsaFormError from '@/components/form-error/form-error.vue'
  import ElsaFormGroup from '@/components/form-group/form-group.vue'
  import { Koulutussuunnitelma } from '@/types'
  import { mapFile } from '@/utils/fileMapper'

  @Component({
    components: {
      ElsaFormGroup,
      ElsaFormError,
      ElsaButton,
      AsiakirjatUpload,
      AsiakirjatContent
    },
    validations: {
      form: {}
    }
  })
  export default class KoulutussuunnitelmaForm extends Mixins(validationMixin) {
    @Prop({
      required: true
    })
    value!: Koulutussuunnitelma

    @Prop({ required: true })
    reservedAsiakirjaNimet!: string[]

    form: Koulutussuunnitelma = {
      id: null,
      motivaatiokirje: null,
      motivaatiokirjeYksityinen: false,
      opiskeluJaTyohistoria: null,
      opiskeluJaTyohistoriaYksityinen: false,
      vahvuudet: null,
      vahvuudetYksityinen: false,
      tulevaisuudenVisiointi: null,
      tulevaisuudenVisiointiYksityinen: false,
      osaamisenKartuttaminen: null,
      osaamisenKartuttaminenYksityinen: false,
      elamankentta: null,
      elamankenttaYksityinen: false,
      koulutussuunnitelmaAsiakirja: null,
      motivaatiokirjeAsiakirja: null,
      koulutussuunnitelmaFile: null,
      koulutussuunnitelmaAsiakirjaUpdated: false,
      motivaatiokirjeFile: null,
      motivaatiokirjeAsiakirjaUpdated: false
    }

    params = {
      saving: false
    }

    mounted() {
      this.form = {
        ...this.value,
        koulutussuunnitelmaAsiakirjaUpdated: false,
        motivaatiokirjeAsiakirjaUpdated: false
      }
    }

    onKoulutussuunnitelmaFileAdded(files: File[]) {
      const file = files[0]
      Vue.set(this.form, 'koulutussuunnitelmaAsiakirja', mapFile(file))
      this.form.koulutussuunnitelmaFile = file
      this.form.koulutussuunnitelmaAsiakirjaUpdated = true
      this.$emit('skipRouteExitConfirm', false)
    }

    onKoulutussuunnitelmaFileDeleted() {
      Vue.set(this.form, 'koulutussuunnitelmaAsiakirja', null)
      this.form.koulutussuunnitelmaAsiakirjaUpdated = true
      this.$emit('skipRouteExitConfirm', false)
    }

    onMotivaatiokirjeFileAdded(files: File[]) {
      const file = files[0]
      Vue.set(this.form, 'motivaatiokirjeAsiakirja', mapFile(file))
      this.form.motivaatiokirjeFile = file
      this.form.motivaatiokirjeAsiakirjaUpdated = true
      this.$emit('skipRouteExitConfirm', false)
    }

    onMotivaatiokirjeFileDeleted() {
      Vue.set(this.form, 'motivaatiokirjeAsiakirja', null)
      this.form.motivaatiokirjeAsiakirjaUpdated = true
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
          koulutussuunnitelmaAsiakirja: null,
          motivaatiokirjeAsiakirja: null
        },
        this.params
      )
    }

    onCancel() {
      this.$emit('cancel')
    }

    get koulutussuunnitelmaAsiakirjatTableItems() {
      return this.form.koulutussuunnitelmaAsiakirja ? [this.form.koulutussuunnitelmaAsiakirja] : []
    }

    get motivaatiokirjeAsiakirjatTableItems() {
      return this.form.motivaatiokirjeAsiakirja ? [this.form.motivaatiokirjeAsiakirja] : []
    }
  }
</script>

<style lang="scss" scoped>
  @import '~@/styles/variables';
  @import '~bootstrap/scss/mixins/breakpoints';

  ::v-deep table {
    border-bottom: 0;
  }
</style>
