<template>
  <b-form v-if="hyvaksynta != null" @submit.stop.prevent="onSubmit">
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
          <td class="erikoistuja-details-padding">
            {{ $duration(hyvaksynta.terveyskeskuskoulutusjaksonKesto) }}
          </td>
        </tr>
        <tr
          v-if="hyvaksynta.laillistamispaiva != null && hyvaksynta.laillistamispaivanLiite != null"
        >
          <th scope="row" class="align-middle font-weight-500">
            {{ $t('laillistamispaiva') }}
          </th>
          <td class="erikoistuja-details-padding">
            {{ $date(hyvaksynta.laillistamispaiva) }} -
            <elsa-button variant="link" @click="onDownloadLaillistamistodistus" class="pl-0">
              {{ hyvaksynta.laillistamispaivanLiitteenNimi }}
            </elsa-button>
          </td>
        </tr>
        <tr v-if="!$isErikoistuva() && hyvaksynta.asetus != null">
          <th scope="row" class="align-middle font-weight-500">
            {{ $t('asetus') }}
          </th>
          <td class="erikoistuja-details-padding">
            {{ hyvaksynta.asetus }}
          </td>
        </tr>
      </table>
    </div>
    <hr />
    <div
      v-if="
        editable &&
        $isErikoistuva() &&
        (hyvaksynta.laillistamispaiva == null || hyvaksynta.laillistamispaivanLiite == null)
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
            {{ sp.tyoskentelypaikka.kunta ? sp.tyoskentelypaikka.kunta.abbreviation : '' }}
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
            {{ sp.kaytannonKoulutus ? displayKaytannonKoulutus(sp.kaytannonKoulutus) : '' }}
            {{ sp.omaaErikoisalaaTukeva ? ': ' + sp.omaaErikoisalaaTukeva.nimi : '' }}
          </p>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <elsa-form-group :label="$t('liitetiedostot')" :required="true">
            <div v-if="editable && $isErikoistuva()">
              <span>
                {{ $t('lisaa-tyoskentelyjaksoon-tyojakoulutustodistus') }}
              </span>
              <asiakirjat-upload
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
              :enable-delete="editable && $isErikoistuva()"
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
        <h3>{{ $t('yleislaaketieteen-vastuuhenkilo') }}</h3>
        <h5>{{ $t('erikoisala-vastuuhenkilö-label') }}</h5>
        <p>
          {{ hyvaksynta.yleislaaketieteenVastuuhenkilonNimi }}
          {{
            hyvaksynta.yleislaaketieteenVastuuhenkilonNimike
              ? ', ' + hyvaksynta.yleislaaketieteenVastuuhenkilonNimike
              : ''
          }}
        </p>
      </b-col>
    </b-row>
    <hr />
    <div v-if="showVirkailijaKuittaus">
      <b-row>
        <b-col>
          <h3>{{ $t('tarkistanut') }}</h3>
        </b-col>
      </b-row>
      <b-row>
        <b-col lg="4">
          <h5>{{ $t('paivays') }}</h5>
          <p>{{ $date(hyvaksynta.virkailijanKuittausaika) }}</p>
        </b-col>
        <b-col lg="4">
          <h5>{{ $t('nimi-ja-nimike') }}</h5>
          <p>
            {{ hyvaksynta.virkailijanNimi + ' '
            }}{{ hyvaksynta.virkailijanNimike ? ', ' + hyvaksynta.virkailijanNimike : '' }}
          </p>
        </b-col>
      </b-row>
      <hr />
    </div>
    <div v-if="showVastuuhenkiloKuittaus">
      <b-row>
        <b-col>
          <h3>{{ $t('hyvaksynyt') }}</h3>
        </b-col>
      </b-row>
      <b-row>
        <b-col lg="4">
          <h5>{{ $t('paivays') }}</h5>
          <p>{{ $date(hyvaksynta.vastuuhenkilonKuittausaika) }}</p>
        </b-col>
        <b-col lg="4">
          <h5>{{ $t('nimi-ja-nimike') }}</h5>
          <p>
            {{ hyvaksynta.vastuuhenkilonNimi + ' '
            }}{{ hyvaksynta.vastuuhenkilonNimike ? ', ' + hyvaksynta.vastuuhenkilonNimike : '' }}
          </p>
        </b-col>
      </b-row>
      <hr />
    </div>
    <div v-if="editable" class="d-flex flex-row-reverse flex-wrap">
      <elsa-button
        v-if="$isErikoistuva()"
        :loading="params.saving"
        variant="primary"
        class="ml-2"
        @click="onValidateAndConfirm('confirm-erikoistuja')"
      >
        {{ $t('laheta') }}
      </elsa-button>
      <elsa-button
        v-if="$isVirkailija()"
        :loading="params.saving"
        variant="primary"
        class="ml-3"
        @click="onValidateAndConfirm('confirm-virkailija')"
      >
        {{ $t('hyvaksy-laheta') }}
      </elsa-button>
      <elsa-button
        v-if="$isVastuuhenkilo()"
        :loading="params.saving"
        variant="primary"
        class="ml-3"
        @click="onValidateAndConfirm('confirm-vastuuhenkilo')"
      >
        {{ $t('hyvaksy') }}
      </elsa-button>
      <elsa-button
        v-if="!$isErikoistuva()"
        variant="outline-primary"
        v-b-modal.return-to-sender
        class="ml-2"
      >
        {{ $t('palauta-muokattavaksi') }}
      </elsa-button>
      <elsa-button variant="back" @click.stop.prevent="onCancel" class="font-weight-500">
        {{ $t('peruuta') }}
      </elsa-button>
    </div>
    <div class="row" v-if="editable">
      <elsa-form-error :active="this.$v.$anyError" />
    </div>
    <elsa-confirmation-modal
      id="confirm-erikoistuja"
      :title="$t('vahvista-lomakkeen-lahetys')"
      :text="$t('lahetyksen-jalkeen-virkailijan-tarkistus')"
      :submitText="$t('laheta')"
      @submit="onSubmit"
    />
    <elsa-confirmation-modal
      id="confirm-virkailija"
      :title="$t('vahvista-lomakkeen-lahetys')"
      :text="$t('lahetyksen-jalkeen-vastuuhenkilo-hyvaksynta')"
      :submitText="$t('hyvaksy-laheta')"
      @submit="onSubmit"
    >
      <template #modal-content>
        <elsa-form-group :label="$t('lisatiedot-vastuuhenkilolle')">
          <template v-slot="{ uid }">
            <b-form-textarea
              :id="uid"
              v-model="hyvaksynta.lisatiedotVirkailijalta"
              rows="7"
            ></b-form-textarea>
          </template>
        </elsa-form-group>
      </template>
    </elsa-confirmation-modal>
    <elsa-confirmation-modal
      id="confirm-vastuuhenkilo"
      :title="$t('vahvista-lomakkeen-lahetys')"
      :text="$t('vahvistuksen-jalkeen-terveyskeskuskoulutusjakso-hyvaksytty')"
      :submitText="$t('laheta')"
      @submit="onSubmit"
    />
    <elsa-return-to-sender-modal
      id="return-to-sender"
      :title="$t('palauta-erikoistuvalle-muokattavaksi')"
      @submit="returnToSender"
    />
  </b-form>
