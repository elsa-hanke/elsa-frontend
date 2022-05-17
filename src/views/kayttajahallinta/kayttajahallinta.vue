<template>
  <div class="kayttajahallinta">
    <b-container fluid>
      <b-row lg>
        <b-col>
          <h1>{{ $t('kayttajahallinta') }}</h1>
          <p>
            {{ $t('kayttajahallinta-ingressi') }}
            <span v-if="isVirkailija">{{ $t('naet-oman-yliopistosi-kayttajat') }}</span>
          </p>
          <elsa-button variant="primary" :to="{ name: 'uusi-kayttaja' }" class="mb-4">
            {{ $t('lisaa-uusi-kayttaja') }}
          </elsa-button>
          <div v-if="!initializing">
            <b-tabs content-class="mt-3" :no-fade="true">
              <b-tab :title="$t('erikoistujat')" active>
                <erikoistuvat-laakarit :rajaimet="rajaimet" />
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

  import { getKayttajahallintaRajaimet } from '@/api/kayttajahallinta'
  import ElsaButton from '@/components/button/button.vue'
  import ElsaFormGroup from '@/components/form-group/form-group.vue'
  import ElsaFormMultiselect from '@/components/multiselect/multiselect.vue'
  import ElsaPagination from '@/components/pagination/pagination.vue'
  import ElsaSearchInput from '@/components/search-input/search-input.vue'
  import { KayttajahallintaRajaimet } from '@/types'
  import { toastFail } from '@/utils/toast'
  import ErikoistuvatLaakarit from '@/views/kayttajahallinta/erikoistuvat-laakarit.vue'

  @Component({
    components: {
      ErikoistuvatLaakarit,
      ElsaButton,
      ElsaFormGroup,
      ElsaFormMultiselect,
      ElsaPagination,
      ElsaSearchInput
    }
  })
  export default class Kayttajahallinta extends Vue {
    initializing = true
    rajaimet: KayttajahallintaRajaimet | null = null

    async mounted() {
      try {
        await this.fetchRajaimet()
      } catch {
        toastFail(this, this.$t('kayttajien-hakeminen-epaonnistui'))
      }
      this.initializing = false
    }

    async fetchRajaimet() {
      this.rajaimet = (await getKayttajahallintaRajaimet()).data
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

  ::v-deep {
    .drop-down-filter {
      max-width: 25rem;
      label {
        font-weight: 300;
        text-transform: uppercase;
        font-size: $font-size-sm;
        margin-bottom: 0;
      }
    }

    @include media-breakpoint-down(sm) {
      .kayttajat-table {
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
