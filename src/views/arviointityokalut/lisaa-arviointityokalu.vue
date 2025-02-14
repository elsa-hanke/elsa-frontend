<template>
  <div class="lisaa-arviointityokalu">
    <b-breadcrumb :items="items" class="mb-0" />
    <b-container fluid>
      <b-form @submit.stop.prevent="onSubmit">
        <b-row lg>
          <b-col>
            <h1>{{ $t('lisaa-arviointityokalu') }}</h1>
            <hr />
            <b-form-row>
              <elsa-form-group
                :label="$t('arviointityokalun-nimi')"
                class="col-sm-12 col-md-12 pr-md-3"
                :required="true"
              >
                <template #default="{ uid }">
                  <b-form-input
                    :id="uid"
                    v-model="form.nimi"
                    :state="validateState('nimi')"
                    @input="$emit('skipRouteExitConfirm', false)"
                  ></b-form-input>
                  <b-form-invalid-feedback :id="`${uid}-feedback`">
                    {{ $t('pakollinen-tieto') }}
                  </b-form-invalid-feedback>
                </template>
              </elsa-form-group>
            </b-form-row>
            <b-form-row>
              <elsa-form-group
                :label="$t('kategoria')"
                class="col-sm-12 col-md-12 pr-md-3"
                :required="false"
              >
                <elsa-form-multiselect
                  v-model="form.kategoriaId"
                  :options="kategoriatFormatted"
                  label="nimi"
                  track-by="id"
                  @input="$emit('skipRouteExitConfirm', false)"
                />
              </elsa-form-group>
            </b-form-row>
            <b-form-row>
              <elsa-form-group
                :label="$t('ohjeteksti-arviointityokalun-kayttoon')"
                class="col-sm-12 col-md-12 pr-md-3"
                :required="false"
              >
                <template #default="{ uid }">
                  <b-form-textarea
                    :id="uid"
                    v-model="form.ohjeteksti"
                    rows="3"
                    @input="$emit('skipRouteExitConfirm', false)"
                  />
                </template>
              </elsa-form-group>
            </b-form-row>
            <b-form-row>
              <elsa-form-group
                :label="$t('arviointityokalu-liitetiedostona')"
                class="col-sm-12 col-md-12 pr-md-3"
                :required="false"
              >
                <span>
                  {{ $t('arviointityokalu-liite-ohje') }}
                </span>
                <asiakirjat-upload
                  class="mt-3"
                  :is-primary-button="false"
                  :allow-multiples-files="false"
                  :button-text="$t('lisaa-liitetiedosto')"
                  :disabled="asiakirjat.length > 0"
                  @selectedFiles="onLiiteFilesAdded"
                />
                <div v-if="asiakirjat.length > 0">
                  <asiakirjat-content
                    :asiakirjat="asiakirjat"
                    :sorting-enabled="false"
                    :pagination-enabled="false"
                    :enable-search="false"
                    :enable-delete="true"
                    :enable-lisatty="false"
                    :no-results-info-text="$t('ei-liitetiedostoja')"
                    @deleteAsiakirja="onDeleteLiite"
                  />
                </div>
              </elsa-form-group>
            </b-form-row>
          </b-col>
        </b-row>
        <hr />
        <h1>{{ $t('kysymykset') }}</h1>
        <div>
          <div v-for="(kysymys, index) in form.kysymykset" :key="index">
            <arviointityokalu-lomake-kysymys-form
              :kysymys="kysymys"
              :child-data-received="childDataReceived"
            />
          </div>
          <elsa-button
            variant="outline-primary"
            class="mb-2"
            @click.stop.prevent="addTekstikenttaKysymys"
          >
            {{ $t('lisaa-tekstikenttakysymys') }}
          </elsa-button>
          <elsa-button
            variant="outline-primary"
            class="ml-2 mb-2"
            @click.stop.prevent="addValintaKysymys"
          >
            {{ $t('lisaa-valintakysymys') }}
          </elsa-button>
        </div>
        <hr />
        <div class="d-flex flex-row-reverse flex-wrap">
          <elsa-button :loading="saving" type="submit" variant="primary" class="ml-2 mb-2">
            {{ $t('tallenna') }}
          </elsa-button>
          <elsa-button
            variant="outline-primary"
            class="ml-2 mb-2"
            @click.stop.prevent="onSaveAsDraft"
          >
            {{ $t('tallenna-luonnoksena') }}
          </elsa-button>
          <elsa-button variant="back" class="mb-2" @click.stop.prevent="onCancel">
            {{ $t('peruuta') }}
          </elsa-button>
        </div>
        <div class="row">
          <elsa-form-error :active="$v.$anyError" />
        </div>
      </b-form>
    </b-container>
  </div>
</template>

