<template>
  <div class="profiili">
    <b-breadcrumb :items="items" class="mb-0" />
    <b-container fluid>
      <b-row lg>
        <b-col>
          <h1>{{ $t('oma-profiili') }}</h1>
          <p>{{ $t('oma-profiili-kuvaus') }}</p>
          <b-tabs content-class="mt-3" :no-fade="true">
            <b-tab :title="$t('omat-tiedot')" active>
              <omat-tiedot :editing="editing" @change="changeEditing" />
            </b-tab>
            <b-tab v-if="$isErikoistuva()" :title="$t('katseluoikeudet')">
              <katseluoikeudet />
            </b-tab>
          </b-tabs>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script lang="ts">
  import { Component, Mixins } from 'vue-property-decorator'
  import ConfirmRouteExit from '@/mixins/confirm-route-exit'
  import OmatTiedot from './omat-tiedot.vue'
  import Katseluoikeudet from '@/components/profiili/katseluoikeudet.vue'

  @Component({
    components: {
      OmatTiedot,
      Katseluoikeudet
    }
  })
  export default class Profiili extends Mixins(ConfirmRouteExit) {
    items = [
      {
        text: this.$t('etusivu'),
        to: { name: 'etusivu' }
      },
      {
        text: this.$t('oma-profiili'),
        active: true
      }
    ]
    editing = false
    skipRouteExitConfirm = true

    changeEditing(event: boolean) {
      this.skipRouteExitConfirm = !event
      this.editing = event
    }
  }
</script>

<style lang="scss" scoped>
  .profiili {
    max-width: 768px;
  }
</style>
