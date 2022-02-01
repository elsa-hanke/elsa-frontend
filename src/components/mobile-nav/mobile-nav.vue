<template>
  <b-sidebar id="sidebar-right" right no-header backdrop bg-variant="white" class="mobile-menu">
    <template>
      <b-nav vertical class="main-mobile-nav">
        <b-nav-item class="border-bottom" :to="{ name: 'etusivu' }">
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
          <b-nav-item link-classes="pb-2 pt-2" :to="{ name: 'paivittaiset-merkinnat' }">
            <span class="ml-5">{{ $t('paivittaiset-merkinnat') }}</span>
          </b-nav-item>
          <b-nav-item link-classes="pb-2 pt-2" :to="{ name: 'arvioinnit' }">
            <span class="ml-5">{{ $t('arvioinnit') }}</span>
          </b-nav-item>
          <b-nav-item link-classes="pb-2 pt-2" :to="{ name: 'suoritemerkinnat' }">
            <span class="ml-5">{{ $t('suoritemerkinnat') }}</span>
          </b-nav-item>
          <b-nav-item
            class="border-bottom"
            link-classes="pb-2 pt-2"
            :to="{ name: 'seurantakeskustelut' }"
          >
            <span class="ml-5">{{ $t('seurantakeskustelut') }}</span>
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
          v-if="
            ($isErikoistuva() || $isKouluttaja() || $isVastuuhenkilo()) && featurePreviewModeEnabled
          "
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
        <!--<b-nav-item class="border-bottom" :to="{ name: 'viestit' }">
          <font-awesome-icon :icon="['far', 'envelope']" fixed-width size="lg" />
          {{ $t('viestit') }}
        </b-nav-item>-->
      </b-nav>
      <b-nav class="bg-light font-weight-500" vertical>
        <b-nav-item class="text-nowrap px-3" link-classes="text-dark px-0 py-1" disabled>
          <user-avatar :src-base64="avatar" src-content-type="image/jpeg" :title="title" />
        </b-nav-item>
        <b-nav-item class="ml-6" link-classes="p-0 pt-1 pb-2 pb-2" :to="{ name: 'profiili' }">
          {{ $t('oma-profiilini') }}
        </b-nav-item>
        <b-nav-item @click="logout()" class="ml-6" link-classes="p-0 pt-1 pb-3">
          {{ $t('kirjaudu-ulos') }}
        </b-nav-item>
        <b-form ref="logoutForm" :action="logoutUrl" method="POST" />
      </b-nav>
      <!-- Piilotetaan pilotista -->
      <!-- <b-nav class="font-weight-500 justify-content-center d-flex">
        <b-nav-item
          v-for="locale in locales"
          :key="locale"
          :disabled="currentLocale === locale"
          @click="changeLocale(locale)"
        >
          {{ $t(locale) }}
        </b-nav-item>
      </b-nav> -->
    </template>
  </b-sidebar>
</template>

<script lang="ts">
  import Vue from 'vue'
  import Avatar from 'vue-avatar'
  import Component from 'vue-class-component'

  import { ELSA_API_LOCATION } from '@/api'
  import UserAvatar from '@/components/user-avatar/user-avatar.vue'
  import store from '@/store'
  import { getTitleFromAuthorities } from '@/utils/functions'

  @Component({
    components: {
      Avatar,
      UserAvatar
    }
  })
  export default class MobileNav extends Vue {
    featurePreviewModeEnabled = process.env.VUE_APP_FEATURE_PREVIEW_MODE_ENABLED === 'true'

    get account() {
      return store.getters['auth/account']
    }

    get avatar() {
      if (this.account) {
        return this.account.avatar
      }
      return undefined
    }

    get authorities() {
      if (this.account) {
        return this.account.authorities
      }
      return []
    }

    get title() {
      const value = getTitleFromAuthorities(this.authorities)
      return value ? this.$t(value) : undefined
    }

    get currentLocale() {
      return this.$i18n.locale
    }

    get locales() {
      return Object.keys(this.$i18n.messages)
    }

    get logoutUrl() {
      return ELSA_API_LOCATION + '/api/logout'
    }

    async logout() {
      await store.dispatch('auth/logout')
      const logoutForm = this.$refs.logoutForm as HTMLFormElement
      logoutForm.submit()
    }

    changeLocale(lang: string) {
      this.$i18n.locale = lang
    }
  }
</script>

<style lang="scss" scoped>
  @import '~@/styles/variables';

  $navbar-height: 53.5px;

  .mobile-menu {
    z-index: 1010;
  }

  ::v-deep {
    .b-sidebar-right {
      padding-top: $navbar-height;
      height: auto;
    }
  }

  .nav-link {
    position: relative;
    padding: 0.75rem;
  }

  .main-mobile-nav {
    .router-link-active {
      &:before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        border-left: 5px solid $primary;
      }
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
