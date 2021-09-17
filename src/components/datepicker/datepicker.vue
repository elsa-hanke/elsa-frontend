<template>
  <b-form-datepicker
    :id="id"
    v-bind="$attrs"
    :state="state"
    start-weekday="1"
    :locale="currentLocale"
    :min="min"
    :max="max"
    placeholder=""
    :date-format-options="{
      year: 'numeric',
      month: 'numeric',
      day: 'numeric'
    }"
    :label-help="$t('datepicker-label-help')"
    :label-no-date-selected="$t('datepicker-no-date-selected')"
    :disabled="disabled"
    v-on="$listeners"
  >
    <template v-slot:button-content>
      <font-awesome-icon :icon="['far', 'calendar-alt']" class="text-primary" />
    </template>
  </b-form-datepicker>
</template>

<script lang="ts">
  import Vue from 'vue'
  import Component from 'vue-class-component'
  import { Prop } from 'vue-property-decorator'

  @Component({})
  export default class ElsaFormDatepicker extends Vue {
    @Prop({ required: false, type: String })
    id?: string

    @Prop({ required: false, type: Boolean, default: undefined })
    state?: boolean

    @Prop({ required: false, type: [String, Date] })
    min?: string | Date

    @Prop({ required: false, type: [String, Date] })
    max?: string | Date

    @Prop({ required: false, type: Boolean })
    disabled?: boolean

    get currentLocale() {
      if (this.$i18n) {
        return this.$i18n.locale
      } else {
        return 'fi'
      }
    }
  }
</script>
