<template>
  <b-container fluid class="mt-3">
    <div>
      <h2>{{ $t('avoimet-asiat') }}</h2>
      <b-row class="mt-3">
        <b-col xxl="9">
          <div v-if="!loading">
            <b-alert v-if="showEiAvoimiaAsioita()" variant="dark" show>
              <font-awesome-icon icon="info-circle" fixed-width class="text-muted" />
              {{ $t('ei-avoimia-asioita') }}
            </b-alert>
            <koejaksot-card :vaiheet="koejaksoVaiheet" :showVaihe="false" />
            <valmistumispyynnot-card />
          </div>
          <div v-else class="text-center">
            <b-spinner variant="primary" :label="$t('ladataan')" />
          </div>
          <erikoistujien-seuranta-virkailija-card :yliopisto="yliopisto" />
        </b-col>
        <b-col xxl="3">
          <henkilotiedot-card />
        </b-col>
      </b-row>
    </div>
  </b-container>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator'

  import { getEtusivuKoejaksot, getYliopisto } from '@/api/virkailija'
  import BCardSkeleton from '@/components/card/card.vue'
  import ErikoistujienSeurantaVirkailijaCard from '@/components/etusivu-cards/erikoistujien-seuranta-virkailija-card.vue'
  import HenkilotiedotCard from '@/components/etusivu-cards/henkilotiedot-card.vue'
  import KoejaksotCard from '@/components/etusivu-cards/koejaksot-card.vue'
  import ValmistumispyynnotCard from '@/components/etusivu-cards/valmistumispyynnot-card.vue'
  import { KoejaksonVaihe } from '@/types'
  import { toastFail } from '@/utils/toast'

  @Component({
    components: {
      BCardSkeleton,
      ErikoistujienSeurantaVirkailijaCard,
      HenkilotiedotCard,
      KoejaksotCard,
      ValmistumispyynnotCard
    }
  })
  export default class EtusivuVirkailija extends Vue {
    loading = true
    yliopisto: string | null = null
    koejaksoVaiheet: KoejaksonVaihe[] | null = null

    async mounted() {
      this.fetchYliopisto()
      await this.fetchKoejaksonVaiheet()
      this.loading = false
    }

    async fetchYliopisto() {
      this.yliopisto = (await getYliopisto()).data
      this.loading = false
    }

    async fetchKoejaksonVaiheet() {
      try {
        this.koejaksoVaiheet = (await getEtusivuKoejaksot()).data
      } catch (err) {
        toastFail(this, this.$t('koejaksojen-hakeminen-epaonnistui'))
      }
    }

    showEiAvoimiaAsioita() {
      return this.loading == false && this.koejaksoVaiheet?.length == 0
    }
  }
</script>
