<template>
  <b-modal
    id="tyokertymalaskuri-modal"
    :visible="value"
    :title="$t('lisaa-tyoskentelyjakso')"
    size="xl"
    :scrollable="true"
    :hide-footer="true"
    @hidden="$emit('input', false)"
  >
    <tyokertymalaskuri-modal-content />
  </b-modal>
</template>
<script lang="ts">
  import { Vue, Component, Prop } from 'vue-property-decorator'

  import TyokertymalaskuriModalContent from '@/components/tyokertymalaskuri/tyokertymalaskuri-modal-content.vue'

  @Component({
    components: { TyokertymalaskuriModalContent }
  })
  export default class TyokertymalaskuriModal extends Vue {
    items = [
      {
        text: this.$t('etusivu'),
        to: { name: 'etusivu' }
      },
      {
        text: this.$t('lisaa-tyoskentelyjakso'),
        active: true
      }
    ]

    @Prop({ required: true, type: Boolean, default: false })
    value!: boolean
  }
</script>

<style lang="scss" scoped>
  @import '~@/styles/variables';
  @import '~bootstrap/scss/mixins/breakpoints';

  .tietosuojaseloste {
    max-width: 970px;
  }
</style>
