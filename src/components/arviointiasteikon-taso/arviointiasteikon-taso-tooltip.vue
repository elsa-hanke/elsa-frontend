<template>
  <div>
    <h3>{{ arviointiasteikonNimi }}</h3>
    <div v-for="(asteikonTaso, index) in arviointiasteikonTasot" :key="index">
      <h4>
        {{ asteikonTaso.taso }}
        {{ $t('arviointiasteikon-taso-' + asteikonTaso.nimi) }}
      </h4>
      <p>{{ $t('arviointiasteikon-tason-kuvaus-' + asteikonTaso.nimi) }}</p>
    </div>
  </div>
</template>

<script lang="ts">
  import Component from 'vue-class-component'
  import { Vue, Prop } from 'vue-property-decorator'

  import { ArviointiasteikonTaso } from '@/types'

  @Component({})
  export default class ElsaArviointiasteikonTasoTooltipContent extends Vue {
    @Prop({ required: true })
    arviointiasteikonNimi!: string

    @Prop({ required: true })
    arviointiasteikonTasot!: ArviointiasteikonTaso[]
  }
</script>
