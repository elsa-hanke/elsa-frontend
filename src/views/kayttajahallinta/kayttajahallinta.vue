<template>
  <div class="kayttajahallinta">
    <b-container fluid>
      <b-row lg>
        <b-col>
          <h1>{{ $t('kayttajahallinta') }}</h1>
          <p>{{ $t('kayttajahallinta-ingressi') }}</p>
          <elsa-button variant="primary" :to="{ name: 'uusi-kayttaja' }" class="mb-4">
            {{ $t('lisaa-uusi-kayttaja') }}
          </elsa-button>
          <div v-if="!loading">
            <b-tabs content-class="mt-3" :no-fade="true">
              <b-tab :title="$t('erikoistujat')" active>
                <div v-if="erikoistuvatLaakarit.length > 0" class="kayttajat-table">
                  <b-table :items="erikoistuvatLaakarit" :fields="fields" stacked="md" responsive>
                    <template #cell(nimi)="row">
                      <elsa-button
                        :to="{
                          name: 'kayttaja',
                          params: { kayttajaId: row.item.kayttajaId }
                        }"
                        variant="link"
                        class="p-0 shadow-none"
                      >
                        {{ row.item.nimi }}
                      </elsa-button>
                    </template>
                  </b-table>
                </div>
              </b-tab>
              <!-- <b-tab :title="$t('vastuuhenkilot')"></b-tab> -->
              <!-- <b-tab :title="$t('virkailijat')"></b-tab> -->
              <!-- <b-tab :title="$t('paakayttajat')"></b-tab> -->
            </b-tabs>
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
  import { Component, Vue } from 'vue-property-decorator'

  import { getErikoistuvatLaakarit } from '@/api/tekninen-paakayttaja'
  import ElsaButton from '@/components/button/button.vue'
  import { ErikoistuvaLaakari } from '@/types'
  import { toastFail } from '@/utils/toast'

  @Component({
    components: {
      ElsaButton
    }
  })
  export default class Kayttajahallinta extends Vue {
    loading = true
    fields = [
      {
        key: 'nimi',
        label: this.$t('nimi'),
        sortable: true
      },
      {
        key: 'yliopisto',
        label: this.$t('yliopisto'),
        sortable: true
      },
      {
        key: 'erikoisalaNimi',
        label: this.$t('erikoisala'),
        sortable: true
      },
      {
        key: 'opiskelijatunnus',
        label: this.$t('opiskelijatunnus'),
        sortable: true
      }
    ]
    erikoistuvatLaakarit: ErikoistuvaLaakari[] = []

    async mounted() {
      await this.getErikoistuvatLaakarit()
      this.loading = false
    }

    async getErikoistuvatLaakarit() {
      try {
        this.erikoistuvatLaakarit = (await getErikoistuvatLaakarit()).data
      } catch (err) {
        toastFail(this, this.$t('kayttajien-hakeminen-epaonnistui'))
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '~@/styles/variables';
  @import '~bootstrap/scss/mixins/breakpoints';

  .kayttajahallinta {
    max-width: 1024px;
    padding-top: 0.75rem;
  }

  @include media-breakpoint-down(sm) {
    .kayttajat-table {
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
