<template>
  <div class="table-responsive">
    <table class="table table-borderless border-0 table-sm" :summary="$t('henkilotiedot')">
      <colgroup>
        <col class="col-lg-2" />
        <col class="col-lg-8" />
      </colgroup>
      <tr class="sr-only">
        <th scope="col">{{ $t('kentta') }}</th>
        <th scope="col">{{ $t('arvo') }}</th>
      </tr>
      <tr>
        <th scope="row" class="font-weight-500">
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
          {{ displayName }}, {{ title }}
        </td>
      </tr>
      <tr>
        <th scope="row" class="font-weight-500">
          {{ $t('opiskelijanumero') }}
        </th>
        <td class="pl-5">{{ userDetails.opiskelijatunnus }}</td>
      </tr>
      <tr v-if="showBirthdate">
        <th scope="row" class="font-weight-500">
          {{ $t('syntymaaika') }}
        </th>
        <td class="pl-5">-</td>
      </tr>
      <tr>
        <th scope="row" class="font-weight-500">
          {{ $t('yliopisto-opiskeluoikeus') }}
        </th>
        <td class="pl-5">-</td>
      </tr>
    </table>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import Component from 'vue-class-component'
  import { Prop } from 'vue-property-decorator'
  import Avatar from 'vue-avatar'
  import { ELSA_ROLE } from '@/utils/roles'
  import { UserAccount } from '@/types'

  @Component({
    components: {
      Avatar
    }
  })
  export default class UserDetails extends Vue {
    @Prop({ required: true, default: {} })
    account!: UserAccount

    @Prop({ required: false, default: true })
    showBirthdate!: boolean

    get authorities() {
      if (this.account) {
        return this.account.authorities
      }
      return []
    }

    get displayName() {
      return this.account ? `${this.account.firstName} ${this.account.lastName}` : ''
    }

    get userDetails() {
      return this.account ? this.account?.erikoistuvaLaakari : {}
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
