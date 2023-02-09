<template>
  <div>
    <input
      v-if="allowMultiplesFiles"
      :id="uid"
      type="file"
      :disabled="uploading || disabled"
      multiple
      hidden
      @change="handleFileChange"
    />
    <input
      v-else
      :id="uid"
      type="file"
      :disabled="uploading || disabled"
      hidden
      @change="handleFileChange"
    />
    <label
      class="user-select-none"
      :class="[isPrimaryButton ? 'primary mb-4' : 'outline-primary mb-4']"
      :for="uid"
      :disabled="uploading || disabled"
      v-on="$listeners"
    >
      <span>{{ buttonText }}</span>
      <b-spinner v-if="uploading" small class="ml-2"></b-spinner>
    </label>
    <b-alert variant="danger" :show="hasErrors" dismissible @dismissed="onDismissAlert">
      <div class="d-flex flex-row">
        <em class="align-middle">
          <font-awesome-icon :icon="['fas', 'exclamation-circle']" class="mr-2" />
        </em>
        <div v-if="selectedFilesCount === 1">
          <h4>
            {{ $t('asiakirjan-tallentaminen-epaonnistui') }}
          </h4>
          <ul>
            <li v-if="duplicateFilesInCurrentView.length > 0">
              {{ $t('asiakirja-samanniminen-tiedosto') }}
            </li>
            <li v-if="duplicateFilesInOtherViews.length > 0">
              {{ $t('asiakirja-samanniminen-tiedosto-toisessa-nakymassa') }}
            </li>
            <li v-if="filesOfWrongType.length > 0">
              {{
                wrongFileTypeErrorMessage
                  ? wrongFileTypeErrorMessage
                  : $t('sallitut-tiedostoformaatit-default')
              }}
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
          <div v-if="maxFilesTotalSizeExceeded" class="mb-2">
            {{ $t('asiakirjojen-yhteenlaskettu-koko-ylitetty') }}
          </div>
          <span v-if="duplicateFilesInCurrentView.length > 0">
            {{ $t('asiakirja-samanniminen-tiedosto') }}
            <ul>
              <li v-for="(file, index) in duplicateFilesInCurrentView" :key="index">
                {{ file.name }}
              </li>
            </ul>
          </span>
          <span v-if="duplicateFilesInOtherViews.length > 0">
            {{ $t('asiakirja-samanniminen-tiedosto-toisessa-nakymassa') }}
            <ul>
              <li v-for="(file, index) in duplicateFilesInOtherViews" :key="index">
                {{ file.name }}
              </li>
            </ul>
          </span>
          <span v-if="filesOfWrongType.length > 0">
            {{
              wrongFileTypeErrorMessage
                ? wrongFileTypeErrorMessage
                : $t('sallitut-tiedostoformaatit-default')
            }}
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
    maxFilesTotalSizeExceeded = false
    filesExceedingMaxSize: File[] = []
    filesOfWrongType: File[] = []
    duplicateFilesInCurrentView: File[] = []
    duplicateFilesInOtherViews: File[] = []
    selectedFilesCount = 0

    @Prop({ required: false })
    uploading?: boolean

    @Prop({ required: false, type: Boolean, default: true })
    isPrimaryButton!: boolean

    @Prop({ required: true, type: String })
    buttonText!: string

    @Prop({
      required: false,
      default: () => ['application/pdf', 'image/jpg', 'image/jpeg', 'image/png']
    })
    allowedFileTypes!: string[]

    @Prop({ required: false, type: String })
    wrongFileTypeErrorMessage?: string

    @Prop({ required: false, type: Boolean, default: true })
    allowMultiplesFiles!: boolean

    @Prop({ required: false, default: () => [] })
    existingFileNamesInCurrentView!: string[]

    @Prop({ required: false, default: () => [] })
    existingFileNamesInOtherViews!: string[]

    @Prop({ required: false, type: Boolean, default: false })
    disabled!: boolean

    handleFileChange(e: Event) {
      const inputElement = e.target as HTMLInputElement
      const fileArray = [...(inputElement?.files ?? [])]
      this.selectedFilesCount = fileArray.length
      // Chromea varten. Muutoin heti perään valittu sama tiedosto ei laukaise koko eventtiä.
      inputElement.value = ''
      this.maxFilesTotalSizeExceeded = this.getIsTotalFileSizeExceeded(fileArray)
      this.filesExceedingMaxSize = this.getFilesExceedingMaxSize(fileArray)
      this.filesOfWrongType = this.getFilesOfWrongType(fileArray)
      this.duplicateFilesInCurrentView = this.getduplicateFilesInCurrentView(fileArray)
      this.duplicateFilesInOtherViews = this.getduplicateFilesInOtherViews(fileArray)

      if (!this.hasErrors) {
        this.selectedFilesCount = 0
        this.$emit('selectedFiles', fileArray)
      }
    }

    getIsTotalFileSizeExceeded(files: File[]): boolean {
      return files.reduce((sum: number, current: File) => sum + current.size, 0) > maxFilesTotalSize
    }

    getFilesExceedingMaxSize(files: File[]): File[] {
      return files.filter((file) => file.size > maxFileSize)
    }

    getFilesOfWrongType(files: File[]): File[] {
      return files.filter((file) => !this.allowedFileTypes.includes(file.type))
    }

    getduplicateFilesInCurrentView(files: File[]): File[] {
      return files.filter((file) => this.existingFileNamesInCurrentView?.includes(file.name))
    }

    getduplicateFilesInOtherViews(files: File[]): File[] {
      return files.filter((file) => this.existingFileNamesInOtherViews?.includes(file.name))
    }

    onDismissAlert() {
      this.maxFilesTotalSizeExceeded = false
      this.filesExceedingMaxSize = []
      this.filesOfWrongType = []
      this.duplicateFilesInCurrentView = []
      this.duplicateFilesInOtherViews = []
    }

    get uid() {
      return `elsa-asiakirjat-upload-${(this as any)._uid}`
    }

    get hasErrors() {
      return (
        this.maxFilesTotalSizeExceeded ||
        this.filesExceedingMaxSize.length > 0 ||
        this.filesOfWrongType.length > 0 ||
        this.duplicateFilesInCurrentView.length > 0 ||
        this.duplicateFilesInOtherViews.length > 0
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
