<template>
  <koejakson-vaiheet-list
    :loading="loading"
    :koejaksot="koejaksot"
    :componentLinks="componentLinks"
  />
</template>

<script lang="ts">
  import Vue from 'vue'
  import Component from 'vue-class-component'
  import store from '@/store'
  import KoejaksonVaiheetList from '@/components/koejakson-vaiheet/koejakson-vaiheet-list.vue'
  import { LomakeTyypit } from '@/utils/constants'

  @Component({
    components: {
      KoejaksonVaiheetList
    }
  })
  export default class KoejaksoViewKouluttaja extends Vue {
    private loading = true
    private componentLinks = new Map([
      [LomakeTyypit.KOULUTUSSOPIMUS, 'koulutussopimus-kouluttaja'],
      [LomakeTyypit.ALOITUSKESKUSTELU, 'aloituskeskustelu-kouluttaja']
    ])

    async mounted() {
      await store.dispatch('kouluttaja/getKoejaksot')
      this.loading = false
    }

    get koejaksot() {
      return store.getters['kouluttaja/koejaksot']
    }
  }
</script>
