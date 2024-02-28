<template>
  <div class="omat-tiedot mb-4">
    <div v-if="!editing">
      <div class="flex-fill">
        <elsa-form-group
          :label="$t('laillistamispaiva')"
          label-cols-md="4"
          label-cols-xl="4"
          label-cols="12"
          class="align-items-center mb-md-0"
        >
          <div v-if="form.laillistamispaiva">
            {{ $date(form.laillistamispaiva) }} -
            <elsa-button variant="link" class="pl-0" @click="onDownloadLaillistamistodistus">
              {{ laillistamistodistusNimi }}
            </elsa-button>
          </div>
        </elsa-form-group>
      </div>
    </div>
    <div v-else>
      <b-form @submit.stop.prevent="onSubmit">
        <hr />
        <elsa-form-group class="col-xs-12 col-sm-3 pl-0" :label="$t('laillistamispaiva')">
          <template #default="{ uid }">
            <elsa-form-datepicker
              :id="uid"
              ref="laillistamispaiva"
              :value.sync="form.laillistamispaiva"
              @input="$emit('skipRouteExitConfirm', false)"
            ></elsa-form-datepicker>
          </template>
        </elsa-form-group>
        <elsa-form-group :label="$t('laillistamispaivan-liitetiedosto')" :required="true">
          <span>
            {{ $t('lisaa-liite-joka-todistaa-laillistamispaivan') }}
          </span>
          <asiakirjat-upload
            class="mt-3"
            :is-primary-button="false"
            :allow-multiples-files="false"
            :button-text="$t('lisaa-liitetiedosto')"
            :disabled="laillistamispaivaAsiakirjat.length > 0"
            @selectedFiles="onLaillistamispaivaFilesAdded"
          />
          <div v-if="laillistamispaivaAsiakirjat.length > 0">
            <asiakirjat-content
              :asiakirjat="laillistamispaivaAsiakirjat"
              :sorting-enabled="false"
              :pagination-enabled="false"
              :enable-search="false"
              :enable-delete="true"
              :enable-lisatty="false"
              :no-results-info-text="$t('ei-liitetiedostoja')"
              @deleteAsiakirja="onDeleteLaillistamispaivanLiite"
            />
          </div>
          <div v-else>
            <b-alert variant="dark" class="mt-3" show>
              <font-awesome-icon icon="info-circle" fixed-width class="text-muted" />
              <span>
                {{ $t('ei-asiakirjoja') }}
              </span>
            </b-alert>
          </div>
        </elsa-form-group>
        <hr />
        <div class="text-right">
          <elsa-button variant="back" @click="onCancel">
            {{ $t('peruuta') }}
          </elsa-button>
          <elsa-button :loading="params.saving" type="submit" variant="primary" class="ml-2">
            {{ $t('tallenna') }}
          </elsa-button>
        </div>
        <div class="row">
          <elsa-form-error :active="$v.$anyError" />
        </div>
      </b-form>
    </div>
  </div>
</template>

