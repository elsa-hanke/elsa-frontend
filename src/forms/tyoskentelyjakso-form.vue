<template>
  <b-form @submit.stop.prevent="onSubmit">
    <elsa-form-group :label="$t('kunta')" :required="!value.tapahtumia">
      <template v-slot="{ uid }">
        <div v-if="!value.tapahtumia">
          <elsa-form-multiselect
            :id="uid"
            v-model="form.tyoskentelypaikka.kunta"
            :options="kunnatFormatted"
            :state="validateState('tyoskentelypaikka.kunta')"
            label="abbreviation"
            track-by="id"
          />
          <b-form-invalid-feedback :id="`${uid}-feedback`">
            {{ $t('pakollinen-tieto') }}
          </b-form-invalid-feedback>
        </div>
        <div v-else>
          <span :id="uid">{{ form.tyoskentelypaikka.kunta.abbreviation }}</span>
        </div>
      </template>
    </elsa-form-group>
    <elsa-form-group :label="$t('tyoskentelypaikka')" :required="!value.tapahtumia">
      <template v-slot="{ uid }">
        <div v-if="!value.tapahtumia">
          <b-form-input
            :id="uid"
            v-model="form.tyoskentelypaikka.nimi"
            :state="validateState('tyoskentelypaikka.nimi')"
          ></b-form-input>
          <b-form-invalid-feedback :id="`${uid}-feedback`">
            {{ $t('pakollinen-tieto') }}
          </b-form-invalid-feedback>
        </div>
        <div v-else>
          <span :id="uid">{{ form.tyoskentelypaikka.nimi }}</span>
        </div>
      </template>
    </elsa-form-group>
    <elsa-form-group :label="$t('tyyppi')" :required="!value.tapahtumia">
      <template v-slot="{ uid }">
        <div v-if="!value.tapahtumia">
          <b-form-radio-group
            :id="uid"
            v-model="form.tyoskentelypaikka.tyyppi"
            :state="validateState('tyoskentelypaikka.tyyppi')"
            :options="tyypit"
            name="tyoskentelyjakso-tyyppi"
            stacked
          ></b-form-radio-group>
          <b-form-radio
            v-model="form.tyoskentelypaikka.tyyppi"
            :state="validateState('tyoskentelypaikka.tyyppi')"
            name="tyoskentelyjakso-tyyppi"
            value="MUU"
          >
            {{ $t('muu') }}
            <span v-if="form.tyoskentelypaikka.tyyppi === 'MUU'">
              , {{ $t('kerro-mika') | lowercase }}
              <span class="text-primary">*</span>
            </span>
          </b-form-radio>
          <div v-if="form.tyoskentelypaikka.tyyppi === 'MUU'" class="pl-4">
            <b-form-input
              v-model="form.tyoskentelypaikka.muuTyyppi"
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
        <div v-else>
          <span :id="uid">{{ tyyppiLabel }}</span>
          <span v-if="form.tyoskentelypaikka.muuTyyppi">
            : {{ form.tyoskentelypaikka.muuTyyppi }}
          </span>
        </div>
      </template>
    </elsa-form-group>
    <elsa-form-group
      :label="$t('tyoaika-taydesta-tyopaivasta') + ' (50–100 %)'"
      :required="!value.tapahtumia"
    >
      <template v-slot="{ uid }">
        <div v-if="!value.tapahtumia">
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
          <b-form-invalid-feedback
            :id="`${uid}-feedback`"
            :style="{
              display: validateState('osaaikaprosentti') === false ? 'block' : 'none'
            }"
          >
            {{ $t('osaaikaprosentti-validointivirhe') }} 50–100 %
          </b-form-invalid-feedback>
        </div>
        <div v-else>{{ form.osaaikaprosentti }} %</div>
      </template>
    </elsa-form-group>
    <b-form-row>
      <elsa-form-group
        :label="$t('alkamispaiva')"
        class="col-sm-12 col-md-6 pr-md-3"
        :required="!value.tapahtumia"
      >
        <template v-slot="{ uid }">
          <div v-if="!value.tapahtumia">
            <elsa-form-datepicker
              :id="uid"
              v-model="form.alkamispaiva"
              :state="validateState('alkamispaiva')"
              :max="maxAlkamispaiva"
            ></elsa-form-datepicker>
            <b-form-invalid-feedback :id="`${uid}-feedback`">
              {{ $t('pakollinen-tieto') }}
            </b-form-invalid-feedback>
          </div>
          <div v-else>
            <span v-if="form.alkamispaiva" :id="uid">{{ $date(form.alkamispaiva) }}</span>
          </div>
        </template>
      </elsa-form-group>
      <elsa-form-group :label="$t('paattymispaiva')" class="col-sm-12 col-md-6 pl-md-3">
        <template v-slot="{ uid }">
          <elsa-form-datepicker
            :id="uid"
            v-model="form.paattymispaiva"
            :min="minPaattymispaiva"
            :aria-describedby="`${uid}-help`"
            class="datepicker-range"
          />
          <small v-if="value.tapahtumia" class="form-text text-muted">
            {{ $t('tyoskentelyjakso-paattymispaiva-help') }}
          </small>
        </template>
      </elsa-form-group>
    </b-form-row>
    <elsa-form-group :label="$t('kaytannon-koulutus')" :required="!value.tapahtumia">
      <template v-slot="{ uid }">
        <div v-if="!value.tapahtumia">
          <b-form-radio
            v-model="form.kaytannonKoulutus"
            :state="validateState('kaytannonKoulutus')"
            name="kaytannon-koulutus-tyyppi"
            :value="omanErikoisalanKoulutus"
          >
            {{ $t('oman-erikoisalan-koulutus') }}
          </b-form-radio>
          <b-form-radio
            v-model="form.kaytannonKoulutus"
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
              :options="erikoisalatFormatted"
              :state="validateState('omaaErikoisalaaTukeva')"
              label="nimi"
              track-by="id"
            />
            <b-form-invalid-feedback>{{ $t('pakollinen-tieto') }}</b-form-invalid-feedback>
          </div>
          <b-form-radio
            v-model="form.kaytannonKoulutus"
            :state="validateState('kaytannonKoulutus')"
            name="kaytannon-koulutus-tyyppi"
            :value="tutkimustyo"
          >
            {{ $t('tutkimustyo') }}
          </b-form-radio>
          <b-form-radio
            v-model="form.kaytannonKoulutus"
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
        <div v-else>
          <span :id="uid">{{ kaytannonKoulutusLabel }}</span>
          <span v-if="form.omaaErikoisalaaTukeva">: {{ form.omaaErikoisalaaTukeva.nimi }}</span>
        </div>
      </template>
    </elsa-form-group>
    <elsa-form-group
      class="attachments"
      :label="$t('liitetiedostot')"
      :help="$t('sallitut-tiedostoformaatit')"
    >
      <template v-slot="{ uid }">
        <span :id="uid">
          {{ $t('tyoskentelyjakson-liitetiedostot-kuvaus') }}
        </span>
        <asiakirjat-upload
          class="mt-3"
          :id="uid"
          :isPrimaryButton="false"
          :buttonText="$t('lisaa-liitetiedosto')"
          :existingFileNamesForCurrentView="existingFileNamesForCurrentView"
          :existingFileNamesForOtherViews="existingFileNamesForOtherViews"
          :disabled="reservedAsiakirjaNimetMutable === undefined"
          @selectedFiles="onFilesAdded"
        />
        <asiakirjat-content
          :id="uid"
          :asiakirjat="asiakirjatTableItems"
          :sortingEnabled="false"
          :paginationEnabled="false"
          :enableSearch="false"
          :showInfoIfEmpty="false"
          @deleteAsiakirja="onDeleteLiitetiedosto"
        />
      </template>
    </elsa-form-group>
    <elsa-form-group v-if="!modal" :label="$t('lisatiedot')">
      <template v-slot="{ uid }">
        <b-form-checkbox :id="uid" v-model="form.hyvaksyttyAiempaanErikoisalaan">
          {{ $t('tyoskentelyjakso-on-aiemmin-hyvaksytty-toiselle-erikoisalalle') }}
        </b-form-checkbox>
      </template>
    </elsa-form-group>
    <div class="d-flex flex-row-reverse flex-wrap">
      <elsa-button :loading="params.saving" type="submit" variant="primary" class="ml-2 mb-2">
        {{ editing ? $t('tallenna') : $t('lisaa') }}
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
  import { required, between, requiredIf, integer } from 'vuelidate/lib/validators'

  import AsiakirjatContent from '@/components/asiakirjat/asiakirjat-content.vue'
  import AsiakirjatUpload from '@/components/asiakirjat/asiakirjat-upload.vue'
  import ElsaButton from '@/components/button/button.vue'
  import ElsaFormDatepicker from '@/components/datepicker/datepicker.vue'
  import ElsaFormGroup from '@/components/form-group/form-group.vue'
  import ElsaFormMultiselect from '@/components/multiselect/multiselect.vue'
  import { Asiakirja, Tyoskentelyjakso } from '@/types'
  import { confirmDelete } from '@/utils/confirm'
  import { KaytannonKoulutusTyyppi, TyoskentelyjaksoTyyppi } from '@/utils/constants'
  import {
    tyoskentelyjaksoKaytannonKoulutusLabel,
    tyoskentelypaikkaTyyppiLabel
  } from '@/utils/tyoskentelyjakso'

  @Component({
    components: {
      ElsaFormGroup,
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
        alkamispaiva: {
          required
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
    @Prop({ required: false, default: true })
    modal!: boolean

    @Prop({ required: false, default: false })
    editing!: boolean

    @Prop({ required: false, default: () => [] })
    kunnat!: any[]

    @Prop({ required: false, default: () => [] })
    erikoisalat!: any[]

    @Prop({ required: false, default: undefined })
    asiakirjat!: Asiakirja[]

    @Prop({ required: false, default: undefined })
    reservedAsiakirjaNimet!: string[]

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
    reservedAsiakirjaNimetMutable: string[] = []

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
      { text: this.$t('keskussairaala'), value: TyoskentelyjaksoTyyppi.KESKUSSAIRAALA },
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

    onSubmit() {
      this.$v.form.$touch()
      if (this.$v.form.$anyError) {
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
        // Jos asiakirjalla on id, on se tallennettu kantaan jo aiemmin, joten
        // lisää asiakirja poistettaviin asiakirjoihin.
        if (asiakirja.id) {
          this.deletedAsiakirjat = [asiakirja, ...this.deletedAsiakirjat]
        } else {
          // Jos asiakirjalla ei ole id:tä, on se lisätty ensimmäistä kertaa
          // tässä näkymässä, joten poista asiakirja lisättävistä tiedostoista.
          this.addedFiles = this.addedFiles?.filter((file) => file.name !== asiakirja.nimi)
          this.newAsiakirjatMapped = this.newAsiakirjatMapped?.filter(
            (a) => a.nimi != asiakirja.nimi
          )
        }
      }
    }

    onOsaaikaprosenttiInput(value: string) {
      if (value === '') {
        this.form.osaaikaprosentti = null
      } else {
        this.form.osaaikaprosentti = parseFloat(value)
      }
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
        .sort((a, b) => {
          if (a.abbreviation < b.abbreviation) return -1
          if (a.abbreviation > b.abbreviation) return 1
          return 0
        })
    }

    get erikoisalatFormatted() {
      return [
        ...this.erikoisalat.sort((a, b) => {
          if (a.nimi < b.nimi) return -1
          if (a.nimi > b.nimi) return 1
          return 0
        }),
        {
          nimi: this.$t('muu')
        }
      ]
    }

    get asiakirjatTableItems() {
      return [...this.newAsiakirjatMapped, ...this.asiakirjatExcludingDeleted()]
    }

    get existingFileNamesForCurrentView() {
      return this.asiakirjatTableItems?.map((item) => item.nimi)
    }

    get existingFileNamesForOtherViews() {
      return this.reservedAsiakirjaNimetMutable?.filter(
        (nimi) => !this.existingFileNamesForCurrentView.includes(nimi)
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
    left: -2rem;
    padding: 0.375rem 0.75rem;
    @include media-breakpoint-down(sm) {
      display: none;
    }
  }
</style>
