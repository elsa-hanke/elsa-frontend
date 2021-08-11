<template>
  <div id="root" :class="{ 'gray-backdrop': hasGrayBackdrop }">
    <navbar :isMobile="isMobile" />
    <b-container fluid>
      <mobile-nav v-if="isMobile" />
      <b-row class="position-relative">
        <sidebar-menu />
        <main role="main" class="offset-lg-2 col-lg-10 vh-100">
          <router-view />
        </main>
      </b-row>
    </b-container>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import Component from 'vue-class-component'
  import Navbar from '@/components/navbar/navbar.vue'
  import SidebarMenu from '@/components/sidebar-menu/sidebar-menu.vue'
  import MobileNav from '@/components/mobile-nav/mobile-nav.vue'

  @Component({
    components: {
      Navbar,
      SidebarMenu,
      MobileNav
    }
  })
  export default class Root extends Vue {
    viewportWidth = 0

    setViewportWidth() {
      this.viewportWidth = window.innerWidth || document.documentElement.clientWidth
    }

    setViewportOnResize() {
      ;(window as any).addEventListener(
        'resize',
        () => {
          this.setViewportWidth()
        },
        false
      )
    }

    get isMobile() {
      return this.viewportWidth < 992
    }
    get hasGrayBackdrop() {
      return this.$route.meta.grayBackdrop
    }

    mounted(): void {
      this.setViewportWidth()
      this.setViewportOnResize()
    }
  }
</script>

<style lang="scss" scoped>
  @import '~@/styles/variables';

  .gray-backdrop {
    min-height: 100vh;
    background-color: $backdrop-background-color;
  }
</style>
