<template>
  <b-card-skeleton :header="$t('henkilotietosi')" :loading="!account" class="mb-3">
    <div class="d-flex align-items-center">
      <div class="flex-fill">
        <user-avatar
          :src-base64="account.avatar"
          :imageSize="56"
          src-content-type="image/jpeg"
          :title="title"
        />
        <b-row class="mt-2">
          <b-col>
            <h5 class="mb-1">{{ $t('sahkoposti') }}</h5>
            <p class="mb-3">{{ sahkoposti }}</p>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <h5 class="mb-1">{{ $t('puhelinnumero') }}</h5>
            <p class="mb-3">{{ puhelinnumero }}</p>
          </b-col>
        </b-row>
        <elsa-button size="sm" variant="primary" class="rounded-pill d-none d-lg-block d-xl-block">
          {{ $t('muokkaa-tietoja') }}
        </elsa-button>
      </div>
    </div>
  </b-card-skeleton>
</template>

<script lang="ts">
  import Avatar from 'vue-avatar'
  import { Component, Vue } from 'vue-property-decorator'

  import ElsaButton from '@/components/button/button.vue'
  import BCardSkeleton from '@/components/card/card.vue'
  import UserAvatar from '@/components/user-avatar/user-avatar.vue'
  import store from '@/store'
  import { getTitleFromAuthorities } from '@/utils/functions'

  @Component({
    components: {
      BCardSkeleton,
      Avatar,
      ElsaButton,
      UserAvatar
    }
  })
  export default class HenkilotiedotCard extends Vue {
    get account() {
      return store.getters['auth/account']
    }

    get authorities() {
      if (this.account) {
        return this.account.authorities
      }
      return []
    }

    get sahkoposti() {
      return this.account.email
    }

    get puhelinnumero() {
      return this.account.phoneNumber || '-'
    }

    get title() {
      const value = getTitleFromAuthorities(this.authorities)
      return value ? this.$t(value) : undefined
    }
  }
</script>
