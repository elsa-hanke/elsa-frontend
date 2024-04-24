<template>
  <div class="valmistumispyynnot">
    <p class="mt-1 mb-3">{{ $t('valmistumispyynnot-ingressi-vastuuhenkilo') }}</p>
    <b-tabs>
      <b-tab :title="$t('virkailija-etusivu-seuranta-otsikko')">
        <b-row lg>
          <b-col cols="12" lg="5">
            <elsa-search-input
              class="mb-4 hakutermi"
              :hakutermi.sync="hakutermi"
              :placeholder="$t('hae-erikoistujan-nimella')"
            />
          </b-col>
          <b-col cols="12" lg="4" md="6">
            <div v-if="erikoisalat != null && erikoisalat.length > 1" class="filter">
              <elsa-form-group :label="$t('erikoisala')" class="mb-4">
                <template #default="{ uid }">
                  <elsa-form-multiselect
                    :id="uid"
                    v-model="filtered.erikoisala"
                    :options="erikoisalatSorted"
                    label="nimi"
                    @select="onErikoisalaSelect"
                    @clearMultiselect="onErikoisalaReset"
                  ></elsa-form-multiselect>
                </template>
              </elsa-form-group>
            </div>
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
      <b-tab :title="$t('virkailija-etusivu-seuranta-yek-otsikko')">
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
            <h3>{{ $t('valmiit-hyvaksytyt-palautetut') }}</h3>
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
    </b-tabs>
  </div>
</template>

<script lang="ts">
  import { Component, Mixins, Watch } from 'vue-property-decorator'
  import { validationMixin } from 'vuelidate'

  import { getErikoisalat, getValmistumispyynnot } from '@/api/virkailija'
  import ElsaButton from '@/components/button/button.vue'
  import ElsaFormGroup from '@/components/form-group/form-group.vue'
  import ElsaConfirmationModal from '@/components/modal/confirmation-modal.vue'
  import ElsaFormMultiselect from '@/components/multiselect/multiselect.vue'
  import ElsaPagination from '@/components/pagination/pagination.vue'
  import ElsaPopover from '@/components/popover/popover.vue'
  import ElsaSearchInput from '@/components/search-input/search-input.vue'
  import ValmistumispyynnotList from '@/components/valmistumispyynnot-list/valmistumispyynnot-list.vue'
  import { Erikoisala, ValmistumispyyntoListItem, Page } from '@/types'
  import { ValmistumispyynnonHyvaksyjaRole } from '@/utils/roles'
  import { sortByAsc } from '@/utils/sort'

  @Component({
    components: {
      ElsaButton,
      ElsaFormGroup,
      ElsaFormMultiselect,
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
    loading = true
    loadingAvoimet = true
    loadingMuut = true
    valmistumispyynnotAvoimet: Page<ValmistumispyyntoListItem> | null = null
    valmistumispyynnotMuut: Page<ValmistumispyyntoListItem> | null = null
    valmistumispyynnonHyvaksyjaRole: ValmistumispyynnonHyvaksyjaRole | null =
      ValmistumispyynnonHyvaksyjaRole.VIRKAILIJA
    debounce?: number
    erikoisalat: Erikoisala[] | null = null

    filtered: {
      nimi: string | null
      erikoisala: Erikoisala | null
      sortBy: string | null
    } = {
      nimi: null,
      erikoisala: null,
      sortBy: null
    }

    @Watch('hakutermi')
    onPropertyChanged(value: string) {
      this.debounceSearch(value)
    }

    debounceSearch(value: string) {
      this.loadingAvoimet = true
      this.loadingMuut = true
      clearTimeout(this.debounce)
      this.debounce = setTimeout(() => {
        this.filtered.nimi = value
        this.filterResults()
      }, 400)
    }

    async mounted() {
      this.fetchAll()
    }

    async fetchRajaimet() {
      this.erikoisalat = this.$isVirkailija() ? (await getErikoisalat()).data : []
    }

    async filterResults() {
      this.loadingAvoimet = true
      this.loadingMuut = true
      this.currentAvoinPage = 1
      this.currentMuutPage = 1
      this.fetchAll()
    }

    async fetchAll() {
      this.fetchRajaimet()
      this.fetchAvoimet()
      this.fetchMuut()
    }

    get erikoisalatSorted() {
      return this.erikoisalat?.sort((a, b) => sortByAsc(a.nimi, b.nimi))
    }

    onErikoisalaSelect(erikoisala: Erikoisala) {
      this.filtered.erikoisala = erikoisala
      this.filterResults()
    }

    onErikoisalaReset() {
      this.filtered.erikoisala = null
      this.filterResults()
    }

    async fetchAvoimet() {
      getValmistumispyynnot({
        page: this.currentAvoinPage - 1,
        size: this.perPage,
        sort: 'muokkauspaiva,asc',
        ...{ avoin: true },
        ...(this.filtered.nimi ? { 'erikoistujanNimi.contains': this.filtered.nimi } : {}),
        ...(this.filtered.erikoisala?.id
          ? { 'erikoisalaId.equals': this.filtered.erikoisala.id }
          : {})
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
        ...{ avoin: false },
        ...(this.filtered.nimi ? { 'erikoistujanNimi.contains': this.filtered.nimi } : {}),
        ...(this.filtered.erikoisala?.id
          ? { 'erikoisalaId.equals': this.filtered.erikoisala.id }
          : {})
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
  }
</script>

<style lang="scss" scoped>
  @import '~@/styles/variables';
  @import '~bootstrap/scss/mixins/breakpoints';

  .valmistumispyynnot {
    max-width: 1024px;
  }
  .task-type {
    text-transform: capitalize;
  }

  .hakutermi {
    margin-top: 1.2rem;
  }

  .hakutermi::v-deep .search-input {
    margin-top: 0 !important;
  }

  .filter::v-deep .form-group {
    label {
      font-weight: 300;
      text-transform: uppercase;
      font-size: $font-size-sm;
      margin-bottom: 0;
    }
  }
</style>
