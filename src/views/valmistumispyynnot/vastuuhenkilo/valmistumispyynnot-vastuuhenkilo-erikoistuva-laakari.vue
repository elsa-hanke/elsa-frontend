<template>
  <div>
    <b-row lg>
      <b-col>
        <elsa-search-input
          class="mb-4"
          :hakutermi.sync="hakutermi"
          :placeholder="$t('hae-erikoistujan-nimella')"
        />
      </b-col>
    </b-row>
    <b-row class="mb-5">
      <b-col>
        <h3>{{ $t('avoimet') }}</h3>
        <valmistumispyynnot-list
          :valmistumispyynnot="valmistumispyynnotAvoimet"
          :current-page="currentAvoinPage"
          :per-page="perPage"
          :loading="loadingAvoimet"
          :hakutermi-exists="hakutermi.length > 0"
          @update:currentPage="onAvoinPageInput"
        />
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <h3>{{ $t('valmiit-allekirjoitetut-palautetut') }}</h3>
        <valmistumispyynnot-list
          :valmistumispyynnot="valmistumispyynnotMuut"
          :current-page="currentMuutPage"
          :per-page="perPage"
          :loading="loadingMuut"
          :hakutermi-exists="hakutermi.length > 0"
          @update:currentPage="onMuutPageInput"
        />
      </b-col>
    </b-row>
  </div>
</template>

<script lang="ts">
  import { Component, Mixins, Watch } from 'vue-property-decorator'
  import { validationMixin } from 'vuelidate'

  import { getValmistumispyynnot } from '@/api/vastuuhenkilo'
  import ElsaButton from '@/components/button/button.vue'
  import ElsaFormGroup from '@/components/form-group/form-group.vue'
  import ElsaConfirmationModal from '@/components/modal/confirmation-modal.vue'
  import ElsaPagination from '@/components/pagination/pagination.vue'
  import ElsaPopover from '@/components/popover/popover.vue'
  import ElsaSearchInput from '@/components/search-input/search-input.vue'
  import ValmistumispyynnotList from '@/components/valmistumispyynnot-list/valmistumispyynnot-list.vue'
  import { ValmistumispyyntoListItem, Page } from '@/types'

  @Component({
    components: {
      ElsaButton,
      ElsaFormGroup,
      ElsaPopover,
      ElsaConfirmationModal,
      ElsaSearchInput,
      ElsaPagination,
      ValmistumispyynnotList
    }
  })
  export default class ValmistumispyynnotVastuuhenkiloErikoistuvaLaakari extends Mixins(
    validationMixin
  ) {
    hakutermi = ''
    currentAvoinPage = 1
    currentMuutPage = 1
    perPage = 10
    loadingAvoimet = true
    loadingMuut = true
    valmistumispyynnotAvoimet: Page<ValmistumispyyntoListItem> | null = null
    valmistumispyynnotMuut: Page<ValmistumispyyntoListItem> | null = null
    debounce?: number

    @Watch('hakutermi')
    onPropertyChanged(value: string) {
      this.debounceSearch(value)
    }

    debounceSearch(value: string) {
      this.loadingAvoimet = true
      this.loadingMuut = true
      clearTimeout(this.debounce)
      this.debounce = setTimeout(() => {
        this.filtered.erikoistujanNimi = value
        this.filterResults()
      }, 400)
    }

    async mounted() {
      this.fetchAll()
    }

    async filterResults() {
      this.loadingAvoimet = true
      this.loadingMuut = true
      this.currentAvoinPage = 1
      this.currentMuutPage = 1
      this.fetchAll()
    }

    async fetchAll() {
      this.fetchAvoimet()
      this.fetchMuut()
    }

    async fetchAvoimet() {
      getValmistumispyynnot({
        page: this.currentAvoinPage - 1,
        size: this.perPage,
        sort: 'muokkauspaiva,asc',
        ...(this.filtered.erikoistujanNimi
          ? { 'erikoistujanNimi.contains': this.filtered.erikoistujanNimi }
          : {}),
        ...{ avoin: true }
      }).then((response) => {
        this.valmistumispyynnotAvoimet = response.data
        this.loadingAvoimet = false
      })
    }

    async fetchMuut() {
      getValmistumispyynnot({
        page: this.currentMuutPage - 1,
        size: this.perPage,
        sort: 'muokkauspaiva,desc',
        ...(this.filtered.erikoistujanNimi
          ? { 'erikoistujanNimi.contains': this.filtered.erikoistujanNimi }
          : {}),
        ...{ avoin: false }
      }).then((response) => {
        this.valmistumispyynnotMuut = response.data
        this.loadingMuut = false
      })
    }

    onAvoinPageInput(value: number) {
      this.loadingAvoimet = true
      this.currentAvoinPage = value
      this.fetchAvoimet()
    }

    onMuutPageInput(value: number) {
      this.loadingMuut = true
      this.currentMuutPage = value
      this.fetchMuut()
    }

    filtered: {
      erikoistujanNimi: string | null
    } = {
      erikoistujanNimi: null
    }
  }
</script>
