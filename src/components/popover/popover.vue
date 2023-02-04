<template>
  <span>
    <elsa-button :id="uid" variant="link" class="shadow-none p-0 border-0 btn-normal-line-height">
      <font-awesome-icon class="text-primary" icon="info-circle" fixed-width />
    </elsa-button>
    <b-popover :target="uid" triggers="click blur" placement="auto">
      <template v-for="(index, name) in $slots" #[name]><slot :name="name" /></template>
    </b-popover>
  </span>
</template>

<script lang="ts">
  import Vue from 'vue'
  import Component from 'vue-class-component'
  import { Prop } from 'vue-property-decorator'

  import ElsaButton from '@/components/button/button.vue'

  @Component({
    components: {
      ElsaButton
    }
  })
  export default class ElsaPopover extends Vue {
    @Prop({ required: false, type: String })
    title?: string

    get uid() {
      return `elsa-popover-${(this as any)._uid}`
    }
  }
</script>

<style lang="scss" scoped>
  .btn-normal-line-height {
    line-height: normal !important;
  }

  ::v-deep {
    .popover-body {
      max-height: 75vh;
      overflow-y: scroll;
    }
  }
</style>
