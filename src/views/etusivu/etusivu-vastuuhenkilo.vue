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
            <arviointipyynnot-card />
            <koejaksot-card :vaiheet="koejaksoVaiheet" />
            <b-card-skeleton
              :header="$t('terveyskeskusjaksot')"
              :loading="true"
              class="mb-3 d-none"
            ></b-card-skeleton>
            <valmistumispyynnot-card />
          </div>
          <div v-else class="text-center">
            <b-spinner variant="primary" :label="$t('ladataan')" />
          </div>
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
  </b-container>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator'

  import { getErikoistujienSeuranta, getEtusivuKoejaksot } from '@/api/vastuuhenkilo'
  import BCardSkeleton from '@/components/card/card.vue'
  import ArvioinninTyokalutCard from '@/components/etusivu-cards/arvioinnin-tyokalut-card.vue'
  import ArviointipyynnotCard from '@/components/etusivu-cards/arviointipyynnot-card.vue'
  import ErikoistujienSeurantaCard from '@/components/etusivu-cards/erikoistujien-seuranta-card.vue'
  import HenkilotiedotCard from '@/components/etusivu-cards/henkilotiedot-card.vue'
  import KoejaksotCard from '@/components/etusivu-cards/koejaksot-card.vue'
  import ValmistumispyynnotCard from '@/components/etusivu-cards/valmistumispyynnot-card.vue'
  import { ErikoistujienSeuranta, KoejaksonVaihe } from '@/types'
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
    koejaksoVaiheet: KoejaksonVaihe[] | null = null

    async mounted() {
      await this.fetchErikoistujienSeuranta()
      await this.fetchKoejaksonVaiheet()
      this.loading = false
    }

    async fetchErikoistujienSeuranta() {
      try {
        this.seuranta = (await getErikoistujienSeuranta()).data
      } catch (err) {
        toastFail(this, this.$t('erikoistujien-seurannan-hakeminen-epaonnistui'))
      }
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
