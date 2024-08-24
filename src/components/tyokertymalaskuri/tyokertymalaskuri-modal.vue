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
    <tyokertymalaskuri-modal-content
      :tyoskentelyjakso="tyoskentelyjakso"
      @submit="onSubmit"
      @closeModal="closeModal"
    />
  </b-modal>
</template>
<script lang="ts">
  import { Vue, Component, Prop } from 'vue-property-decorator'

  import TyokertymalaskuriModalContent from '@/components/tyokertymalaskuri/tyokertymalaskuri-modal-content.vue'
  import { TyokertymaLaskuriTyoskentelyjakso } from '@/types'

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

    @Prop({ required: false })
    tyoskentelyjakso!: TyokertymaLaskuriTyoskentelyjakso

    onSubmit(formData: any, params: any) {
      this.$emit('submit', formData, params)
    }

    closeModal() {
      this.$emit('input', false)
    }
  }
</script>

<style lang="scss" scoped>
  @import '~@/styles/variables';
  @import '~bootstrap/scss/mixins/breakpoints';

  .tietosuojaseloste {
    max-width: 970px;
  }
</style>
