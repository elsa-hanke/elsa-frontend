<template>
  <b-form @submit.stop.prevent="onSubmit">
    <elsa-form-group :label="$t('koulutuksen-nimi')" :required="true">
      <template v-slot="{ uid }">
        <b-form-input
          :id="uid"
          v-model="form.koulutuksenNimi"
          :state="validateState('koulutuksenNimi')"
        ></b-form-input>
        <b-form-invalid-feedback :id="`${uid}-feedback`">
          {{ $t('pakollinen-tieto') }}
        </b-form-invalid-feedback>
      </template>
    </elsa-form-group>
    <elsa-form-group :label="$t('paikka')" :required="true">
      <template v-slot="{ uid }">
        <b-form-input
          :id="uid"
          v-model="form.koulutuksenPaikka"
          :state="validateState('koulutuksenPaikka')"
        ></b-form-input>
        <b-form-invalid-feedback :id="`${uid}-feedback`">
          {{ $t('pakollinen-tieto') }}
        </b-form-invalid-feedback>
      </template>
    </elsa-form-group>
    <b-form-row>
      <elsa-form-group
        :label="$t('alkamispaiva')"
        class="col-sm-12 col-md-6 pr-md-3"
        :required="true"
      >
        <template v-slot="{ uid }">
          <div>
            <elsa-form-datepicker
              :id="uid"
              v-model="form.alkamispaiva"
              :state="validateState('alkamispaiva')"
              :max="form.paattymispaiva"
            ></elsa-form-datepicker>
            <b-form-invalid-feedback :id="`${uid}-feedback`">
              {{ $t('pakollinen-tieto') }}
            </b-form-invalid-feedback>
          </div>
        </template>
      </elsa-form-group>
      <elsa-form-group :label="$t('paattymispaiva')" class="col-sm-12 col-md-6 pl-md-3">
        <template v-slot="{ uid }">
          <elsa-form-datepicker
            :id="uid"
            v-model="form.paattymispaiva"
            :min="form.alkamispaiva"
            :aria-describedby="`${uid}-help`"
            class="datepicker-range"
          />
        </template>
      </elsa-form-group>
    </b-form-row>
    <elsa-form-group :label="$t('erikoistumiseen-hyvaksyttava-tuntimaara')">
      <template v-slot="{ uid }">
        <div>
          <div class="d-flex align-items-center">
            <b-form-input
              :id="uid"
              :value="form.erikoistumiseenHyvaksyttavaTuntimaara"
              type="number"
              step="any"
              class="col-sm-3"
              @input="onErikoistumiseenHyvaksyttavaTuntimaaraInput"
            />
            <span class="mx-3">{{ $t('t') }}</span>
          </div>
        </div>
      </template>
    </elsa-form-group>
    <elsa-form-group :label="$t('todistus')">
      <template v-slot="{ uid }">
        <div :id="uid">
          <p>{{ $t('teoriakoulutus-todistus-kuvaus') }}</p>
          <asiakirjat-upload
            :isPrimaryButton="false"
            :buttonText="$t('lisaa-liitetiedosto')"
            :existing-file-names-for-current-view="existingFileNamesForCurrentView"
            :existing-file-names-for-other-views="existingFileNamesForOtherViews"
            :disabled="reservedAsiakirjaNimetMutable === undefined"
            @selectedFiles="onFilesAdded"
          />
          <asiakirjat-content
            :asiakirjat="asiakirjatTableItems"
            :sortingEnabled="false"
            :paginationEnabled="false"
            :enableSearch="false"
            :showInfoIfEmpty="false"
            @deleteAsiakirja="onDeleteLiitetiedosto"
          />
        </div>
      </template>
    </elsa-form-group>
    <div class="d-flex flex-row-reverse flex-wrap">
      <elsa-button :loading="params.saving" type="submit" variant="primary" class="ml-2 mb-2">
        {{ $t('tallenna-teoriakoulutus') }}
      </elsa-button>
      <elsa-button variant="back" @click.stop.prevent="onCancel" class="mb-2">
        {{ $t('peruuta') }}
      </elsa-button>
    </div>
  </b-form>
</template>

