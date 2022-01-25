<template>
  <b-card-skeleton
    :header="$t('arvioinnin-tyokalut')"
    :loading="true"
    class="mb-3"
  ></b-card-skeleton>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator'

  import BCardSkeleton from '@/components/card/card.vue'

  @Component({
    components: {
      BCardSkeleton
    }
  })
  export default class ArvioinninTyokalutCard extends Vue {}
</script>
