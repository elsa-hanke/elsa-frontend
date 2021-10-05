<template>
  <b-container fluid class="mt-3 vh-100">
    <b-row class="mt-3" lg>
      <b-col lg="2" order-lg="3" order-xl="3">
        <elsa-button variant="link" class="d-flex align-items-center text-decoration-none">
          <div class="fa-2x mr-2">
            <font-awesome-layers>
              <font-awesome-icon icon="circle" />
              <font-awesome-icon
                icon="arrows-alt"
                transform="shrink-6"
                :style="{ color: 'white' }"
              />
            </font-awesome-layers>
          </div>
          <span class="text-left">{{ $t('lisaa-ja-muokkaa-osioita') }}</span>
        </elsa-button>
      </b-col>
      <b-col>
        <b-card-skeleton :header="$t('henkilotiedot')" :loading="!account" class="mb-3">
          <div class="d-flex align-items-center">
            <div class="d-none d-lg-block d-xl-block mr-3">
              <avatar
                :src="avatarSrc"
                :username="displayName"
                background-color="gray"
                color="white"
                :size="96"
              ></avatar>
            </div>
            <div class="flex-fill">
              <table
                class="table table-borderless text-size-sm border-0"
                :summary="$t('henkilotiedot')"
              >
                <tr class="sr-only">
                  <th scope="col">{{ $t('kentta') }}</th>
                  <th scope="col">{{ $t('arvo') }}</th>
                </tr>
                <tr>
                  <th scope="row" class="py-0 pl-0 pr-1 text-muted font-weight-400">
                    {{ $t('nimi') }}
                  </th>
                  <td class="py-0 pr-0 pl-1">{{ displayName }}</td>
                </tr>
                <tr>
                  <th scope="row" class="py-0 pl-0 pr-1 text-muted font-weight-400">
                    {{ $t('puhelinnumero') }}
                  </th>
                  <td class="py-0 pr-0 pl-1">-</td>
                </tr>
                <tr>
                  <th scope="row" class="py-0 pl-0 pr-1 text-muted font-weight-400">
                    {{ $t('erikoisala') }}
                  </th>
                  <td class="py-0 pr-0 pl-1">-</td>
                </tr>
                <tr>
                  <th scope="row" class="py-0 pl-0 pr-1 text-muted font-weight-400">
                    {{ $t('vastuuhenkilo') }}
                  </th>
                  <td class="py-0 pr-0 pl-1">-</td>
                </tr>
              </table>
            </div>
            <elsa-button
              size="sm"
              variant="primary"
              class="rounded-pill d-none d-lg-block d-xl-block ml-3"
            >
              {{ $t('muokkaa-tietoja') }}
            </elsa-button>
          </div>
        </b-card-skeleton>
        <b-card-skeleton
          :header="$t('suorittanut-erikoistumiseen-vaadittavista-opinnoista')"
          :loading="true"
          class="mb-3"
        ></b-card-skeleton>
        <b-card-skeleton
          :header="$t('tyoskentelyjaksot')"
          :loading="true"
          class="mb-3"
        ></b-card-skeleton>
      </b-col>
      <b-col lg>
        <b-card-skeleton
          :header="$t('koulutussuunnitelma')"
          :loading="true"
          class="mb-3"
        ></b-card-skeleton>
        <b-card-skeleton
          :header="$t('teoriakoulutukset')"
          :loading="true"
          class="mb-3"
        ></b-card-skeleton>
        <b-card-skeleton
          :header="$t('johtamiskoulutukset')"
          :loading="true"
          class="mb-3"
        ></b-card-skeleton>
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts">
  import Avatar from 'vue-avatar'
  import { Component, Vue } from 'vue-property-decorator'

  import ElsaButton from '@/components/button/button.vue'
  import BCardSkeleton from '@/components/card/card.vue'
  import store from '@/store'

  @Component({
    components: {
      BCardSkeleton,
      Avatar,
      ElsaButton
    }
  })
  export default class Etusivu extends Vue {
    get account() {
      return store.getters['auth/account']
    }

    get avatarSrc() {
      if (this.account) {
        return `data:image/jpeg;base64,${this.account.avatar}`
      }
      return undefined
    }

    get displayName() {
      if (this.account) {
        return `${this.account.firstName} ${this.account.lastName}`
      }
      return ''
    }
  }
</script>
