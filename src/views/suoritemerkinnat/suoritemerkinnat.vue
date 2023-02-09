<template>
  <div class="suoritemerkinnat">
    <b-breadcrumb :items="items" class="mb-0"></b-breadcrumb>
    <b-container fluid>
      <b-row lg>
        <b-col>
          <h1>{{ $t('suoritemerkinnat') }}</h1>
          <p class="mb-3">{{ $t('suoritemerkinnat-kuvaus') }}</p>
          <elsa-button
            v-if="!account.impersonated"
            variant="primary"
            :to="{ name: 'uusi-suoritemerkinta' }"
            class="mb-5"
          >
            {{ $t('lisaa-suoritemerkinta') }}
          </elsa-button>
          <div v-if="suoritteetTable">
            <div v-for="(kategoria, index) in suoritteenKategoriat" :key="index" class="mb-2">
              <div v-if="!$screen.md" :key="`header-${index}`" class="text-uppercase text-size-sm">
                {{ `${$t('suorite')}: ${kategoria.nimi}` }}
              </div>
              <b-table-simple fixed responsive stacked="md">
                <b-thead>
                  <b-tr>
                    <b-th>
                      {{ `${$t('suorite')}${kategoria.nimi ? ':' : ''} ${kategoria.nimi}` }}
                    </b-th>
                    <b-th>
                      {{ arviointiAsteikonNimi(suoritteetTable.arviointiasteikko) }}
                      <elsa-popover>
                        <elsa-arviointiasteikon-taso-tooltip-content
                          :arviointiasteikon-nimi="
                            arviointiAsteikonNimi(suoritteetTable.arviointiasteikko)
                          "
                          :arviointiasteikon-tasot="suoritteetTable.arviointiasteikko.tasot"
                        />
                      </elsa-popover>
                    </b-th>
                    <b-th>{{ $t('pvm') }}</b-th>
                    <b-th>{{ $t('maara') }}</b-th>
                    <b-th></b-th>
                  </b-tr>
                </b-thead>
                <b-tbody>
                  <b-tr
                    v-for="(row, kategoriaIndex) in kategoria.rows"
                    :key="kategoriaIndex"
                    :class="{
                      'row-details': row.details,
                      'details-showing': row.suoritemerkinta && row.suoritemerkinta.showDetails,
                      'mt-1': index === 0,
                      last: row.lastDetails
                    }"
                  >
                    <b-td>
                      <div v-if="!row.details" class="d-flex align-items-center">
                        {{ row.nimi }}
                      </div>
                    </b-td>
                    <b-td
                      :stacked-heading="arviointiAsteikonNimi(suoritteetTable.arviointiasteikko)"
                      :class="{
                        empty: !row.suoritemerkinta || !row.suoritemerkinta.arviointiasteikonTaso
                      }"
                    >
                      <div class="d-flex align-items-center">
                        <elsa-arviointiasteikon-taso
                          v-if="row.suoritemerkinta && row.suoritemerkinta.arviointiasteikonTaso"
                          :value="row.suoritemerkinta.arviointiasteikonTaso"
                          :tasot="suoritteetTable.arviointiasteikko.tasot"
                        />
                      </div>
                    </b-td>
                    <b-td :stacked-heading="$t('pvm')" :class="{ empty: !row.suoritemerkinta }">
                      <div v-if="row.suoritemerkinta" class="d-flex align-items-center">
                        <elsa-button
                          :to="{
                            name: 'suoritemerkinta',
                            params: {
                              suoritemerkintaId: row.suoritemerkinta.id
                            }
                          }"
                          variant="link"
                          class="shadow-none p-0"
                        >
                          {{
                            row.suoritemerkinta.suorituspaiva
                              ? $date(row.suoritemerkinta.suorituspaiva)
                              : ''
                          }}
                        </elsa-button>
                      </div>
                    </b-td>
                    <b-td
                      :stacked-heading="$t('maara')"
                      :class="{ last: !(row.hasDetails && row.suoritemerkinta) }"
                    >
                      <div v-if="!row.details" class="suoritettu-text">
                        <span
                          class="pr-1"
                          :class="{
                            success:
                              row.vaadittulkm &&
                              row.suoritettulkm &&
                              row.suoritettulkm >= row.vaadittulkm
                          }"
                        >
                          {{ row.suoritettulkm }}
                        </span>
                        <span>{{ row.vaadittulkm ? `/ ${row.vaadittulkm}` : '' }}</span>
                      </div>
                    </b-td>
                    <b-td
                      class="details-icon"
                      :class="{ 'has-details': row.hasDetails && row.suoritemerkinta }"
                    >
                      <div class="d-flex align-items-center">
                        <elsa-button
                          v-if="row.hasDetails && row.suoritemerkinta"
                          variant="link"
                          class="shadow-none text-dark p-0"
                          @click="toggleDetails(row)"
                        >
                          <font-awesome-icon
                            :icon="row.suoritemerkinta.showDetails ? 'chevron-up' : 'chevron-down'"
                            fixed-width
                            size="lg"
                          />
                        </elsa-button>
                      </div>
                    </b-td>
                  </b-tr>
                </b-tbody>
              </b-table-simple>
            </div>
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
  import axios from 'axios'
  import { Component, Vue } from 'vue-property-decorator'

  import ElsaArviointiasteikonTasoTooltipContent from '@/components/arviointiasteikon-taso/arviointiasteikon-taso-tooltip.vue'
  import ElsaArviointiasteikonTaso from '@/components/arviointiasteikon-taso/arviointiasteikon-taso.vue'
  import ElsaButton from '@/components/button/button.vue'
  import ElsaPopover from '@/components/popover/popover.vue'
  import store from '@/store'
  import {
    Arviointiasteikko,
    Suorite,
    SuoritteenKategoria,
    SuoritteetTable,
    SuoritemerkintaRow,
    SuoritemerkintaWithDetails,
    ToggleableSuoritemerkinta
  } from '@/types'
  import { ArviointiasteikkoTyyppi } from '@/utils/constants'
  import { sortByDateDesc } from '@/utils/date'

  @Component({
    components: {
      ElsaButton,
      ElsaPopover,
      ElsaArviointiasteikonTaso,
      ElsaArviointiasteikonTasoTooltipContent
    }
  })
  export default class Suoritemerkinnat extends Vue {
    items = [
      {
        text: this.$t('etusivu'),
        to: { name: 'etusivu' }
      },
      {
        text: this.$t('suoritemerkinnat'),
        active: true
      }
    ]
    suoritteetTable: SuoritteetTable | null = null

    async mounted() {
      const suoritteetTable: SuoritteetTable = (
        await axios.get('erikoistuva-laakari/suoritteet-taulukko')
      ).data
      this.suoritteetTable = {
        ...suoritteetTable,
        suoritemerkinnat: suoritteetTable.suoritemerkinnat.map((suoritemerkinta) => ({
          ...suoritemerkinta,
          showDetails: false
        }))
      }
    }

    get account() {
      return store.getters['auth/account']
    }

    toggleDetails(row: SuoritemerkintaRow) {
      if (row.suoritemerkinta) {
        row.suoritemerkinta.showDetails = !row.suoritemerkinta.showDetails
      }
    }

    arviointiAsteikonNimi(arviointiasteikko: Arviointiasteikko) {
      return arviointiasteikko.nimi === ArviointiasteikkoTyyppi.EPA
        ? this.$t('luottamuksen-taso')
        : this.$t('etappi')
    }

    get suoritteenKategoriat() {
      if (this.suoritteetTable) {
        const suoritemerkinnatGroupBySuorite = this.suoritteetTable.suoritemerkinnat.reduce(
          (
            result: Record<number, SuoritemerkintaWithDetails[]>,
            suoritemerkinta: ToggleableSuoritemerkinta
          ) => {
            const suoriteId = suoritemerkinta.suorite.id
            if (suoriteId in result) {
              result[suoriteId].push({
                suoritemerkinta,
                details: true
              })
            } else {
              result[suoriteId] = [
                {
                  suoritemerkinta,
                  details: true
                }
              ]
            }
            return result
          },
          {}
        )

        return this.suoritteetTable.suoritteenKategoriat.map((kategoria: SuoritteenKategoria) => {
          const rows: SuoritemerkintaRow[] = kategoria.suoritteet.reduce(
            (result: SuoritemerkintaRow[], suorite: Suorite) => {
              // Kerätään suoritteen suoritemerkinnät ja järjestetään ne aikajärjestykseen
              const suoritemerkinnat = (suoritemerkinnatGroupBySuorite[suorite.id] || []).sort(
                (a: any, b: any) =>
                  sortByDateDesc(a.suoritemerkinta.suorituspaiva, b.suoritemerkinta.suorituspaiva)
              )

              // Ensimmäinen suoritemerkintä esitetään suoritteen rivillä
              const suoritemerkinta = suoritemerkinnat.length > 0 ? suoritemerkinnat[0] : undefined
              const suoritemerkinnatWithoutFirst = suoritemerkinnat.slice(1)
              suorite.suoritettulkm = suoritemerkinnat.length

              if (suoritemerkinnatWithoutFirst.length > 0) {
                suoritemerkinnatWithoutFirst[suoritemerkinnatWithoutFirst.length - 1].lastDetails =
                  true
              }

              result.push({
                ...suorite,
                details: false,
                suoritemerkinta: suoritemerkinta?.suoritemerkinta,
                hasDetails: suoritemerkinnatWithoutFirst.length > 0
              })

              // Näytetään muut suoritemerkinnät vain jos rivi on avattu
              if (suoritemerkinta?.suoritemerkinta?.showDetails) {
                return result.concat(suoritemerkinnatWithoutFirst)
              } else {
                return result
              }
            },
            []
          )

          return {
            ...kategoria,
            rows
          }
        })
      }
      return []
    }
  }
