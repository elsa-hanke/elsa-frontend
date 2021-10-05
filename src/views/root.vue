<template>
  <div id="root" :class="{ 'gray-backdrop': hasGrayBackdrop }">
    <navbar />
    <mobile-nav v-if="!$screen.lg" />
    <sidebar-menu ref="sidebar" />
    <main role="main">
      <router-view />
    </main>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import Component from 'vue-class-component'

  import MobileNav from '@/components/mobile-nav/mobile-nav.vue'
  import Navbar from '@/components/navbar/navbar.vue'
  import SidebarMenu from '@/components/sidebar-menu/sidebar-menu.vue'

  @Component({
    components: {
      Navbar,
      SidebarMenu,
      MobileNav
    }
  })
  export default class Root extends Vue {
    get hasGrayBackdrop() {
      return this.$route.meta.grayBackdrop
    }
  }
</script>

<style lang="scss" scoped>
  @import '~bootstrap/scss/mixins/breakpoints';
  @import '~@/styles/variables';

  .gray-backdrop {
    background-color: $backdrop-background-color;
  }

  @include media-breakpoint-up(lg) {
    main {
      padding-left: $sidebar-width;
    }
  }
</style>
