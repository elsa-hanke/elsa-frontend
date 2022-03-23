<template>
  <b-container class="mt-4 mb-6">
    <b-row>
      <b-col lg="5">
        <h1 class="text-primary">{{ $t('melkein-valmista') }}</h1>
        <kayton-aloitus-form :opintooikeudet="opintooikeudet" @submit="onSubmit" class="mb-3" />
      </b-col>
      <b-col>
        <img src="@/assets/elsa-kirjautuminen.svg" :alt="$t('elsa-palvelu')" class="img-fluid" />
      </b-col>
    </b-row>
  </b-container>
</template>
<script lang="ts">
  import { AxiosError } from 'axios'
  import { Component, Vue } from 'vue-property-decorator'

  import { getErikoistuvaLaakari, putKaytonAloitusLomake } from '@/api/erikoistuva'
  import KaytonAloitusForm from '@/forms/kayton-aloitus-form.vue'
  import { KaytonAloitusModel, Opintooikeus, ElsaError } from '@/types/index'
  import { filterOpintooikeudetByAllowedStates } from '@/utils/opintooikeus'
  import { toastFail } from '@/utils/toast'

  @Component({
    components: {
      KaytonAloitusForm
    }
  })
  export default class KaytonAloitus extends Vue {
    loading = false

    opintooikeudet: null | Opintooikeus[] = null

    async mounted() {
      const erikoistuvaLaakari = (await getErikoistuvaLaakari()).data
      this.opintooikeudet = filterOpintooikeudetByAllowedStates(erikoistuvaLaakari)
    }

    async onSubmit(form: KaytonAloitusModel) {
      this.loading = true
      try {
        await putKaytonAloitusLomake(form)
        this.$router.push({ name: 'etusivu' })
      } catch (err) {
        this.loading = false
        const axiosError = err as AxiosError<ElsaError>
        const message = axiosError?.response?.data?.message
        toastFail(
          this,
          message
            ? `${this.$t('tietojen-tallennus-epaonnistui')}: ${this.$t(message)}`
            : this.$t('tietojen-tallennus-epaonnistui')
        )
      }
    }
  }
</script>
<style lang="scss" scoped>
  .text-primary {
    font-size: 1.75rem;
  }
</style>
