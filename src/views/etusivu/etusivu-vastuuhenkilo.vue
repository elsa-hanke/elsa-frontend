<template>
  <b-container fluid class="mt-3">
    <div>
      <h2 class="mb-3">{{ $t('avoimet-asiat') }}</h2>
      <b-row>
        <b-col xxl="9">
          <arviointipyynnot-card />
          <koejaksot-card />
          <terveyskeskuskoulutusjaksot-card v-if="$isTerveyskeskuskoulutusjaksoVastuuhenkilo()" />
          <valmistumispyynnot-card />
          <h2 class="mt-5 mb-3">{{ $t('erikoistujien-seuranta') }}</h2>
          <erikoistujien-seuranta-card />
        </b-col>
        <b-col xxl="3">
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
    </div>
  </b-container>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator'

  import BCardSkeleton from '@/components/card/card.vue'
  import ArvioinninTyokalutCard from '@/components/etusivu-cards/arvioinnin-tyokalut-card.vue'
  import ArviointipyynnotCard from '@/components/etusivu-cards/arviointipyynnot-card.vue'
  import ArvioitavatKokonaisuudetCard from '@/components/etusivu-cards/arvioitavat-kokonaisuudet-card.vue'
  import ErikoistujienSeurantaCard from '@/components/etusivu-cards/erikoistujien-seuranta-card.vue'
  import HenkilotiedotCard from '@/components/etusivu-cards/henkilotiedot-card.vue'
  import KoejaksotCard from '@/components/etusivu-cards/koejaksot-card.vue'
  import TerveyskeskuskoulutusjaksotCard from '@/components/etusivu-cards/terveyskeskuskoulutusjaksot-card.vue'
  import ValmistumispyynnotCard from '@/components/etusivu-cards/valmistumispyynnot-card.vue'

  @Component({
    components: {
      ArvioinninTyokalutCard,
      ArviointipyynnotCard,
      BCardSkeleton,
      ErikoistujienSeurantaCard,
      HenkilotiedotCard,
      KoejaksotCard,
      TerveyskeskuskoulutusjaksotCard,
      ValmistumispyynnotCard,
      ArvioitavatKokonaisuudetCard
    }
  })
  export default class EtusivuVastuuhenkilo extends Vue {}
</script>
