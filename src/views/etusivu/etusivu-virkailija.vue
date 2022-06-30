<template>
  <b-container fluid class="mt-3">
    <div>
      <h2 class="mb-3">{{ $t('avoimet-asiat') }}</h2>
      <b-row>
        <b-col xxl="9">
          <div v-if="!loading">
            <koejaksot-card :showVaihe="false" />
            <valmistumispyynnot-card />
          </div>
          <div v-else class="text-center">
            <b-spinner variant="primary" :label="$t('ladataan')" />
          </div>
          <h2 class="mt-5 mb-3">{{ $t('erikoistujien-seuranta') }}</h2>
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

  import { getYliopisto } from '@/api/virkailija'
  import BCardSkeleton from '@/components/card/card.vue'
  import ErikoistujienSeurantaVirkailijaCard from '@/components/etusivu-cards/erikoistujien-seuranta-virkailija-card.vue'
  import HenkilotiedotCard from '@/components/etusivu-cards/henkilotiedot-card.vue'
  import KoejaksotCard from '@/components/etusivu-cards/koejaksot-card.vue'
  import ValmistumispyynnotCard from '@/components/etusivu-cards/valmistumispyynnot-card.vue'

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

    async mounted() {
      await this.fetchYliopisto()
      this.loading = false
    }

    async fetchYliopisto() {
      this.yliopisto = (await getYliopisto()).data
      this.loading = false
    }
  }
</script>
