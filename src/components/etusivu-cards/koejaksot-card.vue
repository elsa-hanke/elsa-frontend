<template>
  <b-card-skeleton :header="$t('koejaksot')" :loading="true" class="mb-3"></b-card-skeleton>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator'

  import BCardSkeleton from '@/components/card/card.vue'

  @Component({
    components: {
      BCardSkeleton
    }
  })
  export default class KoejaksotCard extends Vue {}
</script>
