<template>
  <div class="d-flex justify-content-center border rounded pt-3 mb-4">
    <div class="container-fluid">
      <h2>
        <span class="form-order">B</span>
        {{ $t('valiarviointi-otsikko') }}
      </h2>

      <koejakso-card-content v-if="tila === lomaketilat.EI_AKTIIVINEN">
        <template v-slot:content>
          <p>{{ $t('arviointi-ei-viela-pyydetty') }}</p>
        </template>
        <template v-slot:button>
          <elsa-button variant="primary" class="mb-4" :disabled="true" :to="{ name: url }">
            {{ $t('pyyda-arviointia') }}
          </elsa-button>
        </template>
      </koejakso-card-content>

      <koejakso-card-content v-if="tila === lomaketilat.UUSI">
        <template v-slot:content>
          <p>{{ $t('arviointi-ei-viela-pyydetty') }}</p>
        </template>
        <template v-slot:button>
          <elsa-button variant="primary" class="mb-4" :to="{ name: url }">
            {{ $t('pyyda-arviointia') }}
          </elsa-button>
        </template>
      </koejakso-card-content>

      <koejakso-card-content v-if="tila === lomaketilat.ODOTTAA_HYVAKSYNTAA">
        <template v-slot:content>
          <p class="pr-5">{{ $t('valiarviointi-tila-odottaa-hyvaksyntaa') }}</p>
        </template>
        <template v-slot:button>
          <elsa-button variant="outline-primary" class="mb-4" :to="{ name: url }">
            {{ $t('nayta-arviointipyynto') }}
          </elsa-button>
        </template>
      </koejakso-card-content>

      <koejakso-card-content v-if="tila === lomaketilat.ODOTTAA_ERIKOISTUVAN_HYVAKSYNTAA">
        <template v-slot:content>
          <p class="pr-5">{{ $t('valiarviointi-tila-odottaa-erikoistuvan-hyvaksyntaa') }}</p>
        </template>
        <template v-slot:button>
          <elsa-button variant="primary" class="mb-4" :to="{ name: url }">
            {{ $t('hyvaksy-arviointi') }}
          </elsa-button>
        </template>
      </koejakso-card-content>

      <koejakso-card-content v-if="tila === lomaketilat.HYVAKSYTTY">
        <template v-slot:content>
          <div class="d-inline-flex">
            <font-awesome-icon :icon="['fas', 'check-circle']" class="text-success mr-1" />
          </div>
          <div class="d-inline-flex">
            <span class="pr-5">{{ $t('valiarviointi-tila-hyvaksytty') }}</span>
          </div>
        </template>
        <template v-slot:button>
          <elsa-button variant="outline-primary" class="mb-4" :to="{ name: url }">
            {{ $t('nayta-arviointi') }}
          </elsa-button>
        </template>
      </koejakso-card-content>
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import Component from 'vue-class-component'

  import KoejaksoCardContent from './koejakso-card-content.vue'

  import ElsaButton from '@/components/button/button.vue'
  import store from '@/store'
  import { LomakeTilat } from '@/utils/constants'

  @Component({
    components: {
      KoejaksoCardContent,
      ElsaButton
    }
  })
  export default class ValiarviointiCard extends Vue {
    get koejakso() {
      return store.getters['erikoistuva/koejakso']
    }

    get tila() {
      return this.koejakso.valiarvioinninTila
    }

    get lomaketilat() {
      return LomakeTilat
    }

    get url() {
      return 'koejakson-valiarviointi'
    }
  }
</script>
