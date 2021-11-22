<template>
  <div class="seurantajakso-container">
    <muokkaa-seurantajaksoa-erikoistuja
      v-if="$isErikoistuva()"
      @skipRouteExitConfirm="skipRouteExitConfirm()"
    ></muokkaa-seurantajaksoa-erikoistuja>
    <muokkaa-seurantajaksoa-kouluttaja
      v-if="$isKouluttaja()"
      @skipRouteExitConfirm="skipRouteExitConfirm()"
    ></muokkaa-seurantajaksoa-kouluttaja>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import Component from 'vue-class-component'

  import MuokkaaSeurantajaksoaErikoistuja from '@/views/seurantakeskustelut/erikoistuva/muokkaa-seurantajaksoa-erikoistuja.vue'
  import MuokkaaSeurantajaksoaKouluttaja from '@/views/seurantakeskustelut/kouluttaja/muokkaa-seurantajaksoa-kouluttaja.vue'

  @Component({
    components: {
      MuokkaaSeurantajaksoaErikoistuja,
      MuokkaaSeurantajaksoaKouluttaja
    }
  })
  export default class SeurantajaksoContainer extends Vue {
    get notFound() {
      return !(this.$isErikoistuva() || this.$isKouluttaja())
    }

    skipRouteExitConfirm() {
      this.$emit('skipRouteExitConfirm', true)
    }
  }
</script>

<style lang="scss" scoped>
  .seurantajakso-container {
    max-width: 1024px;
  }
</style>
