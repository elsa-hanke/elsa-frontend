<template>
  <div>
    <nav
      id="sidebar-menu"
      class="border-right bg-white font-weight-500 d-none d-lg-block d-xl-block"
    >
      <b-nav vertical>
        <b-nav-item
          v-if="!$isTekninenPaakayttaja()"
          class="border-top border-bottom"
          :to="{ name: 'etusivu' }"
        >
          <font-awesome-icon icon="home" fixed-width size="lg" />
          {{ $t('etusivu') }}
        </b-nav-item>
        <b-nav-item
          v-if="$isErikoistuva()"
          class="border-bottom"
          :to="{ name: 'koulutussuunnitelma' }"
        >
          <font-awesome-icon :icon="['far', 'clipboard']" fixed-width size="lg" />
          {{ $t('koulutussuunnitelma') }}
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
          :to="{ name: 'teoriakoulutukset' }"
        >
          <font-awesome-icon :icon="['fas', 'university']" fixed-width size="lg" />
          {{ $t('teoriakoulutukset') }}
        </b-nav-item>
        <b-nav-item v-if="$isErikoistuva()" v-b-toggle.osaaminen-toggle class="osaaminen-nav">
          <font-awesome-icon icon="award" fixed-width size="lg" />
          {{ $t('osaaminen') }}
          <span class="closed">
            <font-awesome-icon icon="chevron-down" />
          </span>
          <span class="open">
            <font-awesome-icon icon="chevron-up" />
          </span>
        </b-nav-item>
        <b-collapse id="osaaminen-toggle">
          <b-nav-item link-classes="pb-2 pt-2 ml-5" :to="{ name: 'paivittaiset-merkinnat' }">
            {{ $t('paivittaiset-merkinnat') }}
          </b-nav-item>
          <b-nav-item link-classes="pb-2 pt-2 ml-5" :to="{ name: 'arvioinnit' }">
            {{ $t('arvioinnit') }}
          </b-nav-item>
          <b-nav-item link-classes="pb-2 pt-2 ml-5" :to="{ name: 'suoritemerkinnat' }">
            {{ $t('suoritemerkinnat') }}
          </b-nav-item>
          <b-nav-item
            class="border-bottom"
            link-classes="pb-2 pt-2 ml-5"
            :to="{ name: 'seurantakeskustelut' }"
          >
            {{ $t('seurantakeskustelut') }}
          </b-nav-item>
        </b-collapse>
        <b-nav-item
          v-if="$isKouluttaja() || $isVastuuhenkilo()"
          class="border-bottom"
          :to="{ name: 'arvioinnit' }"
        >
          <font-awesome-icon icon="award" fixed-width size="lg" />
          {{ $t('arvioinnit') }}
        </b-nav-item>
        <b-nav-item
          v-if="$isKouluttaja()"
          class="border-bottom"
          :to="{ name: 'seurantakeskustelut' }"
        >
          <font-awesome-icon icon="file-alt" fixed-width size="lg" />
          {{ $t('seurantakeskustelut') }}
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
          <font-awesome-icon :icon="['far', 'file-alt']" fixed-width size="lg" />
          {{ $t('asiakirjat') }}
        </b-nav-item>
        <b-nav-item
          v-if="$isTekninenPaakayttaja()"
          class="border-top border-bottom"
          :to="{ name: 'kayttajahallinta' }"
        >
          <font-awesome-icon icon="user-friends" fixed-width size="lg" />
          {{ $t('kayttajahallinta') }}
        </b-nav-item>
      </b-nav>
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

  #sidebar-menu {
    position: fixed;
    width: $sidebar-width;
    z-index: 1000;
    display: block;
    overflow-x: hidden;
    overflow-y: auto;
    min-height: 100vh;

    .nav-link {
      padding: 1rem 0.75rem;

      &:hover {
        background-color: rgba($primary, 0.1);
      }

      &.router-link-active {
        background-color: $primary;
        color: white;
      }
    }
  }

  .toaster {
    top: $navbar-height;

    ::v-deep .b-toast {
      z-index: 1100;
    }
  }

  .collapsed {
    .open {
      display: none;
    }

    border-bottom: 1px solid $gray-300;
  }

  .not-collapsed {
    .closed {
      display: none;
    }
  }

  .open,
  .closed {
    float: right;
  }

  #osaaminen-toggle {
    transition: none !important;
  }
</style>
