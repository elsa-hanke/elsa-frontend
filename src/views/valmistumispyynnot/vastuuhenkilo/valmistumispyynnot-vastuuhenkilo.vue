<template>
  <div>
    <p class="mt-1 mb-3">{{ $t('valmistumispyynnot-ingressi-vastuuhenkilo') }}</p>
    <b-tabs>
      <b-tab :title="$t('vastuuhenkilo-etusivu-seuranta-otsikko')">
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
              :valmistumispyynnon-hyvaksyja-role="valmistumispyynnonHyvaksyjaRole"
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
              :valmistumispyynnon-hyvaksyja-role="valmistumispyynnonHyvaksyjaRole"
              :current-page="currentMuutPage"
              :per-page="perPage"
              :loading="loadingMuut"
              :hakutermi-exists="hakutermi.length > 0"
              @update:currentPage="onMuutPageInput"
            />
          </b-col>
        </b-row>
      </b-tab>
      <b-tab :title="$t('vastuuhenkilo-etusivu-seuranta-yek-otsikko')">
        <b-row lg>
          <b-col cols="12" lg="5">
            <elsa-search-input
              class="mb-4 hakutermi"
              :hakutermi.sync="hakutermi"
              :placeholder="$t('hae-koulutettavan-nimella')"
            />
          </b-col>
        </b-row>
        <b-row class="mb-5">
          <b-col>
            <h3>{{ $t('avoimet') }}</h3>
            <!-- avoimet Yek-valmistumispyynnot -->
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <h3>{{ $t('valmiit-hyvaksytyt-palautetut') }}</h3>
            <!-- valmiit yms Yek-valmistumispyynnot -->
          </b-col>
        </b-row>
      </b-tab>
    </b-tabs>
  </div>
</template>

<script lang="ts">
  import { Component, Mixins, Watch } from 'vue-property-decorator'
  import { validationMixin } from 'vuelidate'

  import { getValmistumispyynnot, getValmistumispyynnonHyvaksyjaRole } from '@/api/vastuuhenkilo'
  import ElsaButton from '@/components/button/button.vue'
  import ElsaFormGroup from '@/components/form-group/form-group.vue'
  import ElsaConfirmationModal from '@/components/modal/confirmation-modal.vue'
  import ElsaPagination from '@/components/pagination/pagination.vue'
  import ElsaPopover from '@/components/popover/popover.vue'
  import ElsaSearchInput from '@/components/search-input/search-input.vue'
  import ValmistumispyynnotList from '@/components/valmistumispyynnot-list/valmistumispyynnot-list.vue'
  import { ValmistumispyyntoListItem, Page } from '@/types'
  import { ValmistumispyynnonHyvaksyjaRole } from '@/utils/roles'

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
  export default class ValmistumispyynnotVastuuhenkilo extends Mixins(validationMixin) {
    hakutermi = ''
    currentAvoinPage = 1
    currentMuutPage = 1
    perPage = 10
    loadingAvoimet = true
    loadingMuut = true
    valmistumispyynnotAvoimet: Page<ValmistumispyyntoListItem> | null = null
    valmistumispyynnotMuut: Page<ValmistumispyyntoListItem> | null = null
    valmistumispyynnonHyvaksyjaRole: ValmistumispyynnonHyvaksyjaRole | null = null
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
      this.valmistumispyynnonHyvaksyjaRole = (await getValmistumispyynnonHyvaksyjaRole()).data
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
      if (!this.valmistumispyynnonHyvaksyjaRole) {
        this.loadingAvoimet = false
        return
      }
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
      if (!this.valmistumispyynnonHyvaksyjaRole) {
        this.loadingMuut = false
        return
      }
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
