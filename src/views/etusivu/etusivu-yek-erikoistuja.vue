<template>
  <b-container fluid class="mt-3">
    <b-row class="mt-3">
      <b-col xxl="9">
        <avoimet-asiat-card />
        <yek-koulutuksen-edistyminen-card />
      </b-col>
      <b-col xxl="3">
        <b-row>
          <b-col xxl="12" md="6" class="mt-4 mt-xxl-0">
            <henkilotiedot-card />
          </b-col>
        </b-row>
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator'

  import BCardSkeleton from '@/components/card/card.vue'
  import AvoimetAsiatCard from '@/components/etusivu-cards/avoimet-asiat-card.vue'
  import HenkilotiedotCard from '@/components/etusivu-cards/henkilotiedot-card.vue'
  import YekKoulutuksenEdistyminenCard from '@/components/etusivu-cards/yek-koulutuksen-edistyminen-card.vue'

  @Component({
    components: {
      BCardSkeleton,
      AvoimetAsiatCard,
      HenkilotiedotCard,
      YekKoulutuksenEdistyminenCard
    }
  })
  export default class EtusivuErikoistuja extends Vue {}
</script>
