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
                <div v-if="kayttajatFormatted.length > 0" class="kayttajat-table">
                  <b-table :items="kayttajatFormatted" :fields="fields" stacked="md" responsive>
                    <template #cell(nimi)="row">
                      <elsa-button
                        :to="{
                          name: 'kayttaja',
                          params: { kayttajaId: row.item.id }
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
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator'

  import ElsaButton from '@/components/button/button.vue'

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
        key: 'erikoisala',
        label: this.$t('erikoisala'),
        sortable: true
      },
      {
        key: 'opiskelijatunnus',
        label: this.$t('opiskelijatunnus'),
        sortable: true
      }
    ]

    async mounted() {
      this.loading = false
    }

    get kayttajatFormatted() {
      return [
        {
          id: 1,
          nimi: 'Matti Meikäläinen',
          yliopisto: 'Tampere',
          erikoisala: 'Lastentaudit',
          opiskelijatunnus: 123456
        }
      ]
    }
  }
</script>

<style lang="scss" scoped>
  .kayttajahallinta {
    max-width: 1024px;
    padding-top: 0.75rem;
  }
</style>
