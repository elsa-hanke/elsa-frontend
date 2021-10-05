<template>
  <div v-bind="$attrs">
    <h1 class="mb-4">{{ $t('tietojen-hakeminen-epaonnistui') }}</h1>
    <p><slot /></p>
    <elsa-button variant="primary" :loading="loading" @click="$emit('click')">
      {{ $t('yrita-uudestaan') }}
    </elsa-button>
  </div>
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
  export default class ElsaErrorMessage extends Vue {
    @Prop({ required: false, type: Boolean, default: false })
    loading!: boolean
  }
</script>
