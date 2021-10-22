<template>
  <arvioinnit-list :arvioinnit="arvioinnit" />
</template>

<script lang="ts">
  import axios from 'axios'
  import { Component, Vue } from 'vue-property-decorator'

  import ArvioinnitList from '@/components/arvioinnit-list/arvioinnit-list.vue'
  import ElsaButton from '@/components/button/button.vue'

  @Component({
    components: {
      ElsaButton,
      ArvioinnitList
    }
  })
  export default class Arvioinnit extends Vue {
    private arvioinnit: null | any[] = null

    async mounted() {
      await this.fetch()
    }

    async fetch() {
      try {
        this.arvioinnit = (await axios.get('vastuuhenkilo/suoritusarvioinnit')).data
      } catch {
        this.arvioinnit = []
      }
    }
  }
</script>
