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

    <b-navbar-toggle v-if="isMobile" target="sidebar-right" class="border-0">
      <template #default="{ expanded }">
        <font-awesome-icon v-if="expanded" :icon="['fas', 'times']" size="lg" />
        <font-awesome-icon v-else :icon="['fas', 'bars']" size="lg" />
      </template>
    </b-navbar-toggle>

    <!--
    <div class="d-flex justify-content-center w-100">
      <div class="input-group" style="width: 500px;">
        <input
          class="form-control text-center rounded-pill"
          type="text"
          :placeholder="$t('etsi')"
          :aria-label="$t('etsi')"
        />
      </div>
    </div>
    -->

    <b-collapse is-nav>
      <!-- Right aligned nav items -->
      <b-navbar-nav class="ml-auto pr-3 font-weight-500">
        <b-nav-item
          href="#"
          class="border-right text-nowrap align-self-center px-3"
          :to="{ name: 'viestit' }"
        >
          <font-awesome-icon :icon="['far', 'envelope']" fixed-width size="lg" />
          {{ $t('viestit') }}
        </b-nav-item>

        <b-nav-item-dropdown
          href="#"
          class="align-self-center px-3 user-dropdown"
          menu-class="user-dropdown-content py-0"
          right
        >
          <template #button-content>
            <user-avatar :title="title" />
          </template>
          <b-dropdown-item class="border-bottom" link-class="py-2">
            <b-link :to="{}" class="text-dark text-decoration-none">
              {{ $t('oma-profiilini') }}
            </b-link>
          </b-dropdown-item>
          <b-dropdown-item link-class="py-2 text-dark text-decoration-none" @click="logout">
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
  import { Prop } from 'vue-property-decorator'
  import Avatar from 'vue-avatar'
  import store from '@/store'
  import UserAvatar from '@/components/user-avatar/user-avatar.vue'
  import { ELSA_ROLE } from '@/utils/roles'

  @Component({
    components: {
      Avatar,
      UserAvatar
    }
  })
  export default class Navbar extends Vue {
    @Prop({ required: true })
    isMobile!: string

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
      if (this.authorities.includes(ELSA_ROLE.ErikoistuvaLaakari)) {
        return this.$t('erikoistuva-laakari')
      } else if (this.authorities.includes(ELSA_ROLE.Kouluttaja)) {
        return this.$t('kouluttaja')
      } else if (this.authorities.includes(ELSA_ROLE.Lahikouluttaja)) {
        return this.$t('lahikouluttaja')
      } else if (this.authorities.includes(ELSA_ROLE.Vastuuhenkilo)) {
        return this.$t('vastuuhenkilo')
      }

      return undefined
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
</style>

<style lang="scss">
  .user-dropdown {
    .dropdown-toggle {
      display: flex;
      align-items: center;
    }
    &-content {
      margin-top: -0.25rem !important;
    }
  }
</style>
