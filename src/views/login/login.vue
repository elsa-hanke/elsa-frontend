<template>
  <b-container class="mt-4 mb-6">
    <b-row>
      <b-col lg>
        <b-alert variant="danger" :show="virhe != null">
          <font-awesome-icon :icon="['fas', 'exclamation-circle']" class="mr-1" />
          {{ $t('kirjautuminen.' + virhe) }}
        </b-alert>
        <b-alert variant="dark" show>
          <font-awesome-icon icon="info-circle" fixed-width class="text-muted" />
          {{ $t('piloottikaytto-kuvaus') }}
        </b-alert>
      </b-col>
    </b-row>
    <b-row>
      <b-col lg="5">
        <h1 class="text-primary mb-lg-3">{{ $t('palvelu-erikoistuville-laakareille') }}</h1>
        <p class="mb-lg-4">{{ $t('login-ingressi') }}</p>
        <div class="mb-4">
          <h3>{{ $t('erikoistuva-laakari-ja-kouluttaja') }}</h3>
          <p>{{ $t('kirjaudu-sisaan-suomifi') }}</p>
          <elsa-button variant="primary" @click="loginSuomiFi" class="mr-3 mb-2">
            {{ $t('kirjaudu-sisaan') }} (Suomi.fi)
          </elsa-button>
        </div>
        <div class="mb-4">
          <h3>{{ $t('muut-kayttajaroolit-kuin-erikoistuva-tai-kouluttaja') }}</h3>
          <p>{{ $t('kirjaudu-sisaan-haka') }}</p>
          <elsa-button variant="primary" :to="{ name: 'haka-yliopisto' }" class="mr-3 mb-2">
            {{ $t('kirjaudu-sisaan') }} (HAKA)
          </elsa-button>
        </div>
      </b-col>
      <b-col class="">
        <img src="@/assets/elsa-kirjautuminen.svg" :alt="$t('elsa-palvelu')" class="img-fluid" />
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator'

  import { ELSA_API_LOCATION } from '@/api'
  import ElsaButton from '@/components/button/button.vue'

  @Component({
    components: {
      ElsaButton
    }
  })
  export default class Login extends Vue {
    loginSuomiFi() {
      return (window.location.href = `${ELSA_API_LOCATION}/saml2/authenticate/suomifi?RelayState=${this.$route.query.token}`)
    }

    get virhe() {
      return this.$route.query.virhe
    }
  }
</script>

<style lang="scss" scoped>
  .text-primary {
    font-size: 1.75rem;
  }
</style>
