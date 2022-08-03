<template>
  <div class="opintosuoritukset">
    <b-breadcrumb :items="items" class="mb-0" />
    {{ opintosuoritukset }}
    <b-container fluid>
      <b-row lg>
        <b-col>
          <h1>{{ $t('opintosuoritukset') }}</h1>
          <p>{{ $t('opintosuoritukset-kuvaus') }}</p>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script lang="ts">
  import axios from 'axios'
  import { Component, Vue } from 'vue-property-decorator'

  import store from '@/store'
  import { OpintosuorituksetWrapper } from '@/types'

  @Component({
    components: {}
  })
  export default class Opintosuoritukset extends Vue {
    private endpointUrl = 'erikoistuva-laakari/opintosuoritukset'
    private opintosuoritukset: OpintosuorituksetWrapper[] = []
    private loading = false
    private uploading = false
    private sortBy = 'lisattypvm'
    private items = [
      {
        text: this.$t('etusivu'),
        to: { name: 'etusivu' }
      },
      {
        text: this.$t('opintosuoritukset'),
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
        this.opintosuoritukset = (await axios.get(this.endpointUrl)).data
      } catch {
        this.$t('asiakirjojen-haku-epaonnistui')
      }
      this.loading = false
    }
  }
</script>

<style lang="scss" scoped>
  .opintosuoritukset {
    max-width: 1024px;
  }
</style>