</script>

<style lang="scss" scoped>
  @import '~@/styles/variables';
  @import '~bootstrap/scss/mixins/breakpoints';

  .suoritemerkinnat {
    max-width: 1024px;
  }

  .success {
    color: $green;
    font-weight: 500;
  }

  .suoritettu-text {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  ::v-deep table {
    thead th {
      font-size: $font-size-sm;
      font-weight: 400;
      text-transform: uppercase;
      border-top: none;
      &:nth-of-type(3) {
        width: 5rem;
      }
      &:nth-of-type(4) {
        width: 5rem;
        text-align: center;
      }
      &:nth-of-type(5) {
        width: 3rem;
      }
    }
    td {
      padding-top: 0;
      padding-bottom: 0;
      vertical-align: middle;
      div {
        min-height: $font-size-base * 2.5;
      }
    }
  }

  @include media-breakpoint-down(sm) {
    .suoritettu-text {
      justify-content: flex-start;
    }
    ::v-deep table {
      border-bottom: 0;

      tr {
        border: $table-border-width solid $table-border-color;
        border-radius: $border-radius;
        margin-top: 0.5rem;
        padding-top: $table-cell-padding;
        padding-bottom: $table-cell-padding;

        &.details-showing {
          border-radius: $border-radius $border-radius 0 0;
        }

        & > td.last > div {
          padding-bottom: 0 !important;
        }

        &.row-details {
          margin: 0;
          padding-bottom: 0;
          border-top: 0;
          border-radius: unset;

          &.last {
            border-radius: 0 0 $border-radius $border-radius;
          }
          & > td:first-child,
          & > td.last {
            display: none;
          }
        }
      }

      td {
        border: none;
        div {
          min-height: $font-size-base;
        }

        &.empty {
          display: none !important;
        }
        &:first-of-type {
          font-size: $font-size-md;
        }

        &.details-icon {
          &:not(.has-details) {
            display: none !important;
          }
          > div {
            padding-bottom: 0 !important;
          }
        }

        & > div {
          width: 100% !important;
          padding: 0 0 0.5rem 0 !important;
        }

        &::before {
          text-align: left !important;
          text-transform: uppercase;
          font-size: $font-size-sm;
          font-weight: 400 !important;
          width: 100% !important;
          padding-right: 0 !important;
        }
      }
    }
  }

  .row-details {
    background: #f5f5f6;
    td {
      border-top: none;
    }
  }
</style>
