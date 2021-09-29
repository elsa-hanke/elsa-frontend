<template>
  <div class="d-flex flex-column">
    <navbar v-if="isLoggedIn" />
    <navbar-not-logged-in v-else />
    <b-container v-if="isLoggedIn" fluid>
      <mobile-nav v-if="!$screen.lg" />
      <b-row class="position-relative">
        <sidebar-menu />
        <main role="main" class="offset-lg-2 col-lg-10 mb-5 px-0 px-lg-3">
          <page-not-found />
        </main>
      </b-row>
    </b-container>
    <b-container v-else class="mt-4 mt-md-5 mb-5">
      <page-not-found />
    </b-container>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator'

  import ElsaButton from '@/components/button/button.vue'
  import MobileNav from '@/components/mobile-nav/mobile-nav.vue'
  import NavbarNotLoggedIn from '@/components/navbar/navbar-not-logged-in.vue'
  import Navbar from '@/components/navbar/navbar.vue'
  import SidebarMenu from '@/components/sidebar-menu/sidebar-menu.vue'
  import store from '@/store'
  import PageNotFound from '@/views/404/page-not-found-content.vue'

  @Component({
    components: {
      ElsaButton,
      Navbar,
      NavbarNotLoggedIn,
      SidebarMenu,
      MobileNav,
      PageNotFound
    }
  })
  export default class PageNotFoundView extends Vue {
    get isLoggedIn() {
      store.dispatch('auth/authorize')
      return store.getters['auth/isLoggedIn']
    }

    changeLocale(lang: string) {
      this.$i18n.locale = lang
    }

    get currentLocale() {
      return this.$i18n.locale
    }

    get locales() {
      return Object.keys(this.$i18n.messages)
    }
  }
</script>

<style lang="scss" scoped>
  .brand-logo {
    font-size: 2rem;
  }
</style>