<script lang="ts">
  import axios from 'axios'
  import Component from 'vue-class-component'
  import { Mixins, Prop } from 'vue-property-decorator'
  import { validationMixin } from 'vuelidate'
  import { required } from 'vuelidate/lib/validators'

  import AsiakirjatContent from '@/components/asiakirjat/asiakirjat-content.vue'
  import AsiakirjatUpload from '@/components/asiakirjat/asiakirjat-upload.vue'
  import ElsaButton from '@/components/button/button.vue'
  import ElsaFormDatepicker from '@/components/datepicker/datepicker.vue'
  import ElsaFormGroup from '@/components/form-group/form-group.vue'
  import { Asiakirja, Teoriakoulutus } from '@/types'
  import { confirmDelete } from '@/utils/confirm'

  @Component({
    components: {
      ElsaFormGroup,
      ElsaFormDatepicker,
      ElsaButton,
      AsiakirjatContent,
      AsiakirjatUpload
    },
    validations: {
      form: {
        koulutuksenNimi: {
          required
        },
        koulutuksenPaikka: {
          required
        },
        alkamispaiva: {
          required
        }
      }
    }
  })
  export default class TeoriakoulutusForm extends Mixins(validationMixin) {
    @Prop({
      required: false,
      type: Object
    })
    value!: Teoriakoulutus

    form: Teoriakoulutus = {
      koulutuksenNimi: null,
      koulutuksenPaikka: null,
      alkamispaiva: null,
      paattymispaiva: null,
      erikoistumiseenHyvaksyttavaTuntimaara: null,
      todistukset: []
    }
    params = {
      saving: false
    }

    addedFiles: File[] = []
    reservedAsiakirjaNimetMutable: string[] = []
    newAsiakirjatMapped: Asiakirja[] = []
    deletedAsiakirjat: Asiakirja[] = []

    async mounted() {
      if (this.value?.id) {
        this.form = {
          ...this.value
        }
      } else {
        this.form = {
          koulutuksenNimi: null,
          koulutuksenPaikka: null,
          alkamispaiva: null,
          paattymispaiva: null,
          erikoistumiseenHyvaksyttavaTuntimaara: null,
          todistukset: []
        }
      }

      this.reservedAsiakirjaNimetMutable = (
        await axios.get('erikoistuva-laakari/asiakirjat/nimet')
      ).data
    }

    validateState(name: string) {
      const { $dirty, $error } = this.$v.form[name] as any
      return $dirty ? ($error ? false : null) : null
    }

    onErikoistumiseenHyvaksyttavaTuntimaaraInput(value: string) {
      if (value === '') {
        this.form.erikoistumiseenHyvaksyttavaTuntimaara = null
      } else {
        this.form.erikoistumiseenHyvaksyttavaTuntimaara = parseFloat(value)
      }
    }

    onFilesAdded(files: File[]) {
      const addedFilesInDeletedArray = files.filter((added) =>
        this.deletedAsiakirjat.map((deleted) => deleted.nimi).includes(added.name)
      )
      const addedFilesNotInDeletedArray = files.filter(
        (added) => !addedFilesInDeletedArray.includes(added)
      )

      this.deletedAsiakirjat = this.deletedAsiakirjat?.filter(
        (deletedAsiakirja) =>
          !addedFilesInDeletedArray
            .map((addedFile) => addedFile.name)
            .includes(deletedAsiakirja.nimi)
      )
      this.addedFiles = [...this.addedFiles, ...addedFilesNotInDeletedArray]
      this.newAsiakirjatMapped = [
        ...this.mapFiles(addedFilesNotInDeletedArray),
        ...this.newAsiakirjatMapped
      ]
    }

    async onDeleteLiitetiedosto(asiakirja: Asiakirja) {
      if (
        await confirmDelete(
          this,
          this.$t('poista-liitetiedosto') as string,
          (this.$t('liitetiedoston') as string).toLowerCase()
        )
      ) {
        if (asiakirja.id) {
          this.deletedAsiakirjat = [asiakirja, ...this.deletedAsiakirjat]
        } else {
          this.addedFiles = this.addedFiles?.filter((file) => file.name !== asiakirja.nimi)
          this.newAsiakirjatMapped = this.newAsiakirjatMapped?.filter(
            (a) => a.nimi !== asiakirja.nimi
          )
        }
      }
    }

    onSubmit() {
      this.$v.form.$touch()
      if (this.$v.form.$anyError) {
        return
      }
      this.$emit(
        'submit',
        {
          teoriakoulutus: {
            id: this.form.id,
            koulutuksenNimi: this.form.koulutuksenNimi,
            koulutuksenPaikka: this.form.koulutuksenPaikka,
            alkamispaiva: this.form.alkamispaiva,
            paattymispaiva: this.form.paattymispaiva,
            erikoistumiseenHyvaksyttavaTuntimaara: this.form.erikoistumiseenHyvaksyttavaTuntimaara
          },
          addedFiles: this.addedFiles,
          deletedAsiakirjaIds: this.deletedAsiakirjat.map((asiakirja) => asiakirja.id)
        },
        this.params
      )
    }

    onCancel() {
      this.$emit('cancel')
    }

    get existingFileNamesForCurrentView() {
      return this.asiakirjatTableItems?.map((item) => item.nimi)
    }

    get existingFileNamesForOtherViews() {
      return this.reservedAsiakirjaNimetMutable?.filter(
        (nimi) => !this.existingFileNamesForCurrentView.includes(nimi)
      )
    }

    get asiakirjatTableItems() {
      return [...this.newAsiakirjatMapped, ...this.asiakirjatExcludingDeleted()]
    }

    private mapFiles(files: File[]): Asiakirja[] {
      return files.map((file) => {
        const asiakirja: Asiakirja = {
          nimi: file.name,
          data: file.arrayBuffer(),
          lisattypvm: new Date().toString(),
          contentType: file.type
        }
        return asiakirja
      })
    }

    private asiakirjatExcludingDeleted(): Asiakirja[] {
      return (this.value?.todistukset ?? []).filter(
        (asiakirja) =>
          !this.deletedAsiakirjat.map((deleted) => deleted.nimi).includes(asiakirja.nimi)
      )
    }
  }
</script>

<style lang="scss" scoped>
  @import '~@/styles/variables';
  @import '~bootstrap/scss/mixins/breakpoints';

  .datepicker-range::before {
    content: '–';
    position: absolute;
    left: -2rem;
    padding: 0.375rem 0.75rem;
    @include media-breakpoint-down(sm) {
      display: none;
    }
  }
</style>
