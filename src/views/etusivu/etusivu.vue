<template>
  <div class="etusivu">
    <b-alert variant="dark" class="mt-2 ml-2" show>
      <font-awesome-icon icon="info-circle" fixed-width class="text-muted" />
      {{ $t('etusivun-toiminnallisuudet-tulossa-myohemmin') }}
    </b-alert>
    <EtusivuErikoistuja v-if="$isErikoistuva()" />
    <EtusivuKouluttaja v-else-if="$isKouluttaja()" />
    <EtusivuVastuuhenkilo v-else-if="$isVastuuhenkilo()" />
    <EtusivuVirkailija v-else-if="$isVirkailija()" />
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator'

  import EtusivuErikoistuja from '@/views/etusivu/etusivu-erikoistuja.vue'
  import EtusivuKouluttaja from '@/views/etusivu/etusivu-kouluttaja.vue'
  import EtusivuVastuuhenkilo from '@/views/etusivu/etusivu-vastuuhenkilo.vue'
  import EtusivuVirkailija from '@/views/etusivu/etusivu-virkailija.vue'

  @Component({
    components: {
      EtusivuErikoistuja,
      EtusivuKouluttaja,
      EtusivuVastuuhenkilo,
      EtusivuVirkailija
    }
  })
  export default class Etusivu extends Vue {}
</script>

<style lang="scss" scoped>
  .etusivu {
    max-width: 1420px;
  }
</style>
