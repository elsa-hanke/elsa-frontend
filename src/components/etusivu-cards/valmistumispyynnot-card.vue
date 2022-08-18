<template>
  <b-card-skeleton
    :header="$t('valmistumispyynnot')"
    :loading="true"
    class="mb-4 d-none"
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
  export default class ValmistumispyynnotCard extends Vue {}
</script>
