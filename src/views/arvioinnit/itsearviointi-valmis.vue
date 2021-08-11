<template>
  <div class="itsearviointi-valmis">
    <b-breadcrumb :items="items" class="mb-0" />
    <b-container fluid>
      <b-row lg>
        <b-col>
          <h1 class="text-center">{{ $t('itsearviointi-valmis') }}</h1>
          <p class="text-center">Lorem ipsum dolor sit amet...</p>
          <div class="d-flex justify-content-center">
            <elsa-button variant="primary" class="mr-3" :to="{ name: 'arvioinnit' }">
              {{ $t('palaa-arviointeihin') }}
            </elsa-button>
          </div>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator'
  import ElsaButton from '@/components/button/button.vue'

  @Component({
    components: {
      ElsaButton
    }
  })
  export default class ItsearviointiValmis extends Vue {
    items = [
      {
        text: this.$t('etusivu'),
        to: { name: 'etusivu' }
      },
      {
        text: this.$t('arvioinnit'),
        to: { name: 'arvioinnit' }
      },
      {
        text: this.$t('itsearviointi-valmis'),
        active: true
      }
    ]
  }
</script>

<style lang="scss" scoped>
  .itsearviointi-valmis {
    max-width: 1024px;
  }
</style>
