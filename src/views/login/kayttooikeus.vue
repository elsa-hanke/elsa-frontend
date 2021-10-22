<template>
  <b-container class="mt-4 mb-6">
    <b-row>
      <b-col lg="5">
        <h1 class="text-primary">{{ $t('oletko-erikoistuva-laakari') }}</h1>
        <kayttooikeus-form @submit="onSubmit" class="mb-3" />
      </b-col>
      <b-col>
        <img src="@/assets/elsa-kirjautuminen.svg" :alt="$t('elsa-palvelu')" class="img-fluid" />
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator'

  import * as api from '@/api/erikoistuva'
  import KayttooikeusForm from '@/forms/kayttooikeus-form.vue'
  import { toastSuccess, toastFail } from '@/utils/toast'

  @Component({
    components: {
      KayttooikeusForm
    }
  })
  export default class Kayttooikeus extends Vue {
    loading = false

    async onSubmit(value: any) {
      this.loading = true
      try {
        await api.putKayttooikeushakemus(value)
        toastSuccess(this, this.$t('kayttooikeuden-lisaaminen-onnistui'))
        this.$router.push({ name: 'etusivu' })
      } catch {
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
