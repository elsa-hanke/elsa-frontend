<template>
  <b-navbar
    v-if="account.impersonated"
    id="navbar-top"
    toggleable="lg"
    type="dark"
    variant="primary"
    class="px-0 py-lg-0 navbar-impersonated"
  >
    <b-col cols="12" class="p-3 bg-secondary">
      <div class="text-white">
        {{ $t('katselet-erikoistujaa') }}: {{ account.firstName }} {{ account.lastName }},
        {{ account.erikoistuvaLaakari.erikoisalaNimi }},
        {{ account.erikoistuvaLaakari.yliopisto }}
        <elsa-button size="sm" variant="primary" class="rounded-pill ml-3" @click="vaihdaRooli()">
          {{ $t('palaa-omaan-profiiliisi') }}
        </elsa-button>
      </div>
    </b-col>
  </b-navbar>
</template>

<script lang="ts">
  import Vue from 'vue'
  import Avatar from 'vue-avatar'
  import Component from 'vue-class-component'

  import ElsaButton from '@/components/button/button.vue'
  import UserAvatar from '@/components/user-avatar/user-avatar.vue'
  import store from '@/store'

  @Component({
    components: {
      Avatar,
      ElsaButton,
      UserAvatar
    }
  })
  export default class NavbarImpersonated extends Vue {
    get account() {
      return store.getters['auth/account']
    }

    vaihdaRooli() {
      window.location.href = `/api/logout/impersonate`
    }
  }
</script>
<style lang="scss" scoped>
  .navbar-impersonated {
    position: sticky;
    top: 64px;
    z-index: 1000;
  }
</style>
