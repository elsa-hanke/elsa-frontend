<template>
  <arvioinnit-list :arvioinnit="arvioinnit" />
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

    async mounted() {
      await this.fetch()
    }

    async fetch() {
      try {
        this.arvioinnit = (await axios.get('vastuuhenkilo/suoritusarvioinnit')).data
      } catch (err) {
        this.arvioinnit = []
      }
    }
  }
</script>
