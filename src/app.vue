<template>
  <div id="app" class="d-flex flex-column justify-content-between min-vh-100">
    <router-view class="router-view" />
    <b-link v-if="isLoggedIn" @click="openPalauteFormModal">
      <div class="feedback-link">
        <font-awesome-icon class="feedback-icon" :icon="['far', 'envelope']" fixed-width />
        <span class="feedback-text">{{ $t('palaute') }}</span>
      </div>
    </b-link>
    <footer class="pb-4 bg-white">
      <div class="d-flex justify-content-center">
        <b-link class="my-4 mx-3 mx-lg-4">{{ $t('tietosuoja') }}</b-link>
        <b-link class="my-4 mx-3 mx-lg-4">{{ $t('kayttoehdot') }}</b-link>
        <b-link v-if="isLoggedIn" @click="openPalauteFormModal" class="my-4 mx-3 mx-lg-4">
          {{ $t('palaute') }}
        </b-link>
        <palaute-form-modal :show="showPalauteFormModal" @hide="hidePalauteFormModal" />
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

  import PalauteFormModal from '@/forms/palaute-form-modal.vue'
  import store from '@/store'
  import { Meta } from '@/utils/decorators'

  @Component({
    components: {
      PalauteFormModal
    }
  })
  export default class App extends Vue {
    showPalauteFormModal = false

    openPalauteFormModal() {
      this.showPalauteFormModal = true
    }

    hidePalauteFormModal() {
      this.showPalauteFormModal = false
    }

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

    get isLoggedIn() {
      return store.getters['auth/isLoggedIn']
    }
  }
</script>

<style lang="scss" scoped>
  @import '~@/styles/variables';
  @import '~bootstrap/scss/mixins/breakpoints';

  footer {
    border-top: 1px solid $border-color;
    @include media-breakpoint-down(sm) {
      border-top: 5px solid #f5f5f6;
    }
    z-index: 1000;
  }

  .feedback-link {
    background-color: $primary;
    color: $white;
    font-weight: 500;
    position: fixed;
    bottom: 0;
    right: 0;
    border-radius: 0.25rem 0 0 0;
    padding: 0.375rem 0.625rem 0.25rem 0.5rem;
    z-index: 9999;
  }

  .feedback-icon {
    font-size: 1.5rem;
    vertical-align: middle;
  }

  .feedback-text {
    margin-left: 0.375rem;
    vertical-align: middle;
  }

  .router-view {
    margin-bottom: 5rem;
  }
</style>
