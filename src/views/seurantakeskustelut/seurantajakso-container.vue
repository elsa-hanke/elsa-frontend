<template>
  <div class="seurantajakso-container">
    <seurantajakso-view-erikoistuja v-if="$isErikoistuva()"></seurantajakso-view-erikoistuja>
    <seurantajakso-view-kouluttaja v-if="$isKouluttaja()"></seurantajakso-view-kouluttaja>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import Component from 'vue-class-component'

  import SeurantajaksoViewErikoistuja from '@/views/seurantakeskustelut/erikoistuva/seurantajakso-erikoistuja.vue'
  import SeurantajaksoViewKouluttaja from '@/views/seurantakeskustelut/kouluttaja/seurantajakso-kouluttaja.vue'

  @Component({
    components: {
      SeurantajaksoViewErikoistuja,
      SeurantajaksoViewKouluttaja
    }
  })
  export default class SeurantajaksoContainer extends Vue {
    get notFound() {
      return !(this.$isErikoistuva() || this.$isKouluttaja())
    }
  }
</script>

<style lang="scss" scoped>
  .seurantajakso-container {
    max-width: 1024px;
  }
</style>
