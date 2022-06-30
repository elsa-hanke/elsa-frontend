<template>
  <b-container fluid class="mt-3">
    <div>
      <h2 class="mb-3">{{ $t('avoimet-asiat') }}</h2>
      <b-row class="mt-3">
        <b-col xxl="9">
          <arviointipyynnot-card />
          <b-card-skeleton
            :header="$t('seurantajaksot')"
            :loading="true"
            class="mb-3 d-none"
          ></b-card-skeleton>
          <koejaksot-card />
          <b-card-skeleton
            :header="$t('vanhenevat-katseluoikeudet')"
            :loading="true"
            class="mb-3 d-none"
          ></b-card-skeleton>
          <h2 class="mt-5 mb-3">{{ $t('erikoistujien-seuranta') }}</h2>
          <erikoistujien-seuranta-card :showKouluttajaKuvaus="true" />
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
  import ErikoistujienSeurantaCard from '@/components/etusivu-cards/erikoistujien-seuranta-card.vue'
  import HenkilotiedotCard from '@/components/etusivu-cards/henkilotiedot-card.vue'
  import KoejaksotCard from '@/components/etusivu-cards/koejaksot-card.vue'

  @Component({
    components: {
      ArvioinninTyokalutCard,
      ArviointipyynnotCard,
      BCardSkeleton,
      ErikoistujienSeurantaCard,
      HenkilotiedotCard,
      KoejaksotCard
    }
  })
  export default class EtusivuKouluttaja extends Vue {}
</script>
