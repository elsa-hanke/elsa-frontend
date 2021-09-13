<template>
  <div id="root" :class="{ 'gray-backdrop': hasGrayBackdrop }">
    <navbar />
    <b-container fluid>
      <mobile-nav v-if="!$screen.lg" />
      <b-row class="position-relative">
        <sidebar-menu />
        <main role="main" class="offset-lg-2 col-lg-10 mb-5 px-0 px-lg-3">
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
    get hasGrayBackdrop() {
      return this.$route.meta.grayBackdrop
    }
  }
</script>

<style lang="scss" scoped>
  @import '~@/styles/variables';

  .gray-backdrop {
    background-color: $backdrop-background-color;
  }
</style>
