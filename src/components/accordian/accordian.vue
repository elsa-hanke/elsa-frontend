<template>
  <b-card no-body class="border mb-2" v-bind="$attrs">
    <b-card-header
      header-tag="header"
      class="py-2 pl-2 pr-5 px-lg-5 text-size-md font-weight-500 text-black user-select-none bg-transparent accordian-header"
      :class="{ empty: !$slots.default, 'always-open': alwaysOpen }"
      role="tab"
      tabindex="0"
      @click="toggle"
      @keyup.space="toggle"
      @keyup.enter="toggle"
    >
      <slot name="header">
        <font-awesome-icon
          v-if="icon"
          :icon="icon"
          fixed-width
          size="lg"
          class="text-muted accordian-icon"
        />
      </slot>
      <slot name="title">
        {{ title }}
      </slot>
      <font-awesome-icon
        v-if="$slots.default && !alwaysOpen"
        icon="chevron-up"
        fixed-width
        size="lg"
        class="accordian-chevron-icon"
        :class="{ opened: visible, closed: !visible }"
      />
    </b-card-header>
    <b-collapse v-if="$slots.default" :visible="visible">
      <b-card-body class="p-2 pl-lg-5">
        <b-card-text>
          <slot />
        </b-card-text>
      </b-card-body>
    </b-collapse>
  </b-card>
</template>

<script lang="ts">
  import Vue from 'vue'
  import Component from 'vue-class-component'
  import { Prop } from 'vue-property-decorator'

  @Component
  export default class ElsaAccordian extends Vue {
    visible = true

    @Prop({ required: false, default: false, type: Boolean })
    alwaysOpen!: boolean

    @Prop({ required: false, type: String })
    accordion?: string

    @Prop({ required: false })
    icon?: string | string[]

    @Prop({ required: false })
    title?: string

    toggle() {
      this.visible = this.alwaysOpen ? true : !this.visible
    }
  }
</script>

<style lang="scss" scoped>
  @import '~@/styles/variables';
  @import '~bootstrap/scss/mixins/breakpoints';

  .accordian-header {
    cursor: pointer;

    &.empty {
      cursor: auto;
    }
    &.always-open {
      cursor: auto;
    }
  }

  @include media-breakpoint-up(lg) {
    .accordian-icon {
      position: absolute;
      left: 0.75rem;
    }
  }

  .accordian-chevron-icon {
    position: absolute;
    top: 0.5rem;
    right: 0.75rem;
    transition: transform 0.3s ease-in-out;

    &.closed {
      transform: rotate(-180deg);
    }
  }
</style>
