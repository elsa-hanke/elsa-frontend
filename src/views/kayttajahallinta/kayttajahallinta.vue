<template>
  <div class="kayttajahallinta">
    <b-container fluid>
      <b-row lg>
        <b-col>
          <h1>{{ $t('kayttajahallinta') }}</h1>
          <p>
            {{ $t('kayttajahallinta-ingressi') }}
            <span v-if="isVirkailija">{{ $t('naet-oman-yliopistosi-kayttajat') }}</span>
          </p>
          <elsa-button variant="primary" :to="{ name: 'uusi-kayttaja' }" class="mb-4">
            {{ $t('lisaa-uusi-kayttaja') }}
          </elsa-button>
          <div v-if="!initializing">
            <b-tabs content-class="mt-3" :no-fade="true">
              <b-tab :title="$t('erikoistujat')" active>
                <b-row align-v="center" lg>
                  <b-col cols="12" lg="4">
                    <elsa-search-input
                      class="mb-3"
                      :hakutermi.sync="hakutermi"
                      :placeholder="$t('hae-erikoistuvan-nimella')"
                    />
                  </b-col>
                  <b-col cols="12" lg="4">
                    <div class="drop-down-filter" v-if="rajaimet.erikoisalat.length > 1">
                      <elsa-form-group :label="$t('erikoisala')">
                        <template v-slot="{ uid }">
                          <elsa-form-multiselect
                            :id="uid"
                            v-model="filtered.erikoisala"
                            :options="erikoisalatSorted"
                            label="nimi"
                            @select="onResultsFiltered"
                            @clearMultiselect="onErikoisalaReset"
                          ></elsa-form-multiselect>
                        </template>
                      </elsa-form-group>
                    </div>
                  </b-col>
                </b-row>
                <b-row lg>
                  <b-col cols="12">
                    <b-form-checkbox
                      class="mb-4"
                      v-model="filtered.useaOpintooikeus"
                      @input="onResultsFiltered"
                    >
                      {{ $t('nayta-erikoistujat-useampi-opintooikeus') }}
                    </b-form-checkbox>
                  </b-col>
                </b-row>
                <div v-if="rows > 0" class="kayttajat-table">
                  <b-table
                    :items="erikoistuvatLaakarit.content"
                    :fields="fields"
                    stacked="md"
                    responsive
                  >
                    <template #cell(nimi)="row">
                      <elsa-button
                        :to="{
                          name: 'kayttaja',
                          params: { kayttajaId: row.item.kayttajaId }
                        }"
                        variant="link"
                        class="p-0 border-0 shadow-none"
                      >
                        <span>{{ row.item.sukunimi }}&nbsp;{{ row.item.etunimi }}</span>
                        <span v-if="row.item.syntymaaika">
                          &nbsp;({{ $date(row.item.syntymaaika) }})
                        </span>
                      </elsa-button>
                    </template>
                    <template #cell(opintooikeus)="row">
                      <template v-for="(item, index) in row.item.yliopistotAndErikoisalat">
                        <div :key="index">
                          {{ `${$t(`yliopisto-nimi.${item.yliopisto}`)}: ${item.erikoisala}` }}
                        </div>
                      </template>
                    </template>
                    <template #cell(tila)="row">
                      <span :class="getTilaColor(row.item.kayttajatilinTila)">
                        {{ $t(`tilin-tila-${row.item.kayttajatilinTila}`) }}
                      </span>
                    </template>
                  </b-table>
                </div>
                <elsa-pagination
                  @update:currentPage="onPageInput"
                  :current-page="currentPage"
                  :per-page="perPage"
                  :rows="rows"
                />
              </b-tab>
              <!-- <b-tab :title="$t('vastuuhenkilot')"></b-tab> -->
              <!-- <b-tab :title="$t('virkailijat')"></b-tab> -->
              <!-- <b-tab :title="$t('paakayttajat')"></b-tab> -->
            </b-tabs>
          </div>
          <div v-else class="text-center">
            <b-spinner variant="primary" :label="$t('ladataan')" />
          </div>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script lang="ts">
  import { Component, Vue, Watch } from 'vue-property-decorator'

  import { getErikoistuvatLaakarit, getKayttajahallintaRajaimet } from '@/api/kayttajahallinta'
  import ElsaButton from '@/components/button/button.vue'
  import ElsaFormGroup from '@/components/form-group/form-group.vue'
  import ElsaFormMultiselect from '@/components/multiselect/multiselect.vue'
  import ElsaPagination from '@/components/pagination/pagination.vue'
  import ElsaSearchInput from '@/components/search-input/search-input.vue'
  import store from '@/store'
  import {
    KayttajahallintaKayttajaListItem,
    Page,
    KayttajahallintaRajaimet,
    Erikoisala,
    VastuuhenkiloTehtavatyyppi
  } from '@/types'
  import { KayttajatiliTila } from '@/utils/constants'
  import { ELSA_ROLE } from '@/utils/roles'
  import { sortByAsc } from '@/utils/sort'
  import { toastFail } from '@/utils/toast'

  @Component({
    components: {
      ElsaButton,
      ElsaFormGroup,
      ElsaFormMultiselect,
      ElsaPagination,
      ElsaSearchInput
    }
  })
  export default class Kayttajahallinta extends Vue {
    fields = [
      {
        key: 'nimi',
        label: this.$t('nimi'),
        sortable: true
      },
      {
        key: 'opintooikeus',
        label: this.$t('opintooikeus'),
        sortable: false
      },
      {
        key: 'tila',
        label: this.$t('tilin-tila'),
        sortable: false
      }
    ]
    filtered: {
      nimi: string | null
      erikoisala: Erikoisala | null
      useaOpintooikeus: boolean
      vastuuhenkilonTehtavatyyppi: VastuuhenkiloTehtavatyyppi | null
    } = {
      nimi: null,
      erikoisala: null,
      useaOpintooikeus: false,
      vastuuhenkilonTehtavatyyppi: null
    }

    initializing = true
    loadingResults = false
    currentPage = 1
    perPage = 20
    debounce?: number
    hakutermi = ''
    erikoistuvatLaakarit: Page<KayttajahallintaKayttajaListItem> | null = null
    rajaimet: KayttajahallintaRajaimet | null = null

    async mounted() {
      try {
        await Promise.all([this.fetchRajaimet(), this.fetch()])
      } catch {
        toastFail(this, this.$t('kayttajien-hakeminen-epaonnistui'))
      }
      this.initializing = false
    }

    async fetchRajaimet() {
      this.rajaimet = (await getKayttajahallintaRajaimet()).data
    }

    async fetch() {
      this.getErikoistuvatLaakarit()
    }

    async getErikoistuvatLaakarit() {
      this.erikoistuvatLaakarit = (
        await getErikoistuvatLaakarit({
          page: this.currentPage - 1,
          size: this.perPage,
          sort: null,
          ...(this.filtered.nimi ? { 'nimi.contains': this.filtered.nimi } : {}),
          ...(this.filtered.erikoisala?.id
            ? { 'erikoisalaId.equals': this.filtered.erikoisala.id }
            : {}),
          ...{ 'useaOpintooikeus.equals': this.filtered.useaOpintooikeus }
        })
      ).data
    }

    @Watch('hakutermi')
    onPropertyChanged(value: string) {
      this.debounceSearch(value)
    }

    private async onResultsFiltered() {
      this.loadingResults = true
      this.currentPage = 1
      await this.fetch()
      this.loadingResults = false
    }

    onPageInput(value: number) {
      this.currentPage = value
      this.fetch()
    }

    debounceSearch(value: string) {
      clearTimeout(this.debounce)
      this.debounce = setTimeout(() => {
        this.filtered.nimi = value
        this.onResultsFiltered()
      }, 400)
    }

    onErikoisalaReset() {
      this.filtered.erikoisala = null
      this.onResultsFiltered()
    }

    get rows() {
      return this.erikoistuvatLaakarit?.totalElements ?? 0
    }

    get account() {
      return store.getters['auth/account']
    }

    get isVirkailija() {
      return this.account.authorities.includes(ELSA_ROLE.OpintohallinnonVirkailija)
    }

    get erikoisalatSorted() {
      return this.rajaimet?.erikoisalat.sort((a, b) => sortByAsc(a.nimi, b.nimi))
    }

    getTilaColor(tila: KayttajatiliTila) {
      switch (tila) {
        case KayttajatiliTila.AKTIIVINEN:
          return 'text-success'
        case KayttajatiliTila.PASSIIVINEN:
          return 'text-danger'
        default:
          return ''
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '~@/styles/variables';
  @import '~bootstrap/scss/mixins/breakpoints';

  .kayttajahallinta {
    max-width: 1024px;
    padding-top: 0.75rem;
  }

  .drop-down-filter::v-deep {
    max-width: 25rem;
    label {
      font-weight: 300;
      text-transform: uppercase;
      font-size: $font-size-sm;
      margin-bottom: 0;
    }
  }

  @include media-breakpoint-down(sm) {
    .kayttajat-table {
      ::v-deep table {
        border-bottom: 0;

        tr {
          border: $table-border-width solid $table-border-color;
          border-radius: $border-radius;
          margin-top: 0.5rem;
          padding-top: $table-cell-padding;
          padding-bottom: $table-cell-padding;
        }

        td {
          border: none;
          padding: 0 0.5rem;

          & > div {
            width: 100% !important;
            padding: 0 0 0.5rem 0 !important;
          }

          &::before {
            text-align: left !important;
            font-weight: 500 !important;
            width: 100% !important;
            padding-right: 0 !important;
          }
          &:last-child > div {
            padding-bottom: 0 !important;
          }

          &.last > div {
            padding-bottom: 0 !important;
          }
        }
      }
    }
  }
</style>
