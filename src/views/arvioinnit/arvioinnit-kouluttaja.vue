<template>
  <arvioinnit-list :arvioinnit="arvioinnit" :loading="loading" />
</template>

<script lang="ts">
  import axios from 'axios'
  import { Component, Vue } from 'vue-property-decorator'
  import ElsaButton from '@/components/button/button.vue'
  import ArvioinnitList from '@/components/arvioinnit-list/arvioinnit-list.vue'

  @Component({
    components: {
      ElsaButton,
      ArvioinnitList
    }
  })
  export default class Arvioinnit extends Vue {
    private arvioinnit: null | any[] = null
    private loading = true

    async mounted() {
      await this.fetch()
      this.loading = false
    }

    async fetch() {
      try {
        this.arvioinnit = (await axios.get('kouluttaja/suoritusarvioinnit')).data
      } catch (err) {
        this.arvioinnit = []
      }
    }
  }
</script>
