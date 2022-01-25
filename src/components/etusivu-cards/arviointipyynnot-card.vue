<template>
  <b-card-skeleton :header="$t('arviointipyynnot')" :loading="true" class="mb-3"></b-card-skeleton>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator'

  import BCardSkeleton from '@/components/card/card.vue'

  @Component({
    components: {
      BCardSkeleton
    }
  })
  export default class ArviointipyynnotCard extends Vue {}
</script>
