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
              <!-- TODO: omat tiedot komponentti -->
            </b-tab>
            <b-tab :title="$t('katseluoikeudet')">
              <katseluoikeudet />
            </b-tab>
          </b-tabs>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator'
  import Katseluoikeudet from '@/components/profiili/katseluoikeudet.vue'

  @Component({
    components: {
      Katseluoikeudet
    }
  })
  export default class Kayttajaprofiili extends Vue {
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
  }
</script>

<style lang="scss" scoped>
  .profiili {
    max-width: 768px;
  }
</style>
