<template>
  <div class="teoriakoulutukset">
    <b-breadcrumb :items="items" class="mb-0" />
    <b-container fluid>
      <b-row lg>
        <b-col>
          <h1>{{ $t('teoriakoulutukset') }}</h1>
          <p v-html="$t('teoriakoulutukset-ingressi', { opintooppaastaLinkki, kopiLinkki })" />
          <elsa-button variant="primary" :to="{ name: 'uusi-teoriakoulutus' }" class="mb-4">
            {{ $t('lisaa-teoriakoulutus') }}
          </elsa-button>
          <div v-if="!loading">
            <div class="d-flex justify-content-center border rounded pt-3 mb-4">
              <b-container fluid>
                <elsa-form-group :label="$t('teoriakoulutusaika-yhteensa')">
                  <template v-slot="{ uid }">
                    <div :id="uid">
                      <elsa-progress-bar
                        :value="suoritettuTeoriakoulutusMaara"
                        :min-required="erikoisalanVaatimaTeoriakoulutustenVahimmaismaara"
                        :show-required-text="true"
                        color="#41b257"
                        background-color="#b3e1bc"
                        :customUnit="$t('t')"
                      />
                    </div>
                  </template>
                </elsa-form-group>
              </b-container>
            </div>
            <div v-if="teoriakoulutuksetFormatted.length > 0" class="teoriakoulutukset-table">
              <b-table :items="teoriakoulutuksetFormatted" :fields="fields" stacked="md" responsive>
                <template #cell(nimi)="row">
                  <elsa-button
                    :to="{
                      name: 'teoriakoulutus',
                      params: { teoriakoulutusId: row.item.id }
                    }"
                    variant="link"
                    class="p-0 shadow-none"
                  >
                    {{ row.item.nimi }}
                  </elsa-button>
                </template>
                <template #cell(todistus)="row">
                  <div v-for="todistus in row.item.todistukset" :key="todistus.id">
                    <elsa-button
                      @click="onViewAsiakirja(todistus)"
                      variant="link"
                      class="p-0 shadow-none"
                      :loading="todistus.disablePreview"
                    >
                      {{ todistus.nimi }}
                    </elsa-button>
                  </div>
                </template>
              </b-table>
            </div>
            <div v-else>
              <b-alert variant="dark" show>
                <font-awesome-icon icon="info-circle" fixed-width class="text-muted" />
                <span>
                  {{ $t('ei-teoriakoulutuksia') }}
                </span>
              </b-alert>
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
  import { Vue, Component } from 'vue-property-decorator'

  import { getTeoriakoulutukset } from '@/api/erikoistuva'
  import ElsaButton from '@/components/button/button.vue'
  import ElsaFormGroup from '@/components/form-group/form-group.vue'
  import ElsaProgressBar from '@/components/progress-bar/progress-bar.vue'
  import { Asiakirja, Erikoisala, Teoriakoulutus } from '@/types'
  import { fetchAndOpenBlob } from '@/utils/blobs'
  import { sortByDateDesc } from '@/utils/date'
  import { toastFail } from '@/utils/toast'

  @Component({
    components: {
      ElsaButton,
      ElsaFormGroup,
      ElsaProgressBar
    }
  })
  export default class Teoriakoulutukset extends Vue {
    items = [
      {
        text: this.$t('etusivu'),
        to: { name: 'etusivu' }
      },
      {
        text: this.$t('teoriakoulutukset'),
        active: true
      }
    ]
    loading = true
    fields = [
      {
        key: 'nimi',
        label: this.$t('koulutuksen-nimi'),
        sortable: true
      },
      {
        key: 'koulutuksenPaikka',
        label: this.$t('paikka'),
        sortable: true
      },
      {
        key: 'pvm',
        label: this.$t('pvm'),
        sortable: true
      },
      {
        key: 'erikoistumiseenHyvaksyttavaTuntimaara',
        label: this.$t('tunnit'),
        sortable: true
      },
      {
        key: 'todistus',
        label: this.$t('todistus'),
        sortable: false
      }
    ]
    teoriakoulutukset: Teoriakoulutus[] = []
    erikoisala: Erikoisala | null = null

    async mounted() {
      await this.fetchTeoriakoulutukset()
      this.loading = false
    }

    async fetchTeoriakoulutukset() {
      try {
        const { teoriakoulutukset, erikoisala } = (await getTeoriakoulutukset()).data
        this.teoriakoulutukset = teoriakoulutukset
        this.erikoisala = erikoisala
      } catch (err) {
        toastFail(this, this.$t('teoriakoulutuksien-hakeminen-epaonnistui'))
      }
    }

    get teoriakoulutuksetFormatted() {
      return this.teoriakoulutukset
        .sort((a: any, b: any) => sortByDateDesc(a.alkamispaiva, b.alkamispaiva))
        .map((teoriakoulutus) => ({
          ...teoriakoulutus,
          nimi: teoriakoulutus.koulutuksenNimi,
          pvm: `${(this as any).$date(teoriakoulutus.alkamispaiva)}${
            teoriakoulutus.paattymispaiva
              ? `-${(this as any).$date(teoriakoulutus.paattymispaiva)}`
              : ''
          }`,
          todistus: teoriakoulutus.todistukset
        }))
    }

    get suoritettuTeoriakoulutusMaara() {
      return this.teoriakoulutukset
        .map((teoriakoulutus) => teoriakoulutus.erikoistumiseenHyvaksyttavaTuntimaara)
        .reduce((a, b) => (a ?? 0) + (b ?? 0), 0)
    }

    get erikoisalanVaatimaTeoriakoulutustenVahimmaismaara() {
      return this.erikoisala?.erikoisalanVaatimaTeoriakoulutustenVahimmaismaara ?? 0
    }

    get opintooppaastaLinkki() {
      return `<a href="https://www.laaketieteelliset.fi/ammatillinen-jatkokoulutus/opinto-oppaat/" target="_blank" rel="noopener noreferrer">${(this.$t(
        'opinto-oppaasta'
      ) as string).toLowerCase()}</a>`
    }

    get kopiLinkki() {
      return `<a href="https://www.kopi.fi/" target="_blank" rel="noopener noreferrer">www.kopi.fi</a>`
    }

    async onViewAsiakirja(asiakirja: Asiakirja) {
      if (asiakirja.id) {
        Vue.set(asiakirja, 'disablePreview', true)
        const success = await fetchAndOpenBlob(
          asiakirja.id,
          asiakirja.nimi,
          'erikoistuva-laakari/asiakirjat/'
        )
        if (!success) {
          toastFail(this, this.$t('asiakirjan-sisallon-hakeminen-epaonnistui'))
        }

        Vue.set(asiakirja, 'disablePreview', false)
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '~@/styles/variables';
  @import '~bootstrap/scss/mixins/breakpoints';

  .teoriakoulutukset {
    max-width: 1024px;
  }

  @include media-breakpoint-down(sm) {
    .teoriakoulutukset-table {
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
          padding: 0 0.5rem;

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
        }
      }
    }
  }
</style>