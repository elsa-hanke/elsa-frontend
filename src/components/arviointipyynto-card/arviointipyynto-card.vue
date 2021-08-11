<template>
  <div>
    <b-container fluid class="px-0 mb-3">
      <b-row>
        <b-col lg="8">
          <div class="d-flex justify-content-between align-items-center">
            <div class="text-size-lg font-weight-500 mr-3">
              {{ value.arvioitavaTapahtuma }}
            </div>
            <div class="separator">
              {{ $date(value.tapahtumanAjankohta) }}
            </div>
          </div>
        </b-col>
        <b-col class="d-flex align-items-center">
          <div>{{ value.tyoskentelyjakso.tyoskentelypaikka.nimi }}</div>
        </b-col>
      </b-row>
    </b-container>
    <b-container fluid>
      <b-row>
        <b-col lg="8">
          <div class="flex-fill">
            <b-table-simple borderless responsive>
              <tr>
                <th scope="row" class="py-0 pl-0 pr-1 font-weight-500" style="width: 33.33%">
                  {{ $t('epa-osaamisalue') }}
                </th>
                <td class="py-0 pr-0 pl-1">
                  {{ value.arvioitavaOsaalue.nimi }}
                </td>
              </tr>
              <tr>
                <th scope="row" class="py-0 pl-0 pr-1 font-weight-500">
                  {{ $t('kouluttaja-tai-vastuuhenkilo') }}
                </th>
                <td class="py-0 pr-0 pl-1">
                  {{ value.arvioinninAntaja.nimi }}
                </td>
              </tr>
              <tr v-if="value.lisatiedot">
                <th scope="row" class="py-0 pl-0 pr-1 font-weight-500">
                  {{ $t('lisatiedot') }}
                </th>
                <td class="py-0 pr-0 pl-1">
                  <span class="text-prewrap">{{ value.lisatiedot }}</span>
                </td>
              </tr>
            </b-table-simple>
          </div>
          <elsa-button
            v-if="!value.itsearviointiAika"
            variant="outline-primary"
            class="mr-2"
            :to="{
              name: 'itsearviointi',
              params: { arviointiId: value.id }
            }"
          >
            {{ $t('tee-itsearviointi') }}
          </elsa-button>
          <elsa-button
            v-if="!value.arviointiAika"
            variant="primary"
            :to="{
              name: 'arviointipyynto-muokkaus',
              params: { arviointiId: value.id }
            }"
          >
            {{ $t('muokkaa-arviointipyyntoa') }}
          </elsa-button>
        </b-col>
      </b-row>
    </b-container>
    <hr />
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
  export default class ArviointipyyntoCard extends Vue {
    @Prop({})
    value!: any
  }
</script>

<style lang="scss" scoped>
  @import '~@/styles/variables';
  @import '~bootstrap/scss/mixins/breakpoints';

  .separator {
    &::after {
      content: '|';
      position: absolute;
      right: -2px;
      @include media-breakpoint-down(md) {
        display: none;
      }
    }
  }

  hr {
    border-top-color: $hr-color;
    border-top-width: 3px;
  }
  ::v-deep table {
    thead tr {
      border-bottom: solid $gray-300 1px;
    }
    th:first-child {
      padding-left: 0;
    }
    th:last-child {
      padding-right: 0;
    }
    td {
      vertical-align: middle;
    }
    td:first-child {
      padding-left: 0;
    }
    td:last-child {
      padding-right: 0;
    }
  }
</style>
