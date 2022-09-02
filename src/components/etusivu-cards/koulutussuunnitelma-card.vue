<template>
  <b-card-skeleton
    :headerRoute="'koulutussuunnitelma'"
    :header="$t('koulutussuunnitelma')"
    :loading="loading"
    class="mb-5"
  >
    <div v-if="!loading">
      <div>
        <b-row>
          <b-col>
            <elsa-button
              :to="{
                name: 'koulutussuunnitelma'
              }"
              variant="link"
              class="pl-0 border-0 pt-0"
            >
              <h3 class="mb-0">
                {{ $t('henkilokohtainen-koulutussuunnitelma') }}
              </h3>
            </elsa-button>
            <p>
              <font-awesome-icon :icon="['fas', 'info-circle']" class="text-muted mr-0" />
              {{ $t('paivitetty-viimeksi') }}
              <b>xx.xx.xxx</b>
            </p>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <elsa-button
              :to="{
                name: 'koulutussuunnitelma'
              }"
              variant="link"
              class="pl-0 border-0 pt-0"
            >
              <h3 class="mb-0">
                {{ $t('koulutusjaksot') }}
              </h3>
            </elsa-button>
            <div>
              <elsa-button
                :to="{ name: 'koulutussuunnitelma/koulutusjaksot/uusi' }"
                variant="outline-primary"
                class="mb-3 mt-1"
              >
                {{ $t('lisaa-koulutusjakso') }}
              </elsa-button>
            </div>
          </b-col>
        </b-row>
      </div>
      <div v-if="koulutusjaksot.length > 0">
        <b-row v-for="(koulutusjakso, index) in koulutusjaksot" :key="index" lg>
          <b-col>
            <div class="d-flex justify-content-center border rounded pt-1 pb-1 mb-4">
              <div class="container-fluid">
                <elsa-button
                  :to="{
                    name: `koulutussuunnitelma/koulutusjaksot/${koulutusjakso.id} }`
                  }"
                  variant="link"
                  class="pl-0"
                >
                  <h3 class="mb-0">
                    {{ $t('koulutusjakso') }}
                  </h3>
                </elsa-button>
              </div>
            </div>
          </b-col>
        </b-row>
      </div>
      <div v-else>
        <b-alert :show="true" variant="dark">
          <div class="d-flex flex-row">
            <em class="align-middle">
              <font-awesome-icon :icon="['fas', 'info-circle']" class="text-muted mr-2" />
            </em>
            <div>{{ $t('ei-koulutusjaksoja') }}</div>
          </div>
        </b-alert>
      </div>
    </div>
  </b-card-skeleton>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator'

  import { getKoulutusjaksot, getKoulutussuunnitelma } from '@/api/erikoistuva'
  import ElsaButton from '@/components/button/button.vue'
  import BCardSkeleton from '@/components/card/card.vue'
  import store from '@/store'
  import { Koulutusjakso, Koulutussuunnitelma } from '@/types'
  import { toastFail } from '@/utils/toast'

  @Component({
    components: {
      BCardSkeleton,
      ElsaButton
    }
  })
  export default class KoulutussuunnitelmaCard extends Vue {
    koulutusjaksot: Koulutusjakso[] = []
    koulutussuunnitelma: Koulutussuunnitelma | null = null
    naytaKuvaus = false
    loading = true

    async mounted() {
      this.loading = true
      try {
        this.koulutusjaksot = (await getKoulutusjaksot()).data
      } catch {
        toastFail(this, this.$t('seurantakeskustelujen-hakeminen-epaonnistui'))
        this.koulutusjaksot = []
      }
      try {
        this.koulutussuunnitelma = (await getKoulutussuunnitelma()).data
      } catch {
        toastFail(this, this.$t('seurantakeskustelujen-hakeminen-epaonnistui'))
      }
      this.loading = false
    }

    get account() {
      return store.getters['auth/account']
    }
  }
</script>

<style lang="scss" scoped>
  @import '~@/styles/variables';
  @import '~bootstrap/scss/mixins/breakpoints';

  ::v-deep {
    .card-body {
      padding-top: 0.75rem;
      padding-bottom: 0.5rem;
    }
  }
</style>
