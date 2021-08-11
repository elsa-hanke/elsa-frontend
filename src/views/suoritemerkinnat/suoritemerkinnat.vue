<template>
  <div class="suoritemerkinnat">
    <b-breadcrumb :items="items" class="mb-0 px-0"></b-breadcrumb>
    <b-container fluid>
      <b-row lg>
        <b-col class="px-0">
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
              <b-table-simple responsive>
                <b-thead>
                  <b-tr>
                    <b-th>{{ kategoria.nimi }} ({{ $t('toimenpiteita') }})</b-th>
                    <b-th>
                      {{ $t('luottamuksen-taso') }}
                      <elsa-popover>
                        <template>
                          <h3>{{ $t('luottamuksen-taso') }}</h3>
                          <div v-for="(taso, index) in luottamuksenTasot" :key="index">
                            <h4>{{ taso.arvo }} {{ $t(taso.nimi) }}</h4>
                            <p>{{ $t(taso.kuvaus) }}</p>
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
                    <b-td style="width: 45%">
                      <div v-if="!row.details" class="d-flex align-items-center">
                        {{ row.nimi }}
                      </div>
                    </b-td>
                    <b-td style="width: 40%">
                      <div class="d-flex align-items-center">
                        <elsa-luottamuksen-taso
                          v-if="row.suoritemerkinta"
                          :value="row.suoritemerkinta.luottamuksenTaso"
                        />
                      </div>
                    </b-td>
                    <b-td style="width: 15%">
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
                          {{ $date(row.suoritemerkinta.suorituspaiva) }}
                          <font-awesome-icon icon="edit" fixed-width class="ml-2" />
                        </elsa-button>
                      </div>
                    </b-td>
                    <b-td>
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
  import { parseISO } from 'date-fns'
  import ElsaButton from '@/components/button/button.vue'
  import ElsaPopover from '@/components/popover/popover.vue'
  import ElsaLuottamuksenTaso from '@/components/luottamuksen-taso/luottamuksen-taso.vue'
  import { luottamuksenTasot } from '@/utils/constants'

  @Component({
    components: {
      ElsaButton,
      ElsaPopover,
      ElsaLuottamuksenTaso
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
    osaamistavoitteet: any = null
    luottamuksenTasot = luottamuksenTasot

    async mounted() {
      const oppimistavoitteet = (await axios.get('erikoistuva-laakari/oppimistavoitteet-taulukko'))
        .data
      this.osaamistavoitteet = {
        oppimistavoitteenKategoriat: oppimistavoitteet.oppimistavoitteenKategoriat,
        suoritemerkinnat: oppimistavoitteet.suoritemerkinnat.map((suoritemerkinta: any) => ({
          ...suoritemerkinta,
          showDetails: false
        }))
      }
    }

    toggleDetails(row: any) {
      row.suoritemerkinta.showDetails = !row.suoritemerkinta.showDetails
    }

    get oppimistavoitteenKategoriat() {
      if (this.osaamistavoitteet) {
        const suoritemerkinnatGroupByOppimistavoite = this.osaamistavoitteet.suoritemerkinnat.reduce(
          (result: any, suoritemerkinta: any) => {
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

        return this.osaamistavoitteet.oppimistavoitteenKategoriat.map((kategoria: any) => {
          const rows = kategoria.oppimistavoitteet.reduce((result: any, oppimistavoite: any) => {
            // Kerätään oppimistavoitteen suoritemerkinnät ja järjestetään ne aikajärjestykseen
            const suoritemerkinnat = (
              suoritemerkinnatGroupByOppimistavoite[oppimistavoite.id] || []
            ).sort((a: any, b: any) =>
              compareDesc(
                parseISO(a.suoritemerkinta.suorituspaiva as string),
                parseISO(b.suoritemerkinta.suorituspaiva as string)
              )
            )

            // Ensimmäinen suoritemerkintä esitetään oppimistavoitteen rivillä
            const suoritemerkinta = suoritemerkinnat.length > 0 ? suoritemerkinnat[0] : undefined
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
          }, [])

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

  .row-details {
    background: #f5f5f6;
    td {
      border-top: none;
    }
  }
</style>
