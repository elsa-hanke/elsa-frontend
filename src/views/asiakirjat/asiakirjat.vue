<template>
  <div class="asiakirjat">
    <b-breadcrumb :items="items" class="mb-0" />
    <b-container fluid>
      <b-row lg>
        <b-col>
          <h1>{{ $t('asiakirjat') }}</h1>
          <p>{{ $t('asiakirjat-kuvaus') }}</p>
          <asiakirjat-upload
            :buttonText="$t('lisaa-asiakirja')"
            :uploading="uploading"
            :existingFileNamesForCurrentView="existingFileNames"
            @selectedFiles="onAsiakirjatAdded"
          >
            {{ $t('lisaa-asiakirja') }}
          </asiakirjat-upload>
          <asiakirjat-content
            :asiakirjat="asiakirjat"
            :loading="loading"
            :sortBy="sortBy"
            @deleteAsiakirja="onDeleteAsiakirja"
          />
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script lang="ts">
  import axios from 'axios'
  import { Component, Vue } from 'vue-property-decorator'

  import AsiakirjatContent from '@/components/asiakirjat/asiakirjat-content.vue'
  import AsiakirjatUpload from '@/components/asiakirjat/asiakirjat-upload.vue'
  import { Asiakirja } from '@/types'
  import { confirmDelete } from '@/utils/confirm'
  import { toastSuccess, toastFail } from '@/utils/toast'

  @Component({
    components: {
      AsiakirjatContent,
      AsiakirjatUpload
    }
  })
  export default class Asiakirjat extends Vue {
    private endpointUrl = 'erikoistuva-laakari/asiakirjat/'
    private asiakirjat: Asiakirja[] = []
    private loading = false
    private uploading = false
    private sortBy = 'lisattypvm'
    private items = [
      {
        text: this.$t('etusivu'),
        to: { name: 'etusivu' }
      },
      {
        text: this.$t('asiakirjat'),
        active: true
      }
    ]

    async mounted() {
      await this.fetch()
    }

    async fetch() {
      try {
        this.loading = true
        this.asiakirjat = (await axios.get(this.endpointUrl)).data
      } catch {
        this.$t('asiakirjojen-haku-epaonnistui')
      }
      this.loading = false
    }

    async onAsiakirjatAdded(files: File[]) {
      this.uploading = true

      const formData = new FormData()
      files.forEach((file) => formData.append('files', file, file.name))

      try {
        const asiakirjat = (
          await axios.post(this.endpointUrl, formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            },
            timeout: 120000
          })
        ).data
        this.asiakirjat = [...asiakirjat, ...this.asiakirjat]
      } catch (err) {
        toastFail(
          this,
          files.length > 1
            ? this.$t('asiakirjojen-tallentaminen-epaonnistui')
            : this.$t('asiakirjan-tallentaminen-epaonnistui')
        )
        this.uploading = false
        return
      }

      toastSuccess(
        this,
        files.length > 1
          ? this.$t('asiakirjojen-tallentaminen-onnistui')
          : this.$t('asiakirjan-tallentaminen-onnistui')
      )

      this.uploading = false
    }

    async onDeleteAsiakirja(asiakirja: Asiakirja) {
      if (
        await confirmDelete(
          this,
          this.$t('poista-asiakirja') as string,
          (this.$t('asiakirjan') as string).toLowerCase()
        )
      ) {
        Vue.set(asiakirja, 'disableDelete', true)
        try {
          await axios.delete(this.endpointUrl + asiakirja.id)
          toastSuccess(this, this.$t('asiakirjan-poistaminen-onnistui'))
          this.asiakirjat = this.asiakirjat.filter((a) => a.id !== asiakirja.id)
        } catch (err) {
          toastFail(this, this.$t('asiakirjan-poistaminen-epaonnistui'))
        }
        Vue.set(asiakirja, 'disableDelete', false)
      }
    }

    get existingFileNames() {
      return this.asiakirjat.map((asiakirja) => asiakirja.nimi)
    }
  }
</script>

<style lang="scss" scoped>
  .asiakirjat {
    max-width: 1024px;
  }
</style>
