<template>
  <b-container class="d-flex vh-100">
    <div class="w-100 align-self-center">
      <b-row>
        <b-col lg="5">
          <h1 class="text-primary mb-4">{{ $t('oletko-erikoistuva-laakari') }}</h1>
          <kayttooikeus-form @submit="onSubmit" />
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
  import * as api from '@/api/erikoistuva'
  import { toastSuccess, toastFail } from '@/utils/toast'
  import KayttooikeusForm from '@/forms/kayttooikeus-form.vue'

  @Component({
    components: {
      KayttooikeusForm
    }
  })
  export default class Kayttooikeus extends Vue {
    loading = false
    publicPath = process.env.BASE_URL

    async onSubmit(value: any) {
      this.loading = true
      try {
        console.log('val', value)
        await api.putKayttooikeushakemus(value)
        toastSuccess(this, this.$t('kayttooikeuden-lisaaminen-onnistui'))
        this.$router.push({ name: 'etusivu' })
      } catch (err) {
        this.loading = false
        toastFail(this, this.$t('kayttooikeuden-lisaaminen-epaonnistui'))
      }
    }
  }
</script>

<style lang="scss" scoped>
  .text-primary {
    font-size: 1.75rem;
  }
</style>
