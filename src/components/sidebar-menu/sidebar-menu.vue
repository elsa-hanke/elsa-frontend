<template>
  <div>
    <nav id="sidebar-menu" class="col-lg-2 d-none d-lg-block d-xl-block bg-white sidebar">
      <div class="sidebar-sticky font-weight-500">
        <b-nav vertical>
          <b-nav-item class="border-top border-bottom" :to="{ name: 'etusivu' }">
            <font-awesome-icon icon="home" fixed-width size="lg" />
            {{ $t('etusivu') }}
          </b-nav-item>
          <b-nav-item
            v-if="$isErikoistuva()"
            class="border-bottom"
            :to="{ name: 'tyoskentelyjaksot' }"
          >
            <font-awesome-icon :icon="['far', 'hospital']" fixed-width size="lg" />
            {{ $t('tyoskentelyjaksot') }}
          </b-nav-item>
          <b-nav-item
            v-if="$isErikoistuva()"
            class="border-bottom"
            :to="{ name: 'suoritemerkinnat' }"
          >
            <font-awesome-icon icon="clipboard-check" fixed-width size="lg" />
            {{ $t('suoritemerkinnat') }}
          </b-nav-item>
          <b-nav-item class="border-bottom" :to="{ name: 'arvioinnit' }">
            <font-awesome-icon icon="award" fixed-width size="lg" />
            {{ $t('arvioinnit') }}
          </b-nav-item>
          <b-nav-item
            v-if="$isErikoistuva() || $isKouluttaja() || $isVastuuhenkilo()"
            class="border-bottom"
            :to="{ name: 'koejakso' }"
          >
            <font-awesome-icon icon="clipboard-check" fixed-width size="lg" />
            {{ $t('koejakso') }}
          </b-nav-item>
          <b-nav-item v-if="$isErikoistuva()" class="border-bottom" :to="{ name: 'asiakirjat' }">
            <font-awesome-icon icon="file" fixed-width size="lg" />
            {{ $t('asiakirjat') }}
          </b-nav-item>
        </b-nav>
      </div>
    </nav>
    <b-toaster class="toaster" :style="{ top: paddingTop + 'px' }" name="b-toaster-top-right" />
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import Component from 'vue-class-component'

  @Component
  export default class SidebarMenu extends Vue {
    paddingTop = 64

    // Tarkistetaan sivunavigaation paikka
    mounted() {
      const el = document.getElementById('navbar-top')
      if (el) {
        this.paddingTop = el.offsetHeight
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '~@/styles/variables';

  $navbar-height: 64px;

  .sidebar {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    z-index: 100;
    height: 100%;
    padding: 0;
    box-shadow: inset -1px 0 0 rgba(0, 0, 0, 0.1);

    .nav-link {
      padding: 1rem;

      &:hover {
        background-color: rgba($primary, 0.1);
      }

      &.router-link-active {
        background-color: $primary;
        color: white;
      }
    }

    .sidebar-sticky {
      position: sticky;
      // top: 0;
      height: calc(100vh - 64px);
      overflow-x: hidden;
      overflow-y: auto;
    }
  }

  .toaster {
    top: $navbar-height;

    ::v-deep .b-toast {
      z-index: 1100;
    }
  }
</style>
