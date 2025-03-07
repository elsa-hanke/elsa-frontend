<template>
  <b-modal
    :id="modalRef"
    :ref="modalRef"
    :visible="value"
    :title="$t('arviointityokalut')"
    size="xl"
    :scrollable="true"
    :hide-footer="true"
    @hidden="$emit('input', false)"
    @hide="onHide"
    @show="onShow"
  >
    <!--
    <arviointityokalut-modal-content
      @skipRouteExitConfirm="onSkipRouteExitConfirm"
      @submit="onSubmit"
      @delete="onDelete"
      @closeModal="closeModal"
    />
    -->
  </b-modal>
</template>
<script lang="ts">
  import { BvModalEvent } from 'bootstrap-vue'
  import { Vue, Component, Prop } from 'vue-property-decorator'

  import { confirmExit } from '@/utils/confirm'

  @Component({
    components: {}
  })
  export default class ArviointityokalutModal extends Vue {
    items = [
      {
        text: this.$t('etusivu'),
        to: { name: 'etusivu' }
      },
      {
        text: this.$t('arvioinnit'),
        to: { name: 'arvioinnit' }
      },
      {
        text: this.$t('arviointi'),
        active: false
      },
      {
        text: this.$t('arviointityokalut'),
        active: true
      }
    ]
    skipConfirm = true

    @Prop({ required: true, type: Boolean, default: false })
    value!: boolean

    async onSkipRouteExitConfirm(value: boolean) {
      this.skipConfirm = value
    }

    async onShow() {
      this.skipConfirm = true
    }

    async onHide(event: BvModalEvent) {
      // Tarkista, onko poistuminen jo vahvistettu
      if (!this.skipConfirm) {
        event.preventDefault()
      } else {
        return
      }

      // Pyydä poistumisen vahvistus
      if (await confirmExit(this)) {
        this.skipConfirm = true
        this.$bvModal.hide(this.modalRef)
      }
    }

    onSubmit(formData: any, params: any) {
      this.skipConfirm = true
      this.$emit('submit', formData, params)
    }

    onDelete(id: number) {
      this.$emit('delete', id)
    }

    closeModal() {
      this.$emit('input', false)
    }

    get modalRef() {
      return `arviointityokalut-modal`
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