<script lang="ts">
  import { AxiosError } from 'axios'
  import { Component, Mixins } from 'vue-property-decorator'
  import { validationMixin } from 'vuelidate'
  import { required } from 'vuelidate/lib/validators'

  import {
    getArviointityokalutKategoriat,
    postArviointityokalutKategoria
  } from '@/api/tekninen-paakayttaja'
  import AsiakirjatContent from '@/components/asiakirjat/asiakirjat-content.vue'
  import AsiakirjatUpload from '@/components/asiakirjat/asiakirjat-upload.vue'
  import ElsaButton from '@/components/button/button.vue'
  import ElsaFormError from '@/components/form-error/form-error.vue'
  import ElsaFormGroup from '@/components/form-group/form-group.vue'
  import ElsaFormMultiselect from '@/components/multiselect/multiselect.vue'
  import ElsaPopover from '@/components/popover/popover.vue'
  import ArviointityokaluLomakeKysymysForm from '@/forms/arviointityokalu-lomake-kysymys-form.vue'
  import TyokertymalaskuriTyoskentelyjaksoPoissaoloForm from '@/forms/tyokertymalaskuri-tyoskentelyjakso-poissaolo-form.vue'
  import ErikoistuvaLaakariForm from '@/forms/uusi-erikoistuva-laakari-form.vue'
  import PaakayttajaForm from '@/forms/uusi-paakayttaja-form.vue'
  import VastuuhenkiloForm from '@/forms/uusi-vastuuhenkilo-form.vue'
  import VirkailijaForm from '@/forms/uusi-virkailija-form.vue'
  import { Arviointityokalu, ArviointityokaluKategoria, Asiakirja, ElsaError } from '@/types'
  import { mapFiles } from '@/utils/fileMapper'
  import { toastFail, toastSuccess } from '@/utils/toast'

  @Component({
    components: {
      ArviointityokaluLomakeKysymysForm,
      TyokertymalaskuriTyoskentelyjaksoPoissaoloForm,
      ElsaFormMultiselect,
      AsiakirjatContent,
      AsiakirjatUpload,
      ElsaPopover,
      ElsaFormError,
      ElsaFormGroup,
      ErikoistuvaLaakariForm,
      VastuuhenkiloForm,
      VirkailijaForm,
      PaakayttajaForm,
      ElsaButton
    },
    validations: {
      form: {
        nimi: {
          required
        }
      }
    }
  })
  export default class LisaaArviointityokalu extends Mixins(validationMixin) {
    items = [
      {
        text: this.$t('etusivu'),
        to: { name: 'etusivu' }
      },
      {
        text: this.$t('arviointityokalut'),
        to: { name: 'arviointityokalut' }
      },
      {
        text: this.$t('lisaa-arviointityokalu'),
        active: true
      }
    ]

    form: Arviointityokalu = {
      nimi: null,
      kategoriaId: -1,
      ohjeteksti: null,
      liite: null,
      kysymykset: [
        {
          id: 0,
          otsikko: 'Tekstikenttä esimerkki',
          tyyppi: 'tekstikenttakysymys',
          pakollinen: true,
          vaihtoehdot: [],
          jarjestysnumero: 0
        },
        {
          id: 1,
          otsikko: 'Valinta esimerkki',
          tyyppi: 'valintakysymys',
          pakollinen: true,
          vaihtoehdot: [
            {
              id: 0,
              teksti: 'Valinta yksi',
              valittu: false
            },
            {
              id: 1,
              teksti: 'Valinta kaksi',
              valittu: false
            },
            {
              id: 2,
              teksti: 'Valinta kolme',
              valittu: false
            }
          ],
          jarjestysnumero: 1
        }
      ]
    }

    asiakirjat: Asiakirja[] = []
    kategoriat: ArviointityokaluKategoria[] = []

    saving = false

    addedFiles: File[] = []
    reservedAsiakirjaNimetMutable: string[] = []
    newAsiakirjatMapped: Asiakirja[] = []
    deletedAsiakirjat: Asiakirja[] = []
    childDataReceived = false

    async onSubmit() {
      const validations = [this.validateForm()]
      if (validations.includes(false)) {
        return
      }

      try {
        await postArviointityokalutKategoria({
          ...this.form
        })
        toastSuccess(this, this.$t('arviointityokalu-kategoria-lisatty'))
        this.$emit('skipRouteExitConfirm', true)
        this.$router.push({
          name: 'arviointityokalut'
        })
      } catch (err) {
        const axiosError = err as AxiosError<ElsaError>
        const message = axiosError?.response?.data?.message
        toastFail(
          this,
          message
            ? `${this.$t('arviointityokalu-kategoria-lisaaminen-epaonnistui')}: ${this.$t(message)}`
            : this.$t('arviointityokalu-kategoria-lisaaminen-epaonnistui')
        )
      }
      this.saving = false
    }

    async onSaveAsDraft() {
      /* */
    }

    addTekstikenttaKysymys() {
      /* */
    }

    addValintaKysymys() {
      /* */
    }

    validateForm(): boolean {
      this.$v.form.$touch()
      return !this.$v.$anyError
    }

    validateState(name: string) {
      const { $dirty, $error } = this.$v.form?.[name] as any
      return $dirty ? ($error ? false : null) : null
    }

    async mounted() {
      this.fetchKategoriat()
      this.childDataReceived = true
    }

    async fetchKategoriat() {
      this.kategoriat = (await getArviointityokalutKategoriat()).data
    }

    get kategoriatFormatted() {
      if (!this.kategoriat || this.kategoriat.length === 0) {
        return [{ id: 0, nimi: this.$t('ei-kategoriaa') }]
      }
      return [{ id: 0, nimi: this.$t('ei-kategoriaa') }, ...this.kategoriat]
    }

    onCancel() {
      this.$router.push({
        name: 'arviointityokalut'
      })
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

    onLiiteFilesAdded(files: File[]) {
      this.form.liite = files[0]
      this.asiakirjat.push(...mapFiles(files))
    }

    async onDeleteLiite() {
      this.form.liite = null
      this.asiakirjat = []
    }
  }
</script>

<style lang="scss" scoped>
  .uusi-kategoria {
    max-width: 768px;
  }
</style>
