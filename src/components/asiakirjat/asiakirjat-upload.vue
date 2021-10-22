<template>
  <div>
    <input
      id="file-upload"
      type="file"
      @change="handleFileChange"
      :disabled="uploading || disabled"
      multiple
      hidden
    />
    <label
      class="user-select-none"
      :class="[isPrimaryButton ? 'primary mb-4' : 'outline-primary mb-4']"
      for="file-upload"
      :disabled="uploading || disabled"
      v-on="$listeners"
    >
      <span>{{ buttonText }}</span>
      <b-spinner v-if="uploading" small class="ml-2"></b-spinner>
    </label>
    <b-alert variant="danger" :show="hasErrors" @dismissed="onDismissAlert" dismissible>
      <div class="d-flex flex-row">
        <em class="align-middle">
          <font-awesome-icon :icon="['fas', 'exclamation-circle']" class="mr-2" />
        </em>
        <div v-if="this.filesToUploadCount === 1">
          <h4>
            {{ $t('asiakirjan-tallentaminen-epaonnistui') }}
          </h4>
          <ul>
            <li v-if="duplicateFilesForCurrentView.length > 0">
              {{ $t('asiakirja-samanniminen-tiedosto') }}
            </li>
            <li v-if="duplicateFilesForOtherViews.length > 0">
              {{ $t('asiakirja-samanniminen-tiedosto-toisessa-nakymassa') }}
            </li>
            <li v-if="filesOfWrongType.length > 0">
              {{ $t('sallitut-tiedostoformaatit') }}
            </li>
            <li v-if="filesExceedingMaxSize.length > 0">
              {{ $t('asiakirjan-maksimi-tiedostokoko-ylitetty') }}
            </li>
          </ul>
        </div>
        <div v-else>
          <h4>
            {{ $t('asiakirjojen-tallentaminen-epaonnistui') }}
          </h4>
          <div class="mb-3">{{ $t('yhtakaan-tiedostoa-ei-tallennettu') }}</div>
          <div class="mb-2" v-if="maxFilesTotalSizeExceeded">
            {{ $t('asiakirjojen-yhteenlaskettu-koko-ylitetty') }}
          </div>
          <span v-if="duplicateFilesForCurrentView.length > 0">
            {{ $t('asiakirja-samanniminen-tiedosto') }}
            <ul>
              <li v-for="(file, index) in duplicateFilesForCurrentView" :key="index">
                {{ file.name }}
              </li>
            </ul>
          </span>
          <span v-if="duplicateFilesForOtherViews.length > 0">
            {{ $t('asiakirja-samanniminen-tiedosto-toisessa-nakymassa') }}
            <ul>
              <li v-for="(file, index) in duplicateFilesForOtherViews" :key="index">
                {{ file.name }}
              </li>
            </ul>
          </span>
          <span v-if="filesOfWrongType.length > 0">
            {{ $t('sallitut-tiedostoformaatit') }}
            <ul>
              <li v-for="(file, index) in filesOfWrongType" :key="index">
                {{ file.name }}
              </li>
            </ul>
          </span>
          <span v-if="filesExceedingMaxSize.length > 0">
            {{ $t('asiakirjan-maksimi-tiedostokoko-ylitetty') }}
            <ul>
              <li v-for="(file, index) in filesExceedingMaxSize" :key="index">
                {{ file.name }}
              </li>
            </ul>
          </span>
        </div>
      </div>
    </b-alert>
  </div>
</template>

