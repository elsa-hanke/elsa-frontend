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
                    <elsa-form-group :label="$t('epa-osaamisalue')" class="mb-md-0">
                      <template v-slot="{ uid }">
                        <elsa-form-multiselect
                          :id="uid"
                          v-model="selected.epaOsaamisalue"
                          :options="options.epaOsaamisalueet"
                          label="nimi"
                          track-by="id"
                          @select="onEpaOsaamisalueSelect"
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
                          :options="options.kouluttajatAndVastuuhenkilot"
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
                          selected.epaOsaamisalue ||
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
                      <div v-for="(oa, index) in kategoria.osaalueet" :key="index">
                        <p class="font-weight-500 p-2 mb-0">{{ oa.nimi }}</p>
                        <div v-if="oa.arvioinnit.length > 0">
                          <b-table-simple small fixed class="mb-0">
                            <thead>
                              <tr class="text-size-sm">
                                <th scope="col">
                                  {{ $t('tapahtuma') | uppercase }}
                                </th>
                                <th scope="col">
                                  {{ $t('arviointi') | uppercase }}
                                </th>
                                <th scope="col">
                                  {{ $t('itsearviointi') | uppercase }}
                                </th>
                                <th scope="col">
                                  {{ $t('pvm') }}
                                </th>
                                <th scope="col">
                                  {{ $t('tyoskentelypaikka') | uppercase }}
                                </th>
                                <th scope="col">
                                  {{ $t('arvioinnin-antaja') | uppercase }}
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr
                                v-for="(arviointi, index) in oa.visible
                                  ? oa.arvioinnit
                                  : oa.arvioinnit.slice(0, 1)"
                                :key="`arviointi-${index}`"
                              >
                                <td>
                                  <elsa-button
                                    variant="link"
                                    :to="{
                                      name: 'arviointi',
                                      params: { arviointiId: arviointi.id }
                                    }"
                                    class="shadow-none p-0 text-truncate w-100 text-left"
                                  >
                                    {{ arviointi.arvioitavaTapahtuma }}
                                  </elsa-button>
                                </td>
                                <td>
                                  <elsa-badge
                                    v-if="arviointi.luottamuksenTaso"
                                    :value="arviointi.luottamuksenTaso"
                                  />
                                  <span v-else class="text-size-sm text-light-muted">
                                    {{ $t('ei-tehty-viela') }}
                                  </span>
                                </td>
                                <td>
                                  <elsa-badge
                                    v-if="arviointi.itsearviointiLuottamuksenTaso"
                                    :value="arviointi.itsearviointiLuottamuksenTaso"
                                  />
                                  <elsa-button
                                    v-else-if="!arviointi.lukittu"
                                    variant="primary"
                                    class="d-flex align-items-center text-decoration-none"
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
                                </td>
                                <td>
                                  {{ $date(arviointi.tapahtumanAjankohta) }}
                                </td>
                                <td>
                                  {{ arviointi.tyoskentelyjakso.tyoskentelypaikka.nimi }}
                                </td>
                                <td>{{ arviointi.arvioinninAntaja.nimi }}</td>
                              </tr>
                            </tbody>
                          </b-table-simple>
                          <div class="text-right">
                            <elsa-button
                              v-if="oa.arvioinnit.length > 1"
                              variant="link"
                              class="shadow-none font-weight-500"
                              @click="oa.visible = !oa.visible"
                            >
                              {{ `${$t('kaikki-arvioinnit')} (${oa.arvioinnit.length})` }}
                              <font-awesome-icon
                                :icon="oa.visible ? 'chevron-up' : 'chevron-down'"
                                fixed-width
                                class="ml-1 text-dark"
                              />
                            </elsa-button>
                          </div>
                        </div>
                        <p v-else class="text-light-muted p-2">
                          {{ $t('arviointeja-ei-ole-viela-tehty') }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-else class="text-center">
                  <b-spinner variant="primary" :label="$t('ladataan')" />
                </div>
              </div>
            </b-tab>
            <b-tab :title="$t('arviointipyynnot')">
              <div v-if="pyynnot">
                <div v-for="(arviointipyynto, index) in pyynnot" :key="index">
                  <arviointipyynto-card :value="arviointipyynto" />
                </div>
                <b-alert v-if="pyynnot.length === 0" variant="dark" show>
                  <font-awesome-icon icon="info-circle" fixed-width class="text-muted" />
                  {{ $t('kaikkiin-arviointipyyntoihisi-on-tehty-arviointi') }}
                </b-alert>
              </div>
              <div v-else class="text-center">
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
  import ElsaFormGroup from '@/components/form-group/form-group.vue'
  import ElsaFormMultiselect from '@/components/multiselect/multiselect.vue'
  import ElsaButton from '@/components/button/button.vue'
  import ElsaBadge from '@/components/badge/badge.vue'
  import { tyoskentelyjaksoLabel } from '@/utils/tyoskentelyjakso'
  import { decorate } from '@/utils/arvioinninAntajaListDecorator'

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
      epaOsaamisalue: null,
      kouluttajaOrVastuuhenkilo: null
    } as any
    options = {
      tyoskentelyjaksot: [],
      epaOsaamisalueet: [],
      kouluttajatAndVastuuhenkilot: []
    } as any
    omat: null | any[] = null
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
    kategoriat: null | any[] = null

    async mounted() {
      await this.fetchOptions()
      await this.fetch()
    }

    onTabChange(value: any) {
      this.selected = {
        tyoskentelyjakso: null,
        epaOsaamisalue: null,
        kouluttajaOrVastuuhenkilo: null
      }
      this.omat = null
      if (value === 0) {
        this.fetch()
      } else if (value === 1) {
        // Hetaan arviointipyynnöt pelkästään
        this.fetch({
          'arviointiAika.specified': false
        })
      }
    }

    async onTyoskentelyjaksoSelect(selected: any) {
      this.selected.tyoskentelyjakso = selected
      await this.fetch()
    }

    async onEpaOsaamisalueSelect(selected: any) {
      this.selected.epaOsaamisalue = selected
      await this.fetch()
    }

    async onKouluttajaOrVastuuhenkiloSelect(selected: any) {
      this.selected.kouluttajaOrVastuuhenkilo = selected
      await this.fetch()
    }

    async resetFilters() {
      this.selected = {
        tyoskentelyjakso: null,
        epaOsaamisalue: null,
        kouluttajaOrVastuuhenkilo: null
      }
      await this.fetch()
      this.solveKategoriat()
    }

    async fetchOptions() {
      this.options = (await axios.get('erikoistuva-laakari/suoritusarvioinnit-rajaimet')).data
      this.options.kouluttajatAndVastuuhenkilot = decorate(
        this,
        this.options.kouluttajatAndVastuuhenkilot
      )
    }

    async fetch(options: any = {}) {
      try {
        this.omat = (
          await axios.get('erikoistuva-laakari/suoritusarvioinnit', {
            params: {
              ...options,
              sort: 'tapahtumanAjankohta,desc',
              'tyoskentelyjaksoId.equals': this.selected.tyoskentelyjakso?.id,
              'arvioitavaOsaalueId.equals': this.selected.epaOsaamisalue?.id,
              'arvioinninAntajaId.equals': this.selected.kouluttajaOrVastuuhenkilo?.id
            }
          })
        ).data
        this.kategoriat = this.solveKategoriat()
      } catch (err) {
        this.omat = []
      }
    }

    solveKategoriat() {
      // Muodostetaan osa-alueet lista
      const osaalueet = (this.selected.tyoskentelyjakso || this.selected.kouluttajaOrVastuuhenkilo
        ? this.omat?.map((oma: any) => oma.arvioitavaOsaalue)
        : this.options.epaOsaamisalueet.filter((oa: any) =>
            this.selected.epaOsaamisalue ? oa.id === this.selected.epaOsaamisalue?.id : true
          )
      ).map((oa: any) => ({
        ...oa,
        arvioinnit: [],
        visible: false
      }))

      // Muodostetaan kategoriat lista
      let kategoriat: any[] = []
      osaalueet.forEach((oa: any) => {
        kategoriat.push({
          ...oa.kategoria,
          osaalueet: [],
          visible: true
        })
      })
      kategoriat = [...new Map(kategoriat.map((item: any) => [item['id'], item])).values()]

      // Laitetaan arvioinnin osa-alueihin
      if (this.omat) {
        this.omat.forEach((arviointi) => {
          const oa = osaalueet.find((oa: any) => oa.id === arviointi.arvioitavaOsaalueId)
          if (oa) {
            oa.arvioinnit.push(arviointi)
          }
        })
      }

      // Laitetaan osa-aluuet kategorioihin
      osaalueet.forEach((oa: any) => {
        const kategoria = kategoriat.find((k: any) => k.id === oa.kategoria.id)
        if (kategoria) {
          kategoria.osaalueet.push(oa)
        }
      })

      return kategoriat
    }

    get arvioinnit() {
      if (this.omat) {
        return this.omat
      }
      return null
    }

    get pyynnot() {
      if (this.omat) {
        return this.omat
      }
      return null
    }

    get tyoskentelyjaksotFormatted() {
      return this.options.tyoskentelyjaksot.map((tj: any) => ({
        ...tj,
        label: tyoskentelyjaksoLabel(this, tj)
      }))
    }
  }
</script>

<style lang="scss" scoped>
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

  .text-light-muted {
    color: #b1b1b1;
  }
</style>
