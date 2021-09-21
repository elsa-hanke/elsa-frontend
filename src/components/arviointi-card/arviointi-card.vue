<template>
  <div>
    <b-container fluid>
      <b-row>
        <b-col>
          <div class="d-flex justify-content-between align-items-center">
            <div class="text-size-lg font-weight-500 mr-3">
              {{ value.arvioitavaTapahtuma }}
            </div>
            <div>
              {{ $date(value.tapahtumanAjankohta) }} |
              {{ value.tyoskentelyjakso.tyoskentelypaikka.nimi }} |
              {{ value.arvioinninAntaja.nimi }}
            </div>
          </div>
        </b-col>
      </b-row>
    </b-container>
    <b-container fluid>
      <b-row>
        <b-col lg="12">
          <b-table-simple borderless small responsive>
            <thead>
              <tr>
                <th scope="col" style="width: 20%">
                  {{ value.arvioitavaOsaalue.nimi }}
                </th>
                <th scope="col" style="width: 40%">{{ $t('arviointi') }}</th>
                <th scope="col" style="width: 40%">
                  {{ $t('itsearviointi') }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row" class="font-weight-400">
                  <div>
                    {{ $t('luottamuksen-taso') }}
                  </div>
                </th>
                <td>
                  <div v-if="!value.arviointiAika" class="text-size-sm text-muted">
                    {{ $t('arviointia-ei-ole-viela-annettu') }}
                  </div>
                  <elsa-luottamuksen-taso
                    v-if="value.luottamuksenTaso"
                    :value="value.luottamuksenTaso"
                  />
                </td>
                <td>
                  <elsa-luottamuksen-taso
                    v-if="value.itsearviointiLuottamuksenTaso"
                    :value="value.itsearviointiLuottamuksenTaso"
                  />
                  <div v-else class="d-inline-flex">
                    <elsa-button
                      variant="primary"
                      class="d-flex align-items-center text-decoration-none"
                      :to="{
                        name: 'itsearviointi',
                        params: { arviointiId: value.id }
                      }"
                    >
                      {{ $t('tee-itsearviointi') }}
                    </elsa-button>
                  </div>
                </td>
              </tr>
            </tbody>
          </b-table-simple>

          <elsa-button
            variant="primary"
            :to="{ name: 'arviointi', params: { arviointiId: value.id } }"
          >
            {{ $t('avaa-arviointi') }}
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
  import ElsaLuottamuksenTaso from '@/components/luottamuksen-taso/luottamuksen-taso.vue'

  @Component({
    components: {
      ElsaLuottamuksenTaso,
      ElsaButton
    }
  })
  export default class ArviointiCard extends Vue {
    @Prop({})
    value!: any

    tableValue = {
      fields: [
        { key: 'epa', label: 'Hoitovastuun siirtäminen' },
        { key: 'arviointi', label: 'Arviointi' },
        { key: 'itsearviointi', label: 'Itsearviointi' }
      ],
      items: [
        {
          epa: this.$t('luottamuksen-taso'),
          arviointi: 3,
          itsearviointi: 4
        }
      ]
    }
    maxValue = 5
  }
</script>

<style lang="scss" scoped>
  @import '~@/styles/variables';
  @import '~bootstrap/scss/mixins/breakpoints';

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
    th,
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
