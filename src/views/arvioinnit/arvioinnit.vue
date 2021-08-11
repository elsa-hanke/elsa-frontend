<template>
  <ArvioinnitErikoistuva v-if="$isErikoistuva()" />
  <ArvioinnitKouluttaja v-else />
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator'
  import ArvioinnitErikoistuva from '@/views/arvioinnit/arvioinnit-erikoistuva.vue'
  import ArvioinnitKouluttaja from '@/views/arvioinnit/arvioinnit-kouluttaja.vue'

  @Component({
    components: {
      ArvioinnitErikoistuva,
      ArvioinnitKouluttaja
    }
  })
  export default class Arvioinnit extends Vue {}
</script>
