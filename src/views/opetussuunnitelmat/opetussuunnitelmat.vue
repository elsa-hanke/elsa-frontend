<template>
  <div>
    <b-breadcrumb :items="items" class="mb-0" />
    <b-container fluid>
      <b-row lg>
        <b-col>
          <h1>{{ $t('opetussuunnitelmat') }}</h1>
          <p>{{ $t('opetussuunnitelmat-kuvaus') }}</p>
          <search-input
            class="mb-4"
            :hakutermi.sync="hakutermi"
            :placeholder="$t('hae-erikoistujan-nimella')"
          />
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <div v-if="!loading">
            <b-alert v-if="rows === 0" variant="dark" show>
              <font-awesome-icon icon="info-circle" fixed-width class="text-muted" />
              <span v-if="hakutermi.length > 0">
                {{ $t('ei-hakutuloksia') }}
              </span>
              <span v-else>
                {{ $t('ei-erikoisaloja') }}
              </span>
            </b-alert>
          </div>
          <div v-else class="text-center">
            <b-spinner variant="primary" :label="$t('ladataan')" />
          </div>
          <b-table
            v-if="!loading && rows > 0"
            fixed
            :items="tulokset"
            :fields="fields"
            :per-page="perPage"
            :current-page="currentPage"
            class="erikoisala-table"
            details-td-class="row-details"
            tbody-tr-class="outer-table"
            stacked="md"
          >
            <template #cell(nimi)="data">
              <b-link
                :to="{
                  name: 'erikoisala',
                  params: { erikoisalaId: data.item.id }
                }"
                class="task-type"
              >
                {{ data.item.nimi }}
              </b-link>
            </template>

            <template #cell(tyyppi)="data">
              {{ $t('erikoisala-tyyppi-' + data.item.tyyppi) }}
            </template>
          </b-table>
          <pagination
            :currentPage.sync="currentPage"
            :perPage="perPage"
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

  import { getErikoisalat } from '@/api/tekninen-paakayttaja'
  import Pagination from '@/components/pagination/pagination.vue'
  import SearchInput from '@/components/search-input/search-input.vue'
  import { Erikoisala } from '@/types'
  import { toastFail } from '@/utils/toast'

  @Component({
    components: {
      SearchInput,
      Pagination
    }
  })
  export default class Opetussuunnitelmat extends Vue {
    erikoisalat: Erikoisala[] = []

    loading = true

    items = [
      {
        text: this.$t('etusivu'),
        to: { name: 'etusivu' }
      },
      {
        text: this.$t('opetussuunnitelmat'),
        active: true
      }
    ]

    fields = [
      {
        key: 'nimi',
        label: this.$t('erikoisala'),
        class: 'nimi',
        sortable: true
      },
      {
        key: 'tyyppi',
        label: this.$t('tyyppi'),
        class: 'tyyppi',
        sortable: true
      }
    ]
    perPage = 20
    currentPage = 1
    hakutermi = ''

    async mounted() {
      this.loading = true
      try {
        this.erikoisalat = (await getErikoisalat()).data
      } catch {
        toastFail(this, this.$t('erikoisalojen-hakeminen-epaonnistui'))
        this.erikoisalat = []
      }
      this.loading = false
    }

    get rows() {
      return this.tulokset?.length ?? 0
    }

    get tulokset() {
      if (this.hakutermi) {
        this.currentPage = 1
        return this.erikoisalat?.filter((item: Erikoisala) =>
          item.nimi?.toLowerCase().includes(this.hakutermi.toLowerCase())
        )
      }

      return this.erikoisalat
    }
  }
</script>

<style lang="scss" scoped>
  @import '~@/styles/variables';
  @import '~bootstrap/scss/mixins/breakpoints';

  .task-type {
    text-transform: capitalize;
  }

  ::v-deep {
    .erikoisalat-table {
      .row-details {
        padding: 0;
        background-color: #f5f5f6;
        table {
          margin: 0.375rem 0 0.375rem 0;

          border: none;
          thead,
          &tr {
            display: none;
          }
          td {
            word-wrap: break-all;
            padding-top: 0.375rem;
            padding-bottom: 0.375rem;
            border-top: none;
          }
        }
      }
      @include media-breakpoint-up(xl) {
        .actions {
          text-align: right;
        }
      }

      @include media-breakpoint-down(sm) {
        border-bottom: none;

        tr {
          padding: 0.375rem 0 0.375rem 0;
          border: $table-border-width solid $table-border-color;

          &.outer-table {
            margin-bottom: 0.75rem;
            border-radius: 0.25rem;
          }

          &.b-table-has-details {
            margin-bottom: 0;
            border-radius: 0.25rem 0.25rem 0 0;
          }

          &.b-table-details {
            border: none;
            padding: 0;
            margin-bottom: 0.75rem;
            :last-of-type {
              border-radius: 0 0 0.25rem 0.25rem;
            }

            table {
              margin: 0;

              tr {
                border-top: none;
                margin-top: 0;
                padding-top: 0;
                td {
                  padding-top: 0.75rem;
                  &.nimi,
                  &.actions {
                    display: none;
                  }
                }
              }
            }
          }
        }

        td {
          padding: 0.25rem 0 0.25rem 0.25rem;
          border: none;

          &.nimi {
            font-size: $h4-font-size;
            > div {
              width: 100% !important;
              padding: 0.25rem 0.375rem 0 0.375rem !important;
            }
            &::before {
              display: none;
            }
          }

          &.seurantajakso,
          &.tila,
          &.pvm,
          &.actions {
            > div {
              &:empty {
                display: none !important;
              }
              padding: 0 0.375rem 0 0.375rem !important;
            }
            &::before {
              text-align: left !important;
              padding-left: 0.375rem !important;
              font-weight: 500 !important;
              width: 100% !important;
            }
            text-align: left;
          }
        }
      }
    }
  }
</style>
