<template>
  <b-navbar
    id="navbar-top"
    toggleable="lg"
    type="dark"
    variant="primary"
    sticky
    class="px-0 py-lg-0"
  >
    <b-navbar-brand class="col mr-0 text-nowrap user-select-none">
      <span class="brand-logo d-inline-block font-weight-bold text-uppercase">
        {{ $t('elsa') }}
      </span>
      <span class="brand-text d-inline-block align-text-top">-{{ $t('palvelu') | lowercase }}</span>
    </b-navbar-brand>

    <b-navbar-toggle v-if="!$screen.lg" target="sidebar-right" class="border-0">
      <template #default="{ expanded }">
        <font-awesome-icon v-if="expanded" :icon="['fas', 'times']" size="lg" />
        <font-awesome-icon v-else :icon="['fas', 'bars']" size="lg" />
      </template>
    </b-navbar-toggle>

    <b-collapse is-nav>
      <!-- Right aligned nav items -->
      <b-navbar-nav class="ml-auto pr-3 font-weight-500">
        <b-nav-item
          class="border-right text-nowrap align-self-center px-3"
          :to="{ name: 'viestit' }"
        >
          <font-awesome-icon :icon="['far', 'envelope']" fixed-width size="lg" />
          {{ $t('viestit') }}
        </b-nav-item>

        <b-nav-item-dropdown class="user-dropdown align-self-center px-3" right>
          <template #button-content>
            <user-avatar :title="title ? $t(title) : undefined" />
          </template>
          <b-dropdown-item :to="{ name: 'profiili' }">
            {{ $t('oma-profiilini') }}
          </b-dropdown-item>
          <b-dropdown-item @click="logout">
            {{ $t('kirjaudu-ulos') }}
          </b-dropdown-item>
        </b-nav-item-dropdown>

        <b-nav-item-dropdown
          :text="$t(currentLocale)"
          class="border-left align-self-center px-3"
          right
        >
          <b-dropdown-item
            v-for="locale in locales"
            :key="locale"
            :disabled="currentLocale === locale"
            @click="changeLocale(locale)"
          >
            {{ $t(locale) }}
          </b-dropdown-item>
        </b-nav-item-dropdown>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>

<script lang="ts">
  import Vue from 'vue'
  import Component from 'vue-class-component'
  import Avatar from 'vue-avatar'
  import store from '@/store'
  import UserAvatar from '@/components/user-avatar/user-avatar.vue'
  import { getTitleFromAuthorities } from '@/utils/functions'

  @Component({
    components: {
      Avatar,
      UserAvatar
    }
  })
  export default class Navbar extends Vue {
    get account() {
      return store.getters['auth/account']
    }

    get authorities() {
      if (this.account) {
        return this.account.authorities
      }
      return []
    }

    get title() {
      return getTitleFromAuthorities(this.authorities)
    }

    get currentLocale() {
      return this.$i18n.locale
    }

    get locales() {
      return Object.keys(this.$i18n.messages)
    }

    async logout() {
      await store.dispatch('auth/logout')
    }

    changeLocale(lang: string) {
      this.$i18n.locale = lang
    }
  }
</script>

<style lang="scss" scoped>
  .brand-text {
    font-size: 0.725rem;
  }

  .user-dropdown {
    ::v-deep {
      .dropdown-toggle {
        display: flex;
        align-items: center;
      }
    }
  }
</style>
