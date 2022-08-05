<template>
  <div class="opintosuoritukset-tab">
    <div class="d-flex justify-content-center border rounded pt-3 mb-4" v-if="progress">
      <b-container fluid>
        <elsa-form-group :label="$t('johtamisopinnot-yhteensa')">
          <template v-slot="{ uid }">
            <div :id="uid">
              <elsa-progress-bar
                :value="suoritettu"
                :min-required="vaadittu"
                :show-required-text="true"
                color="#41b257"
                backgroundColor="#b3e1bc"
                textColor="#000"
                class="mb-3"
                :customUnit="$t('opintopistetta-lyhenne')"
              />
            </div>
          </template>
        </elsa-form-group>
      </b-container>
    </div>
    <b-table-simple stacked="md">
      <b-thead>
        <b-tr>
          <b-th v-if="variant === 'johtaminen'" class="col1">{{ $t('opinto') }}</b-th>
          <b-th v-if="variant === 'sateily'" class="col1">{{ $t('koulutus') }}</b-th>
          <b-th v-if="variant === 'kuulustelu'" class="col1">{{ $t('kuulustelu') }}</b-th>
          <b-th v-if="variant === 'muu'" class="col1">{{ $t('suoritus') }}</b-th>
          <b-th class="col2">{{ $t('suorituspvm') }}</b-th>
          <b-th v-if="variant === 'johtaminen' || variant === 'sateily'" class="col3">
            {{ $t('opintopisteet') }}
          </b-th>
          <b-th v-if="variant === 'kuulustelu' || variant === 'muu'" class="col3">
            {{ $t('merkinta') }}
          </b-th>
        </b-tr>
      </b-thead>
      <b-tbody v-if="variant === 'kuulustelu' || variant === 'muu'">
        <b-tr v-for="(o, index) in os" :key="index">
          <b-td>
            <p>{{ o.nimi_fi }}</p>
          </b-td>
          <b-td>
            {{ o.suorituspaiva }}
          </b-td>
          <b-td>
            <span v-if="o.hyvaksytty">{{ $t('hyvaksytty') }}</span>
            <span v-if="!o.hyvaksytty" class="text-danger">{{ $t('hylatty') }}</span>
          </b-td>
        </b-tr>
      </b-tbody>
    </b-table-simple>
  </div>
</template>

<script lang="ts">
  import { Component, Vue, Prop } from 'vue-property-decorator'

  import ElsaFormGroup from '@/components/form-group/form-group.vue'
  import ElsaProgressBar from '@/components/progress-bar/progress-bar.vue'
  import { Opintosuoritus } from '@/types'

  @Component({
    components: {
      ElsaFormGroup,
      ElsaProgressBar
    }
  })
  export default class OpintosuoritusTab extends Vue {
    @Prop({ required: true, type: Array })
    os!: Opintosuoritus[]

    @Prop({ required: true, type: String })
    variant!: string

    @Prop({ required: false, type: Number })
    suoritettu!: number

    @Prop({ required: false, type: Number })
    vaadittu!: number

    @Prop({ required: false, type: Boolean, default: false })
    progress!: boolean
  }
</script>

<style lang="scss" scoped>
  .col1 {
    width: 60%;
  }
  .col2 {
    width: 15%;
  }
  .col3 {
    width: 25%;
  }
</style>