<script lang="ts">
  import axios, { AxiosError } from 'axios'
  import Avatar from 'vue-avatar'
  import { Component, Vue, Prop } from 'vue-property-decorator'
  import { required } from 'vuelidate/lib/validators'

  import AsiakirjatContent from '@/components/asiakirjat/asiakirjat-content.vue'
  import AsiakirjatUpload from '@/components/asiakirjat/asiakirjat-upload.vue'
  import ElsaButton from '@/components/button/button.vue'
  import ElsaFormDatepicker from '@/components/datepicker/datepicker.vue'
  import ElsaFormError from '@/components/form-error/form-error.vue'
  import ElsaFormGroup from '@/components/form-group/form-group.vue'
  import store from '@/store'
  import {
    OmatTiedotLomakeErikoistuja,
    ElsaError,
    Laillistamistiedot,
    Asiakirja,
    Opintooikeus
  } from '@/types'
  import { saveBlob } from '@/utils/blobs'
  import { confirmExit } from '@/utils/confirm'
  import { phoneNumber } from '@/utils/constants'
  import { mapFile, mapFiles } from '@/utils/fileMapper'
  import { getTitleFromAuthorities } from '@/utils/functions'
  import { sortByDesc } from '@/utils/sort'
  import { toastFail, toastSuccess } from '@/utils/toast'

  @Component({
    components: {
      Avatar,
      AsiakirjatContent,
      AsiakirjatUpload,
      ElsaFormDatepicker,
      ElsaButton,
      ElsaFormError,
      ElsaFormGroup
    },
    validations: {
      form: {
        email: {
          required
        },
        phoneNumber: {
          phoneNumber
        }
      }
    }
  })
  export default class Laillistamispaiva extends Vue {
    @Prop({ required: false, default: false })
    editing!: boolean

    $refs!: {
      laillistamispaiva: ElsaFormDatepicker
      avatarFileInput: HTMLInputElement
    }

    form: OmatTiedotLomakeErikoistuja = {
      email: null,
      phoneNumber: null,
      avatar: null,
      avatarUpdated: false,
      laillistamispaiva: null,
      laillistamispaivanLiite: null
    }

    laillistamispaivaAsiakirjat: Asiakirja[] = []

    params = {
      saving: false
    }

    async mounted() {
      try {
        const laillistamistiedot: Laillistamistiedot = (
          await axios.get('/erikoistuva-laakari/laillistamispaiva')
        ).data
        this.form.laillistamispaiva = laillistamistiedot.laillistamispaiva

        if (laillistamistiedot.laillistamistodistus) {
          const data = Uint8Array.from(atob(laillistamistiedot.laillistamistodistus), (c) =>
            c.charCodeAt(0)
          )
          this.laillistamispaivaAsiakirjat.push(
            mapFile(
              new File([data], laillistamistiedot.laillistamistodistusNimi || '', {
                type: laillistamistiedot.laillistamistodistusTyyppi || ''
              })
            )
          )
        }
      } catch {
        toastFail(this, this.$t('laillistamispaivan-hakeminen-epaonnistui'))
      }
      this.form = this.initForm()
    }

    selectAvatar() {
      this.$refs.avatarFileInput.click()
    }

    removeAvatar() {
      this.form.avatar = null
      this.form.avatarUpdated = true
      this.$refs.avatarFileInput.value = ''
    }

    avatarChange(e: Event) {
      const inputElement = e.target as HTMLInputElement
      if (inputElement.files && inputElement.files?.length > 0) {
        const file = inputElement.files[0]
        this.form.avatar = file
        this.form.avatarUpdated = true
      }
    }

    async onDownloadLaillistamistodistus() {
      if (this.laillistamispaivaAsiakirjat.length > 0) {
        const file = this.laillistamispaivaAsiakirjat[0]
        const data = await file.data
        if (data) {
          saveBlob(file.nimi, data, file.contentType || '')
        }
      }
    }

    onLaillistamispaivaFilesAdded(files: File[]) {
      this.form.laillistamispaivanLiite = files[0]
      this.laillistamispaivaAsiakirjat.push(...mapFiles(files))
    }

    async onDeleteLaillistamispaivanLiite() {
      this.form.laillistamispaivanLiite = null
      this.laillistamispaivaAsiakirjat = []
    }

    initForm(): OmatTiedotLomakeErikoistuja {
      return {
        email: this.account?.email || null,
        phoneNumber: this.account?.phoneNumber || null,
        avatar: this.account?.avatar || null,
        avatarUpdated: false,
        laillistamispaiva: this.form.laillistamispaiva
      }
    }

    validateState(name: string) {
      const { $dirty, $error } = this.$v.form[name] as any
      return $dirty ? ($error ? false : null) : null
    }

    validateForm(): boolean {
      this.$v.form.$touch()
      return !this.$v.$anyError
    }

    async onSubmit() {
      const validations = [
        this.validateForm(),
        this.$refs.laillistamispaiva ? this.$refs.laillistamispaiva.validateForm() : true
      ]

      if (validations.includes(false)) {
        return
      }

      try {
        this.params.saving = true
        if (
          this.form.laillistamispaivanLiite == null &&
          this.laillistamispaivaAsiakirjat.length > 0
        ) {
          const file = this.laillistamispaivaAsiakirjat[0]
          const data = await file.data
          if (data) {
            this.form.laillistamispaivanLiite = new File([data], file.nimi || '', {
              type: file.contentType || ''
            })
          }
        }

        await store.dispatch(
          'auth/putErikoistuvaLaakari',
          // Ohitetaan olemassa olevan avatarin lähettäminen
          !this.form.avatar?.name
            ? {
                ...this.form,
                avatar: null
              }
            : this.form
        )
        toastSuccess(this, this.$t('omat-tiedot-paivitetty'))
        this.$v.form.$reset()
        this.form = this.initForm()
        this.$emit('change', false)
      } catch (err) {
        const axiosError = err as AxiosError<ElsaError>
        const message = axiosError?.response?.data?.message
        toastFail(
          this,
          message
            ? `${this.$t('omien-tietojen-paivittaminen-epaonnistui')}: ${this.$t(message)}`
            : this.$t('omien-tietojen-paivittaminen-epaonnistui')
        )
      } finally {
        this.params.saving = false
      }
    }

    async onCancel() {
      if (await confirmExit(this)) {
        this.form = this.initForm()
        this.$v.form.$reset()
        this.$emit('change', false)
      }
    }

    get previewSrc() {
      if (this.form.avatar && this.form.avatar.name) {
        return URL.createObjectURL(this.form.avatar)
      } else if (this.form.avatar) {
        return `data:image/jpeg;base64,${this.account.avatar}`
      }
      return undefined
    }

    get account() {
      return store.getters['auth/account']
    }

    get displayName() {
      if (this.account) {
        return `${this.account.firstName} ${this.account.lastName}`
      }
      return ''
    }

    get syntymaaika() {
      if (this.account) {
        return this.$date(this.account.erikoistuvaLaakari.syntymaaika)
      }
      return ''
    }

    get avatarSrc() {
      if (this.account) {
        return `data:image/jpeg;base64,${this.account.avatar}`
      }
      return undefined
    }

    get activeAuthority() {
      if (this.account) {
        return this.account.activeAuthority
      }
      return ''
    }

    get title() {
      return getTitleFromAuthorities(this, this.activeAuthority, this.$isYekKoulutettava())
    }

    get avatar() {
      if (this.account) {
        return this.account.avatar
      }
      return null
    }

    get laillistamistodistusNimi() {
      if (this.laillistamispaivaAsiakirjat.length > 0) {
        return this.laillistamispaivaAsiakirjat[0].nimi
      }
      return null
    }

    get opintooikeudet() {
      return this.account.erikoistuvaLaakari.opintooikeudet.sort(
        (a: Opintooikeus, b: Opintooikeus) =>
          sortByDesc(a.opintooikeudenMyontamispaiva, b.opintooikeudenMyontamispaiva)
      )
    }
  }
</script>