</template>

<script lang="ts">
  import Component from 'vue-class-component'
  import { Mixins, Prop } from 'vue-property-decorator'
  import { Validation, validationMixin } from 'vuelidate'
  import { required, requiredIf, minLength } from 'vuelidate/lib/validators'

  import AsiakirjatContent from '@/components/asiakirjat/asiakirjat-content.vue'
  import AsiakirjatUpload from '@/components/asiakirjat/asiakirjat-upload.vue'
  import ElsaButton from '@/components/button/button.vue'
  import ElsaFormDatepicker from '@/components/datepicker/datepicker.vue'
  import ErikoistuvaDetails from '@/components/erikoistuva-details/erikoistuva-details.vue'
  import ElsaFormError from '@/components/form-error/form-error.vue'
  import ElsaFormGroup from '@/components/form-group/form-group.vue'
  import ElsaConfirmationModal from '@/components/modal/confirmation-modal.vue'
  import ElsaReturnToSenderModal from '@/components/modal/return-to-sender-modal.vue'
  import ElsaPoissaolotDisplay from '@/components/poissaolot-display/poissaolot-display.vue'
  import {
    Asiakirja,
    TerveyskeskuskoulutusjaksonHyvaksyminen,
    TerveyskeskuskoulutusjaksonHyvaksyntaForm,
    Tyoskentelyjakso
  } from '@/types'
  import { saveBlob } from '@/utils/blobs'
  import {
    KaytannonKoulutusTyyppi,
    TerveyskeskuskoulutusjaksonTila,
    TyoskentelyjaksoTyyppi
  } from '@/utils/constants'
  import { mapFile, mapFiles } from '@/utils/fileMapper'
  import {
    tyoskentelyjaksoKaytannonKoulutusLabel,
    tyoskentelypaikkaTyyppiLabel
  } from '@/utils/tyoskentelyjakso'

  @Component({
    components: {
      AsiakirjatContent,
      AsiakirjatUpload,
      ElsaConfirmationModal,
      ElsaButton,
      ElsaFormDatepicker,
      ElsaFormError,
      ElsaFormGroup,
      ElsaReturnToSenderModal,
      ElsaPoissaolotDisplay,
      ErikoistuvaDetails
    }
  })
  export default class TerveyskeskuskoulutusjaksoForm extends Mixins(validationMixin) {
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

    @Prop({ required: false, default: null })
    hyvaksynta!: TerveyskeskuskoulutusjaksonHyvaksyminen | null

    @Prop({ required: false, default: () => [] })
    reservedAsiakirjaNimetMutable!: string[] | undefined

    @Prop({ required: false, default: false })
    editable!: boolean

    form: TerveyskeskuskoulutusjaksonHyvaksyntaForm = {
      laillistamispaiva: null,
      laillistamispaivanLiite: null,
      tyoskentelyjaksoAsiakirjat: []
    }

    laillistamispaivaAsiakirjat: Asiakirja[] = []

    params = {
      saving: false
    }

    async mounted() {
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
      if (this.hyvaksynta?.laillistamispaiva) {
        this.form.laillistamispaiva = this.hyvaksynta?.laillistamispaiva
      }
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

    get showVirkailijaKuittaus() {
      return (
        this.hyvaksynta?.tila ===
          TerveyskeskuskoulutusjaksonTila.ODOTTAA_VASTUUHENKILON_HYVAKSYNTAA ||
        this.hyvaksynta?.tila === TerveyskeskuskoulutusjaksonTila.HYVAKSYTTY
      )
    }

    get showVastuuhenkiloKuittaus() {
      return this.hyvaksynta?.tila === TerveyskeskuskoulutusjaksonTila.HYVAKSYTTY
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

    onValidateAndConfirm(modalId: string) {
      return this.$bvModal.show(modalId)
    }

    onSubmit() {
      const validations = [
        this.validateForm(),
        this.$refs.laillistamispaiva ? this.$refs.laillistamispaiva.validateForm() : true
      ]

      if (validations.includes(false) || this.hyvaksynta == null) {
        return
      }
      this.params.saving = true

      const submitData = {
        hyvaksynta: this.hyvaksynta,
        form: this.form
      }

      this.$emit('submit', submitData, this.params)
    }

    onCancel() {
      this.$emit('cancel')
    }

    returnToSender(korjausehdotus: string) {
      if (this.hyvaksynta != null) {
        this.hyvaksynta.korjausehdotus = korjausehdotus
      }
      this.$emit(
        'submit',
        {
          hyvaksynta: this.hyvaksynta
        },
        this.params
      )
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

  .datepicker-range::before {
    content: '–';
    position: absolute;
    left: -1rem;
    padding: 0 0.75rem;
    @include media-breakpoint-down(sm) {
      display: none;
    }
  }

  .erikoistuja-details-padding {
    padding-left: 1.7rem;
  }
</style>
