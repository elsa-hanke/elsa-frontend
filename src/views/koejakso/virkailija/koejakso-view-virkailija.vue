<template>
  <div>
    <koejakson-vaiheet-list-virkailija
      :loading="loading"
      :koejaksot="koejaksot"
      :componentLinks="componentLinks"
    />
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import Component from 'vue-class-component'

  import KoejaksonVaiheetListVirkailija from '@/components/koejakson-vaiheet/koejakson-vaiheet-list-virkailija.vue'
  import ElsaPagination from '@/components/pagination/pagination.vue'
  import store from '@/store'
  import { LomakeTyypit } from '@/utils/constants'

  @Component({
    components: {
      ElsaPagination,
      KoejaksonVaiheetListVirkailija
    }
  })
  export default class KoejaksoViewVirkailija extends Vue {
    private loading = true
    private componentLinks = new Map([
      [LomakeTyypit.KOULUTUSSOPIMUS, 'koulutussopimus'],
      [LomakeTyypit.ALOITUSKESKUSTELU, 'aloituskeskustelu-kouluttaja'],
      [LomakeTyypit.VALIARVIOINTI, 'valiarviointi-kouluttaja'],
      [LomakeTyypit.KEHITTAMISTOIMENPITEET, 'kehittamistoimenpiteet-kouluttaja'],
      [LomakeTyypit.LOPPUKESKUSTELU, 'loppukeskustelu-kouluttaja'],
      [LomakeTyypit.VASTUUHENKILON_ARVIO, 'vastuuhenkilon-arvio-vastuuhenkilo']
    ])

    async mounted() {
      await store.dispatch('virkailija/getKoejaksot')
      this.loading = false
    }

    get koejaksot() {
      return store.getters['virkailija/koejaksot']
    }
  }
</script>
