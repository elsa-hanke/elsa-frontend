<template>
  <div class="arvioitavat-kokonaisuudet" v-if="!loading && arvioitavatKokonaisuudet">
    <b-breadcrumb :items="items" class="mb-0" />
    <b-container fluid>
      <b-row lg>
        <b-col>
          <h1>{{ $t('arvioitavat-kokonaisuudet') }}</h1>
        </b-col>
      </b-row>
      <b-row lg v-for="(ak, index) in arvioitavatKokonaisuudet" :key="index">
        <b-col>
          <elsa-accordian :ref="ak.nimi" :visible="false">
            <template #title>
              {{ $i18n.locale == 'sv' ? ak.nimiSv : ak.nimi }}
            </template>
            <div class="mt-3 mb-3">
              <p v-html="$i18n.locale == 'sv' ? ak.kuvausSv : ak.kuvaus"></p>
            </div>
          </elsa-accordian>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script lang="ts">
  import axios from 'axios'
  import { Component, Vue } from 'vue-property-decorator'

  import ElsaAccordian from '@/components/accordian/accordian.vue'
  import store from '@/store'
  import { ArvioitavaKokonaisuus } from '@/types'
  import { toastFail } from '@/utils/toast'

  @Component({
    components: {
      ElsaAccordian
    }
  })
  export default class ArvioitavatKokonaisuudet extends Vue {
    private endpointUrl = 'erikoistuva-laakari/arvioitavatkokonaisuudet'
    private arvioitavatKokonaisuudet: ArvioitavaKokonaisuus[] = []
    private loading = false
    private items = [
      {
        text: this.$t('etusivu'),
        to: { name: 'etusivu' }
      },
      {
        text: this.$t('arvioitavat-kokonaisuudet'),
        active: true
      }
    ]

    async mounted() {
      await this.fetch()
    }

    get account() {
      return store.getters['auth/account']
    }

    async fetch() {
      try {
        this.loading = true
        this.arvioitavatKokonaisuudet = (await axios.get(this.endpointUrl)).data
        this.loading = false
      } catch {
        toastFail(this, this.$t('arvioitavien-kokonaisuuksien-hakeminen-epaonnistui'))
        this.loading = false
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '~@/styles/variables';
  .arvioitavat-kokonaisuudet {
    max-width: 1024px;
  }
</style>
