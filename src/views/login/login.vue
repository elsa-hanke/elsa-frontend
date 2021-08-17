<template>
  <b-container>
    <div class="d-flex align-items-center justify-content-center" style="height: 50rem">
      <b-row>
        <b-col lg="5" class="mt-3 mr-2">
          <h1 class="text-primary mb-4">{{ $t('palvelu-erikoistuville-laakareille') }}</h1>
          <p class="mb-4">{{ $t('login-ingressi') }}</p>
          <elsa-button variant="primary" @click="loginSuomiFi">
            {{ $t('kirjaudu-sisaan') }} (Suomi.fi)
          </elsa-button>
          <elsa-button variant="primary" class="ml-2">
            {{ $t('kirjaudu-sisaan') }} (HAKA)
          </elsa-button>
        </b-col>
        <b-col>
          <img
            :src="`${publicPath}img/elsa_kirjautuminen.svg`"
            class="mr-3"
            :alt="$t('elsa-palvelu')"
          />
        </b-col>
      </b-row>
    </div>
  </b-container>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator'
  import ElsaButton from '@/components/button/button.vue'
  import { ELSA_API_LOCATION } from '@/api'

  @Component({
    components: {
      ElsaButton
    }
  })
  export default class Login extends Vue {
    publicPath = process.env.BASE_URL

    loginSuomiFi() {
      return (window.location.href = `${ELSA_API_LOCATION}/saml2/authenticate/suomifi?RelayState=${this.$route.query.token}`)
    }
  }
</script>

<style lang="scss" scoped>
  .text-primary {
    font-size: 1.75rem;
  }
</style>
