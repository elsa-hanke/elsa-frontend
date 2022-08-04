<template>
  <b-container fluid class="mt-3">
    <b-row class="mt-3">
      <b-col xxl="9">
        <avoimet-asiat-card />
        <erikoistumisen-edistyminen-card />
        <b-row>
          <b-col xl="6">
            <b-card-skeleton
              :header="$t('koulutussuunnitelma')"
              :loading="true"
              class="mb-3 d-none"
            ></b-card-skeleton>
          </b-col>
          <b-col xl="6">
            <b-card-skeleton
              :header="$t('seurantakeskustelut')"
              :loading="true"
              class="mb-3 d-none"
            ></b-card-skeleton>
          </b-col>
        </b-row>
        <b-card-skeleton
          :header="$t('paivittaiset-merkinnat')"
          :loading="true"
          class="mb-3 d-none"
        ></b-card-skeleton>
      </b-col>
      <b-col xxl="3">
        <b-row>
          <b-col xxl="12" md="6" class="mt-4 mt-xxl-0">
            <henkilotiedot-card />
          </b-col>
          <b-card-skeleton
            :header="$t('arvioitavat-kokonaisuudet')"
            :loading="true"
            class="mb-3 d-none"
          ></b-card-skeleton>
        </b-row>
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator'

  import BCardSkeleton from '@/components/card/card.vue'
  import AvoimetAsiatCard from '@/components/etusivu-cards/avoimet-asiat-card.vue'
  import ErikoistumisenEdistyminenCard from '@/components/etusivu-cards/erikoistumisen-edistyminen-card.vue'
  import HenkilotiedotCard from '@/components/etusivu-cards/henkilotiedot-card.vue'

  @Component({
    components: {
      BCardSkeleton,
      AvoimetAsiatCard,
      ErikoistumisenEdistyminenCard,
      HenkilotiedotCard
    }
  })
  export default class EtusivuErikoistuja extends Vue {}
</script>
