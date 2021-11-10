<template>
  <div class="paivittaiset-merkinnat">
    <b-breadcrumb :items="items" class="mb-0" />
    <b-container fluid>
      <b-row lg>
        <b-col>
          <div class="mb-4">
            <h1>{{ $t('paivittaiset-merkinnat') }}</h1>
            <p>{{ $t('paivittaiset-merkinnat-ingressi') }}</p>
            <elsa-button
              variant="primary"
              :to="{ name: 'uusi-paivittainen-merkinta' }"
              class="mb-2"
            >
              {{ $t('lisaa-merkinta') }}
            </elsa-button>
            <hr />
            <div v-if="!loading">
              <small>{{ $t('rajaa-merkintoja') | uppercase }}</small>
              <b-container fluid class="px-0" :class="{ 'mb-md-5': !anyFilterSelected }">
                <b-row>
                  <b-col md="4">
                    <elsa-form-group :label="$t('aihe')" class="mb-md-0">
                      <template v-slot="{ uid }">
                        <elsa-form-multiselect
                          :id="uid"
                          v-model="selected.aihe"
                          :options="aihekategoriat"
                          label="nimi"
                          track-by="jarjestysnumero"
                          @select="onAihekategoriaSelect"
                        ></elsa-form-multiselect>
                      </template>
                    </elsa-form-group>
                  </b-col>
                  <b-col md="6">
                    <elsa-form-group
                      :label="$t('ajankohta')"
                      class="mb-md-0"
                      :class="{ 'mb-0': anyFilterSelected }"
                    >
                      <template v-slot="{ uid }">
                        <div :id="uid" class="d-flex">
                          <elsa-form-datepicker
                            :value="selected.ajankohtaAlkaa"
                            @input="onAjankohtaAlkaaSelect"
                            :max="maxAjankohtaAlkaa"
                            class="mr-3"
                          />
                          <elsa-form-datepicker
                            :value="selected.ajankohtaPaattyy"
                            @input="onAjankohtaPaattyySelect"
                            :min="minAjankohtaPaattyy"
                            class="ml-3 datepicker-range"
                          />
                        </div>
                      </template>
                    </elsa-form-group>
                  </b-col>
                </b-row>
                <b-row>
                  <b-col>
                    <div class="d-flex flex-row-reverse">
                      <elsa-button
                        v-if="anyFilterSelected"
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
              <b-alert v-if="merkinnat.empty" variant="dark" show>
                <font-awesome-icon icon="info-circle" fixed-width class="text-muted" />
                <span>
                  {{ $t('ei-paivittaisia-merkintoja') }}
                </span>
              </b-alert>
              <div
                v-else
                v-for="(paivittainenMerkinta, index) in merkinnat.content"
                :key="index"
                class="d-flex flex-column border rounded p-2 mb-2"
              >
                <elsa-button
                  :to="{
                    name: 'paivittainen-merkinta',
                    params: { paivakirjamerkintaId: paivittainenMerkinta.id }
                  }"
                  variant="link"
                  class="d-flex p-0 border-0 shadow-none font-weight-500 text-left"
                >
                  {{ paivittainenMerkinta.oppimistapahtumanNimi }}
                </elsa-button>
                <div class="d-flex flex-wrap">
                  <small class="mr-2">{{ $date(paivittainenMerkinta.paivamaara) }}</small>
                  <b-badge
                    v-for="aihe in paivittainenMerkinta.aihekategoriat"
                    :key="aihe.id"
                    pill
                    variant="light"
                    class="font-weight-400 mr-2 mb-2"
                  >
                    {{
                      `${aihe.nimi}${
                        aihe.teoriakoulutus && paivittainenMerkinta.teoriakoulutus
                          ? `: ${paivittainenMerkinta.teoriakoulutus.koulutuksenNimi}`
                          : ''
                      }${aihe.muunAiheenNimi ? `: ${paivittainenMerkinta.muunAiheenNimi}` : ''}`
                    }}
                  </b-badge>
                </div>
                <div class="line-clamp">
                  {{ paivittainenMerkinta.reflektio }}
                </div>
              </div>
              <elsa-pagination
                @update:currentPage="onPageInput"
                :current-page="currentPage"
                :per-page="perPage"
                :rows="rows"
              />
            </div>
            <div v-else class="text-center">
              <b-spinner variant="primary" :label="$t('ladataan')" />
            </div>
          </div>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script lang="ts">
  import { Vue, Component } from 'vue-property-decorator'

  import { getPaivakirjamerkinnatRajaimet, getPaivittaisetMerkinnat } from '@/api/erikoistuva'
  import ElsaButton from '@/components/button/button.vue'
  import ElsaFormDatepicker from '@/components/datepicker/datepicker.vue'
  import ElsaFormGroup from '@/components/form-group/form-group.vue'
  import ElsaFormMultiselect from '@/components/multiselect/multiselect.vue'
  import ElsaPagination from '@/components/pagination/pagination.vue'
  import {
    Page,
    PaivakirjaAihekategoria,
    Paivakirjamerkinta,
    PaivakirjamerkintaRajaimet
  } from '@/types'
  import { toastFail } from '@/utils/toast'

  @Component({
    components: {
      ElsaButton,
      ElsaFormGroup,
      ElsaFormMultiselect,
      ElsaFormDatepicker,
      ElsaPagination
    }
  })
  export default class PaivittaisetMerkinnat extends Vue {
    items = [
      {
        text: this.$t('etusivu'),
        to: { name: 'etusivu' }
      },
      {
        text: this.$t('paivittaiset-merkinnat'),
        active: true
      }
    ]
    loading = true
    selected: {
      aihekategoriaId: number | null
      ajankohtaAlkaa: string | null
      ajankohtaPaattyy: string | null
    } = {
      aihekategoriaId: null,
      ajankohtaAlkaa: null,
      ajankohtaPaattyy: null
    }
    currentPage = 1
    perPage = 20
    rajaimet: PaivakirjamerkintaRajaimet | null = null
    merkinnat: Page<Paivakirjamerkinta> | null = null

    async mounted() {
      await Promise.all([this.fetchRajaimet(), this.fetch()])
      this.loading = false
    }

    async fetchRajaimet() {
      try {
        this.rajaimet = (await getPaivakirjamerkinnatRajaimet()).data
      } catch {
        toastFail(this, this.$t('paivittaisten-merkintojen-hakeminen-epaonnistui'))
      }
    }

    async fetch() {
      try {
        const merkinnat = (
          await getPaivittaisetMerkinnat({
            page: this.currentPage - 1,
            size: this.perPage,
            sort: 'paivamaara,id,desc',
            ...(this.selected.aihekategoriaId
              ? { 'aihekategoriaId.equals': this.selected.aihekategoriaId }
              : {}),
            ...(this.selected.ajankohtaAlkaa
              ? { 'paivamaara.greaterThanOrEqual': this.selected.ajankohtaAlkaa }
              : {}),
            ...(this.selected.ajankohtaPaattyy
              ? { 'paivamaara.lessThanOrEqual': this.selected.ajankohtaPaattyy }
              : {})
          })
        ).data
        this.merkinnat = {
          ...merkinnat,
          content: merkinnat.content.map((merkinta) => ({
            ...merkinta,
            aihekategoriat: merkinta.aihekategoriat.sort(
              (a, b) => (a.jarjestysnumero ?? 0) - (b.jarjestysnumero ?? 0)
            )
          }))
        }
      } catch {
        toastFail(this, this.$t('paivittaisten-merkintojen-hakeminen-epaonnistui'))
      }
    }

    onPageInput(value: number) {
      this.currentPage = value
      this.fetch()
    }

    onAihekategoriaSelect(selected: PaivakirjaAihekategoria) {
      this.currentPage = 1
      this.selected.aihekategoriaId = selected.id ?? null
      this.fetch()
    }

    onAjankohtaAlkaaSelect(value: string) {
      this.currentPage = 1
      this.selected.ajankohtaAlkaa = value
      this.fetch()
    }

    onAjankohtaPaattyySelect(value: string) {
      this.currentPage = 1
      this.selected.ajankohtaPaattyy = value
      this.fetch()
    }

    resetFilters() {
      this.currentPage = 1
      this.selected = {
        aihekategoriaId: null,
        ajankohtaAlkaa: null,
        ajankohtaPaattyy: null
      }
      this.fetch()
    }

    get maxAjankohtaAlkaa() {
      return this.selected.ajankohtaPaattyy
    }

    get minAjankohtaPaattyy() {
      return this.selected.ajankohtaAlkaa
    }

    get rows() {
      return this.merkinnat?.totalElements ?? 0
    }

    get aihekategoriat() {
      return this.rajaimet?.aihekategoriat ?? []
    }

    get anyFilterSelected() {
      return (
        this.selected.aihekategoriaId ||
        this.selected.ajankohtaAlkaa ||
        this.selected.ajankohtaPaattyy
      )
    }
  }
</script>

<style lang="scss" scoped>
  @import '~@/styles/variables';
  @import '~bootstrap/scss/mixins/breakpoints';

  .paivittaiset-merkinnat {
    max-width: 1024px;
  }

  .line-clamp {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    @include media-breakpoint-down(sm) {
      -webkit-line-clamp: 4;
    }
  }

  .datepicker-range::before {
    content: '–';
    position: absolute;
    left: -2rem;
    padding: 0.375rem 0.75rem;
  }
</style>
