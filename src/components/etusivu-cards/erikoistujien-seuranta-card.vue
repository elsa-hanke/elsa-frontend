<template>
  <div>
    <h2>{{ $t('erikoistujien-seuranta') }}</h2>
    <b-card-skeleton
      :header="$t('erikoistujien-seuranta')"
      :loading="true"
      class="mb-3"
    ></b-card-skeleton>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator'

  import BCardSkeleton from '@/components/card/card.vue'

  @Component({
    components: {
      BCardSkeleton
    }
  })
  export default class ErikoistujienSeurantaCard extends Vue {}
</script>
