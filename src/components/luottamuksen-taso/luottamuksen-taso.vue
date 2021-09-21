<template>
  <elsa-badge :value="value" :help="tasonNimi" />
</template>

<script lang="ts">
  import Vue from 'vue'
  import Component from 'vue-class-component'
  import { Prop } from 'vue-property-decorator'

  import ElsaBadge from '@/components/badge/badge.vue'
  import { luottamuksenTasot } from '@/utils/constants'

  @Component({
    components: {
      ElsaBadge
    }
  })
  export default class ElsaLuottamuksenTaso extends Vue {
    @Prop({ required: true })
    value!: number

    tasot = luottamuksenTasot

    get tasonNimi() {
      const taso = this.tasot.find((taso) => taso.arvo === this.value)
      if (taso) {
        return this.$t(taso.nimi)
      }
      return undefined
    }
  }
</script>
