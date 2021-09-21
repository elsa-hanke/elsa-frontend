<template>
  <div class="bar-chart user-select-none">
    <b-table-simple borderless class="text-size-sm mt-3 border-0">
      <b-tr v-for="(row, index) in value" :key="index">
        <b-td
          class="text-right text-nowrap"
          :class="{
            'font-weight-500': row.highlight,
            'pt-2': row.highlight,
            'pt-1': !row.highlight
          }"
        >
          {{ row.text }}
        </b-td>
        <b-td
          class="px-2"
          style="width: 100%"
          :class="{ 'pt-2': row.highlight, 'pt-1': !row.highlight }"
        >
          <elsa-progress-bar
            :value="row.value"
            :min-required="row.minRequired"
            :color="row.color"
            :background-color="row.backgroundColor"
          />
        </b-td>
        <b-td
          class="text-nowrap"
          :class="{
            'font-weight-500': row.highlight,
            'pt-2': row.highlight,
            'pt-1': !row.highlight
          }"
        >
          {{ $t('vah') }} {{ $duration(row.minRequired) }}
        </b-td>
      </b-tr>
    </b-table-simple>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import Component from 'vue-class-component'
  import { Prop } from 'vue-property-decorator'

  import ElsaProgressBar from '@/components/progress-bar/progress-bar.vue'

  @Component({
    components: {
      ElsaProgressBar
    }
  })
  export default class ElsaBarChart extends Vue {
    @Prop({ required: false, default: [] })
    value!: any[]
  }
</script>

<style lang="scss" scoped>
  .bar-chart {
    ::v-deep table {
      td {
        padding: 0;
        vertical-align: middle;
      }
    }
  }
</style>
