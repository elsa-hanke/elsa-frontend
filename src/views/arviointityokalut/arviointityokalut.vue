<template>
  <div class="opetussuunnitelmat">
    <b-breadcrumb :items="items" class="mb-0" />
    <b-container fluid>
      <b-row lg>
        <b-col>
          <h1>{{ $t('arviointityokalut') }}</h1>
          <p>{{ $t('arviointityokalut-kuvaus') }}</p>
          <elsa-button variant="primary" :to="{ name: 'uusi-arviointityokalu' }" class="mb-4 mr-2">
            {{ $t('lisaa-arviointityokalu') }}
          </elsa-button>
          <elsa-button variant="primary" :to="{ name: 'uusi-kategoria' }" class="mb-4">
            {{ $t('lisaa-kategoria') }}
          </elsa-button>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <div v-if="!loading">
            <b-alert v-if="rows === 0" variant="dark" show>test test</b-alert>
          </div>
          <div v-else class="text-center">
            <b-spinner variant="primary" :label="$t('ladataan')" />
          </div>
          <b-table
            v-if="!loading && rows > 0"
            :items="tulokset"
            :fields="fields"
            :per-page="perPage"
            :current-page="currentPage"
            class="arviointityokalut-table"
            details-td-class="row-details"
            tbody-tr-class="outer-table"
            stacked="md"
            responsive
          >
            <template #cell(nimi)="data">
              <b-link
                :to="{
                  name: 'kategoria',
                  params: { kategoriaId: data.item.id }
                }"
              >
                {{ data.item.nimi }}
              </b-link>
            </template>

            <template #cell(tyyppi)="data">
              {{ $t('arviointityokalu-tila-' + data.item.tyyppi) }}
            </template>
          </b-table>
          <pagination
            :current-page.sync="currentPage"
            :per-page="perPage"
            :rows="rows"
            :loading="loading"
          />
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator'

  import { getArviointityokalutKategoriat } from '@/api/tekninen-paakayttaja'
  import ElsaButton from '@/components/button/button.vue'
  import Pagination from '@/components/pagination/pagination.vue'
  import SearchInput from '@/components/search-input/search-input.vue'
  import { ArviointityokaluKategoria } from '@/types'
  import { sortByAsc } from '@/utils/sort'
  import { toastFail } from '@/utils/toast'

  @Component({
    components: {
      ElsaButton,
      SearchInput,
      Pagination
    }
  })
  export default class Arviointityokalut extends Vue {
    arviointityokalut: ArviointityokaluKategoria[] = []

    loading = true

    items = [
      {
        text: this.$t('etusivu'),
        to: { name: 'etusivu' }
      },
      {
        text: this.$t('arviointityokalut'),
        active: true
      }
    ]

    fields = [
      {
        key: 'nimi',
        label: this.$t('arviointityokalu'),
        class: 'nimi',
        sortable: false
      },
      {
        key: 'tila',
        label: this.$t('tila'),
        class: 'tila',
        sortable: false
      }
    ]
    perPage = 20
    currentPage = 1

    async mounted() {
      this.loading = true
      try {
        this.arviointityokalut = (await getArviointityokalutKategoriat()).data.sort((a, b) =>
          sortByAsc(a.nimi, b.nimi)
        )
      } catch {
        toastFail(this, this.$t('arviointityokalujen-kategorioiden-hakeminen-epaonnistui'))
        this.arviointityokalut = []
      }
      this.loading = false
    }

    get rows() {
      return this.tulokset?.length ?? 0
    }

    get tulokset() {
      // if (this.hakutermi) {
      //   this.currentPage = 1
      //   return this.erikoisalat?.filter((item: Erikoisala) =>
      //     item.nimi?.toLowerCase().includes(this.hakutermi.toLowerCase())
      //   )
      // }

      return this.arviointityokalut
    }
  }
</script>

<style lang="scss" scoped>
  @import '~@/styles/variables';
  @import '~bootstrap/scss/mixins/breakpoints';

  .arviointityokalut {
    max-width: 1420px;
  }

  ::v-deep .arviointityokalut-table {
    .row-details {
      padding: 0;
      table {
        margin: 0;

        border: none;
        thead,
        &tr {
          display: none;
        }
        td {
          word-wrap: break-all;
        }
      }
    }

    @include media-breakpoint-down(sm) {
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
</style>
