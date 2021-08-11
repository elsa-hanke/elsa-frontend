<template>
  <div class="d-flex flex-column">
    <b-navbar id="navbar-top" type="dark" variant="primary" sticky class="px-0 py-0">
      <b-container>
        <b-navbar-brand class="col text-nowrap user-select-none">
          <div class="brand-logo d-inline-block font-weight-bold text-uppercase">
            {{ $t('elsa') }}
          </div>
          <div class="brand-text d-inline-block text-size-sm align-top pt-2">
            -{{ $t('palvelu') | lowercase }}
          </div>
        </b-navbar-brand>
        <b-navbar-nav class="ml-auto pr-3 font-weight-500">
          <b-nav-item-dropdown :text="$t(currentLocale)" class="align-self-center px-3" right>
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
      </b-container>
    </b-navbar>

    <router-view></router-view>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator'
  import KayttooikeusForm from '@/forms/kayttooikeus-form.vue'
  import ElsaButton from '@/components/button/button.vue'

  @Component({
    components: {
      KayttooikeusForm,
      ElsaButton
    }
  })
  export default class LoginView extends Vue {
    loading = false

    get currentLocale() {
      return this.$i18n.locale
    }

    get locales() {
      return Object.keys(this.$i18n.messages)
    }

    changeLocale(lang: string) {
      this.$i18n.locale = lang
    }
  }
</script>

<style lang="scss" scoped>
  .brand-logo {
    font-size: 2rem;
  }
</style>
