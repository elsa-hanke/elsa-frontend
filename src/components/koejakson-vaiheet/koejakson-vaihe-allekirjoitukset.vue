<template>
  <div v-if="allekirjoitukset">
    <b-row class="mb-3">
      <b-col>
        <h3>{{ $t('allekirjoitukset') }}</h3>
      </b-col>
    </b-row>
    <b-row v-for="(allekirjoitus, index) in allekirjoitukset" :key="index">
      <b-col class="allekirjoitus-pvm col-xxl-1" lg="2">
        <h5>{{ $t('päiväys') }}</h5>
        <p>
          {{ $date(allekirjoitus.pvm) }}
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
  import { KoejaksonVaiheAllekirjoitus } from '@/types'
  import { Component, Prop, Vue } from 'vue-property-decorator'

  @Component({})
  export default class KoejaksonVaiheAllekirjoitukset extends Vue {
    @Prop({ required: true, default: undefined })
    allekirjoitukset!: KoejaksonVaiheAllekirjoitus[] | null
  }
</script>

<style lang="scss" scoped>
  .allekirjoitus-pvm {
    min-width: 7rem;
  }
</style>
