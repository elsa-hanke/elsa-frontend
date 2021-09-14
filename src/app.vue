<template>
  <div id="app" class="d-flex flex-column justify-content-between min-vh-100">
    <router-view />

    <footer class="pb-4">
      <div class="d-flex justify-content-center">
        <b-link class="my-4 mx-3 mx-lg-4">{{ $t('tietosuoja') }}</b-link>
        <b-link class="my-4 mx-3 mx-lg-4">{{ $t('kayttoehdot') }}</b-link>
        <b-link class="my-4 mx-3 mx-lg-4">{{ $t('palaute') }}</b-link>
      </div>
      <div class="d-flex flex-wrap justify-content-center">
        <a
          href="https://www.oulu.fi/fi"
          target="_blank"
          rel="noopener noreferrer"
          class="m-2 m-lg-3"
        >
          <img src="@/assets/elsa-oulun-yliopisto.svg" alt="Oulun Yliopisto" />
        </a>
        <a
          href="https://www.tuni.fi/fi"
          target="_blank"
          rel="noopener noreferrer"
          class="m-2 m-lg-3"
        >
          <img src="@/assets/elsa-tampereen-yliopisto.svg" alt="Tampereen Yliopisto" />
        </a>
        <a
          href="https://www.utu.fi/fi"
          target="_blank"
          rel="noopener noreferrer"
          class="m-2 m-lg-3"
        >
          <img src="@/assets/elsa-turun-yliopisto.svg" alt="Turun Yliopisto" />
        </a>
        <a
          href="https://www.uef.fi/fi"
          target="_blank"
          rel="noopener noreferrer"
          class="m-2 m-lg-3"
        >
          <img src="@/assets/elsa-itasuomen-yliopisto.svg" alt="Itä-Suomen Yliopisto" />
        </a>
        <a
          href="https://www.helsinki.fi/fi"
          target="_blank"
          rel="noopener noreferrer"
          class="m-2 m-lg-3"
        >
          <img src="@/assets/elsa-helsingin-yliopisto.svg" alt="Helsingin Yliopisto" />
        </a>
      </div>
    </footer>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import Component from 'vue-class-component'
  import { Meta } from '@/utils/decorators'

  @Component({})
  export default class App extends Vue {
    @Meta
    getMetaInfo() {
      if (this.$route && this.$route.name) {
        return {
          title: this.$t(this.$route.name),
          titleTemplate: `%s - ${this.$t('elsa-palvelu')}`
        }
      }
      return {
        title: this.$t('elsa-palvelu'),
        titleTemplate: null
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '~@/styles/variables';

  footer {
    border-top: 5px solid #f5f5f6;
  }
</style>
