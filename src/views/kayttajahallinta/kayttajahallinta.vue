<template>
  <div class="kayttajahallinta">
    <b-container fluid>
      <b-row lg>
        <b-col>
          <h1>{{ $t('kayttajahallinta') }}</h1>
          <p>{{ $t('kayttajahallinta-ingressi') }}</p>
          <elsa-button variant="primary" :to="{ name: 'uusi-kayttaja' }" class="mb-4">
            {{ $t('lisaa-uusi-kayttaja') }}
          </elsa-button>
          <div v-if="!loading">
            <b-tabs content-class="mt-3" :no-fade="true">
              <b-tab :title="$t('erikoistujat')" active>
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
  import { Component, Vue } from 'vue-property-decorator'

  import { getErikoistuvatLaakarit } from '@/api/kayttajahallinta'
  import ElsaButton from '@/components/button/button.vue'
  import ElsaPagination from '@/components/pagination/pagination.vue'
  import store from '@/store'
  import { KayttajahallintaKayttajaListItem, Page } from '@/types'
  import { KayttajatiliTila } from '@/utils/constants'
  import { ELSA_ROLE } from '@/utils/roles'
  import { toastFail } from '@/utils/toast'

  @Component({
    components: {
      ElsaButton,
      ElsaPagination
    }
  })
  export default class Kayttajahallinta extends Vue {
    loading = true
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
    currentPage = 1
    perPage = 20
    erikoistuvatLaakarit: Page<KayttajahallintaKayttajaListItem> | null = null

    async mounted() {
      await this.fetch()
      this.loading = false
    }

    async fetch() {
      this.getErikoistuvatLaakarit()
    }

    async getErikoistuvatLaakarit() {
      try {
        this.erikoistuvatLaakarit = (
          await getErikoistuvatLaakarit({
            page: this.currentPage - 1,
            size: this.perPage,
            sort: null
          })
        ).data
      } catch (err) {
        toastFail(this, this.$t('erikoistujien-hakeminen-epaonnistui'))
      }
    }

    onPageInput(value: number) {
      this.currentPage = value
      this.fetch()
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
