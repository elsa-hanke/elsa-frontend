<template>
  <multiselect
    :id="id"
    v-bind="$attrs"
    :placeholder="placeholderText"
    :tag-placeholder="tagPlaceholderText"
    :select-label="selectLabelText"
    :select-group-label="selectGroupLabelText"
    :selected-label="selectedLabelText"
    :deselect-label="deselectLabelText"
    :deselect-group-label="deselectGroupLabelText"
    :allow-empty="allowEmpty"
    :max="max"
    v-on="$listeners"
    :class="{ 'is-invalid': isInvalid, 'is-valid': isValid }"
  >
    <template slot="maxElements">{{ $t('valittuna-enimmäismaara', { max }) }}</template>
    <template slot="noResult">{{ $t('ei-hakutuloksia') }}</template>
    <template slot="noOptions">{{ $t('ei-vaihtoehtoja') }}</template>
    <template v-for="(index, name) in $scopedSlots" v-slot:[name]="data">
      <slot :name="name" v-bind="data"></slot>
    </template>
  </multiselect>
</template>

<script lang="ts">
  import Vue from 'vue'
  import Component from 'vue-class-component'
  import Multiselect from 'vue-multiselect'
  import { Prop } from 'vue-property-decorator'

  @Component({
    components: {
      Multiselect
    }
  })
  export default class ElsaFormMultiselect extends Vue {
    @Prop({ required: false, type: String })
    id?: string

    @Prop({ required: false, type: String })
    placeholder?: string

    @Prop({ required: false, type: String })
    tagPlaceholder?: string

    @Prop({ required: false, type: String })
    selectLabel?: string

    @Prop({ required: false, type: String })
    selectGroupLabel?: string

    @Prop({ required: false, type: String })
    selectedLabel?: string

    @Prop({ required: false, type: String })
    deselectLabel?: string

    @Prop({ required: false, type: String })
    deselectGroupLabel?: string

    @Prop({ required: false, type: Number })
    max?: number

    @Prop({ required: false, type: Boolean, default: undefined })
    state?: boolean

    @Prop({ required: false, type: Boolean, default: false })
    allowEmpty!: boolean

    get isValid() {
      return this.state
    }

    get isInvalid() {
      return this.state === false
    }

    get placeholderText() {
      return this.placeholder || this.$t('valitse')
    }

    get tagPlaceholderText() {
      return ''
    }

    get selectLabelText() {
      return ''
    }

    get selectGroupLabelText() {
      return ''
    }

    get selectedLabelText() {
      return ''
    }

    get deselectLabelText() {
      return ''
    }

    get deselectGroupLabelText() {
      return ''
    }
  }
</script>

<style lang="scss" scoped>
  @import '~@/styles/variables';

  ::v-deep {
    min-height: 35px !important;

    &.multiselect--disabled {
      background: transparent;
      opacity: 1;

      .multiselect__current,
      .multiselect__select {
        background: transparent;
      }
      .multiselect__tags {
        background-color: $input-disabled-bg;
      }
      .multiselect__single {
        color: #495057;
        background-color: $input-disabled-bg;
      }
    }

    .multiselect__select {
      height: $font-size-base * $line-height-base + 2 * 0.375rem;

      &::before {
        top: 68%;
      }
    }
    .multiselect__tags {
      padding: 0.375rem 2.5rem 0.375rem 0.75rem;
      border: 1px solid $gray-400;
      min-height: initial;
      font-size: $font-size-base;
      line-height: $line-height-base;
      .multiselect__spinner {
        right: 5px;
        width: 30px;
        height: $font-size-base * $line-height-base + 2 * 0.375rem;
        &::before {
          border: 0.2em solid $primary;
          border-right-color: transparent;
          animation: spinner-border 0.75s linear infinite;
        }
        &::after {
          display: none;
        }
      }
      .multiselect__single {
        margin: 0;
        padding: 0;
        font-size: $font-size-base;
      }
      .multiselect__tag {
        margin-left: -3px;
        margin-bottom: -6px;
        font-size: $font-size-base;
      }
      .multiselect__option {
        font-size: $font-size-base;
      }
      .multiselect__placeholder {
        font-size: $font-size-base;
        line-height: $line-height-base;
        margin: 0;
        padding: 0;
      }
      .multiselect__input,
      .multiselect__single {
        font-size: $font-size-base;
        line-height: $line-height-base;
      }
      .multiselect__input {
        font-size: $font-size-base;
        line-height: $line-height-base;
        padding: 0;
        margin: 0;
      }
      .multiselect__tag {
        font-size: $font-size-sm;
        font-weight: $font-weight-500;
        background: $primary-dark;
        border-radius: $rounded-pill;
        margin-right: 6px;

        .multiselect__tag-icon {
          border-radius: 0;
          line-height: 22px;

          &:focus,
          &:hover {
            background: $primary;
          }

          &::after {
            color: $white;
            font-size: $font-size-lg;
          }
        }
      }
    }

    .multiselect__content-wrapper {
      font-size: 0.875rem;
      border-color: $gray-400;

      .multiselect__option {
        padding: 0.75rem;
        white-space: normal;
        min-height: unset;
      }

      .multiselect__option::after {
        top: 50%;
        transform: translateY(-50%);
      }
      .multiselect__option.multiselect__option--highlight,
      .multiselect__option.multiselect__option--highlight::after {
        color: $black;
        background: #f5f5f6;
      }
      .multiselect__option.multiselect__option--selected,
      .multiselect__option.multiselect__option--selected::after {
        color: $white;
        background: #b1b1b1;
      }
      .multiselect__option.multiselect__option--highlight.multiselect__option--selected,
      .multiselect__option.multiselect__option--highlight.multiselect__option--selected::after {
        color: $white;
        background: #b1b1b1;
      }

      .multiselect__option.multiselect__option--group {
        color: $black;
        background: transparent;
        font-weight: $font-weight-500;

        &.multiselect__option--highlight {
          background: #f5f5f6;
        }
        &.multiselect__option--disabled {
          color: $black !important;
          background: transparent !important;
        }
      }
    }

    &.is-invalid .multiselect__content-wrapper,
    &.is-invalid .multiselect__tags {
      border-color: $form-feedback-invalid-color;
    }
  }
</style>
