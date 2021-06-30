<template>
  <div class="table-responsive">
    <table class="table table-borderless border-0 table-sm" :summary="$t('henkilotiedot')">
      <tr class="sr-only">
        <th scope="col">{{ $t('kentta') }}</th>
        <th scope="col">{{ $t('arvo') }}</th>
      </tr>
      <tr>
        <th scope="row" style="width: 12rem" class="font-weight-500">
          {{ $t('erikoistuva-laakari') }}
        </th>
        <td class="pl-5">
          <avatar
            background-color="gray"
            :username="displayName"
            color="white"
            :size="32"
            class="d-inline-block avatar"
          ></avatar>
          {{ displayName }}, {{ account.erikoistuvaLaakari.erikoisalaNimi.toLowerCase() }}
        </td>
      </tr>
      <tr>
        <th scope="row" class="font-weight-500">
          {{ $t('opiskelijanumero') }}
        </th>
        <td class="pl-5">{{ erikoistuvaDetails.opiskelijatunnus }}</td>
      </tr>
      <tr v-if="showBirthdate">
        <th scope="row" class="font-weight-500">
          {{ $t('syntymaaika') }}
        </th>
        <td class="pl-5">{{ $date(account.erikoistuvaLaakari.syntymaaika) }}</td>
      </tr>
      <tr>
        <th scope="row" class="font-weight-500">
          {{ $t('yliopisto-opiskeluoikeus') }}
        </th>
        <td class="pl-5">{{ account.erikoistuvaLaakari.yliopisto }}</td>
      </tr>
    </table>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import Component from 'vue-class-component'
  import { Prop } from 'vue-property-decorator'
  import Avatar from 'vue-avatar'
  import { UserAccount } from '@/types'

  @Component({
    components: {
      Avatar
    }
  })
  export default class ErikoistuvaDetails extends Vue {
    @Prop({ required: true, default: {} })
    account!: UserAccount

    @Prop({ required: false, default: true })
    showBirthdate!: boolean

    get displayName() {
      return this.account ? `${this.account.firstName} ${this.account.lastName}` : ''
    }

    get erikoistuvaDetails() {
      return this.account ? this.account?.erikoistuvaLaakari : {}
    }

    get imageSrc() {
      /*if (this.account.profilePicture.srcContentType && this.account.profilePicture.srcBase64) {
        return `data:${this.account.profilePicture.srcContentType};base64,${this.account.profilePicture.srcBase64}`
      } else */
      if (this.account.profilePicture.src) {
        return this.account.profilePicture.src
      } else {
        return undefined
      }
    }
  }
</script>

<style lang="scss" scoped>
  .avatar {
    min-width: 32px;
  }

  .avatar-line-height {
    line-height: 0;
  }
</style>
