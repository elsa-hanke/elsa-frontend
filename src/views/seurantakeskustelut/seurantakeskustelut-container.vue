<template>
  <div class="seurantakeskustelut-container">
    <seurantakeskustelut-view-erikoistuva
      v-if="$isErikoistuva()"
    ></seurantakeskustelut-view-erikoistuva>
    <seurantakeskustelut-view-kouluttaja
      v-if="$isKouluttaja()"
    ></seurantakeskustelut-view-kouluttaja>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import Component from 'vue-class-component'

  import SeurantakeskustelutViewErikoistuva from '@/views/seurantakeskustelut/erikoistuva/seurantakeskustelut-erikoistuja.vue'
  import SeurantakeskustelutViewKouluttaja from '@/views/seurantakeskustelut/kouluttaja/seurantakeskustelut-kouluttaja.vue'

  @Component({
    components: {
      SeurantakeskustelutViewErikoistuva,
      SeurantakeskustelutViewKouluttaja
    }
  })
  export default class SeurantakeskustelutContainer extends Vue {
    get notFound() {
      return !(this.$isErikoistuva() || this.$isKouluttaja())
    }
  }
</script>

<style lang="scss">
  .seurantakeskustelut-container {
    max-width: 1024px;
  }
</style>
