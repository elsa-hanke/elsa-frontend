<template>
  <div class="erikoisala">
    <b-breadcrumb :items="items" class="mb-0" />
    <b-container fluid>
      <b-row lg>
        <b-col>
          <div v-if="!loading">
            <h1>{{ erikoisala.nimi }}</h1>
            <p>{{ $t('opetussuunnitelmat-kuvaus') }}</p>
            <b-tabs content-class="mt-3" :no-fade="true">
              <b-tab :title="$t('opintooppaat')" active>
                <opintooppaat />
              </b-tab>
              <b-tab :title="$t('arvioitavat-kokonaisuudet')" lazy></b-tab>
              <b-tab :title="$t('suoritteet')" lazy></b-tab>
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

  import { getErikoisala } from '@/api/tekninen-paakayttaja'
  import Pagination from '@/components/pagination/pagination.vue'
  import SearchInput from '@/components/search-input/search-input.vue'
  import { Erikoisala } from '@/types'
  import { toastFail } from '@/utils/toast'
  import Opintooppaat from '@/views/opetussuunnitelmat/opintoopas/opintooppaat.vue'

  @Component({
    components: {
      SearchInput,
      Pagination,
      Opintooppaat
    }
  })
  export default class ErikoisalaView extends Vue {
    erikoisala: Erikoisala | null = null

    loading = true

    get items() {
      return [
        {
          text: this.$t('etusivu'),
          to: { name: 'etusivu' }
        },
        {
          text: this.$t('opetussuunnitelmat'),
          to: { name: 'opetussuunnitelmat' }
        },
        {
          text: this.erikoisala?.nimi,
          active: true
        }
      ]
    }

    async mounted() {
      await this.fetchErikoisala()
      this.loading = false
    }

    async fetchErikoisala() {
      try {
        this.erikoisala = (await getErikoisala(this.$route?.params?.erikoisalaId)).data
      } catch (err) {
        toastFail(this, this.$t('erikoisalan-hakeminen-epaonnistui'))
        this.$router.replace({ name: 'opetussuunnitelmat' })
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

  ::v-deep {
    .erikoisalat-table {
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

          &.seurantajakso,
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
  }
</style>
