<template>
  <div class="tyoskentelyjaksot">
    <b-breadcrumb :items="items" class="mb-0" />
    <b-container fluid>
      <b-row lg>
        <b-col>
          <h1>{{ $t('tyokertymalaskuri') }}</h1>
          <!-- eslint-disable vue/no-v-html -->
          <p v-html="$t('tyokertymalaskuri-kuvaus', { opintooppaastaLinkki })" />
          <div class="d-flex flex-wrap mb-3 mb-lg-4">
            <elsa-button variant="primary" class="mb-2 mr-2" @click="showToast">
              {{ $t('lisaa-tyoskentelyjakso') }}
            </elsa-button>
            <!--
            <elsa-button variant="outline-primary" class="mb-2 mr-2" disabled="disabled">
              {{ $t('tulosta') }}
            </elsa-button>
            -->
          </div>
          <div v-if="tyoskentelyjaksotTaulukko != null && tilastot != null">
            <h2>{{ $t('laskennan-yhteenveto') }}</h2>
            <div class="d-flex justify-content-center border rounded pt-3 pb-2 mb-4">
              <div class="container-fluid">
                <elsa-form-group :label="$t('tyokertyma')">
                  <template #default="{ uid }">
                    <div :id="uid" class="d-flex flex-wrap">
                      <div class="d-flex flex-column mb-2 duration-card">
                        <span class="duration-text">
                          {{ $duration(tilastot.tyoskentelyaikaYhteensa) }}
                        </span>
                        <span class="text-size-sm">{{ $t('tyoskentelyaika') }}</span>
                      </div>
                      <div class="d-flex flex-column mb-2 duration-card">
                        <span class="duration-text">
                          {{ $duration(tilastot.poissaoloaikaYhteensa) }}
                        </span>
                        <span class="text-size-sm">
                          {{ $t('poissaolot') }}
                        </span>
                      </div>
                      <div class="d-flex flex-column mb-2 duration-card">
                        <span class="duration-text">
                          {{ $duration(tilastot.tyokertymaYhteensa) }}
                        </span>
                        <span class="text-size-sm">
                          {{ $t('tyokertyma-yhteensa') }}
                        </span>
                      </div>
                    </div>
                  </template>
                </elsa-form-group>
                <b-row>
                  <elsa-form-group :label="$t('kaytannon-koulutus')" class="col-xl-6 mb-0">
                    <template #default="{ uid }">
                      <div :id="uid" class="donut-chart">
                        <apexchart :options="donutOptions" :series="donutSeries"></apexchart>
                      </div>
                    </template>
                  </elsa-form-group>
                </b-row>
                <elsa-form-group
                  v-if="tyoskentelyjaksotTaulukko.terveyskeskuskoulutusjaksonHyvaksymispvm != null"
                  :label="$t('terveyskeskuskoulutusjakso')"
                >
                  <template #default="{ uid }">
                    <div :id="uid" class="d-flex flex-wrap">
                      <em class="align-middle">
                        <font-awesome-icon
                          :icon="['fas', 'check-circle']"
                          class="text-success mr-2"
                        />
                      </em>
                      <div>
                        {{
                          $t('terveyskeskuskoulutusjakso-on-hyvaksytty-pvm', {
                            pvm: $date(
                              tyoskentelyjaksotTaulukko.terveyskeskuskoulutusjaksonHyvaksymispvm
                            )
                          })
                        }}
                      </div>
                    </div>
                  </template>
                </elsa-form-group>
              </div>
            </div>
            <elsa-button variant="link" class="shadow-none p-0" :to="{ name: 'etusivu' }">
              {{ $t('siirry-elsan-etusivulle') }}
            </elsa-button>
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
  import { parseISO } from 'date-fns'
  import { Component, Vue } from 'vue-property-decorator'

  import { tyoskentelyjaksotTaulukkoData } from './tyoskentelyjaksot-offline-data'

  import ElsaButton from '@/components/button/button.vue'
  import ElsaFormGroup from '@/components/form-group/form-group.vue'
  import ElsaPoissaolonSyyt from '@/components/poissaolon-syyt/poissaolon-syyt.vue'
  import ElsaPopover from '@/components/popover/popover.vue'
  import TyoskentelyjaksotBarChart from '@/components/tyoskentelyjaksot-bar-chart.vue'
  import ElsaVanhaAsetusVaroitus from '@/components/vanha-asetus-varoitus/vanha-asetus-varoitus.vue'
  import {
    Keskeytysaika,
    TyoskentelyjaksotTable,
    TyoskentelyjaksotTilastotKaytannonKoulutus,
    TyoskentelyjaksotTilastotTyoskentelyjaksot
  } from '@/types'
  import { KaytannonKoulutusTyyppi, TerveyskeskuskoulutusjaksonTila } from '@/utils/constants'
  import { sortByDateDesc } from '@/utils/date'
  import { toastSuccess } from '@/utils/toast'
  import { ajankohtaLabel, tyoskentelyjaksoKaytannonKoulutusLabel } from '@/utils/tyoskentelyjakso'

  @Component({
    components: {
      ElsaButton,
      ElsaFormGroup,
      ElsaPopover,
      TyoskentelyjaksotBarChart,
      ElsaPoissaolonSyyt,
      ElsaVanhaAsetusVaroitus
    }
  })
  export default class Tyokertymalaskuri extends Vue {
    items = [
      {
        text: this.$t('kirjautuminen-linkki'),
        to: { name: 'login' }
      },
      {
        text: this.$t('tyokertymalaskuri'),
        active: true
      }
    ]
    tyoskentelyjaksotTaulukko: TyoskentelyjaksotTable | null = tyoskentelyjaksotTaulukkoData
    fields = [
      {
        key: 'tyoskentelypaikkaLabel',
        label: this.$t('tyoskentelypaikka'),
        sortable: true
      },
      {
        key: 'ajankohtaDate',
        label: this.$t('ajankohta'),
        sortable: true
      },
      {
        key: 'tyoskentelyaikaLabel',
        label: this.$t('tyoskentelyaika'),
        sortable: true
      },
      {
        key: 'osaaikaprosenttiLabel',
        label: this.$t('tyoaika'),
        sortable: true
      },
      {
        key: 'hyvaksyttyAiempaanErikoisalaanLabel',
        label: this.$t('hyvaksytty-toiselle-erikoisalalle'),
        sortable: true
      },
      {
        key: 'keskeytyksetLength',
        label: this.$t('poissaolot'),
        sortable: true
      }
    ]

    get tyoskentelyjaksot() {
      if (this.tyoskentelyjaksotTaulukko) {
        return this.tyoskentelyjaksotTaulukko.tyoskentelyjaksot
      } else {
        return []
      }
    }

    get keskeytykset() {
      if (this.tyoskentelyjaksotTaulukko) {
        return this.tyoskentelyjaksotTaulukko.keskeytykset
      } else {
        return []
      }
    }

    get tilastot() {
      if (this.tyoskentelyjaksotTaulukko) {
        return this.tyoskentelyjaksotTaulukko.tilastot
      } else {
        return undefined
      }
    }

    get tilastotKaytannonKoulutus() {
      if (this.tilastot) {
        return this.tilastot.kaytannonKoulutus
      } else {
        return []
      }
    }

    get tilastotTyoskentelyjaksot() {
      if (this.tilastot) {
        return this.tilastot.tyoskentelyjaksot
      } else {
        return []
      }
    }

    get tilastotKaytannonKoulutusSorted() {
      return [
        this.tilastotKaytannonKoulutus.find(
          (kk) => kk.kaytannonKoulutus === KaytannonKoulutusTyyppi.OMAN_ERIKOISALAN_KOULUTUS
        ),
        this.tilastotKaytannonKoulutus.find(
          (kk) => kk.kaytannonKoulutus === KaytannonKoulutusTyyppi.OMAA_ERIKOISALAA_TUKEVA_KOULUTUS
        ),
        this.tilastotKaytannonKoulutus.find(
          (kk) => kk.kaytannonKoulutus === KaytannonKoulutusTyyppi.TUTKIMUSTYO
        ),
        this.tilastotKaytannonKoulutus.find(
          (kk) => kk.kaytannonKoulutus === KaytannonKoulutusTyyppi.TERVEYSKESKUSTYO
        )
      ].filter((kk) => kk !== null) as TyoskentelyjaksotTilastotKaytannonKoulutus[]
    }

    get donutSeries() {
      return this.tilastotKaytannonKoulutusSorted.map((kk) => kk.suoritettu)
    }

    get donutOptions() {
      this.tilastotKaytannonKoulutus.map(
        (kk) =>
          `${tyoskentelyjaksoKaytannonKoulutusLabel(this, kk.kaytannonKoulutus)}: ${this.$duration(
            kk.suoritettu
          )}`
      )

      return {
        colors: ['#4EBDEF', '#FF8B06', '#808080', '#FFB406'],
        labels: [
          `${this.$t('oma-erikoisala')}: ${this.$duration(
            this.tilastotKaytannonKoulutusSorted[0].suoritettu
          )}`,
          `${this.$t('muu-erikoisala')}: ${this.$duration(
            this.tilastotKaytannonKoulutusSorted[1].suoritettu
          )}`,
          `${this.$t('kahden-vuoden-kliininen-tyokokemus')}: ${this.$duration(
            this.tilastotKaytannonKoulutusSorted[2].suoritettu
          )}`,
          `${this.$t('terveyskeskustyo')}: ${this.$duration(
            this.tilastotKaytannonKoulutusSorted[3].suoritettu
          )}`
        ],
        legend: {
          fontSize: '13px',
          fontFamily: 'Montserrat, Helvetica, Arial, sans-serif',
          onItemClick: {
            toggleDataSeries: false
          },
          onItemHover: {
            highlightDataSeries: false
          },
          offsetY: '1px'
        },
        chart: {
          type: 'donut',
          animations: {
            enabled: false
          }
        },
        dataLabels: {
          formatter: function (val: number) {
            return Math.round(val) + '%'
          },
          style: {
            fontSize: '8px',
            fontFamily: 'Montserrat, Helvetica, Arial, sans-serif'
          },
          dropShadow: {
            enabled: false
          }
        },
        plotOptions: {
          pie: {
            expandOnClick: false
          }
        },
        stroke: {
          show: false
        },
        states: {
          hover: {
            filter: {
              type: 'normal'
            }
          },
          active: {
            filter: {
              type: 'normal'
            }
          }
        },
        tooltip: {
          enabled: false
        },
        responsive: [
          {
            breakpoint: 768,
            options: {
              legend: {
                position: 'bottom',
                offsetY: 0
              }
            }
          }
        ]
      }
    }

    get opintooppaastaLinkki() {
      return `<a href="https://www.laaketieteelliset.fi/ammatillinen-jatkokoulutus/opinto-oppaat/" target="_blank" rel="noopener noreferrer">${(
        this.$t('tarkemmat-vaatimukset-opinto-oppaasta') as string
      ).toLowerCase()}</a>`
    }

    get tyoskentelyjaksotFormatted() {
      const keskeytyksetGroupByTyoskentelyjakso = this.keskeytykset.reduce(
        (result: { [key: number]: Partial<Keskeytysaika>[] }, keskeytysaika: Keskeytysaika) => {
          const tyoskentelyjaksoId = keskeytysaika?.tyoskentelyjakso?.id
          if (tyoskentelyjaksoId) {
            if (tyoskentelyjaksoId in result) {
              result[tyoskentelyjaksoId].push({
                id: keskeytysaika.id,
                alkamispaiva: keskeytysaika.alkamispaiva,
                paattymispaiva: keskeytysaika.paattymispaiva,
                poissaoloprosentti: keskeytysaika.poissaoloprosentti,
                poissaolonSyy: keskeytysaika.poissaolonSyy
              })
            } else {
              result[tyoskentelyjaksoId] = [
                {
                  id: keskeytysaika.id,
                  alkamispaiva: keskeytysaika.alkamispaiva,
                  paattymispaiva: keskeytysaika.paattymispaiva,
                  poissaoloprosentti: keskeytysaika.poissaoloprosentti,
                  poissaolonSyy: keskeytysaika.poissaolonSyy
                }
              ]
            }
          }
          return result
        },
        {}
      )

      const tilastotTyoskentelyjaksotMap = this.tilastotTyoskentelyjaksot.reduce(
        (
          result: { [key: number]: number },
          tyoskentelyjakso: TyoskentelyjaksotTilastotTyoskentelyjaksot
        ) => {
          result[tyoskentelyjakso.id] = tyoskentelyjakso.suoritettu
          return result
        },
        {}
      )

      return this.tyoskentelyjaksot
        .map((tj) => ({
          ...tj,
          tyoskentelypaikkaLabel: tj.tyoskentelypaikka.nimi,
          ajankohtaDate: tj.alkamispaiva ? parseISO(tj.alkamispaiva) : null,
          ajankohta: ajankohtaLabel(this, tj),
          tyoskentelyaikaLabel: tj.id ? this.$duration(tilastotTyoskentelyjaksotMap[tj.id]) : null,
          osaaikaprosenttiLabel: `${tj.osaaikaprosentti} %`,
          hyvaksyttyAiempaanErikoisalaanLabel: tj.hyvaksyttyAiempaanErikoisalaan
            ? this.$t('kylla')
            : this.$t('ei'),
          keskeytykset: (tj.id ? keskeytyksetGroupByTyoskentelyjakso[tj.id] : undefined) || [],
          keskeytyksetLength: (
            (tj.id ? keskeytyksetGroupByTyoskentelyjakso[tj.id] : undefined) || []
          ).length
        }))
        .sort((a, b) => sortByDateDesc(a.paattymispaiva, b.paattymispaiva))
    }

    get terveyskeskuskoulutusjaksoPalautettuKorjattavaksi() {
      return (
        this.tyoskentelyjaksotTaulukko?.terveyskeskuskoulutusjaksonTila ===
        TerveyskeskuskoulutusjaksonTila.PALAUTETTU_KORJATTAVAKSI
      )
    }

    get terveyskeskuskoulutusjaksoLahetetty() {
      return (
        this.tyoskentelyjaksotTaulukko?.terveyskeskuskoulutusjaksonTila ===
          TerveyskeskuskoulutusjaksonTila.ODOTTAA_VIRKAILIJAN_TARKISTUSTA ||
        this.tyoskentelyjaksotTaulukko?.terveyskeskuskoulutusjaksonTila ===
          TerveyskeskuskoulutusjaksonTila.ODOTTAA_VASTUUHENKILON_HYVAKSYNTAA
      )
    }

    get terveyskeskuskoulutusjaksoUusi() {
      return (
        this.tyoskentelyjaksotTaulukko?.terveyskeskuskoulutusjaksonTila ===
        TerveyskeskuskoulutusjaksonTila.UUSI
      )
    }

    showToast() {
      toastSuccess(this, 'todo')
    }
  }
