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

  @Component({
    components: {
      KoejaksonVaiheetList
    }
  })
  export default class KoejaksoViewVastuuhenkilo extends Vue {
    private loading = true
    private componentLinks = new Map()

    async mounted() {
      await store.dispatch('vastuuhenkilo/getKoejaksot')
      this.loading = false
    }

    get koejaksot() {
      return store.getters['vastuuhenkilo/koejaksot']
    }
  }
</script>
