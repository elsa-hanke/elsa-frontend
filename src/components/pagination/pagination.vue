<template>
  <b-pagination
    v-if="!loading && rows > perPage"
    class="mt-4"
    v-model="currentPageMutable"
    :total-rows="rows"
    :per-page="perPage"
    align="center"
    pills
    first-class="d-none"
    last-class="d-none"
  >
    <template slot="prev-text">
      <font-awesome-icon icon="chevron-left" fixed-width size="lg" />
      {{ $t('edellinen') }}
    </template>

    <template slot="next-text">
      {{ $t('seuraava') }}
      <font-awesome-icon icon="chevron-right" fixed-width size="lg" />
    </template>
  </b-pagination>
</template>

<script lang="ts">
  import { Component, Vue, Prop } from 'vue-property-decorator'

  @Component({})
  export default class Pagination extends Vue {
    @Prop({ required: true, default: null })
    currentPage!: any | null

    @Prop({ required: true, default: 0 })
    rows!: number

    @Prop({ required: true, default: 20 })
    perPage!: number

    @Prop({ required: true, default: false })
    loading!: boolean

    get currentPageMutable() {
      return this.currentPage
    }

    set currentPageMutable(val) {
      this.$emit('update:currentPage', val)
    }
  }
</script>

<style lang="scss">
  .maxw {
    max-width: inherit;
  }
</style>
