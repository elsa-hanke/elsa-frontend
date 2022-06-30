<template>
  <div v-if="showAllekirjoitukset">
    <b-row class="mb-3">
      <b-col>
        <h3>{{ $t(title) }}</h3>
      </b-col>
    </b-row>
    <b-row v-for="(allekirjoitus, index) in allekirjoitukset" :key="index">
      <b-col class="allekirjoitus-pvm col-xxl-1" lg="2">
        <h5>{{ $t('paivays') }}</h5>
        <p>
          {{ allekirjoitus.pvm ? $date(allekirjoitus.pvm) : '' }}
        </p>
      </b-col>
      <b-col>
        <h5>{{ $t('nimi-ja-nimike') }}</h5>
        <p>
          {{ allekirjoitus.nimiAndNimike }}
        </p>
      </b-col>
    </b-row>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator'

  import { KoejaksonVaiheAllekirjoitus } from '@/types'

  @Component({})
  export default class KoejaksonVaiheAllekirjoitukset extends Vue {
    @Prop({ required: true, default: [] })
    allekirjoitukset!: KoejaksonVaiheAllekirjoitus[] | null

    @Prop({ required: false, default: 'muokkauspaivamaarat' })
    title?: string

    get showAllekirjoitukset() {
      return this.allekirjoitukset ? this.allekirjoitukset.length > 0 : false
    }
  }
</script>

<style lang="scss" scoped>
  .allekirjoitus-pvm {
    min-width: 7rem;
  }
</style>
