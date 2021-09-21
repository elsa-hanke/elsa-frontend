<template>
  <div class="suoritemerkinnat">
    <b-breadcrumb :items="items" class="mb-0"></b-breadcrumb>
    <b-container fluid>
      <b-row lg>
        <b-col>
          <h1>{{ $t('suoritemerkinnat') }}</h1>
          <p>{{ $t('suoritemerkinnat-kuvaus') }}</p>
          <elsa-button variant="primary" :to="{ name: 'uusi-suoritemerkinta' }" class="mb-4">
            {{ $t('lisaa-suoritemerkinta') }}
          </elsa-button>
          <h2>{{ $t('oppimistavoitteet') }}</h2>
          <div v-if="osaamistavoitteet">
            <div
              v-for="(kategoria, index) in oppimistavoitteenKategoriat"
              :key="index"
              class="mb-2"
            >
              <b-table-simple responsive stacked="md">
                <b-thead>
                  <b-tr>
                    <b-th>{{ `${$t('suorite')}: ${kategoria.nimi}` }}</b-th>
                    <b-th>
                      {{ arviointiAsteikonNimi(kategoria.arviointiasteikko) }}
                      <elsa-popover>
                        <template>
                          <h3>{{ arviointiAsteikonNimi(kategoria.arviointiasteikko) }}</h3>
                          <div
                            v-for="(asteikonTaso, index) in kategoria.arviointiasteikko.tasot"
                            :key="index"
                          >
                            <h4>
                              {{ asteikonTaso.taso }}
                              {{ $t('arviointiasteikon-taso-' + asteikonTaso.nimi) }}
                            </h4>
                            <p>{{ $t('arviointiasteikon-tason-kuvaus-' + asteikonTaso.nimi) }}</p>
                          </div>
                        </template>
                      </elsa-popover>
                    </b-th>
                    <b-th>{{ $t('suorituspaiva') }}</b-th>
                    <b-th></b-th>
                  </b-tr>
                </b-thead>
                <b-tbody>
                  <b-tr
                    v-for="(row, index) in kategoria.rows"
                    :key="index"
                    :class="{ 'row-details': row.details }"
                  >
                    <b-td :stacked-heading="`${$t('suorite')}: ${kategoria.nimi}`">
                      <div v-if="!row.details" class="d-flex align-items-center">
                        {{ row.nimi }}
                      </div>
                    </b-td>
                    <b-td :stacked-heading="$t('luottamuksen-taso')">
                      <div class="d-flex align-items-center">
                        <elsa-arviointiasteikon-taso
                          v-if="row.suoritemerkinta"
                          :value="row.suoritemerkinta.arviointiasteikonTaso"
                          :tasot="kategoria.arviointiasteikko.tasot"
                        />
                      </div>
                    </b-td>
                    <b-td
                      :stacked-heading="$t('suorituspaiva')"
                      :class="{ last: !(row.hasDetails && row.suoritemerkinta) }"
                    >
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
                          <font-awesome-icon icon="edit" fixed-width class="ml-2" />
                        </elsa-button>
                      </div>
                    </b-td>
                    <b-td :class="{ empty: !(row.hasDetails && row.suoritemerkinta) }">
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
  import compareDesc from 'date-fns/compareDesc'
  import { Component, Vue } from 'vue-property-decorator'

  import ElsaArviointiasteikonTaso from '@/components/arviointiasteikon-taso/arviointiasteikon-taso.vue'
  import ElsaButton from '@/components/button/button.vue'
  import ElsaPopover from '@/components/popover/popover.vue'
  import {
    Arviointiasteikko,
    Oppimistavoite,
    OppimistavoitteenKategoria,
    OppimistavoitteetTable,
    SuoritemerkintaRow,
    SuoritemerkintaWithDetails,
    ToggleableSuoritemerkinta
  } from '@/types'
  import { ArviointiasteikkoTyyppi } from '@/utils/constants'

  @Component({
    components: {
      ElsaButton,
      ElsaPopover,
      ElsaArviointiasteikonTaso
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
    osaamistavoitteet: OppimistavoitteetTable | null = null

    async mounted() {
      const oppimistavoitteet: OppimistavoitteetTable = (
        await axios.get('erikoistuva-laakari/oppimistavoitteet-taulukko')
      ).data
      this.osaamistavoitteet = {
        oppimistavoitteenKategoriat: oppimistavoitteet.oppimistavoitteenKategoriat,
        suoritemerkinnat: oppimistavoitteet.suoritemerkinnat.map((suoritemerkinta) => ({
          ...suoritemerkinta,
          showDetails: false
        }))
      }
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

    get oppimistavoitteenKategoriat() {
      if (this.osaamistavoitteet) {
        const suoritemerkinnatGroupByOppimistavoite = this.osaamistavoitteet.suoritemerkinnat.reduce(
          (
            result: Record<number, SuoritemerkintaWithDetails[]>,
            suoritemerkinta: ToggleableSuoritemerkinta
          ) => {
            const oppimistavoiteId = suoritemerkinta.oppimistavoite.id
            if (oppimistavoiteId in result) {
              result[oppimistavoiteId].push({
                suoritemerkinta,
                details: true
              })
            } else {
              result[oppimistavoiteId] = [
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

        return this.osaamistavoitteet.oppimistavoitteenKategoriat.map(
          (kategoria: OppimistavoitteenKategoria) => {
            const rows: SuoritemerkintaRow[] = kategoria.oppimistavoitteet.reduce(
              (result: SuoritemerkintaRow[], oppimistavoite: Oppimistavoite) => {
                // Kerätään oppimistavoitteen suoritemerkinnät ja järjestetään ne aikajärjestykseen
                const suoritemerkinnat = (
                  suoritemerkinnatGroupByOppimistavoite[oppimistavoite.id] || []
                ).sort((a, b) =>
                  compareDesc(a.suoritemerkinta.suorituspaiva, b.suoritemerkinta.suorituspaiva)
                )

                // Ensimmäinen suoritemerkintä esitetään oppimistavoitteen rivillä
                const suoritemerkinta =
                  suoritemerkinnat.length > 0 ? suoritemerkinnat[0] : undefined
                const suoritemerkinnatWithoutFirst = suoritemerkinnat.slice(1)

                result.push({
                  ...oppimistavoite,
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
          }
        )
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

  ::v-deep table {
    thead th {
      border-top: none;
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
    ::v-deep table {
      border-bottom: 0;

      tr {
        border: $table-border-width solid $table-border-color;
        border-radius: $border-radius;
        margin-top: 0.5rem;
        padding-top: $table-cell-padding;
        padding-bottom: $table-cell-padding;

        &.row-details {
          & > td:first-child,
          & > td:last-child {
            display: none;
          }
          td {
            &:nth-last-child(2) > div {
              padding-bottom: 0 !important;
            }
          }
        }
      }

      td {
        border: none;
        div {
          min-height: $font-size-base;
        }

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

        &.empty {
          display: none !important;
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
