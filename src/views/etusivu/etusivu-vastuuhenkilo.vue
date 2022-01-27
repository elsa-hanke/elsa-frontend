<template>
  <b-container fluid class="mt-3">
    <h2>{{ $t('avoimet-asiat') }}</h2>
    <b-row class="mt-3">
      <b-col xxl="8">
        <arviointipyynnot-card />
        <koejaksot-card />
        <b-card-skeleton
          :header="$t('terveyskeskusjaksot')"
          :loading="true"
          class="mb-3"
        ></b-card-skeleton>
        <valmistumispyynnot-card />
        <erikoistujien-seuranta-card />
      </b-col>
      <b-col xxl="4">
        <b-row>
          <b-col xxl="12" lg="6">
            <henkilotiedot-card />
          </b-col>
          <b-col xxl="12" lg="6">
            <arvioinnin-tyokalut-card />
          </b-col>
        </b-row>
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator'

  import BCardSkeleton from '@/components/card/card.vue'
  import ArvioinninTyokalutCard from '@/components/etusivu-cards/arvioinnin-tyokalut-card.vue'
  import ArviointipyynnotCard from '@/components/etusivu-cards/arviointipyynnot-card.vue'
  import ErikoistujienSeurantaCard from '@/components/etusivu-cards/erikoistujien-seuranta-card.vue'
  import HenkilotiedotCard from '@/components/etusivu-cards/henkilotiedot-card.vue'
  import KoejaksotCard from '@/components/etusivu-cards/koejaksot-card.vue'
  import ValmistumispyynnotCard from '@/components/etusivu-cards/valmistumispyynnot-card.vue'

  @Component({
    components: {
      ArvioinninTyokalutCard,
      ArviointipyynnotCard,
      BCardSkeleton,
      ErikoistujienSeurantaCard,
      HenkilotiedotCard,
      KoejaksotCard,
      ValmistumispyynnotCard
    }
  })
  export default class EtusivuVastuuhenkilo extends Vue {}
</script>
