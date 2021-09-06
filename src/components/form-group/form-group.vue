<template>
  <b-form-group :label-for="uid" v-bind="$attrs">
    <template v-slot:label>
      <div class="d-flex justify-content-between align-items-center flex-wrap">
        <div :class="{ 'mr-3': addNewEnabled }">
          {{ label }}
          <span class="text-primary">
            {{ required ? '*' : '' }}
            <font-awesome-icon
              v-if="help"
              v-b-popover.hover.top="help"
              icon="info-circle"
              fixed-width
            />
          </span>
          <slot name="label-help" />
        </div>
        <div v-if="$slots['help']" class="form-group-help font-weight-400">
          <font-awesome-icon icon="info-circle" fixed-width class="text-muted" />
          <slot name="help" />
        </div>
        <div v-if="addNewEnabled" class="form-group-help font-weight-400">
          <font-awesome-icon icon="info-circle" fixed-width class="text-muted" />
          &nbsp;
          <b-link @click="$refs[modalRef].show()">{{ addNewLabelText }}</b-link>
          <span>{{ $t('tai-valitse-alta') }}</span>
          <b-modal :ref="modalRef" centered size="lg" :hide-footer="true" @hide="onHide">
            <template v-slot:modal-title>
              {{ addNewLabelText }}
            </template>
            <slot name="modal-content" :submit="onSubmit" :cancel="onCancel" />
          </b-modal>
        </div>
      </div>
    </template>
    <slot :uid="uid" />
  </b-form-group>
</template>

<script lang="ts">
  import Vue from 'vue'
  import Component from 'vue-class-component'
  import { Prop } from 'vue-property-decorator'
  import { confirmExit } from '@/utils/confirm'

  @Component({})
  export default class ElsaFormGroup extends Vue {
    @Prop({ required: true, type: String })
    label!: string

    @Prop({ required: false, type: String })
    addNewLabel!: string

    @Prop({ required: false, default: false })
    addNewEnabled!: boolean

    @Prop({ required: false, type: Boolean, default: false })
    required!: boolean

    @Prop({ required: false, type: String })
    help!: string

    async onHide(event: any) {
      // Tarkista, onko poistuminen jo vahvistettu
      if (event.trigger !== 'confirm') {
        event.preventDefault()
      } else {
        return
      }

      // Pyydä poistumisen vahvistus
      if (await confirmExit(this)) {
        ;(this.$refs[this.modalRef] as any).hide('confirm')
      }
    }

    // Välitä tapahtuma vanhemmalle
    onSubmit(value: any, params: any) {
      this.$emit('submit', value, params, this.$refs[this.modalRef])
    }

    async onCancel() {
      if (await confirmExit(this)) {
        ;(this.$refs[this.modalRef] as any).hide('confirm')
      }
    }

    get addNewLabelText() {
      return this.addNewLabel ? this.addNewLabel : this.$t('lisaa-uusi')
    }

    get modalRef() {
      return `elsa-form-group-modal-${(this as any)._uid}`
    }

    get uid() {
      return `elsa-form-group-${(this as any)._uid}`
    }
  }
</script>

<style lang="scss" scoped>
  @import '~@/styles/variables';

  .form-group-help {
    font-size: $font-size-sm;
  }
</style>
