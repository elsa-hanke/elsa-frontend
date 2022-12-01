<template>
  <div>
    <b-breadcrumb :items="items" class="mb-0" />
    <b-container fluid>
      <h1>{{ $t('koejakso') }}</h1>
      <b-row lg>
        <b-col cols="12" lg="5">
          <elsa-search-input
            class="mb-4 hakutermi"
            :hakutermi.sync="hakutermi"
            :placeholder="$t('hae-erikoistujan-nimella')"
          />
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <h3>{{ $t('avoimet') }}</h3>
          <div v-if="!loadingAvoimet">
            <b-alert v-if="avoimetRows === 0" variant="dark" show>
              <font-awesome-icon icon="info-circle" fixed-width class="text-muted" />
              <span v-if="hakutermi.length > 0">
                {{ $t('ei-hakutuloksia') }}
              </span>
              <span v-else>
                {{ $t('ei-koejaksoja') }}
              </span>
            </b-alert>
            <div v-else>
              <b-table
                fixed
                :items="avoimetKoejaksot.content"
                :fields="fields"
                :per-page="perPage"
                class="koejakson-vaiheet-table"
                details-td-class="row-details"
                tbody-tr-class="outer-table"
                stacked="md"
              >
                <template #table-colgroup>
                  <col span="1" width="18%" />
                  <col span="1" width="25%" />
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
                  <b-link
                    v-if="showCompleted(row.item)"
                    @click="row.toggleDetails"
                    class="text-decoration-none"
                  >
                    {{ row.detailsShowing ? $t('piilota') : $t('nayta') }} {{ $t('aiemmat') }}
                    <font-awesome-icon
                      :icon="row.detailsShowing ? 'chevron-up' : 'chevron-down'"
                      fixed-width
                      size="lg"
                      class="text-dark"
                    />
                  </b-link>
                </template>

                <template #row-details="row">
                  <b-table
                    :items="row.item.hyvaksytytVaiheet"
                    :fields="fields"
                    stacked="md"
                    fixed
                    tbody-tr-class="inner-table"
                  >
                    <template #table-colgroup>
                      <col span="1" width="18%" />
                      <col span="1" width="25%" />
                      <col span="1" width="27%" />
                      <col span="1" width="10%" />
                      <col span="1" width="20%" />
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

                    <template #cell(tila)>
                      <font-awesome-icon :icon="['fas', 'check-circle']" class="text-success" />
                      {{ $t('lomake-tila-HYVAKSYTTY') }}
                    </template>
                    >

                    <template #cell(pvm)="data">
                      {{ data.item.pvm ? $date(data.item.pvm) : '' }}
                    </template>
                  </b-table>
                </template>
              </b-table>
              <elsa-pagination
                @update:currentPage="onAvoinPageInput"
                :current-page="currentAvoinPage"
                :per-page="perPage"
                :rows="avoimetKoejaksot.totalElements"
              />
            </div>
          </div>
          <div v-else class="text-center">
            <b-spinner variant="primary" :label="$t('ladataan')" />
          </div>
          <h3 class="mt-4">{{ $t('valmiit-allekirjoitetut-palautetut') }}</h3>
          <div v-if="!loadingMuut">
            <b-alert v-if="muutRows === 0" variant="dark" show>
              <font-awesome-icon icon="info-circle" fixed-width class="text-muted" />
              <span v-if="hakutermi.length > 0">
                {{ $t('ei-hakutuloksia') }}
              </span>
              <span v-else>
                {{ $t('ei-koejaksoja') }}
              </span>
            </b-alert>
            <div v-else>
              <b-table
                fixed
                :items="muutKoejaksot.content"
                :fields="fields"
                :per-page="perPage"
                class="koejakson-vaiheet-table"
                details-td-class="row-details"
                tbody-tr-class="outer-table"
                stacked="md"
              >
                <template #table-colgroup>
                  <col span="1" width="18%" />
                  <col span="1" width="25%" />
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
                  <b-link
                    v-if="showCompleted(row.item)"
                    @click="row.toggleDetails"
                    class="text-decoration-none"
                  >
                    {{ row.detailsShowing ? $t('piilota') : $t('nayta') }} {{ $t('aiemmat') }}
                    <font-awesome-icon
                      :icon="row.detailsShowing ? 'chevron-up' : 'chevron-down'"
                      fixed-width
                      size="lg"
                      class="text-dark"
                    />
                  </b-link>
                </template>

                <template #row-details="row">
                  <b-table
                    :items="row.item.hyvaksytytVaiheet"
                    :fields="fields"
                    stacked="md"
                    fixed
                    tbody-tr-class="inner-table"
                  >
                    <template #table-colgroup>
                      <col span="1" width="18%" />
                      <col span="1" width="25%" />
                      <col span="1" width="27%" />
                      <col span="1" width="10%" />
                      <col span="1" width="20%" />
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

                    <template #cell(tila)>
                      <font-awesome-icon :icon="['fas', 'check-circle']" class="text-success" />
                      {{ $t('lomake-tila-HYVAKSYTTY') }}
                    </template>
                    >

                    <template #cell(pvm)="data">
                      {{ data.item.pvm ? $date(data.item.pvm) : '' }}
                    </template>
                  </b-table>
                </template>
              </b-table>
              <elsa-pagination
                @update:currentPage="onMuutPageInput"
                :current-page="currentMuutPage"
                :per-page="perPage"
                :rows="muutKoejaksot.totalElements"
              />
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
  import Vue from 'vue'
  import Component from 'vue-class-component'
  import { Watch } from 'vue-property-decorator'

  import ElsaButton from '@/components/button/button.vue'
  import ElsaFormGroup from '@/components/form-group/form-group.vue'
  import ElsaFormMultiselect from '@/components/multiselect/multiselect.vue'
  import ElsaPagination from '@/components/pagination/pagination.vue'
  import ElsaSearchInput from '@/components/search-input/search-input.vue'
  import { getKoejaksot } from '@/store/vastuuhenkilo'
  import { KoejaksonVaihe, Page } from '@/types'
  import { LomakeTilat, LomakeTyypit, TaskStatus } from '@/utils/constants'
  import { toastFail } from '@/utils/toast'

  @Component({
    components: {
      ElsaSearchInput,
      ElsaPagination,
      ElsaButton,
      ElsaFormGroup,
      ElsaFormMultiselect
    }
  })
  export default class KoejaksoViewVastuuhenkilo extends Vue {
    private loadingAvoimet = true
    private loadingMuut = true

    private componentLinks = new Map([
      [LomakeTyypit.KOULUTUSSOPIMUS, 'koulutussopimus'],
      [LomakeTyypit.ALOITUSKESKUSTELU, 'aloituskeskustelu-kouluttaja'],
      [LomakeTyypit.VALIARVIOINTI, 'valiarviointi-kouluttaja'],
      [LomakeTyypit.KEHITTAMISTOIMENPITEET, 'kehittamistoimenpiteet-kouluttaja'],
      [LomakeTyypit.LOPPUKESKUSTELU, 'loppukeskustelu-kouluttaja'],
      [LomakeTyypit.VASTUUHENKILON_ARVIO, 'vastuuhenkilon-arvio-vastuuhenkilo']
    ])

    avoimetKoejaksot: Page<KoejaksonVaihe> | null = null
    muutKoejaksot: Page<KoejaksonVaihe> | null = null

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
        sortable: false
      },
      {
        key: 'tyyppi',
        label: this.$t('koejakson-vaihe'),
        class: 'tyyppi',
        sortable: false
      },
      {
        key: 'tila',
        label: this.$t('tila'),
        class: 'tila',
        sortable: false
      },
      {
        key: 'pvm',
        label: this.$t('pvm'),
        class: 'pvm',
        sortable: false
      },
      {
        key: 'actions',
        label: '',
        sortable: false,
        class: 'actions'
      }
    ]

    currentAvoinPage = 1
    currentMuutPage = 1
    perPage = 20
    debounce?: number
    hakutermi = ''

    async mounted() {
      try {
        await this.fetchAll()
      } catch {
        toastFail(this, this.$t('koejaksojen-hakeminen-epaonnistui'))
      }
    }

    async fetchAll() {
      await Promise.all([this.fetchAvoimet(), this.fetchMuut()])
    }

    async fetchAvoimet() {
      this.loadingAvoimet = true
      this.avoimetKoejaksot = (
        await getKoejaksot({
          page: this.currentAvoinPage - 1,
          size: this.perPage,
          avoin: true,
          ...(this.hakutermi && { nimi: this.hakutermi })
        })
      ).data
      this.loadingAvoimet = false
    }

    async fetchMuut() {
      this.loadingMuut = true
      this.muutKoejaksot = (
        await getKoejaksot({
          page: this.currentMuutPage - 1,
          size: this.perPage,
          avoin: false,
          ...(this.hakutermi && { nimi: this.hakutermi })
        })
      ).data
      this.loadingMuut = false
    }

    @Watch('hakutermi')
    onPropertyChanged(value: string) {
      this.debounceSearch(value)
    }

    debounceSearch(value: string) {
      clearTimeout(this.debounce)
      this.debounce = setTimeout(() => {
        this.hakutermi = value
        this.onResultsFiltered()
      }, 400)
    }

    showCompleted(item: any) {
      const hyvaksytytVaiheet = Object.values(item.hyvaksytytVaiheet).some((x) => x !== null)
      if (item.tyyppi !== LomakeTyypit.KOULUTUSSOPIMUS && hyvaksytytVaiheet) {
        return true
      }
    }

    linkComponent(type: LomakeTyypit) {
      return this.componentLinks.get(type)
    }

    onAvoinPageInput(value: number) {
      this.currentAvoinPage = value
      this.fetchAvoimet()
    }

    onMuutPageInput(value: number) {
      this.currentMuutPage = value
      this.fetchMuut()
    }

    private async onResultsFiltered() {
      this.currentAvoinPage = 1
      this.currentMuutPage = 1
      await this.fetchAll()
    }

    get avoimetRows() {
      return this.avoimetKoejaksot?.content.length ?? 0
    }

    get muutRows() {
      return this.muutKoejaksot?.content.length ?? 0
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
          return ['far', 'clock']
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
        case LomakeTilat.ODOTTAA_ESIMIEHEN_HYVAKSYNTAA:
          return this.$t('lomake-tila-' + TaskStatus.ODOTTAA_ESIMIEHEN_HYVAKSYNTAA)
        case LomakeTilat.ODOTTAA_VASTUUHENKILON_HYVAKSYNTAA:
          return this.$t('lomake-tila-' + TaskStatus.ODOTTAA_VASTUUHENKILON_HYVAKSYNTAA)
        case LomakeTilat.ODOTTAA_TOISEN_KOULUTTAJAN_HYVAKSYNTAA:
          return this.$t('lomake-tila-' + TaskStatus.ODOTTAA_TOISEN_KOULUTTAJAN_HYVAKSYNTAA)
      }
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
