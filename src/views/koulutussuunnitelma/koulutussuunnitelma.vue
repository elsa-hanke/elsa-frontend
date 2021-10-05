<template>
  <div class="koulutussuunnitelma">
    <b-breadcrumb :items="items" class="mb-0" />
    <b-container fluid>
      <b-row lg>
        <b-col>
          <div v-if="!loading" class="mb-4">
            <h1>{{ $t('koulutussuunnitelma') }}</h1>
            <p>{{ $t('koulutussuunnitelma-kuvaus') }}</p>
            <hr />
            <h2>{{ $t('koulutusjaksot') }}</h2>
            <p>{{ $t('koulutusjaksot-kuvaus') }}</p>
            <elsa-button variant="primary" :to="{ name: 'uusi-koulutusjakso' }" class="mb-3">
              {{ $t('lisaa-koulutusjakso') }}
            </elsa-button>
            <b-table-simple
              v-if="koulutusjaksot && koulutusjaksot.length > 0"
              responsive
              stacked="md"
            >
              <b-thead>
                <b-tr>
                  <b-th style="width: 25%">{{ $t('koulutusjakso') }}</b-th>
                  <b-th style="width: 35%">{{ $t('tyoskentelyjaksot') }}</b-th>
                  <b-th>{{ $t('osaamistavoitteet-omalta-erikoisalalta') }}</b-th>
                </b-tr>
              </b-thead>
              <b-tbody>
                <b-tr v-for="koulutusjakso in koulutusjaksot" :key="koulutusjakso.id">
                  <b-td>
                    <elsa-button
                      :to="{
                        name: 'koulutusjakso',
                        params: { koulutusjaksoId: koulutusjakso.id }
                      }"
                      variant="link"
                      class="shadow-none p-0 border-0"
                    >
                      {{ koulutusjakso.nimi }}
                    </elsa-button>
                  </b-td>
                  <b-td>
                    <div
                      v-for="tyoskentelyjakso in koulutusjakso.tyoskentelyjaksot"
                      :key="tyoskentelyjakso.id"
                    >
                      {{ tyoskentelyjakso.tyoskentelypaikka.nimi }} ({{
                        tyoskentelyjakso.alkamispaiva ? $date(tyoskentelyjakso.alkamispaiva) : ''
                      }}
                      –
                      {{
                        tyoskentelyjakso.paattymispaiva
                          ? $date(tyoskentelyjakso.paattymispaiva)
                          : $t('kesken') | lowercase
                      }})
                    </div>
                  </b-td>
                  <b-td>
                    <b-badge
                      v-for="osaamistavoite in koulutusjakso.osaamistavoitteet"
                      :key="osaamistavoite.id"
                      pill
                      variant="light"
                      class="font-weight-400 mr-2"
                    >
                      {{ osaamistavoite.nimi }}
                    </b-badge>
                  </b-td>
                </b-tr>
              </b-tbody>
            </b-table-simple>
            <hr v-else />
            <h2>{{ $t('henkilokohtainen-koulutussuunnitelma') }}</h2>
            <p>
              {{ $t('henkilokohtainen-koulutussuunnitelma-kuvaus') }}
              <a
                href="https://www.laaketieteelliset.fi/ammatillinen-jatkokoulutus/opinto-oppaat/"
                target="_blank"
                rel="noopener noreferrer"
              >
                {{ $t('henkilokohtainen-koulutussuunnitelma-linkki') }}
              </a>
            </p>
            <div class="d-flex flex-wrap justify-content-between">
              <elsa-button
                variant="primary"
                :to="{ name: 'muokkaa-koulutussuunnitelma' }"
                class="mr-2 mb-3"
              >
                {{ $t('muokkaa-tietoja') }}
              </elsa-button>
              <elsa-button variant="link" class="text-decoration-none mb-3" :disabled="true">
                <font-awesome-icon icon="print" fixed-width class="mr-1" />
                {{ $t('tulosta-suunnitelma') }}
              </elsa-button>
            </div>
            <b-card
              v-if="koulutussuunnitelma.koulutussuunnitelmaAsiakirja"
              no-body
              class="border mb-3"
            >
              <b-card-text class="p-2">
                <b-table-simple responsive class="mb-0">
                  <b-thead>
                    <b-tr>
                      <b-th style="width: 40%">{{ $t('tiedoston-nimi') }}</b-th>
                      <b-th>{{ $t('lisatty') }}</b-th>
                    </b-tr>
                  </b-thead>
                  <b-tbody>
                    <b-tr>
                      <b-td>
                        <elsa-button
                          variant="link"
                          class="shadow-none p-0"
                          @click="onViewAsiakirja(koulutussuunnitelma.koulutussuunnitelmaAsiakirja)"
                          :loading="koulutussuunnitelma.koulutussuunnitelmaAsiakirja.disablePreview"
                        >
                          {{ koulutussuunnitelma.koulutussuunnitelmaAsiakirja.nimi }}
                        </elsa-button>
                      </b-td>
                      <b-td>
                        {{ $date(koulutussuunnitelma.koulutussuunnitelmaAsiakirja.lisattypvm) }}
                      </b-td>
                    </b-tr>
                  </b-tbody>
                </b-table-simple>
              </b-card-text>
            </b-card>
            <elsa-accordian icon="envelope-open-text">
              <template #title>
                {{ $t('motivaatiokirje') }}
                <span
                  v-if="koulutussuunnitelma.motivaatiokirjeYksityinen"
                  class="text-size-sm font-weight-400"
                >
                  ({{ $t('yksityinen') | lowercase }})
                </span>
              </template>
              <b-table-simple responsive v-if="koulutussuunnitelma.motivaatiokirjeAsiakirja">
                <b-thead>
                  <b-tr>
                    <b-th style="width: 40%">{{ $t('tiedoston-nimi') }}</b-th>
                    <b-th>{{ $t('lisatty') }}</b-th>
                  </b-tr>
                </b-thead>
                <b-tbody>
                  <b-tr>
                    <b-td>
                      <elsa-button
                        variant="link"
                        class="shadow-none p-0"
                        @click="onViewAsiakirja(koulutussuunnitelma.motivaatiokirjeAsiakirja)"
                        :loading="koulutussuunnitelma.motivaatiokirjeAsiakirja.disablePreview"
                      >
                        {{ koulutussuunnitelma.motivaatiokirjeAsiakirja.nimi }}
                      </elsa-button>
                    </b-td>
                    <b-td>
                      {{ $date(koulutussuunnitelma.motivaatiokirjeAsiakirja.lisattypvm) }}
                    </b-td>
                  </b-tr>
                </b-tbody>
              </b-table-simple>
              <div v-if="koulutussuunnitelma.motivaatiokirje">
                {{ koulutussuunnitelma.motivaatiokirje }}
              </div>
            </elsa-accordian>
            <elsa-accordian icon="toolbox">
              <template #title>
                {{ $t('opiskelu-ja-tyohistoria') }}
                <span
                  v-if="koulutussuunnitelma.opiskeluJaTyohistoriaYksityinen"
                  class="text-size-sm font-weight-400"
                >
                  ({{ $t('yksityinen') | lowercase }})
                </span>
              </template>
              <div v-if="koulutussuunnitelma.opiskeluJaTyohistoria">
                {{ koulutussuunnitelma.opiskeluJaTyohistoria }}
              </div>
            </elsa-accordian>
            <elsa-accordian icon="dumbbell">
              <template #title>
                {{ $t('vahvuudet') }}
                <span
                  v-if="koulutussuunnitelma.vahvuudetYksityinen"
                  class="text-size-sm font-weight-400"
                >
                  ({{ $t('yksityinen') | lowercase }})
                </span>
              </template>
              <div v-if="koulutussuunnitelma.vahvuudet">
                {{ koulutussuunnitelma.vahvuudet }}
              </div>
            </elsa-accordian>
            <elsa-accordian :icon="['far', 'eye']">
              <template #title>
                {{ $t('tulevaisuuden-visiointi') }}
                <span
                  v-if="koulutussuunnitelma.tulevaisuudenVisiointiYksityinen"
                  class="text-size-sm font-weight-400"
                >
                  ({{ $t('yksityinen') | lowercase }})
                </span>
              </template>
              <div v-if="koulutussuunnitelma.tulevaisuudenVisiointi">
                {{ koulutussuunnitelma.tulevaisuudenVisiointi }}
              </div>
            </elsa-accordian>
            <elsa-accordian icon="chart-line">
              <template #title>
                {{ $t('osaamisen-kartuttaminen') }}
                <span
                  v-if="koulutussuunnitelma.osaamisenKartuttaminenYksityinen"
                  class="text-size-sm font-weight-400"
                >
                  ({{ $t('yksityinen') | lowercase }})
                </span>
              </template>
              <div v-if="koulutussuunnitelma.osaamisenKartuttaminen">
                {{ koulutussuunnitelma.osaamisenKartuttaminen }}
              </div>
            </elsa-accordian>
            <elsa-accordian icon="theater-masks">
              <template #title>
                {{ $t('elamankentta') }}
                <span
                  v-if="koulutussuunnitelma.elamankenttaYksityinen"
                  class="text-size-sm font-weight-400"
                >
                  ({{ $t('yksityinen') | lowercase }})
                </span>
              </template>
              <div v-if="koulutussuunnitelma.elamankentta">
                {{ koulutussuunnitelma.elamankentta }}
              </div>
            </elsa-accordian>
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

  import { getKoulutusjaksot } from '@/api/erikoistuva'
  import ElsaAccordian from '@/components/accordian/accordian.vue'
  import ElsaButton from '@/components/button/button.vue'
  import { Asiakirja, Koulutusjakso } from '@/types'
  import { fetchAndOpenBlob } from '@/utils/blobs'
  import { toastFail } from '@/utils/toast'

  @Component({
    components: {
      ElsaAccordian,
      ElsaButton
    }
  })
  export default class Koulutussuunnitelma extends Vue {
    items = [
      {
        text: this.$t('etusivu'),
        to: { name: 'etusivu' }
      },
      {
        text: this.$t('koulutussuunnitelma'),
        active: true
      }
    ]

    koulutussuunnitelma: Koulutussuunnitelma | null = null
    koulutusjaksot: Koulutusjakso[] | null = null
    loading = true

    async mounted() {
      await Promise.all([this.fetchKoulutusjaksot(), this.fetchKoulutussuunnitelma()])
      this.loading = false
    }

    async fetchKoulutussuunnitelma() {
      try {
        this.koulutussuunnitelma = (await axios.get(`erikoistuva-laakari/koulutussuunnitelma`)).data
      } catch (err) {
        toastFail(this, this.$t('koulutussuunnitelman-hakeminen-epaonnistui'))
      }
    }

    async fetchKoulutusjaksot() {
      try {
        this.koulutusjaksot = (await getKoulutusjaksot()).data
      } catch (err) {
        toastFail(this, this.$t('koulutusjaksojen-hakeminen-epaonnistui'))
      }
    }

    async onViewAsiakirja(asiakirja: Asiakirja) {
      Vue.set(asiakirja, 'disablePreview', true)
      if (
        !asiakirja.id ||
        !(await fetchAndOpenBlob(asiakirja.id, asiakirja.nimi, 'erikoistuva-laakari/asiakirjat/'))
      ) {
        toastFail(this, this.$t('asiakirjan-sisallon-hakeminen-epaonnistui'))
      }
      Vue.set(asiakirja, 'disablePreview', false)
    }
  }
</script>

<style lang="scss" scoped>
  @import '~@/styles/variables';
  @import '~bootstrap/scss/mixins/breakpoints';

  .koulutussuunnitelma {
    max-width: 1024px;
  }

  ::v-deep table {
    border-bottom: 0;
  }

  ::v-deep .table-responsive.mb-0 {
    margin-bottom: 0;
  }
</style>
