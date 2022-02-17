<template>
  <b-container fluid class="mt-3">
    <div v-if="!loading">
      <h2>{{ $t('avoimet-asiat') }}</h2>
      <b-row class="mt-3">
        <b-col xxl="9">
          <arviointipyynnot-card />
          <koejaksot-card />
          <b-card-skeleton
            :header="$t('terveyskeskusjaksot')"
            :loading="true"
            class="mb-3"
          ></b-card-skeleton>
          <valmistumispyynnot-card />
          <erikoistujien-seuranta-card :seuranta="seuranta" />
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
    <div v-else class="text-center">
      <b-spinner variant="primary" :label="$t('ladataan')" />
    </div>
  </b-container>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator'

  import { getErikoistujienSeuranta } from '@/api/vastuuhenkilo'
  import BCardSkeleton from '@/components/card/card.vue'
  import ArvioinninTyokalutCard from '@/components/etusivu-cards/arvioinnin-tyokalut-card.vue'
  import ArviointipyynnotCard from '@/components/etusivu-cards/arviointipyynnot-card.vue'
  import ErikoistujienSeurantaCard from '@/components/etusivu-cards/erikoistujien-seuranta-card.vue'
  import HenkilotiedotCard from '@/components/etusivu-cards/henkilotiedot-card.vue'
  import KoejaksotCard from '@/components/etusivu-cards/koejaksot-card.vue'
  import ValmistumispyynnotCard from '@/components/etusivu-cards/valmistumispyynnot-card.vue'
  import { ErikoistujienSeuranta } from '@/types'
  import { toastFail } from '@/utils/toast'

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
  export default class EtusivuVastuuhenkilo extends Vue {
    loading = true
    seuranta: ErikoistujienSeuranta | null = null

    async mounted() {
      await this.fetchErikoistujienSeuranta()
      this.loading = false
    }

    async fetchErikoistujienSeuranta() {
      try {
        this.seuranta = (await getErikoistujienSeuranta()).data
      } catch (err) {
        toastFail(this, this.$t('erikoistujien-seurannan-hakeminen-epaonnistui'))
      }
    }
  }
</script>
