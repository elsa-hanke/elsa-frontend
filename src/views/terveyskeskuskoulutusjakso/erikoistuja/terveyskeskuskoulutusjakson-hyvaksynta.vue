<template>
  <div class="terveyskeskuskoulutusjakso">
    <b-breadcrumb :items="items" class="mb-0" />
    <b-container fluid>
      <b-row lg>
        <b-col>
          <h1>{{ $t('terveyskeskuskoulutusjakson-hyvaksynta') }}</h1>
          <div v-if="hyvaksynta != null">
            <p v-if="editable">{{ $t('terveyskeskuskoulutusjakson-hyvaksynta-kuvaus') }}</p>
            <b-alert v-else variant="dark" show>
              <font-awesome-icon icon="info-circle" fixed-width class="text-muted" />
              <span>
                {{ $t('terveyskeskuskoulutusjakso-on-lahetetty-hyvaksyttavaksi') }}
              </span>
            </b-alert>
            <hr />

            <b-form @submit.stop.prevent="onSubmit">
              <erikoistuva-details
                :avatar="hyvaksynta.erikoistuvanAvatar"
                :name="hyvaksynta.erikoistuvanNimi"
                :erikoisala="hyvaksynta.erikoistuvanErikoisala"
                :opiskelijatunnus="hyvaksynta.erikoistuvanOpiskelijatunnus"
                :yliopisto="hyvaksynta.erikoistuvanYliopisto"
                :show-birthdate="true"
              />
              <div class="table-responsive">
                <table
                  class="table table-borderless border-0 table-sm erikoistuva-details-table"
                  :summary="$t('terveyskeskuskoulutuksen-yhteenlaskettu-kesto')"
                >
                  <tr class="sr-only">
                    <th scope="col">{{ $t('kentta') }}</th>
                    <th scope="col">{{ $t('arvo') }}</th>
                  </tr>
                  <tr>
                    <th scope="row" style="width: 12rem" class="align-middle font-weight-500">
                      {{ $t('terveyskeskuskoulutuksen-yhteenlaskettu-kesto') }}
                    </th>
                    <td class="pl-6">
                      {{ $duration(hyvaksynta.terveyskeskuskoulutusjaksonKesto) }}
                    </td>
                  </tr>
                  <tr
                    v-if="
                      hyvaksynta.laillistamispaiva != null &&
                      hyvaksynta.laillistamispaivanLiite != null
                    "
                  >
                    <th scope="row" style="width: 12rem" class="align-middle font-weight-500">
                      {{ $t('laillistamispaiva') }}
                    </th>
                    <td class="pl-6">
                      {{ $date(hyvaksynta.laillistamispaiva) }} -
                      <elsa-button
                        variant="link"
                        @click="onDownloadLaillistamistodistus"
                        class="pl-0"
                      >
                        {{ hyvaksynta.laillistamispaivanLiitteenNimi }}
                      </elsa-button>
                    </td>
                  </tr>
                </table>
              </div>
              <hr />
              <div
                v-if="
                  editable &&
                  (hyvaksynta.laillistamispaiva == null ||
                    hyvaksynta.laillistamispaivanLiite == null)
                "
              >
                <h3>
                  {{ $t('laillistaminen') }}
                </h3>
                <elsa-form-group
                  class="col-xs-12 col-sm-3 pl-0"
                  :label="$t('laillistamispaiva')"
                  :required="true"
                >
                  <template v-slot="{ uid }">
                    <elsa-form-datepicker
                      ref="laillistamispaiva"
                      :id="uid"
                      :value.sync="form.laillistamispaiva"
                      @input="$emit('skipRouteExitConfirm', false)"
                    ></elsa-form-datepicker>
                    <b-form-invalid-feedback>{{ $t('pakollinen-tieto') }}</b-form-invalid-feedback>
                  </template>
                </elsa-form-group>
                <elsa-form-group :label="$t('laillistamispaivan-liitetiedosto')" :required="true">
                  <span>
                    {{ $t('lisaa-liite-joka-todistaa-laillistamispaivan') }}
                  </span>
                  <asiakirjat-upload
                    class="mt-3"
                    :isPrimaryButton="false"
                    :allowMultiplesFiles="false"
                    :buttonText="$t('lisaa-liitetiedosto')"
                    @selectedFiles="onLaillistamispaivaFilesAdded"
                    :disabled="laillistamispaivaAsiakirjat.length > 0"
                  />
                  <asiakirjat-content
                    :asiakirjat="laillistamispaivaAsiakirjat"
                    :sorting-enabled="false"
                    :pagination-enabled="false"
                    :enable-search="false"
                    :enable-delete="true"
                    @deleteAsiakirja="onDeleteLaillistamispaivanLiite"
                    :no-results-info-text="$t('ei-liitetiedostoja')"
                    :state="validateState('laillistamispaivanLiite')"
                  />
                  <b-form-invalid-feedback :state="validateState('laillistamispaivanLiite')">
                    {{ $t('pakollinen-tieto') }}
                  </b-form-invalid-feedback>
                </elsa-form-group>
                <hr />
              </div>
              <div v-for="(sp, index) in hyvaksynta.tyoskentelyjaksot" :key="index">
                <b-row>
                  <b-col>
                    <h3>{{ $t('tyoskentelyjakso') }}</h3>
                  </b-col>
                </b-row>
                <b-row>
                  <b-col>
                    <h5>{{ $t('tyyppi') }}</h5>
                    <p>
                      {{
                        sp.tyoskentelypaikka.tyyppi
                          ? displayTyoskentelypaikkaTyyppiLabel(
                              sp.tyoskentelypaikka.muuTyyppi,
                              sp.tyoskentelypaikka.tyyppi
                            )
                          : '-'
                      }}
                    </p>
                  </b-col>
                </b-row>
                <b-row>
                  <b-col>
                    <h5>{{ $t('tyoskentelypaikka') }}</h5>
                    <p>{{ sp.tyoskentelypaikka.nimi }}</p>
                  </b-col>
                </b-row>
                <b-row>
                  <b-col>
                    <h5>{{ $t('kunta') }}</h5>
                    <p>
                      {{
                        sp.tyoskentelypaikka.kunta ? sp.tyoskentelypaikka.kunta.abbreviation : ''
                      }}
                    </p>
                  </b-col>
                </b-row>
                <b-row>
                  <b-col lg="2">
                    <h5>{{ $t('alkamispaiva') }}</h5>
                    <p>{{ sp.alkamispaiva ? $date(sp.alkamispaiva) : '' }}</p>
                  </b-col>
                  <b-col lg="2">
                    <h5>{{ $t('paattymispaiva') }}</h5>
                    <p>{{ sp.paattymispaiva ? $date(sp.paattymispaiva) : '' }}</p>
                  </b-col>
                </b-row>
                <b-row>
                  <b-col>
                    <h5>{{ $t('tyoaika-taydesta-tyopaivasta-prosentti') }}</h5>
                    <p>{{ sp.osaaikaprosentti }}%</p>
                  </b-col>
                </b-row>
                <b-row>
                  <b-col>
                    <h5>{{ $t('kaytannon-koulutus') }}</h5>
                    <p>
                      {{
                        sp.kaytannonKoulutus ? displayKaytannonKoulutus(sp.kaytannonKoulutus) : ''
                      }}
                      {{ sp.omaaErikoisalaaTukeva ? ': ' + sp.omaaErikoisalaaTukeva.nimi : '' }}
                    </p>
                  </b-col>
                </b-row>
                <b-row>
                  <b-col>
                    <elsa-form-group :label="$t('liitetiedostot')" :required="true">
                      <div v-if="editable">
                        <span>
                          {{ $t('lisaa-tyoskentelyjaksoon-tyojakoulutustodistus') }}
                        </span>
                        <asiakirjat-upload
                          v-if="editable"
                          class="mt-3"
                          :isPrimaryButton="false"
                          :allowMultiplesFiles="false"
                          :buttonText="$t('lisaa-liitetiedosto')"
                          :existingFileNamesInCurrentView="existingFileNamesInCurrentView"
                          :existingFileNamesInOtherViews="existingFileNamesInOtherViews"
                          @selectedFiles="onFilesAdded(sp, ...arguments)"
                        />
                      </div>
                      <asiakirjat-content
                        :asiakirjat="sp.asiakirjat"
                        :sorting-enabled="false"
                        :pagination-enabled="false"
                        :enable-search="false"
                        :enable-delete="editable"
                        @deleteAsiakirja="onDeleteLiitetiedosto(sp, ...arguments)"
                        :no-results-info-text="$t('ei-liitetiedostoja')"
                        :state="validateTyoskentelyjaksoState(index)"
                      />
                      <b-form-invalid-feedback :state="validateTyoskentelyjaksoState(index)">
                        {{ $t('pakollinen-tieto') }}
                      </b-form-invalid-feedback>
                    </elsa-form-group>
                  </b-col>
                </b-row>
                <b-row v-if="sp.hyvaksyttyAiempaanErikoisalaan">
                  <b-col>
                    <h5>{{ $t('lisatiedot') }}</h5>
                    <p>{{ $t('tyoskentelyjakso-on-aiemmin-hyvaksytty-toiselle-erikoisalalle') }}</p>
                  </b-col>
                </b-row>
                <b-row v-if="sp.poissaolot != null && sp.poissaolot.length > 0">
                  <b-col>
                    <h5>{{ $t('poissaolot') }}</h5>
                    <elsa-poissaolot-display :poissaolot="sp.poissaolot" />
                  </b-col>
                </b-row>
                <hr />
              </div>
              <b-row>
                <b-col lg="8">
                  <h3>{{ $t('vastuuhenkilo') }}</h3>
                  <h5>{{ $t('erikoisala-vastuuhenkilö-label') }}</h5>
                  <p>
                    {{ hyvaksynta.vastuuhenkilonNimi }}
                    {{
                      hyvaksynta.vastuuhenkilonNimike ? ', ' + hyvaksynta.vastuuhenkilonNimike : ''
                    }}
                  </p>
                </b-col>
              </b-row>
              <hr />
              <div class="d-flex flex-row-reverse flex-wrap">
                <elsa-button
                  v-if="editable"
                  :loading="params.saving"
                  type="submit"
                  variant="primary"
                  class="ml-2 mb-2"
                >
                  {{ $t('laheta') }}
                </elsa-button>
                <elsa-button
                  :to="{ name: 'tyoskentelyjaksot' }"
                  variant="link"
                  :class="
                    editable
                      ? 'mb-3 mr-auto font-weight-500'
                      : 'mb-3 mr-auto font-weight-500 tyoskentelyjaksot-link'
                  "
                >
                  {{ editable ? $t('peruuta') : $t('palaa-tyoskentelyjaksoihin') }}
                </elsa-button>
              </div>
            </b-form>
          </div>
          <div v-else class="text-center">
            <b-spinner variant="primary" :label="$t('ladataan')" />
          </div>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script lang="ts">
  import axios, { AxiosError } from 'axios'
  import { Component, Mixins } from 'vue-property-decorator'
  import { Validation, validationMixin } from 'vuelidate'
  import { required, minLength, requiredIf } from 'vuelidate/lib/validators'

  import { getTerveyskeskuskoulutusjakso } from '@/api/erikoistuva'
  import AsiakirjatContent from '@/components/asiakirjat/asiakirjat-content.vue'
  import AsiakirjatUpload from '@/components/asiakirjat/asiakirjat-upload.vue'
  import ElsaButton from '@/components/button/button.vue'
  import ElsaFormDatepicker from '@/components/datepicker/datepicker.vue'
  import ErikoistuvaDetails from '@/components/erikoistuva-details/erikoistuva-details.vue'
  import ElsaFormGroup from '@/components/form-group/form-group.vue'
  import ElsaPoissaolotDisplay from '@/components/poissaolot-display/poissaolot-display.vue'
  import store from '@/store'
  import {
    Asiakirja,
    ElsaError,
    TerveyskeskuskoulutusjaksonHyvaksyminen,
    TerveyskeskuskoulutusjaksonHyvaksyntaForm,
    Tyoskentelyjakso
  } from '@/types'
  import { saveBlob } from '@/utils/blobs'
  import { KaytannonKoulutusTyyppi, TyoskentelyjaksoTyyppi } from '@/utils/constants'
  import { mapFile, mapFiles } from '@/utils/fileMapper'
  import { toastFail, toastSuccess } from '@/utils/toast'
  import {
    tyoskentelyjaksoKaytannonKoulutusLabel,
    tyoskentelypaikkaTyyppiLabel
  } from '@/utils/tyoskentelyjakso'

  @Component({
    components: {
      ElsaButton,
      ElsaFormGroup,
      ElsaFormDatepicker,
      ElsaPoissaolotDisplay,
      AsiakirjatContent,
      AsiakirjatUpload,
      ErikoistuvaDetails
    }
  })
  export default class TerveyskeskuskoulutusjaksonHyvaksynta extends Mixins(validationMixin) {
    $refs!: {
      laillistamispaiva: ElsaFormDatepicker
    }

    validations() {
      return {
        hyvaksynta: {
          tyoskentelyjaksot: {
            $each: {
              asiakirjat: {
                required,
                minLength: minLength(2)
              }
            }
          }
        },
        form: {
          laillistamispaiva: {
            required: requiredIf(() => {
              return this.hyvaksynta?.laillistamispaiva == null
            })
          },
          laillistamispaivanLiite: {
            required: requiredIf(() => {
              return this.laillistamispaivaAsiakirjat.length === 0
            })
          }
        }
      }
    }
    items = [
      {
        text: this.$t('etusivu'),
        to: { name: 'etusivu' }
      },
      {
        text: this.$t('tyoskentelyjaksot'),
        to: { name: 'tyoskentelyjaksot' }
      },
      {
        text: this.$t('terveyskeskuskoulutusjakson-hyvaksynta'),
        active: true
      }
    ]

    params = {
      saving: false
    }

    hyvaksynta: TerveyskeskuskoulutusjaksonHyvaksyminen | null = null
    form: TerveyskeskuskoulutusjaksonHyvaksyntaForm = {
      laillistamispaiva: null,
      laillistamispaivanLiite: null,
      tyoskentelyjaksoAsiakirjat: []
    }
    reservedAsiakirjaNimetMutable: string[] | undefined = []
    laillistamispaivaAsiakirjat: Asiakirja[] = []

    async mounted() {
      try {
        this.hyvaksynta = (await getTerveyskeskuskoulutusjakso()).data
        if (this.hyvaksynta?.laillistamispaivanLiite) {
          const data = Uint8Array.from(atob(this.hyvaksynta?.laillistamispaivanLiite), (c) =>
            c.charCodeAt(0)
          )
          this.laillistamispaivaAsiakirjat.push(
            mapFile(
              new File([data], this.hyvaksynta?.laillistamispaivanLiitteenNimi || '', {
                type: this.hyvaksynta?.laillistamispaivanLiitteenTyyppi
              })
            )
          )
        }
        this.form.laillistamispaiva = this.hyvaksynta?.laillistamispaiva
        this.reservedAsiakirjaNimetMutable = (
          await axios.get('erikoistuva-laakari/asiakirjat/nimet')
        ).data
      } catch (err) {
        const axiosError = err as AxiosError<ElsaError>
        const message = axiosError?.response?.data?.message
        toastFail(
          this,
          message
            ? `${this.$t('terveyskeskuskoulutusjakson-tietojen-hakeminen-epaonnistui')}: ${this.$t(
                message
              )}`
            : this.$t('terveyskeskuskoulutusjakson-tietojen-hakeminen-epaonnistui')
        )
        this.$router.replace({ name: 'tyoskentelyjaksot' })
      }
    }

    get account() {
      return store.getters['auth/account']
    }

    get existingFileNamesInCurrentView() {
      return this.hyvaksynta
        ? this.hyvaksynta.tyoskentelyjaksot?.flatMap((item) =>
            item.asiakirjat?.map((asiakirja) => asiakirja.nimi)
          )
        : []
    }

    get existingFileNamesInOtherViews() {
      return this.reservedAsiakirjaNimetMutable?.filter(
        (nimi) => !this.existingFileNamesInCurrentView.includes(nimi)
      )
    }

    get editable() {
      return this.hyvaksynta?.id == null && !this.account.impersonated
    }

    validateForm(): boolean {
      this.$v.form.$touch()
      this.$v.hyvaksynta.$touch()
      return !this.$v.$anyError
    }

    validateState(name: string) {
      const { $dirty, $error } = this.$v.form[name] as Validation
      return $dirty ? ($error ? false : null) : null
    }

    validateTyoskentelyjaksoState(index: number) {
      const { $dirty, $error } = this.$v.hyvaksynta?.tyoskentelyjaksot?.$each[index] as Validation
      return $dirty ? ($error ? false : null) : null
    }

    async onSubmit() {
      const validations = [
        this.validateForm(),
        this.$refs.laillistamispaiva ? this.$refs.laillistamispaiva.validateForm() : true
      ]

      if (validations.includes(false) || this.hyvaksynta == null) {
        this.$nextTick(() => {
          const invalidInput = document.querySelector('.is-invalid')
          invalidInput
            ? invalidInput.scrollIntoView({ block: 'center', behavior: 'smooth' })
            : document
                .querySelector('.invalid-feedback.d-block')
                ?.scrollIntoView({ block: 'center', behavior: 'smooth' })
        })
        return
      }
      this.params.saving = true

      for (const asiakirjat of this.form.tyoskentelyjaksoAsiakirjat) {
        const formData = new FormData()
        asiakirjat.addedFiles.forEach((file: File) =>
          formData.append(`addedFiles`, file, file.name)
        )
        asiakirjat.deletedFiles.forEach((file: number) =>
          formData.append(`deletedFiles`, String(file))
        )

        try {
          await axios.put(
            `erikoistuva-laakari/tyoskentelyjaksot/${asiakirjat.id}/asiakirjat`,
            formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data'
              },
              timeout: 120000
            }
          )
        } catch (err) {
          const axiosError = err as AxiosError<ElsaError>
          const message = axiosError?.response?.data?.message
          toastFail(
            this,
            message
              ? `${this.$t('terveyskeskuskoulutusjakson-lahetys-epaonnistui')}: ${this.$t(message)}`
              : this.$t('terveyskeskuskoulutusjakson-lahetys-epaonnistui')
          )
          return
        }
      }

      try {
        const formData = new FormData()
        if (this.form.laillistamispaiva != null)
          formData.append('laillistamispaiva', this.form.laillistamispaiva)
        if (this.form.laillistamispaivanLiite != null)
          formData.append(
            'laillistamispaivanLiite',
            this.form.laillistamispaivanLiite,
            this.form.laillistamispaivanLiite?.name
          )
        await axios.post(
          'erikoistuva-laakari/tyoskentelyjaksot/terveyskeskuskoulutusjakson-hyvaksynta',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            },
            timeout: 120000
          }
        )
        toastSuccess(this, this.$t('terveyskeskuskoulutusjakson-lahetys-onnistui'))
        this.$emit('skipRouteExitConfirm', true)
        this.$router.push({ name: 'tyoskentelyjaksot' })
      } catch (err) {
        const axiosError = err as AxiosError<ElsaError>
        const message = axiosError?.response?.data?.message
        toastFail(
          this,
          message
            ? `${this.$t('terveyskeskuskoulutusjakson-lahetys-epaonnistui')}: ${this.$t(message)}`
            : this.$t('terveyskeskuskoulutusjakson-lahetys-epaonnistui')
        )
      }
      this.params.saving = false
    }

    kaytannonKoulutusLabel(tyoskentelyjakso: Tyoskentelyjakso) {
      if (tyoskentelyjakso.kaytannonKoulutus) {
        return tyoskentelyjaksoKaytannonKoulutusLabel(this, tyoskentelyjakso.kaytannonKoulutus)
      }
      return undefined
    }

    tyyppiLabel(tyoskentelyjakso: Tyoskentelyjakso) {
      if (tyoskentelyjakso.tyoskentelypaikka?.tyyppi) {
        return tyoskentelypaikkaTyyppiLabel(this, tyoskentelyjakso.tyoskentelypaikka?.tyyppi)
      }
      return undefined
    }

    displayTyoskentelypaikkaTyyppiLabel(muu: string | null, tyyppi: TyoskentelyjaksoTyyppi) {
      return muu ? muu : tyoskentelypaikkaTyyppiLabel(this, tyyppi)
    }

    displayKaytannonKoulutus(value: KaytannonKoulutusTyyppi) {
      return tyoskentelyjaksoKaytannonKoulutusLabel(this, value)
    }

    onFilesAdded(tyoskentelyjakso: Tyoskentelyjakso, files: File[]) {
      const tjaksoAsiakirjat = this.form.tyoskentelyjaksoAsiakirjat.filter(
        (tjakso) => tjakso.id === tyoskentelyjakso.id
      )

      if (tjaksoAsiakirjat?.length === 0) {
        this.form.tyoskentelyjaksoAsiakirjat.push({
          id: tyoskentelyjakso.id,
          addedFiles: files,
          deletedFiles: []
        })
      } else {
        tjaksoAsiakirjat[0].addedFiles.push(...files)
      }

      tyoskentelyjakso.asiakirjat?.push(...mapFiles(files))
    }

    async onDeleteLiitetiedosto(tyoskentelyjakso: Tyoskentelyjakso, asiakirja: Asiakirja) {
      const tjaksoAsiakirjat = this.form.tyoskentelyjaksoAsiakirjat.filter(
        (tjakso) => tjakso.id === tyoskentelyjakso.id
      )

      if (asiakirja.id) {
        if (tjaksoAsiakirjat?.length === 0) {
          this.form.tyoskentelyjaksoAsiakirjat.push({
            id: tyoskentelyjakso.id,
            addedFiles: [],
            deletedFiles: [asiakirja.id]
          })
        } else {
          tjaksoAsiakirjat[0].deletedFiles.push(asiakirja.id)
        }
        tyoskentelyjakso.asiakirjat = tyoskentelyjakso.asiakirjat?.filter(
          (a) => a.nimi !== asiakirja.nimi
        )
      } else {
        tjaksoAsiakirjat[0].addedFiles = tjaksoAsiakirjat[0].addedFiles.filter(
          (file) => file.name !== asiakirja.nimi
        )
        tyoskentelyjakso.asiakirjat = tyoskentelyjakso.asiakirjat?.filter(
          (a) => a.nimi !== asiakirja.nimi
        )
      }
      this.$emit('skipRouteExitConfirm', false)
    }

    onLaillistamispaivaFilesAdded(files: File[]) {
      this.form.laillistamispaivanLiite = files[0]
      this.laillistamispaivaAsiakirjat.push(...mapFiles(files))
    }

    async onDeleteLaillistamispaivanLiite() {
      this.form.laillistamispaivanLiite = null
      this.laillistamispaivaAsiakirjat = []
      this.$emit('skipRouteExitConfirm', false)
    }

    async onDownloadLaillistamistodistus() {
      if (this.hyvaksynta?.laillistamispaivanLiite != null) {
        const data = Uint8Array.from(atob(this.hyvaksynta?.laillistamispaivanLiite), (c) =>
          c.charCodeAt(0)
        )
        saveBlob(
          this.hyvaksynta?.laillistamispaivanLiitteenNimi || '',
          data,
          this.hyvaksynta?.laillistamispaivanLiitteenTyyppi || ''
        )
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '~@/styles/variables';
  @import '~bootstrap/scss/mixins/breakpoints';

  .terveyskeskuskoulutusjakso {
    max-width: 1024px;
  }

  .datepicker-range::before {
    content: '–';
    position: absolute;
    left: -1rem;
    padding: 0 0.75rem;
    @include media-breakpoint-down(sm) {
      display: none;
    }
  }

  .tyoskentelyjaksot-link::before {
    content: '<';
    position: absolute;
    left: 1rem;
  }
</style>
