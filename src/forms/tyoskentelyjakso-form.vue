<template>
  <b-form @submit.stop.prevent="onSubmit">
    <elsa-form-group :label="$t('tyyppi')" :required="!value.tapahtumia">
      <template v-slot="{ uid }">
        <div>
          <b-form-radio
            v-for="(tyyppi, index) in tyypit"
            :key="index"
            v-model="form.tyoskentelypaikka.tyyppi"
            @input="$emit('skipRouteExitConfirm', false)"
            :state="validateState('tyoskentelypaikka.tyyppi')"
            name="tyoskentelyjakso-tyyppi"
            :value="tyyppi.value"
          >
            <span>
              {{ $t(tyyppi.text) }}
            </span>
          </b-form-radio>
          <b-form-radio
            v-model="form.tyoskentelypaikka.tyyppi"
            @input="$emit('skipRouteExitConfirm', false)"
            :state="validateState('tyoskentelypaikka.tyyppi')"
            name="tyoskentelyjakso-tyyppi"
            value="MUU"
          >
            <span v-if="form.tyoskentelypaikka.tyyppi === 'MUU'">
              {{ $t('muu') }}, {{ $t('kerro-mika') | lowercase }}
              <span class="text-primary">*</span>
            </span>
            <span v-else>
              {{ $t('muu') }}
            </span>
          </b-form-radio>
          <div v-if="form.tyoskentelypaikka.tyyppi === 'MUU'" class="pl-4">
            <b-form-input
              v-model="form.tyoskentelypaikka.muuTyyppi"
              @input="$emit('skipRouteExitConfirm', false)"
              :state="validateState('tyoskentelypaikka.muuTyyppi')"
            ></b-form-input>
            <b-form-invalid-feedback>{{ $t('pakollinen-tieto') }}</b-form-invalid-feedback>
          </div>
          <b-form-invalid-feedback
            :id="`${uid}-feedback`"
            :style="{
              display: validateState('tyoskentelypaikka.tyyppi') === false ? 'block' : 'none'
            }"
          >
            {{ $t('pakollinen-tieto') }}
          </b-form-invalid-feedback>
        </div>
      </template>
    </elsa-form-group>
    <elsa-form-group :label="$t('tyoskentelypaikka')" :required="!value.tapahtumia">
      <template v-slot="{ uid }">
        <div>
          <b-form-input
            :id="uid"
            v-model="form.tyoskentelypaikka.nimi"
            @input="$emit('skipRouteExitConfirm', false)"
            :state="validateState('tyoskentelypaikka.nimi')"
          ></b-form-input>
          <b-form-invalid-feedback :id="`${uid}-feedback`">
            {{ $t('pakollinen-tieto') }}
          </b-form-invalid-feedback>
        </div>
      </template>
    </elsa-form-group>
    <elsa-form-group :label="$t('kunta')" :required="!value.tapahtumia">
      <template v-slot="{ uid }">
        <div>
          <elsa-form-multiselect
            :id="uid"
            v-model="form.tyoskentelypaikka.kunta"
            @input="$emit('skipRouteExitConfirm', false)"
            :options="kunnatFormatted"
            :state="validateState('tyoskentelypaikka.kunta')"
            label="abbreviation"
            track-by="id"
          />
          <b-form-invalid-feedback :id="`${uid}-feedback`">
            {{ $t('pakollinen-tieto') }}
          </b-form-invalid-feedback>
        </div>
      </template>
    </elsa-form-group>
    <b-form-row>
      <elsa-form-group
        :label="$t('alkamispaiva')"
        class="col-xs-12 col-sm-6 pr-sm-3"
        :required="!value.tapahtumia"
      >
        <template v-slot="{ uid }">
          <div>
            <elsa-form-datepicker
              ref="alkamispaiva"
              v-if="childDataReceived"
              :id="uid"
              :value.sync="form.alkamispaiva"
              @input="$emit('skipRouteExitConfirm', false)"
              :max="maxAlkamispaiva"
              :maxErrorText="$t('alkamispaiva-ei-voi-olla-paattymispaivan-jalkeen')"
            ></elsa-form-datepicker>
          </div>
        </template>
      </elsa-form-group>
      <elsa-form-group :label="$t('paattymispaiva')" class="col-xs-12 col-sm-6 pl-sm-3">
        <template v-slot="{ uid }">
          <elsa-form-datepicker
            ref="paattymispaiva"
            v-if="childDataReceived"
            :id="uid"
            :value.sync="form.paattymispaiva"
            @input="$emit('skipRouteExitConfirm', false)"
            :min="minPaattymispaiva"
            :minErrorText="$t('paattymispaiva-ei-voi-olla-ennen-alkamispaivaa')"
            :required="false"
            :aria-describedby="`${uid}-help`"
            class="datepicker-range"
          />
          <small v-if="value.tapahtumia" class="form-text text-muted">
            {{ $t('tyoskentelyjakso-paattymispaiva-help') }}
          </small>
          <small v-else class="form-text text-muted">
            {{ $t('jata-tyhjaksi-jos-ei-tiedossa') }}
          </small>
        </template>
      </elsa-form-group>
    </b-form-row>
    <elsa-form-group
      :label="$t('tyoaika-taydesta-tyopaivasta') + ' (50–100 %)'"
      :required="!value.tapahtumia"
    >
      <template v-slot="{ uid }">
        <div>
          <div class="d-flex align-items-center">
            <b-form-input
              :id="uid"
              :value="form.osaaikaprosentti"
              :state="validateState('osaaikaprosentti')"
              type="number"
              step="any"
              class="col-sm-3"
              @input="onOsaaikaprosenttiInput"
            />
            <span class="mx-3">%</span>
          </div>
          <small class="d-flex form-text text-muted">
            {{ $t('alle-50-osaaikaisuus-ei-kerryta') }}
          </small>
          <b-form-invalid-feedback
            :id="`${uid}-feedback`"
            :style="{
              display: validateState('osaaikaprosentti') === false ? 'block' : 'none'
            }"
          >
            {{ $t('osaaikaprosentti-validointivirhe') }} 50–100 %
          </b-form-invalid-feedback>
        </div>
      </template>
    </elsa-form-group>
    <elsa-form-group :label="$t('kaytannon-koulutus')" :required="!value.tapahtumia">
      <template v-slot="{ uid }">
        <div>
          <b-form-radio
            v-model="form.kaytannonKoulutus"
            @input="$emit('skipRouteExitConfirm', false)"
            :state="validateState('kaytannonKoulutus')"
            name="kaytannon-koulutus-tyyppi"
            :value="omanErikoisalanKoulutus"
          >
            {{ $t('oman-erikoisalan-koulutus') }}
          </b-form-radio>
          <b-form-radio
            v-model="form.kaytannonKoulutus"
            @input="$emit('skipRouteExitConfirm', false)"
            :state="validateState('kaytannonKoulutus')"
            name="kaytannon-koulutus-tyyppi"
            :value="omaaErikoisalaaTukeva"
            class="mb-0"
          >
            {{ $t('omaa-erikoisalaa-tukeva-tai-taydentava-koulutus') }}
            <span v-if="form.kaytannonKoulutus === omaaErikoisalaaTukeva">
              , {{ $t('valitse-erikoisala') | lowercase }}
              <span class="text-primary">*</span>
            </span>
          </b-form-radio>
          <div v-if="form.kaytannonKoulutus === omaaErikoisalaaTukeva" class="pl-4">
            <elsa-form-multiselect
              v-model="form.omaaErikoisalaaTukeva"
              @input="$emit('skipRouteExitConfirm', false)"
              :options="erikoisalatFormatted"
              :state="validateState('omaaErikoisalaaTukeva')"
              label="nimi"
              track-by="id"
            />
            <b-form-invalid-feedback>{{ $t('pakollinen-tieto') }}</b-form-invalid-feedback>
          </div>
          <b-form-radio
            v-model="form.kaytannonKoulutus"
            @input="$emit('skipRouteExitConfirm', false)"
            :state="validateState('kaytannonKoulutus')"
            name="kaytannon-koulutus-tyyppi"
            :value="tutkimustyo"
          >
            {{ $t('tutkimustyo') }}
          </b-form-radio>
          <b-form-radio
            v-model="form.kaytannonKoulutus"
            @input="$emit('skipRouteExitConfirm', false)"
            :state="validateState('kaytannonKoulutus')"
            name="kaytannon-koulutus-tyyppi"
            :value="terveyskeskustyo"
          >
            {{ $t('terveyskeskustyo') }}
          </b-form-radio>
          <b-form-invalid-feedback :id="`${uid}-feedback`">
            {{ $t('pakollinen-tieto') }}
          </b-form-invalid-feedback>
        </div>
      </template>
    </elsa-form-group>
    <elsa-form-group
      v-if="allowHyvaksyttyAiemminToiselleErikoisalalleOption"
      :label="$t('lisatiedot')"
    >
      <template v-slot="{ uid }">
        <b-form-checkbox
          :id="uid"
          v-model="form.hyvaksyttyAiempaanErikoisalaan"
          @input="$emit('skipRouteExitConfirm', false)"
        >
          {{ $t('tyoskentelyjakso-on-aiemmin-hyvaksytty-toiselle-erikoisalalle') }}
        </b-form-checkbox>
      </template>
    </elsa-form-group>
    <elsa-form-group :label="$t('liitetiedostot')" :help="$t('sallitut-tiedostoformaatit-default')">
      <span>
        {{ $t('tyoskentelyjakson-liitetiedostot-kuvaus') }}
      </span>
      <asiakirjat-upload
        class="mt-3"
        :isPrimaryButton="false"
        :buttonText="$t('lisaa-liitetiedosto')"
        :existingFileNamesInCurrentView="existingFileNamesInCurrentView"
        :existingFileNamesInOtherViews="existingFileNamesInOtherViews"
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
    </elsa-form-group>
    <hr v-if="asiakirjatTableItems.length === 0" />
    <div
      :class="{ 'mt-4': asiakirjatTableItems.length > 0 }"
      class="d-flex flex-row-reverse flex-wrap"
    >
      <elsa-button :loading="params.saving" type="submit" variant="primary" class="ml-2 mb-2">
        {{ editing ? $t('tallenna') : $t('lisaa') }}
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
  import axios from 'axios'
  import Component from 'vue-class-component'
  import { Mixins, Prop } from 'vue-property-decorator'
  import { validationMixin } from 'vuelidate'
  import { required, between, requiredIf, integer } from 'vuelidate/lib/validators'

  import AsiakirjatContent from '@/components/asiakirjat/asiakirjat-content.vue'
  import AsiakirjatUpload from '@/components/asiakirjat/asiakirjat-upload.vue'
  import ElsaButton from '@/components/button/button.vue'
  import ElsaFormDatepicker from '@/components/datepicker/datepicker.vue'
  import ElsaFormError from '@/components/form-error/form-error.vue'
  import ElsaFormGroup from '@/components/form-group/form-group.vue'
  import ElsaFormMultiselect from '@/components/multiselect/multiselect.vue'
  import { Asiakirja, Tyoskentelyjakso } from '@/types'
  import { KaytannonKoulutusTyyppi, TyoskentelyjaksoTyyppi } from '@/utils/constants'
  import { mapFiles } from '@/utils/fileMapper'
  import { sortByAsc } from '@/utils/sort'
  import {
    tyoskentelyjaksoKaytannonKoulutusLabel,
    tyoskentelypaikkaTyyppiLabel
  } from '@/utils/tyoskentelyjakso'

  @Component({
    components: {
      ElsaFormGroup,
      ElsaFormError,
      ElsaFormMultiselect,
      ElsaFormDatepicker,
      ElsaButton,
      AsiakirjatContent,
      AsiakirjatUpload
    },
    validations: {
      form: {
        tyoskentelypaikka: {
          required,
          nimi: {
            required
          },
          kunta: {
            required
          },
          tyyppi: {
            required
          },
          muuTyyppi: {
            required: requiredIf((value) => {
              return value.tyyppi === 'MUU'
            })
          }
        },
        osaaikaprosentti: {
          required,
          integer,
          between: between(50, 100)
        },
        kaytannonKoulutus: {
          required
        },
        omaaErikoisalaaTukeva: {
          required: requiredIf((value) => {
            return (
              value.kaytannonKoulutus === KaytannonKoulutusTyyppi.OMAA_ERIKOISALAA_TUKEVA_KOULUTUS
            )
          })
        }
      }
    }
  })
  export default class TyoskentelyjaksoForm extends Mixins(validationMixin) {
    $refs!: {
      alkamispaiva: ElsaFormDatepicker
      paattymispaiva: ElsaFormDatepicker
    }

    @Prop({ required: false, default: false })
    allowHyvaksyttyAiemminToiselleErikoisalalleOption!: boolean

    @Prop({ required: false, default: false })
    editing!: boolean

    @Prop({ required: false, default: () => [] })
    kunnat!: any[]

    @Prop({ required: false, default: () => [] })
    erikoisalat!: any[]

    @Prop({ required: false, default: undefined })
    asiakirjat?: Asiakirja[]

    @Prop({ required: false, default: undefined })
    reservedAsiakirjaNimet?: string[]

    @Prop({
      required: false,
      type: Object,
      default: () => ({
        alkamispaiva: null,
        paattymispaiva: null,
        osaaikaprosentti: null,
        tyoskentelypaikka: {
          nimi: null,
          kunta: {},
          tyyppi: null,
          muuTyyppi: null
        },
        kaytannonKoulutus: null,
        omaaErikoisalaaTukeva: null,
        hyvaksyttyAiempaanErikoisalaan: null
      })
    })
    value!: Tyoskentelyjakso

    addedFiles: File[] = []
    newAsiakirjatMapped: Asiakirja[] = []
    deletedAsiakirjat: Asiakirja[] = []
    reservedAsiakirjaNimetMutable: string[] | undefined = []

    form: Tyoskentelyjakso = {
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
    tyypit = [
      { text: this.$t('terveyskeskus'), value: TyoskentelyjaksoTyyppi.TERVEYSKESKUS },
      {
        text: this.$t('keskussairaala-tai-aluesairaala'),
        value: TyoskentelyjaksoTyyppi.KESKUSSAIRAALA
      },
      {
        text: this.$t('yliopistollinen-sairaala'),
        value: TyoskentelyjaksoTyyppi.YLIOPISTOLLINEN_SAIRAALA
      },
      { text: this.$t('yksityinen'), value: TyoskentelyjaksoTyyppi.YKSITYINEN }
    ]
    params = {
      saving: false,
      deleting: false
    }
    childDataReceived = false

    async mounted() {
      this.form = {
        ...this.value
      }

      this.reservedAsiakirjaNimetMutable = this.reservedAsiakirjaNimet
      if (!this.reservedAsiakirjaNimetMutable) {
        this.reservedAsiakirjaNimetMutable = (
          await axios.get('erikoistuva-laakari/asiakirjat/nimet')
        ).data
      }

      this.childDataReceived = true
    }

    validateState(name: string) {
      // TODO: Vaatii refaktorointia
      const get = (obj: any, path: any, defaultValue = undefined) => {
        const travel = (regexp: any) =>
          String.prototype.split
            .call(path, regexp)
            .filter(Boolean)
            .reduce((res, key) => (res !== null && res !== undefined ? res[key] : res), obj)
        const result = travel(/[,[\]]+?/) || travel(/[,[\].]+?/)
        return result === undefined || result === obj ? defaultValue : result
      }
      const { $dirty, $error } = get(this.$v.form, name)
      return $dirty ? ($error ? false : null) : null
    }

    validateForm(): boolean {
      this.$v.form.$touch()
      return !this.$v.$anyError
    }

    onSubmit() {
      const validations = [
        this.validateForm(),
        this.$refs.alkamispaiva ? this.$refs.alkamispaiva.validateForm() : true,
        this.$refs.paattymispaiva.validateForm()
      ]

      if (validations.includes(false)) {
        return
      }

      const submitData = {
        tyoskentelyjakso: {
          ...this.form,
          tyoskentelypaikka: {
            ...this.form.tyoskentelypaikka,
            kuntaId: this.form.tyoskentelypaikka.kunta?.id
          },
          omaaErikoisalaaTukevaId: this.form.omaaErikoisalaaTukeva?.id
        },
        addedFiles: this.addedFiles,
        deletedAsiakirjaIds: this.deletedAsiakirjat.map((asiakirja) => asiakirja.id)
      }

      delete submitData.tyoskentelyjakso.asiakirjat

      this.$emit('submit', submitData, this.params)
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
        ...mapFiles(addedFilesNotInDeletedArray),
        ...this.newAsiakirjatMapped
      ]
      this.$emit('skipRouteExitConfirm', false)
    }

    async onDeleteLiitetiedosto(asiakirja: Asiakirja) {
      // Jos asiakirjalla on id, on se tallennettu kantaan jo aiemmin, joten
      // lisää asiakirja poistettaviin asiakirjoihin.
      if (asiakirja.id) {
        this.deletedAsiakirjat = [asiakirja, ...this.deletedAsiakirjat]
      } else {
        // Jos asiakirjalla ei ole id:tä, on se lisätty ensimmäistä kertaa
        // tässä näkymässä, joten poista asiakirja lisättävistä tiedostoista.
        this.addedFiles = this.addedFiles?.filter((file) => file.name !== asiakirja.nimi)
        this.newAsiakirjatMapped = this.newAsiakirjatMapped?.filter(
          (a) => a.nimi !== asiakirja.nimi
        )
      }
      this.$emit('skipRouteExitConfirm', false)
    }

    onOsaaikaprosenttiInput(value: string) {
      if (value === '') {
        this.form.osaaikaprosentti = null
      } else {
        this.form.osaaikaprosentti = parseFloat(value)
      }
      this.$emit('skipRouteExitConfirm', false)
    }

    onCancel() {
      this.$emit('cancel')
    }

    get maxAlkamispaiva() {
      return this.form.paattymispaiva
    }

    get minPaattymispaiva() {
      if (this.form.tapahtumia) {
        return this.form.minPaattymispaiva
      } else {
        return this.form.alkamispaiva
      }
    }

    get kunnatFormatted() {
      return this.kunnat
        .filter((k) => !k.korvaavaKoodi) // Rajattu pois entiset kunnat
        .filter((k) => !['000', '198', '199'].includes(k.id)) // Rajattu pois muut kuin kunnat
        .sort((a, b) => sortByAsc(a.abbreviation, b.abbreviation))
    }

    get erikoisalatFormatted() {
      return [
        ...this.erikoisalat.sort((a, b) => sortByAsc(a.nimi, b.nimi)),
        {
          nimi: this.$t('muu')
        }
      ]
    }

    get asiakirjatTableItems() {
      return [...this.newAsiakirjatMapped, ...this.asiakirjatExcludingDeleted()]
    }

    get existingFileNamesInCurrentView() {
      return this.asiakirjatTableItems?.map((item) => item.nimi)
    }

    get existingFileNamesInOtherViews() {
      return this.reservedAsiakirjaNimetMutable?.filter(
        (nimi) => !this.existingFileNamesInCurrentView.includes(nimi)
      )
    }

    get omaaErikoisalaaTukeva() {
      return KaytannonKoulutusTyyppi.OMAA_ERIKOISALAA_TUKEVA_KOULUTUS
    }

    get omanErikoisalanKoulutus() {
      return KaytannonKoulutusTyyppi.OMAN_ERIKOISALAN_KOULUTUS
    }

    get tutkimustyo() {
      return KaytannonKoulutusTyyppi.TUTKIMUSTYO
    }

    get terveyskeskustyo() {
      return KaytannonKoulutusTyyppi.TERVEYSKESKUSTYO
    }

    get kaytannonKoulutusLabel() {
      if (this.form?.kaytannonKoulutus) {
        return tyoskentelyjaksoKaytannonKoulutusLabel(this, this.form?.kaytannonKoulutus)
      }
      return undefined
    }

    get tyyppiLabel() {
      if (this.form?.tyoskentelypaikka?.tyyppi) {
        return tyoskentelypaikkaTyyppiLabel(this, this.form?.tyoskentelypaikka?.tyyppi)
      }
      return undefined
    }

    private asiakirjatExcludingDeleted(): Asiakirja[] {
      return (this.asiakirjat ?? []).filter(
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
    left: -1.5rem;
    padding: 0.375rem 0.75rem;
    @include media-breakpoint-down(xs) {
      display: none;
    }
  }
</style>
