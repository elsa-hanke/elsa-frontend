<template>
  <div class="uusi-kayttaja">
    <b-breadcrumb :items="items" class="mb-0" />
    <b-container fluid>
      <b-row lg>
        <b-col>
          <h1>{{ $t('yhdista-kayttajatileja') }}</h1>
          <p>
            {{ $t('yhdista-kayttajatileja-ingressi') }}
          </p>
          <hr />
        </b-col>
        <b-container v-if="!form.valinnatSuoritettu">
          <erikoistujat-ja-kouluttajat
            :rajaimet="rajaimet"
            :form="form"
          ></erikoistujat-ja-kouluttajat>
        </b-container>
        <b-container v-if="form.valinnatSuoritettu">
          <tilien-yhdistaminen :form="form"></tilien-yhdistaminen>
        </b-container>
      </b-row>
      <div class="d-flex flex-row-reverse flex-wrap">
        <elsa-button
          :disabled="!formValid"
          variant="primary"
          class="ml-2 mb-2"
          @click="form.valinnatSuoritettu = true"
        >
          {{ $t('jatka') }}
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
  import { KayttajahallintaRajaimet, YhdistaKayttajatilejaForm } from '@/types'
  import ErikoistujatJaKouluttajat from '@/views/kayttajahallinta/yhdista-kayttajatileja/erikoistujat-ja-kouluttajat.vue'
  import TilienYhdistaminen from '@/views/kayttajahallinta/yhdista-kayttajatileja/tilien-yhdistaminen.vue'

  @Component({
    components: {
      TilienYhdistaminen,
      ErikoistujatJaKouluttajat,
      ElsaFormGroup,
      ErikoistuvaLaakariForm,
      VastuuhenkiloForm,
      VirkailijaForm,
      PaakayttajaForm,
      ElsaButton
    }
  })
  export default class YhdistaKayttajatileja extends Vue {
    items = [
      {
        text: this.$t('kayttajahallinta'),
        to: { name: 'kayttajahallinta' }
      },
      {
        text: this.$t('yhdista-kayttajatileja'),
        active: true
      }
    ]

    form: YhdistaKayttajatilejaForm = {
      erikoistujaKayttajaId: -1,
      kouluttajaKayttajaId: -1,
      valinnatSuoritettu: false,
      yhteinenSahkoposti: null
    }

    rajaimet: KayttajahallintaRajaimet | null = null

    get formValid(): boolean {
      return this.form.erikoistujaKayttajaId > 0 && this.form.kouluttajaKayttajaId > 0
    }

    onCancel() {
      this.$router.push({
        name: 'kayttajahallinta'
      })
    }

    skipRouteExitConfirm(value: boolean) {
      this.$emit('skipRouteExitConfirm', value)
    }
  }
</script>

<style lang="scss" scoped>
  .uusi-kayttaja {
    max-width: 768px;
  }
</style>
