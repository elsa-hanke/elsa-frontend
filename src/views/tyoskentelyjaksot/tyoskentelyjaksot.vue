<template>
  <div class="tyoskentelyjaksot">
    <b-breadcrumb :items="items" class="mb-0" />
    <b-container fluid>
      <b-row lg>
        <b-col>
          <h1>{{ $t('tyoskentelyjaksot') }}</h1>
          <p>{{ $t('tyoskentelyjaksot-kuvaus') }}</p>
          <elsa-button variant="primary" :to="{ name: 'uusi-tyoskentelyjakso' }" class="mb-4 mr-2">
            {{ $t('lisaa-tyoskentelyjakso') }}
          </elsa-button>
          <elsa-button variant="outline-primary" :to="{ name: 'uusi-poissaolo' }" class="mb-4">
            {{ $t('lisaa-poissaolo') }}
          </elsa-button>
          <div v-if="!loading">
            <div class="d-flex justify-content-center border rounded pt-3 mb-4">
              <div class="container-fluid">
                <elsa-form-group :label="$t('tyoskentelyaika-erikoisalalla')">
                  <template v-slot="{ uid }">
                    <div :id="uid" class="d-flex flex-wrap">
                      <div class="d-flex flex-column mb-2 duration-card">
                        <span class="duration-text">
                          {{ $duration(tilastot.tyoskentelyaikaYhteensa) }}
                        </span>
                        <span class="text-size-sm">{{ $t('tyoskentelyaika-yhteensa') }}</span>
                      </div>
                      <div class="d-flex flex-column mb-2 duration-card">
                        <span class="duration-text">
                          {{ $duration(tilastot.arvioErikoistumiseenHyvaksyttavista) }}
                        </span>
                        <span class="text-size-sm">
                          {{ $t('arvio-erikoistumiseen-hyvaksyttavista') }}
                        </span>
                      </div>
                      <div class="d-flex flex-column mb-2 duration-card">
                        <span class="duration-text">
                          {{ $duration(tilastot.arvioPuuttuvastaKoulutuksesta) }}
                        </span>
                        <span class="text-size-sm">
                          {{ $t('arvio-puuttuvasta-koulutuksesta') }}
                        </span>
                      </div>
                    </div>
                  </template>
                </elsa-form-group>
                <b-row>
                  <elsa-form-group :label="$t('koulutustyypit')" class="col-xl-6 mb-0">
                    <template v-slot="{ uid }">
                      <div :id="uid" class="bar-chart">
                        <elsa-bar-chart :value="barValues" />
                      </div>
                    </template>
                  </elsa-form-group>
                  <elsa-form-group :label="$t('kaytannon-koulutus')" class="col-xl-6 mb-0">
                    <template v-slot="{ uid }">
                      <div :id="uid" class="donut-chart">
                        <apexchart :options="donutOptions" :series="donutSeries"></apexchart>
                      </div>
                    </template>
                  </elsa-form-group>
                </b-row>
                <b-row>
                  <b-col>
                    <div class="d-flex flex-row-reverse">
                      <elsa-button
                        :disabled="false"
                        variant="link"
                        class="shadow-none"
                        @click="toggleDays"
                      >
                        {{
                          showInDays
                            ? $t('nayta-likimaaraisina-sekayksikkoina')
                            : $t('nayta-vuorokausina')
                        }}
                      </elsa-button>
                    </div>
                  </b-col>
                </b-row>
              </div>
            </div>
            <div class="tyoskentelyjaksot-table">
              <b-table :items="tyoskentelyjaksotFormatted" :fields="fields" responsive>
                <template #table-colgroup="scope">
                  <col
                    v-for="field in scope.fields"
                    :key="field.key"
                    :style="{ width: field.width }"
                  />
                </template>
                <template #cell(tyoskentelypaikkaLabel)="row">
                  <elsa-button
                    :to="{
                      name: 'tyoskentelyjakso',
                      params: { tyoskentelyjaksoId: row.item.id }
                    }"
                    variant="link"
                    class="shadow-none px-0"
                  >
                    {{ row.item.tyoskentelypaikka.nimi }}
                  </elsa-button>
                </template>
                <template #cell(ajankohtaDate)="row">
                  {{ row.item.ajankohta }}
                </template>
                <template #cell(keskeytyksetLength)="row">
                  <elsa-button
                    v-if="row.item.keskeytyksetLength > 0"
                    variant="link"
                    class="shadow-none text-nowrap px-0"
                    @click="row.toggleDetails"
                  >
                    {{ row.item.keskeytyksetLength }}
                    {{
                      (row.item.keskeytyksetLength == 1 ? $t('poissaolo') : $t('poissaoloa'))
                        | lowercase
                    }}
                    <font-awesome-icon
                      :icon="row.detailsShowing ? 'chevron-up' : 'chevron-down'"
                      fixed-width
                      size="lg"
                      class="ml-2 text-dark"
                    />
                  </elsa-button>
                  <span v-else>
                    {{ $t('ei-poissaoloja') }}
                  </span>
                </template>
                <template #row-details="row">
                  <div class="px-3">
                    <b-table-simple responsive>
                      <b-thead>
                        <b-tr>
                          <b-th>
                            {{ $t('poissaolon-syy') }}
                            <elsa-popover>
                              <template>
                                <elsa-poissaolon-syyt :value="tilastotPoissaolonSyyt" />
                              </template>
                            </elsa-popover>
                          </b-th>
                          <b-th>{{ $t('ajankohta') }}</b-th>
                          <b-th>{{ $t('tyoaika') }}</b-th>
                        </b-tr>
                      </b-thead>
                      <b-tbody>
                        <b-tr v-for="(keskeytysaika, index) in row.item.keskeytykset" :key="index">
                          <b-td>
                            <elsa-button
                              :to="{
                                name: 'poissaolo',
                                params: { poissaoloId: keskeytysaika.id }
                              }"
                              variant="link"
                              class="shadow-none px-0"
                            >
                              {{ keskeytysaika.poissaolonSyy.nimi }}
                            </elsa-button>
                          </b-td>
                          <b-td>
                            {{
                              keskeytysaika.alkamispaiva != keskeytysaika.paattymispaiva
                                ? `${$date(keskeytysaika.alkamispaiva)}-${$date(
                                    keskeytysaika.paattymispaiva
                                  )}`
                                : $date(keskeytysaika.alkamispaiva)
                            }}
                          </b-td>
                          <b-td>
                            <span
                              v-if="keskeytysaika.osaaikaprosentti === row.item.osaaikaprosentti"
                            >
                              {{ $t('koko-tyoajan-poissaolo') }}
                            </span>
                            <span v-else>{{ 100 - keskeytysaika.osaaikaprosentti }} %</span>
                          </b-td>
                        </b-tr>
                      </b-tbody>
                    </b-table-simple>
                  </div>
                </template>
              </b-table>
            </div>
            <p class="text-size-sm">
              {{ $t('tyoskentelyjaksot-taulukko-kuvaus') }}
            </p>
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
  import { parseISO } from 'date-fns'
  import ElsaButton from '@/components/button/button.vue'
  import ElsaFormGroup from '@/components/form-group/form-group.vue'
  import ElsaPopover from '@/components/popover/popover.vue'
  import ElsaBarChart from '@/components/bar-chart/bar-chart.vue'
  import ElsaPoissaolonSyyt from '@/components/poissaolon-syyt/poissaolon-syyt.vue'
  import { ajankohtaLabel } from '@/utils/tyoskentelyjakso'
  import { toastFail } from '@/utils/toast'
  import { tyoskentelyjaksoKaytannonKoulutusLabel } from '@/utils/tyoskentelyjakso'
  import { durationOptions } from '@/plugins/date'

  @Component({
    components: {
      ElsaButton,
      ElsaFormGroup,
      ElsaPopover,
      ElsaBarChart,
      ElsaPoissaolonSyyt
    }
  })
  export default class Tyoskentelyjaksot extends Vue {
    items = [
      {
        text: this.$t('etusivu'),
        to: { name: 'etusivu' }
      },
      {
        text: this.$t('tyoskentelyjaksot'),
        active: true
      }
    ]
    tyoskentelyjaksotTaulukko = null as any
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
    loading = true

    async mounted() {
      await this.fetchTyoskentelyjaksot()
      this.loading = false
    }

    async fetchTyoskentelyjaksot() {
      try {
        this.tyoskentelyjaksotTaulukko = (
          await axios.get(`erikoistuva-laakari/tyoskentelyjaksot-taulukko`)
        ).data
      } catch (err) {
        toastFail(this, this.$t('tyoskentelyjaksojen-hakeminen-epaonnistui'))
      }
    }

    get showInDays() {
      return durationOptions.showInDays
    }

    toggleDays() {
      durationOptions.showInDays = !durationOptions.showInDays
    }

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

    get barValues() {
      if (this.tilastot) {
        return [
          {
            text: this.$t('terveyskeskus'),
            color: '#ffb406',
            backgroundColor: '#ffe19b',
            value: this.tilastot.koulutustyypit.terveyskeskusSuoritettu,
            minRequired: this.tilastot.koulutustyypit.terveyskeskusVaadittuVahintaan,
            highlight: false
          },
          {
            text: this.$t('yliopistosairaala'),
            color: '#0f9bd9',
            backgroundColor: '#9fd7ef',
            value: this.tilastot.koulutustyypit.yliopistosairaalaSuoritettu,
            minRequired: this.tilastot.koulutustyypit.yliopistosairaalaVaadittuVahintaan,
            highlight: false
          },
          {
            text: this.$t('yo-sair-ulkopuolinen'),
            color: '#8a86fb',
            backgroundColor: '#cfcdfd',
            value: this.tilastot.koulutustyypit.yliopistosairaaloidenUlkopuolinenSuoritettu,
            minRequired: this.tilastot.koulutustyypit
              .yliopistosairaaloidenUlkopuolinenVaadittuVahintaan,
            highlight: false
          },
          {
            text: this.$t('yhteensa'),
            color: '#41b257',
            backgroundColor: '#b3e1bc',
            value: this.tilastot.koulutustyypit.yhteensaSuoritettu,
            minRequired: this.tilastot.koulutustyypit.yhteensaVaadittuVahintaan,
            highlight: true
          }
        ]
      } else {
        return []
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

    get tilastotPoissaolonSyyt() {
      if (this.tyoskentelyjaksotTaulukko) {
        return this.tyoskentelyjaksotTaulukko.poissaolonSyyt
      } else {
        return []
      }
    }

    get tilastotKaytannonKoulutusSorted() {
      return [
        this.tilastotKaytannonKoulutus.find(
          (kk: any) => kk.kaytannonKoulutus === 'OMAN_ERIKOISALAN_KOULUTUS'
        ),
        this.tilastotKaytannonKoulutus.find(
          (kk: any) => kk.kaytannonKoulutus === 'OMAA_ERIKOISALAA_TUKEVA_KOULUTUS'
        ),
        this.tilastotKaytannonKoulutus.find((kk: any) => kk.kaytannonKoulutus === 'TUTKIMUSTYO'),
        this.tilastotKaytannonKoulutus.find(
          (kk: any) => kk.kaytannonKoulutus === 'TERVEYSKESKUSTYO'
        )
      ].filter((kk: any) => kk !== null)
    }

    get donutSeries() {
      return this.tilastotKaytannonKoulutusSorted.map((kk: any) => kk.suoritettu)
    }

    get donutOptions() {
      this.tilastotKaytannonKoulutus.map(
        (kk: any) =>
          `${tyoskentelyjaksoKaytannonKoulutusLabel(
            this,
            kk.kaytannonKoulutus
          )}: ${(this as any).$duration(kk.suoritettu)}`
      )

      return {
        colors: ['#41b257', '#0f9bd9', '#8a86fb', '#ffb406'],
        labels: [
          `${this.$t('oma-erikoisala')}: ${(this as any).$duration(
            this.tilastotKaytannonKoulutusSorted[0].suoritettu
          )}`,
          `${this.$t('omaa-erikoisalaa-tukeva')}: ${(this as any).$duration(
            this.tilastotKaytannonKoulutusSorted[1].suoritettu
          )}`,
          `${this.$t('tutkimustyo')}: ${(this as any).$duration(
            this.tilastotKaytannonKoulutusSorted[2].suoritettu
          )}`,
          `${this.$t('terveyskeskustyo')}: ${(this as any).$duration(
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
          }
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
                position: 'bottom'
              }
            }
          }
        ]
      }
    }

    get tyoskentelyjaksotFormatted() {
      const keskeytyksetGroupByTyoskentelyjakso = this.keskeytykset.reduce(
        (result: any, keskeytysaika: any) => {
          const tyoskentelyjaksoId = keskeytysaika.tyoskentelyjakso.id
          if (tyoskentelyjaksoId in result) {
            result[tyoskentelyjaksoId].push({
              id: keskeytysaika.id,
              alkamispaiva: keskeytysaika.alkamispaiva,
              paattymispaiva: keskeytysaika.paattymispaiva,
              osaaikaprosentti: keskeytysaika.osaaikaprosentti,
              poissaolonSyy: keskeytysaika.poissaolonSyy
            })
          } else {
            result[tyoskentelyjaksoId] = [
              {
                id: keskeytysaika.id,
                alkamispaiva: keskeytysaika.alkamispaiva,
                paattymispaiva: keskeytysaika.paattymispaiva,
                osaaikaprosentti: keskeytysaika.osaaikaprosentti,
                poissaolonSyy: keskeytysaika.poissaolonSyy
              }
            ]
          }
          return result
        },
        {}
      )

      const tilastotTyoskentelyjaksotMap = this.tilastotTyoskentelyjaksot.reduce(
        (result: any, tyoskentelyjakso: any) => {
          result[tyoskentelyjakso.id] = tyoskentelyjakso.suoritettu
          return result
        },
        {}
      )

      return this.tyoskentelyjaksot.map((tj: any) => ({
        ...tj,
        tyoskentelypaikkaLabel: tj.tyoskentelypaikka.nimi,
        ajankohtaDate: parseISO(tj.alkamispaiva),
        ajankohta: ajankohtaLabel(this, tj),
        tyoskentelyaikaLabel: (this as any).$duration(tilastotTyoskentelyjaksotMap[tj.id]),
        osaaikaprosenttiLabel: `${tj.osaaikaprosentti} %`,
        hyvaksyttyAiempaanErikoisalaanLabel: tj.hyvaksyttyAiempaanErikoisalaan
          ? this.$t('kylla')
          : this.$t('ei'),
        keskeytykset: keskeytyksetGroupByTyoskentelyjakso[tj.id] || [],
        keskeytyksetLength: (keskeytyksetGroupByTyoskentelyjakso[tj.id] || []).length
      }))
    }
  }
</script>

<style lang="scss" scoped>
  @import '~@/styles/variables';

  .tyoskentelyjaksot {
    max-width: 1024px;
  }

  .tilastot {
    padding: 200px;
  }

  .tyoskentelyjaksot-table {
    ::v-deep table {
      thead th {
        border-top: none;

        // Ilman tätä, rikkoo responsiivisuuden
        .sr-only {
          display: none;
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
      .b-table-details {
        td {
          padding-left: 0;
          padding-right: 0;
          background: #f5f5f6;
        }
        table {
          th {
            padding-bottom: 0.3rem;
            padding-left: 0;
            padding-right: 0;
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
