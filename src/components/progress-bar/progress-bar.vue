<template>
  <div
    class="position-relative progress user-select-none"
    :style="`height: 1.5rem; background-color: ${backgroundColor}`"
  >
    <div class="progress-bar" :style="`width: ${ratio}%; background-color: ${color}`">
      <span class="position-absolute font-weight-500 text-size-sm px-2">
        {{ customUnit ? `${value} ${customUnit}` : $duration(value) }}
      </span>
      <span
        v-if="showRequiredText"
        class="position-absolute position-right text-right text-size-sm px-2"
      >
        {{ $t('vah') }} {{ minRequired }} {{ customUnit }}
      </span>
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import Component from 'vue-class-component'
  import { Prop } from 'vue-property-decorator'

  import { clamp } from '@/utils/functions'

  @Component
  export default class ElsaProgressBar extends Vue {
    @Prop({ required: true })
    value!: number

    @Prop({ required: false })
    minRequired!: number

    @Prop({ required: false, default: false })
    showRequiredText!: boolean

    @Prop({ required: false })
    color?: string

    @Prop({ required: false })
    backgroundColor?: string

    @Prop({ required: false })
    customUnit?: string

    get ratio() {
      return clamp((this.value / this.minRequired) * 100, 0, 100)
    }
  }
</script>

<style lang="scss" scoped>
  .position-right {
    right: 0;
  }
</style>
