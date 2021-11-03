<template>
  <b-modal :id="id" :title="title">
    <div v-if="text != null" class="d-block">
      <p>{{ text }}</p>
    </div>

    <template #modal-footer>
      <elsa-button variant="back" @click="hideModal">
        {{ $t('peruuta') }}
      </elsa-button>

      <elsa-button variant="primary" @click="onSubmit">
        {{ submitText }}
      </elsa-button>
    </template>
    <slot name="modal-content" />
  </b-modal>
</template>

<script lang="ts">
  import Component from 'vue-class-component'
  import { Mixins, Prop } from 'vue-property-decorator'
  import { validationMixin } from 'vuelidate'
  import { required } from 'vuelidate/lib/validators'

  import ElsaButton from '@/components/button/button.vue'

  @Component({
    components: {
      ElsaButton
    },
    validations: {
      korjausehdotus: {
        required
      }
    }
  })
  export default class ElsaConfirmationModal extends Mixins(validationMixin) {
    @Prop({ required: true, type: String })
    id!: string

    @Prop({ required: true, type: String })
    title!: string

    @Prop({ required: false, type: String })
    text!: string

    @Prop({ required: true, type: String })
    submitText!: string

    hideModal() {
      return this.$bvModal.hide(this.id)
    }

    // Välitä tapahtuma vanhemmalle
    onSubmit(value: any, params: any) {
      this.hideModal()
      this.$emit('submit', value, params)
    }
  }
</script>