<script lang="ts">
  import { Vue, Component, Prop } from 'vue-property-decorator'
  // Maksimi tiedostokoko 20 Mt
  const maxFileSize = 20 * 1024 * 1024
  const maxFilesTotalSize = 100 * 1024 * 1024

  @Component
  export default class AsiakirjatUpload extends Vue {
    private maxFilesTotalSizeExceeded = false
    private filesExceedingMaxSize: File[] = []
    private filesOfWrongType: File[] = []
    private duplicateFilesForCurrentView: File[] = []
    private duplicateFilesForOtherViews: File[] = []
    private filesToUploadCount = 0

    @Prop({ required: false })
    uploading?: boolean

    @Prop({ required: false, type: Boolean, default: true })
    isPrimaryButton!: boolean

    @Prop({ required: true, type: String })
    buttonText!: string

    @Prop({ required: true })
    existingFileNamesForCurrentView?: string[]

    @Prop({ required: false })
    existingFileNamesForOtherViews?: string[]

    @Prop({ required: false, type: Boolean, default: false })
    disabled!: boolean

    handleFileChange(e: Event) {
      const inputElement = e.target as HTMLInputElement
      const fileArray = [...(inputElement?.files ?? [])]
      this.filesToUploadCount = fileArray.length
      // Chromea varten. Muutoin heti perään valittu sama tiedosto ei laukaise koko eventtiä.
      inputElement.value = ''
      this.maxFilesTotalSizeExceeded = this.getIsTotalFileSizeExceeded(fileArray)
      this.filesExceedingMaxSize = this.getfilesExceedingMaxSize(fileArray)
      this.filesOfWrongType = this.getfilesOfWrongType(fileArray)
      this.duplicateFilesForCurrentView = this.getduplicateFilesForCurrentView(fileArray)
      this.duplicateFilesForOtherViews = this.getduplicateFilesForOtherViews(fileArray)

      if (!this.hasErrors) {
        this.filesToUploadCount = 0
        this.$emit('selectedFiles', fileArray)
      }
    }

    getIsTotalFileSizeExceeded(files: File[]): boolean {
      return files.reduce((sum: number, current: File) => sum + current.size, 0) > maxFilesTotalSize
    }

    getfilesExceedingMaxSize(files: File[]): File[] {
      return files.filter((file) => file.size > maxFileSize)
    }

    getfilesOfWrongType(files: File[]): File[] {
      return files.filter(
        (file) =>
          file.type !== 'application/pdf' &&
          file.type !== 'image/jpg' &&
          file.type !== 'image/jpeg' &&
          file.type !== 'image/png'
      )
    }

    getduplicateFilesForCurrentView(files: File[]): File[] {
      return files.filter((file) => this.existingFileNamesForCurrentView?.includes(file.name))
    }

    getduplicateFilesForOtherViews(files: File[]): File[] {
      return files.filter((file) => this.existingFileNamesForOtherViews?.includes(file.name))
    }

    onDismissAlert() {
      this.maxFilesTotalSizeExceeded = false
      this.filesExceedingMaxSize = []
      this.filesOfWrongType = []
      this.duplicateFilesForCurrentView = []
      this.duplicateFilesForOtherViews = []
    }

    get hasErrors() {
      return (
        this.maxFilesTotalSizeExceeded ||
        this.filesExceedingMaxSize.length > 0 ||
        this.filesOfWrongType.length > 0 ||
        this.duplicateFilesForCurrentView.length > 0 ||
        this.duplicateFilesForOtherViews.length > 0
      )
    }
  }
</script>

<style lang="scss" scoped>
  @import '~@/styles/variables';

  label {
    display: inline-block;
    font-weight: 500;
    padding: 0.375rem 1.625rem;
    border-radius: 50rem;
    &[disabled] {
      opacity: 0.6;
    }
    &.primary {
      color: $white;
      background-color: $primary;
      border: 2px solid transparent;
      &:hover,
      &:active {
        &:not([disabled]) {
          background-color: darken($primary, 15);
          cursor: pointer;
        }
      }
    }
    &.outline-primary {
      color: $primary;
      background-color: transparent;
      border: 2px solid $primary;
      &:hover,
      &:active {
        &:not([disabled]) {
          color: $btn-primary-hover-background-color;
          border-color: $btn-primary-hover-border-color;
          cursor: pointer;
        }
      }
    }
  }
</style>
