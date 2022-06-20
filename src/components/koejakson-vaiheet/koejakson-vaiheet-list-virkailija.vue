<template>
  <div>
    <b-breadcrumb :items="items" class="mb-0" />
    <b-container fluid>
      <b-row lg>
        <b-col>
          <h1>{{ $t('koejakso') }}</h1>
          <elsa-search-input
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
                {{ $t('ei-koejaksoja') }}
              </span>
            </b-alert>
          </div>
          <div v-else class="text-center">
            <b-spinner variant="primary" :label="$t('ladataan')" />
          </div>
          <div v-if="filterTulokset(tulokset, true).length > 0">
            <h3>{{ $t('avoimet') }}</h3>
            <b-table
              v-if="!loading && rows > 0"
              fixed
              :items="filterTulokset(tulokset, true)"
              :fields="fields"
              :per-page="perPage"
              :current-page="currentPage"
              class="koejakson-vaiheet-table"
              details-td-class="row-details"
              tbody-tr-class="outer-table"
              stacked="md"
            >
              <template #table-colgroup>
                <col span="1" width="43%" />
                <col span="1" width="27%" />
                <col span="1" width="10%" />
                <col span="1" width="20%" />
              </template>

              <template #head()="scope">
                <div class="border-top-0">{{ scope.label }}</div>
              </template>

              <template #cell(erikoistuvanNimi)="data">
                {{ data.item.erikoistuvanNimi }}
              </template>

              <template #cell(tyyppi)="data">
                <b-link
                  :to="{
                    name: linkComponent(data.item.tyyppi),
                    params: { id: data.item.id }
                  }"
                  class="task-type"
                >
                  {{ $t('lomake-tyyppi-' + data.item.tyyppi) }}
                </b-link>
              </template>

              <template #cell(tila)="data">
                <font-awesome-icon
                  :icon="taskIcon(data.item.tila)"
                  :class="taskClass(data.item.tila)"
                />
                {{ taskStatus(data.item.tila) }}
              </template>

              <template #cell(pvm)="data">
                <span class="text-nowrap">
                  {{ data.item.pvm ? $date(data.item.pvm) : '' }}
                </span>
              </template>

              <template #cell(actions)="row">
                <elsa-button
                  variant="primary"
                  :to="{
                    name: 'koejakso/virkailijan-tarkistus',
                    params: { id: row.item.id }
                  }"
                >
                  {{ $t('tarkista') }}
                </elsa-button>
              </template>
            </b-table>
          </div>
          <div v-if="filterTulokset(tulokset, false).length > 0">
            <h3 class="mt-3">{{ $t('valmiit-allekirjoitetut-palautetut') }}</h3>
            <b-table
              v-if="!loading && rows > 0"
              fixed
              :items="filterTulokset(tulokset, false)"
              :fields="fields"
              :per-page="perPage"
              :current-page="currentPage"
              class="koejakson-vaiheet-table"
              details-td-class="row-details"
              tbody-tr-class="outer-table"
              stacked="md"
            >
              <template #table-colgroup>
                <col span="1" width="43%" />
                <col span="1" width="27%" />
                <col span="1" width="10%" />
                <col span="1" width="20%" />
              </template>

              <template #head()="scope">
                <div class="border-top-0">{{ scope.label }}</div>
              </template>

              <template #cell(erikoistuvanNimi)="data">
                {{ data.item.erikoistuvanNimi }}
              </template>

              <template #cell(tyyppi)="data">
                <b-link
                  :to="{
                    name: linkComponent(data.item.tyyppi),
                    params: { id: data.item.id }
                  }"
                  class="task-type"
                >
                  {{ $t('lomake-tyyppi-' + data.item.tyyppi) }}
                </b-link>
              </template>

              <template #cell(tila)="data">
                <font-awesome-icon
                  :icon="taskIcon(data.item.tila)"
                  :class="taskClass(data.item.tila)"
                />
                {{ taskStatus(data.item.tila) }}
              </template>

              <template #cell(pvm)="data">
                <span class="text-nowrap">
                  {{ data.item.pvm ? $date(data.item.pvm) : '' }}
                </span>
              </template>
            </b-table>
          </div>
          <elsa-pagination
            v-if="loading"
            :current-page.sync="currentPage"
            :per-page="perPage"
            :rows="rows"
          />
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator'

  import ElsaButton from '@/components/button/button.vue'
  import ElsaPagination from '@/components/pagination/pagination.vue'
  import ElsaSearchInput from '@/components/search-input/search-input.vue'
  import { Page, KoejaksonVaihe } from '@/types'
  import { LomakeTyypit, LomakeTilat, TaskStatus } from '@/utils/constants'

  @Component({
    components: {
      ElsaSearchInput,
      ElsaPagination,
      ElsaButton
    }
  })
  export default class KoejaksonVaiheetListVirkailija extends Vue {
    @Prop({ required: true, default: undefined })
    koejaksot!: Page<KoejaksonVaihe>

    @Prop({ required: false, type: Boolean, default: false })
    loading!: boolean

    @Prop({ required: true, type: Map, default: undefined })
    componentLinks!: Map<string, string>

    items = [
      {
        text: this.$t('etusivu'),
        to: { name: 'etusivu' }
      },
      {
        text: this.$t('koejakso'),
        active: true
      }
    ]

    fields = [
      {
        key: 'erikoistuvanNimi',
        label: this.$t('erikoistuja'),
        class: 'nimi',
        sortable: true
      },
      {
        key: 'tila',
        label: this.$t('tila'),
        class: 'tila',
        sortable: true
      },
      {
        key: 'pvm',
        label: this.$t('pvm'),
        class: 'pvm',
        sortable: true
      },
      {
        key: 'actions',
        label: '',
        sortable: false,
        class: 'actions'
      }
    ]
    perPage = 20
    currentPage = 1
    hakutermi = ''

    get rows() {
      return this.tulokset?.length ?? 0
    }

    linkComponent(type: string) {
      return this.componentLinks.get(type)
    }

    taskIcon(status: string) {
      switch (status) {
        case LomakeTilat.ODOTTAA_HYVAKSYNTAA:
          return ['far', 'clock']
        case LomakeTilat.PALAUTETTU_KORJATTAVAKSI:
          return ['fas', 'undo-alt']
        case LomakeTilat.HYVAKSYTTY:
          return ['fas', 'check-circle']
        case LomakeTilat.ALLEKIRJOITETTU:
          return ['fas', 'check-circle']
        case LomakeTilat.ODOTTAA_ALLEKIRJOITUKSIA:
          return this.$isKouluttaja() ? ['far', 'check-circle'] : ['far', 'clock']
        case LomakeTilat.ODOTTAA_ERIKOISTUVAN_HYVAKSYNTAA:
          return ['far', 'check-circle']
        case LomakeTilat.ODOTTAA_ESIMIEHEN_HYVAKSYNTAA:
          return ['far', 'check-circle']
        case LomakeTilat.ODOTTAA_VASTUUHENKILON_HYVAKSYNTAA:
          return ['far', 'check-circle']
        case LomakeTilat.ODOTTAA_TOISEN_KOULUTTAJAN_HYVAKSYNTAA:
          return ['far', 'check-circle']
      }
    }

    taskClass(status: string) {
      switch (status) {
        case LomakeTilat.ODOTTAA_HYVAKSYNTAA:
          return 'text-warning'
        case LomakeTilat.PALAUTETTU_KORJATTAVAKSI:
          return ''
        case LomakeTilat.HYVAKSYTTY:
          return 'text-success'
        case LomakeTilat.ALLEKIRJOITETTU:
          return 'text-success'
        case LomakeTilat.ODOTTAA_ALLEKIRJOITUKSIA:
          return this.$isKouluttaja() ? 'text-success' : 'text-warning'
        case LomakeTilat.ODOTTAA_ERIKOISTUVAN_HYVAKSYNTAA:
          return 'text-success'
        case LomakeTilat.ODOTTAA_ESIMIEHEN_HYVAKSYNTAA:
          return 'text-success'
        case LomakeTilat.ODOTTAA_VASTUUHENKILON_HYVAKSYNTAA:
          return 'text-success'
        case LomakeTilat.ODOTTAA_TOISEN_KOULUTTAJAN_HYVAKSYNTAA:
          return 'text-success'
      }
    }

    taskStatus(status: string) {
      switch (status) {
        case LomakeTilat.ODOTTAA_HYVAKSYNTAA:
          return this.$t('lomake-tila-' + TaskStatus.AVOIN)
        case LomakeTilat.PALAUTETTU_KORJATTAVAKSI:
          return this.$t('lomake-tila-' + TaskStatus.PALAUTETTU)
        case LomakeTilat.HYVAKSYTTY:
          return this.$t('lomake-tila-' + TaskStatus.HYVAKSYTTY)
        case LomakeTilat.ALLEKIRJOITETTU:
          return this.$t('lomake-tila-' + TaskStatus.ALLEKIRJOITETTU)
        case LomakeTilat.ODOTTAA_ALLEKIRJOITUKSIA:
          return this.$isKouluttaja()
            ? this.$t('lomake-tila-' + TaskStatus.VALMIS_ODOTTAA_ALLEKIRJOITUKSIA)
            : this.$t('lomake-tila-' + TaskStatus.ODOTTAA_ALLEKIRJOITUKSIA)
        case LomakeTilat.ODOTTAA_ERIKOISTUVAN_HYVAKSYNTAA:
          return this.$t('lomake-tila-' + TaskStatus.ODOTTAA_ERIKOISTUVAN_HYVAKSYNTAA)
        case LomakeTilat.ODOTTAA_ESIMIEHEN_HYVAKSYNTAA:
          return this.$t('lomake-tila-' + TaskStatus.ODOTTAA_ESIMIEHEN_HYVAKSYNTAA)
        case LomakeTilat.ODOTTAA_VASTUUHENKILON_HYVAKSYNTAA:
          return this.$t('lomake-tila-' + TaskStatus.ODOTTAA_VASTUUHENKILON_HYVAKSYNTAA)
        case LomakeTilat.ODOTTAA_TOISEN_KOULUTTAJAN_HYVAKSYNTAA:
          return this.$t('lomake-tila-' + TaskStatus.ODOTTAA_TOISEN_KOULUTTAJAN_HYVAKSYNTAA)
      }
    }

    showCompleted(item: any) {
      const hyvaksytytVaiheet = Object.values(item.hyvaksytytVaiheet).some((x) => x !== null)
      if (item.tyyppi !== LomakeTyypit.KOULUTUSSOPIMUS && hyvaksytytVaiheet) {
        return true
      }
    }
    filterTulokset(tulokset: KoejaksonVaihe[], avoimet: boolean) {
      if (avoimet) {
        return tulokset.filter((item: any) => item.tila === LomakeTilat.ODOTTAA_ALLEKIRJOITUKSIA)
      } else {
        return tulokset.filter((item: any) => item.tila !== LomakeTilat.ODOTTAA_ALLEKIRJOITUKSIA)
      }
    }

    get tulokset() {
      if (this.hakutermi) {
        this.currentPage = 1
        return this.koejaksot?.content.filter((item: any) =>
          item.erikoistuvanNimi.toLowerCase().includes(this.hakutermi.toLowerCase())
        )
      }

      return this.koejaksot.content
    }
  }
</script>

<style lang="scss" scoped>
  @import '~@/styles/variables';
  @import '~bootstrap/scss/mixins/breakpoints';

  .task-type {
    text-transform: capitalize;
  }

  ::v-deep .koejakson-vaiheet-table {
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

        &.tyyppi,
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
</style>
