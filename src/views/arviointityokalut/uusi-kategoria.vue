<template>
  <div class="uusi-kategoria">
    <b-breadcrumb :items="items" class="mb-0" />
    <b-container fluid>
      <b-row lg>
        <b-col>
          <h1>{{ $t('lisaa-uusi-kategoria') }}</h1>
          <hr />
          Lomake, jossa nimen syöttö
        </b-col>
      </b-row>
      <div class="d-flex flex-row-reverse flex-wrap">
        <elsa-button :disabled="true" variant="primary" class="ml-2 mb-2">
          {{ $t('tallenna') }}
        </elsa-button>
        <elsa-button variant="back" class="mb-2" @click.stop.prevent="onCancel">
          {{ $t('peruuta') }}
        </elsa-button>
      </div>
    </b-container>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator'

  import ElsaButton from '@/components/button/button.vue'
  import ElsaFormGroup from '@/components/form-group/form-group.vue'
  import ErikoistuvaLaakariForm from '@/forms/uusi-erikoistuva-laakari-form.vue'
  import PaakayttajaForm from '@/forms/uusi-paakayttaja-form.vue'
  import VastuuhenkiloForm from '@/forms/uusi-vastuuhenkilo-form.vue'
  import VirkailijaForm from '@/forms/uusi-virkailija-form.vue'

  @Component({
    components: {
      ElsaFormGroup,
      ErikoistuvaLaakariForm,
      VastuuhenkiloForm,
      VirkailijaForm,
      PaakayttajaForm,
      ElsaButton
    }
  })
  export default class UusiKategoria extends Vue {
    items = [
      {
        text: this.$t('etusivu'),
        to: { name: 'etusivu' }
      },
      {
        text: this.$t('arviointityokalut'),
        to: { name: 'arviointityokalut' }
      },
      {
        text: this.$t('lisaa-uusi-kategoria'),
        active: true
      }
    ]
    form = {
      nimi: null
    }

    mounted() {
      if (this.$isTekninenPaakayttaja()) {
        /* */
      }
    }

    onCancel() {
      this.$router.push({
        name: 'arviointityokalut'
      })
    }

    skipRouteExitConfirm(value: boolean) {
      this.$emit('skipRouteExitConfirm', value)
    }
  }
</script>

<style lang="scss" scoped>
  .uusi-kategoria {
    max-width: 768px;
  }
</style>