</script>

<style lang="scss" scoped>
  @import '~@/styles/variables';
  @import '~bootstrap/scss/mixins/breakpoints';

  .tyoskentelyjaksot {
    max-width: 1024px;
  }

  .tilastot {
    padding: 200px;
  }

  .tyoskentelyjaksot-table {
    ::v-deep table {
      td {
        padding-top: 0;
        padding-bottom: 0;
        vertical-align: middle;

        .btn {
          text-align: left;
        }
      }
      .b-table-details {
        td {
          padding-left: 0;
          padding-right: 0;
          background-color: #f5f5f6;
        }
        table {
          th {
            padding-bottom: 0.3rem;
            padding-left: 0;
            padding-right: 0;
          }
          border-bottom: none;
        }
      }
    }
  }

  @include media-breakpoint-down(sm) {
    .tyoskentelyjaksot-table {
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

          & > div {
            width: 100% !important;
            padding: 0 0 0.5rem 0 !important;
          }

          .btn {
            padding: 0 0 !important;
          }

          &::before {
            text-align: left !important;
            font-weight: 500 !important;
            width: 100% !important;
            padding-right: 0 !important;
          }
        }

        .b-table-details {
          background-color: #f5f5f6;
          padding: 0 !important;

          & > td > div {
            padding: 0 !important;
          }

          table {
            tr {
              border: none;
              padding: 0 !important;
              border-bottom: $table-border-width solid $table-border-color;
              margin: 0;
              padding-top: $table-cell-padding !important;
              padding-bottom: $table-cell-padding !important;
            }
            tr:last-child {
              border-bottom: 0;
            }
            td {
              padding-left: $table-cell-padding;
              padding-right: $table-cell-padding;

              &:last-child > div {
                padding-bottom: 0 !important;
              }
            }
            margin: 0;
          }
        }
      }
    }
  }

  .duration-card {
    min-width: 300px;

    .duration-text {
      font-size: 1.25rem;
    }
  }

  .bar-chart {
    max-width: 450px;
  }

  .donut-chart {
    max-width: 450px;
  }
</style>
