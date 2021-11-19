<template>
  <div class="arvioinnit">
    <b-breadcrumb :items="items" class="mb-0" />
    <b-container fluid>
      <b-row lg>
        <b-col>
          <h1>{{ $t('arvioinnit') }}</h1>
          <p>{{ $t('arvioinnit-kuvaus') }}</p>
          <elsa-button variant="primary" :to="{ name: 'arviointipyynto' }" class="mb-4">
            {{ $t('pyyda-arviointia') }}
          </elsa-button>
          <b-tabs content-class="mt-3" :no-fade="true" @input="onTabChange">
            <b-tab :title="$t('arvioinnit-ja-itsearvioinnit')" active>
              <b-container fluid class="px-0">
                <b-row>
                  <b-col md="4">
                    <elsa-form-group :label="$t('tyoskentelyjakso')" class="mb-md-0">
                      <template v-slot="{ uid }">
                        <elsa-form-multiselect
                          :id="uid"
                          v-model="selected.tyoskentelyjakso"
                          :options="tyoskentelyjaksotFormatted"
                          label="label"
                          track-by="id"
                          @select="onTyoskentelyjaksoSelect"
                        ></elsa-form-multiselect>
                      </template>
                    </elsa-form-group>
                  </b-col>
                  <b-col md="4">
                    <elsa-form-group :label="$t('arvioitava-kokonaisuus')" class="mb-md-0">
                      <template v-slot="{ uid }">
                        <elsa-form-multiselect
                          :id="uid"
                          v-model="selected.arvioitavaKokonaisuus"
                          :options="suoritusArvioinnitOptions.arvioitavatKokonaisuudet"
                          label="nimi"
                          track-by="id"
                          @select="onArvioitavaKokonaisuusSelect"
                        ></elsa-form-multiselect>
                      </template>
                    </elsa-form-group>
                  </b-col>
                  <b-col md="4">
                    <elsa-form-group :label="$t('kouluttaja-tai-vastuuhenkilo')" class="mb-0">
                      <template v-slot="{ uid }">
                        <elsa-form-multiselect
                          :id="uid"
                          v-model="selected.kouluttajaOrVastuuhenkilo"
                          :options="suoritusArvioinnitOptions.kouluttajatAndVastuuhenkilot"
                          label="nimi"
                          track-by="id"
                          @select="onKouluttajaOrVastuuhenkiloSelect"
                        ></elsa-form-multiselect>
                      </template>
                    </elsa-form-group>
                  </b-col>
                </b-row>
                <b-row>
                  <b-col>
                    <div class="d-flex flex-row-reverse">
                      <elsa-button
                        v-if="
                          selected.tyoskentelyjakso ||
                          selected.arvioitavaKokonaisuus ||
                          selected.kouluttajaOrVastuuhenkilo
                        "
                        variant="link"
                        class="shadow-none text-size-sm font-weight-500"
                        @click="resetFilters"
                      >
                        {{ $t('tyhjenna-valinnat') }}
                      </elsa-button>
                    </div>
                  </b-col>
                </b-row>
              </b-container>
              <div class="arvioinnit">
                <div v-if="kategoriat">
                  <div v-for="(kategoria, index) in kategoriat" :key="index" class="mt-3">
                    <elsa-button
                      variant="link"
                      class="text-decoration-none shadow-none border-0 text-dark p-0 w-100"
                      @click="kategoria.visible = !kategoria.visible"
                    >
                      <div class="kategoria-collapse p-2 font-weight-500 d-flex">
                        <div>
                          <font-awesome-icon
                            :icon="kategoria.visible ? 'caret-up' : 'caret-down'"
                            fixed-width
                            size="lg"
                            class="text-muted"
                          />
                          {{ kategoria.nimi }}
                        </div>
                      </div>
                    </elsa-button>
                    <div v-if="kategoria.visible">
                      <div v-for="(a, index) in kategoria.arvioitavatKokonaisuudet" :key="index">
                        <p class="font-weight-500 p-2 mb-0">{{ a.nimi }}</p>
                        <div v-if="a.arvioinnit.length > 0">
                          <b-table-simple small fixed class="mb-0" stacked="md" responsive>
                            <b-thead>
                              <b-tr class="text-size-sm">
                                <b-th scope="col" style="width: 12%">
                                  {{ $t('pvm') | uppercase }}
                                </b-th>
                                <b-th scope="col" style="width: 15%">
                                  {{ $t('tapahtuma') | uppercase }}
                                </b-th>
                                <b-th scope="col" style="width: 13%">
                                  {{ $t('arviointi') | uppercase }}
                                </b-th>
                                <b-th scope="col" style="width: 18%">
                                  {{ $t('itsearviointi') | uppercase }}
                                </b-th>
                                <b-th scope="col" style="width: 22%">
                                  {{ $t('tyoskentelypaikka') | uppercase }}
                                </b-th>
                                <b-th scope="col" style="width: 20%">
                                  {{ $t('arvioinnin-antaja') | uppercase }}
                                </b-th>
                              </b-tr>
                            </b-thead>
                            <b-tbody>
                              <b-tr
                                v-for="(arviointi, index) in a.visible
                                  ? a.arvioinnit
                                  : a.arvioinnit.slice(0, 1)"
                                :key="`arviointi-${index}`"
                              >
                                <b-td :stacked-heading="$t('pvm')">
                                  <elsa-button
                                    variant="link"
                                    :to="{
                                      name: 'arviointi',
                                      params: { arviointiId: arviointi.id }
                                    }"
                                    class="shadow-none p-0"
                                  >
                                    {{ $date(arviointi.tapahtumanAjankohta) }}
                                  </elsa-button>
                                </b-td>
                                <b-td :stacked-heading="$t('tapahtuma')">
                                  {{ arviointi.arvioitavaTapahtuma }}
                                </b-td>
                                <b-td :stacked-heading="$t('arviointi')">
                                  <elsa-badge
                                    v-if="arviointi.arviointiasteikonTaso"
                                    :value="arviointi.arviointiasteikonTaso"
                                    :variant="
                                      arviointi.arviointiasteikonTaso > 3 ? 'success' : 'light'
                                    "
                                  />
                                  <span v-else class="text-size-sm text-light-muted">
                                    {{ $t('ei-tehty-viela') }}
                                  </span>
                                </b-td>
                                <b-td :stacked-heading="$t('itsearviointi')">
                                  <elsa-badge
                                    v-if="arviointi.itsearviointiArviointiasteikonTaso"
                                    :value="arviointi.itsearviointiArviointiasteikonTaso"
                                  />
                                  <elsa-button
                                    v-else-if="!arviointi.lukittu"
                                    variant="primary"
                                    :to="{
                                      name: 'itsearviointi',
                                      params: { arviointiId: arviointi.id }
                                    }"
                                  >
                                    {{ $t('tee-itsearviointi') }}
                                  </elsa-button>
                                  <span v-else class="text-size-sm text-light-muted">
                                    {{ $t('ei-tehty') }}
                                  </span>
                                </b-td>
                                <b-td :stacked-heading="$t('tyoskentelypaikka')">
                                  {{ arviointi.tyoskentelyjakso.tyoskentelypaikka.nimi }}
                                </b-td>
                                <b-td :stacked-heading="$t('arvioinnin-antaja')">
                                  {{ arviointi.arvioinninAntaja.nimi }}
                                </b-td>
                              </b-tr>
                            </b-tbody>
                          </b-table-simple>
                          <div class="text-right">
                            <elsa-button
                              v-if="a.arvioinnit.length > 1"
                              variant="link"
                              class="shadow-none font-weight-500"
                              @click="a.visible = !a.visible"
                            >
                              {{ `${$t('kaikki-arvioinnit')} (${a.arvioinnit.length})` }}
                              <font-awesome-icon
                                :icon="a.visible ? 'chevron-up' : 'chevron-down'"
                                fixed-width
                                class="ml-1 text-dark"
                              />
                            </elsa-button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-else class="text-center mt-3">
                  <b-spinner variant="primary" :label="$t('ladataan')" />
                </div>
              </div>
            </b-tab>
            <b-tab :title="$t('arviointipyynnot')">
              <div v-if="arvioinnit">
                <div v-for="(arviointipyynto, index) in arvioinnit" :key="index">
                  <arviointipyynto-card :value="arviointipyynto" />
                </div>
                <b-alert v-if="arvioinnit.length === 0" variant="dark" show>
                  <font-awesome-icon icon="info-circle" fixed-width class="text-muted" />
                  {{ $t('kaikkiin-arviointipyyntoihisi-on-tehty-arviointi') }}
                </b-alert>
              </div>
              <div v-else class="text-center mt-3">
                <b-spinner variant="primary" :label="$t('ladataan')" />
              </div>
            </b-tab>
          </b-tabs>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script lang="ts">
  import axios from 'axios'
  import { Component, Vue } from 'vue-property-decorator'

  import ArviointipyyntoCard from '@/components/arviointipyynto-card/arviointipyynto-card.vue'
  import ElsaBadge from '@/components/badge/badge.vue'
  import ElsaButton from '@/components/button/button.vue'
  import ElsaFormGroup from '@/components/form-group/form-group.vue'
  import ElsaFormMultiselect from '@/components/multiselect/multiselect.vue'
  import {
    Suoritusarviointi,
    SuoritusarviointiFilter,
    SuoritusarvioinnitOptions,
    ArvioitavaKokonaisuus,
    ArvioitavanKokonaisuudenKategoria,
    Tyoskentelyjakso,
    Kayttaja
  } from '@/types'
  import { decorate } from '@/utils/arvioinninAntajaListDecorator'
  import { sortByDateDesc } from '@/utils/date'
  import { tyoskentelyjaksoLabel } from '@/utils/tyoskentelyjakso'

  @Component({
    components: {
      ArviointipyyntoCard,
      ElsaFormGroup,
      ElsaFormMultiselect,
      ElsaButton,
      ElsaBadge
    }
  })
  export default class ArvioinnitErikoistuva extends Vue {
    selected = {
      tyoskentelyjakso: null,
      arvioitavaKokonaisuus: null,
      kouluttajaOrVastuuhenkilo: null
    } as SuoritusarviointiFilter
    suoritusArvioinnitOptions = {
      tyoskentelyjaksot: [],
      arvioitavatKokonaisuudet: [],
      tapahtumat: [],
      kouluttajatAndVastuuhenkilot: []
    } as SuoritusarvioinnitOptions
    arvioinnit: null | Suoritusarviointi[] = null
    items = [
      {
        text: this.$t('etusivu'),
        to: { name: 'etusivu' }
      },
      {
        text: this.$t('arvioinnit'),
        active: true
      }
    ]
    kategoriat: null | ArvioitavanKokonaisuudenKategoria[] = null

    async mounted() {
      await this.fetchOptions()
      await this.fetch()
    }

    onTabChange(tabIndex: number) {
      this.selected = {
        tyoskentelyjakso: null,
        arvioitavaKokonaisuus: null,
        kouluttajaOrVastuuhenkilo: null
      }
      this.arvioinnit = null
      if (tabIndex === 0) {
        this.fetch()
      } else if (tabIndex === 1) {
        // Hetaan arviointipyynnöt pelkästään
        this.fetch({
          'arviointiAika.specified': false
        })
      }
    }

    async onTyoskentelyjaksoSelect(selected: Tyoskentelyjakso) {
      this.selected.tyoskentelyjakso = selected
      await this.fetch()
    }

    async onArvioitavaKokonaisuusSelect(selected: ArvioitavaKokonaisuus) {
      this.selected.arvioitavaKokonaisuus = selected
      await this.fetch()
    }

    async onKouluttajaOrVastuuhenkiloSelect(selected: Kayttaja) {
      this.selected.kouluttajaOrVastuuhenkilo = selected
      await this.fetch()
    }

    async resetFilters() {
      this.selected = {
        tyoskentelyjakso: null,
        arvioitavaKokonaisuus: null,
        kouluttajaOrVastuuhenkilo: null
      }
      await this.fetch()
    }

    async fetchOptions() {
      this.suoritusArvioinnitOptions = (
        await axios.get('erikoistuva-laakari/suoritusarvioinnit-rajaimet')
      ).data
      if (this.suoritusArvioinnitOptions) {
        this.suoritusArvioinnitOptions.kouluttajatAndVastuuhenkilot = decorate(
          this,
          this.suoritusArvioinnitOptions?.kouluttajatAndVastuuhenkilot
        )
      }
    }

    async fetch(options: any = {}) {
      try {
        this.arvioinnit = (
          await axios.get('erikoistuva-laakari/suoritusarvioinnit', {
            params: {
              ...options,
              'tyoskentelyjaksoId.equals': this.selected.tyoskentelyjakso?.id,
              'arvioitavaKokonaisuusId.equals': this.selected.arvioitavaKokonaisuus?.id,
              'arvioinninAntajaId.equals': this.selected.kouluttajaOrVastuuhenkilo?.id
            }
          })
        ).data?.sort((s1: Suoritusarviointi, s2: Suoritusarviointi) => {
          return sortByDateDesc(s1?.tapahtumanAjankohta, s2?.tapahtumanAjankohta)
        })
        this.kategoriat = this.solveKategoriat()
      } catch {
        this.arvioinnit = []
      }
    }

    solveKategoriat() {
      // Muodostetaan arvioitavat kokonaisuudet -lista
      const arvioitavatKokonaisuudetArray = (this.selected.tyoskentelyjakso ||
      this.selected.kouluttajaOrVastuuhenkilo
        ? this.arvioinnit?.map((arviointi: Suoritusarviointi) => arviointi.arvioitavaKokonaisuus)
        : this.suoritusArvioinnitOptions?.arvioitavatKokonaisuudet.filter(
            (a: ArvioitavaKokonaisuus) =>
              this.selected.arvioitavaKokonaisuus
                ? a.id === this.selected.arvioitavaKokonaisuus?.id
                : true
          )
      )
        ?.filter((x) => x != null)
        .map((a: ArvioitavaKokonaisuus | null) => ({
          ...a,
          arvioinnit: [],
          visible: false
        })) as ArvioitavaKokonaisuus[]
      const arvioitavatKokonaisuudetMap = [
        ...new Map(
          arvioitavatKokonaisuudetArray.map((a: ArvioitavaKokonaisuus) => [a['id'], a])
        ).values()
      ]

      // Muodostetaan kategoriat lista
      let kategoriat: ArvioitavanKokonaisuudenKategoria[] = []
      arvioitavatKokonaisuudetMap?.forEach((a: ArvioitavaKokonaisuus) => {
        kategoriat.push({
          ...a.kategoria,
          arvioitavatKokonaisuudet: [],
          visible: false
        })
      })
      kategoriat = [
        ...new Map(
          kategoriat.map((kategoria: ArvioitavanKokonaisuudenKategoria) => [
            kategoria['id'],
            kategoria
          ])
        ).values()
      ]

      // Liitetään arvioinnit arvioitaviin kokonaisuuksiin
      if (this.arvioinnit) {
        this.arvioinnit.forEach((arviointi) => {
          const arvioitavaKokonaisuus = arvioitavatKokonaisuudetMap?.find(
            (a: ArvioitavaKokonaisuus | null) => a?.id === arviointi.arvioitavaKokonaisuusId
          )
          if (arvioitavaKokonaisuus) {
            arvioitavaKokonaisuus.arvioinnit.push(arviointi)
          }
        })
      }

      // Liitetään osa-alueet kategorioihin
      arvioitavatKokonaisuudetMap?.forEach((a: ArvioitavaKokonaisuus) => {
        const kategoria = kategoriat.find(
          (k: ArvioitavanKokonaisuudenKategoria) => k.id === a.kategoria.id
        )
        if (kategoria) {
          if (a.arvioinnit.length > 0) {
            kategoria.visible = true
          }
          kategoria.arvioitavatKokonaisuudet.push(a)
        }
      })
      return kategoriat
    }

    get tyoskentelyjaksotFormatted() {
      return this.suoritusArvioinnitOptions?.tyoskentelyjaksot.map((tj: Tyoskentelyjakso) => ({
        ...tj,
        label: tyoskentelyjaksoLabel(this, tj)
      }))
    }
  }
</script>

<style lang="scss" scoped>
  @import '~@/styles/variables';
  @import '~bootstrap/scss/mixins/breakpoints';

  .arvioinnit {
    max-width: 1024px;
  }

  .kategoria-collapse {
    background: #f5f5f6;
  }

  ::v-deep .multiselect {
    .multiselect__option::after {
      display: none;
    }
  }

  ::v-deep table {
    thead tr th {
      border-top: none;
      border-bottom: none;
    }
    tbody tr:first-child td {
      border-top: none;
    }
    td {
      vertical-align: middle;
    }
    td,
    th {
      padding-left: 0.5rem;
      padding-right: 0.5rem;
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
      }

      td {
        border: none;
        padding: 0 $table-cell-padding;

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
      }
    }
  }

  .text-light-muted {
    color: #b1b1b1;
  }
</style>
