<template>
  <div class="lisaa-arviointityokalu">
    <b-breadcrumb :items="items" class="mb-0" />
    <b-container fluid>
      <b-form @submit.stop.prevent="onSubmit">
        <b-row lg>
          <b-col>
            <h1>{{ editing ? $t('muokkaa-arviointityokalua') : $t('lisaa-arviointityokalu') }}</h1>
            <div v-if="loading" class="text-center">
              <b-spinner variant="primary" :label="$t('ladataan')" />
            </div>
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
                  v-model="form.kategoria"
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
          <div ref="sortableContainer">
            <div v-for="(kysymys, index) in form.kysymykset" :key="kysymys.jarjestysnumero">
              <arviointityokalu-lomake-kysymys-luonti-form
                :kysymys="kysymys"
                :child-data-received="childDataReceived"
                :index="index"
                @delete="onDeleteKysymys"
              />
            </div>
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
  // eslint-disable-next-line import/no-named-as-default
  import Sortable, { SortableEvent } from 'sortablejs'
  import { Component, Mixins } from 'vue-property-decorator'
  import { validationMixin } from 'vuelidate'
  import { required } from 'vuelidate/lib/validators'

  import {
    getArviointityokalu,
    getArviointityokalutKategoriat,
    patchArviointityokalu,
    postArviointityokalu
  } from '@/api/tekninen-paakayttaja'
  import AsiakirjatContent from '@/components/asiakirjat/asiakirjat-content.vue'
  import AsiakirjatUpload from '@/components/asiakirjat/asiakirjat-upload.vue'
  import ElsaButton from '@/components/button/button.vue'
  import ElsaFormError from '@/components/form-error/form-error.vue'
  import ElsaFormGroup from '@/components/form-group/form-group.vue'
  import ElsaFormMultiselect from '@/components/multiselect/multiselect.vue'
  import ElsaPopover from '@/components/popover/popover.vue'
  import ArviointityokaluLomakeKysymysLuontiForm from '@/forms/arviointityokalu-lomake-kysymys-luonti-form.vue'
  import TyokertymalaskuriTyoskentelyjaksoPoissaoloForm from '@/forms/tyokertymalaskuri-tyoskentelyjakso-poissaolo-form.vue'
  import ErikoistuvaLaakariForm from '@/forms/uusi-erikoistuva-laakari-form.vue'
  import PaakayttajaForm from '@/forms/uusi-paakayttaja-form.vue'
  import VastuuhenkiloForm from '@/forms/uusi-vastuuhenkilo-form.vue'
  import VirkailijaForm from '@/forms/uusi-virkailija-form.vue'
  import {
    Arviointityokalu,
    ArviointityokaluKategoria,
    ArviointityokaluKysymysVaihtoehto,
    Asiakirja,
    ElsaError
  } from '@/types'
  import { ArviointityokaluKysymysTyyppi } from '@/utils/constants'
  import { mapFiles } from '@/utils/fileMapper'
  import { toastFail, toastSuccess } from '@/utils/toast'

  @Component({
    components: {
      ArviointityokaluLomakeKysymysLuontiForm,
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
    $refs!: {
      sortableContainer: any
    }
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
      kategoria: null,
      ohjeteksti: null,
      liite: null,
      kysymykset: []
    }

    asiakirjat: Asiakirja[] = []
    kategoriat: ArviointityokaluKategoria[] = []
    saving = false
    loading = false
    editing = false
    addedFiles: File[] = []
    newAsiakirjatMapped: Asiakirja[] = []
    deletedAsiakirjat: Asiakirja[] = []
    childDataReceived = false
    sortableInstance: Sortable | null = null

    async onSubmit() {
      const validations = [this.validateForm()]
      if (validations.includes(false)) {
        return
      }

      try {
        if (this.form.liite == null && this.asiakirjat.length > 0) {
          const file = this.asiakirjat[0]
          const data = await file.data
          if (data) {
            this.form.liite = new File([data], file.nimi || '', {
              type: file.contentType || ''
            })
          }
        }

        if (this.editing) {
          await patchArviointityokalu(this.form)
          toastSuccess(this, this.$t('arviointityokalun-muutokset-tallennettu'))
        } else {
          await postArviointityokalu(this.form)
          toastSuccess(this, this.$t('arviointityokalu-lisatty'))
        }
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
            ? `${this.$t('arviointityokalun-lisaaminen-epaonnistui')}: ${this.$t(message)}`
            : this.$t('arviointityokalun-lisaaminen-epaonnistui')
        )
      }
      this.saving = false
    }

    async onSaveAsDraft() {
      toastFail(this, 'Toimintoa ei ole olemassa')
    }

    addTekstikenttaKysymys() {
      this.addKysymys(ArviointityokaluKysymysTyyppi.TEKSTIKENTTAKYSYMYS, [])
    }

    addValintaKysymys() {
      this.addKysymys(ArviointityokaluKysymysTyyppi.VALINTAKYSYMYS, [
        {
          teksti: '',
          valittu: false
        },
        {
          teksti: '',
          valittu: false
        }
      ])
    }

    private addKysymys(
      tyyppi: ArviointityokaluKysymysTyyppi,
      vaihtoehdot: ArviointityokaluKysymysVaihtoehto[]
    ) {
      this.form.kysymykset.push({
        otsikko: '',
        tyyppi: tyyppi,
        pakollinen: false,
        vaihtoehdot: vaihtoehdot,
        jarjestysnumero: this.form.kysymykset.length + 1
      })
    }

    onDeleteKysymys(index: number) {
      const kysymykset = [...this.form.kysymykset]
      kysymykset.splice(index, 1)
      this.form.kysymykset = kysymykset
      toastSuccess(this, this.$t('arviointityokalu-kysymys-poistettu'))
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
      this.loading = true
      await this.fetchKategoriat()
      this.childDataReceived = true
      const arviointityokaluId = Number(this.$route?.params?.arviointityokaluId)
      if (arviointityokaluId > 0) {
        await this.fetchArviointityokalu(arviointityokaluId)
      }
      this.$nextTick(() => {
        if (this.$refs.sortableContainer) {
          this.sortableInstance = Sortable.create(this.$refs.sortableContainer, {
            handle: '.drag-handle',
            animation: 200,
            onEnd: this.updateOrder
          })
        }
      })
      this.loading = false
    }

    async fetchArviointityokalu(arviointityokaluId: number) {
      try {
        this.form = (await getArviointityokalu(arviointityokaluId)).data
        this.editing = true
      } catch (err) {
        toastFail(this, this.$t('arviointityokalun-hakeminen-epaonnistui'))
        this.$router.replace({ name: 'arviointityokalut' })
        this.loading = false
      }
    }

    updateOrder = (event: SortableEvent) => {
      if (event.oldIndex === undefined || event.newIndex === undefined) return
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
