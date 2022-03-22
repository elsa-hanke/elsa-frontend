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
  import { Component, Vue } from 'vue-property-decorator'

  import { getErikoistuvaLaakari, putKaytonAloitusLomake } from '@/api/erikoistuva'
  import KaytonAloitusForm from '@/forms/kayton-aloitus-form.vue'
  import { KaytonAloitusModel, Opintooikeus } from '@/types/index'
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
      } catch {
        this.loading = false
        toastFail(this, this.$t('tietojen-tallennus-epaonnistui'))
      }
    }
  }
</script>
<style lang="scss" scoped>
  .text-primary {
    font-size: 1.75rem;
  }
</style>
