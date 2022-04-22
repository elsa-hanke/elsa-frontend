<template>
  <b-container fluid class="mt-3">
    <div v-if="!loading">
      <h2>{{ $t('avoimet-asiat') }}</h2>
      <b-row class="mt-3">
        <b-col xxl="9">
          <koejaksot-card />
          <valmistumispyynnot-card />
          <erikoistujien-seuranta-virkailija-card :yliopisto="yliopisto" />
        </b-col>
        <b-col xxl="3">
          <henkilotiedot-card />
        </b-col>
      </b-row>
    </div>
    <div v-else class="text-center">
      <b-spinner variant="primary" :label="$t('ladataan')" />
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
      this.fetchYliopisto()
    }

    async fetchYliopisto() {
      this.yliopisto = (await getYliopisto()).data
      this.loading = false
    }
  }
</script>
