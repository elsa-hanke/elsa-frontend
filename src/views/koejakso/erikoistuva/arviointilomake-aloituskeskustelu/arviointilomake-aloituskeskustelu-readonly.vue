<template>
  <div>
    <b-row>
      <b-col>
        <h5>{{ $t('sahkopostiosoite') }}</h5>
        <p>{{ data.erikoistuvanSahkoposti }}</p>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <h5>{{ $t('koejakson-suorituspaikka') }}</h5>
        <p>{{ data.koejaksonSuorituspaikka }}</p>
      </b-col>
    </b-row>
    <b-row>
      <b-col lg="4">
        <h5>{{ $t('koejakson-alkamispäivä') }}</h5>
        <p>{{ $date(data.koejaksonAlkamispaiva) }}</p>
      </b-col>
      <b-col lg="4">
        <h5>{{ $t('koejakson-päättymispäivä') }}</h5>
        <p>{{ $date(data.koejaksonPaattymispaiva) }}</p>
      </b-col>
    </b-row>
    <b-row>
      <b-col lg="8">
        <h5>{{ $t('koejakso-suoritettu-kokoaikatyössä') }}</h5>
        <p v-if="data.suoritettuKokoaikatyossa">{{ $t('kylla') }}</p>
        <p v-else>
          {{ $t('suoritettu-osa-aikatyossa-tuntia-viikossa', { tyotunnitViikossa }) }}
        </p>
      </b-col>
    </b-row>
    <hr />
    <koulutuspaikan-arvioijat
      :lahikouluttaja="data.lahikouluttaja"
      :lahiesimies="data.lahiesimies"
      :isReadonly="true"
    />
    <hr />
    <b-row>
      <b-col>
        <h3>{{ $t('aloituskeskustelu-tavoitteet') }}</h3>
        <h5>{{ $t('koejakso-osaamistavoitteet') }}</h5>
        <p>{{ data.koejaksonOsaamistavoitteet }}</p>
      </b-col>
    </b-row>
    <hr />
    <koejakson-vaihe-allekirjoitukset :allekirjoitukset="allekirjoitukset" />
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import Component from 'vue-class-component'
  import { Prop } from 'vue-property-decorator'
  import { AloituskeskusteluLomake } from '@/types'
  import KoejaksonVaiheAllekirjoitukset from '@/components/koejakson-vaiheet/koejakson-vaihe-allekirjoitukset.vue'
  import { KoejaksonVaiheAllekirjoitus } from '@/types'
  import * as allekirjoituksetHelper from '@/utils/koejaksonVaiheAllekirjoitusMapper'
  import KoulutuspaikanArvioijat from '@/components/koejakson-vaiheet/koulutuspaikan-arvioijat.vue'

  @Component({
    components: {
      KoulutuspaikanArvioijat,
      KoejaksonVaiheAllekirjoitukset
    }
  })
  export default class ArviointilomakeAloituskeskusteluReadonly extends Vue {
    @Prop({ required: true, default: {} })
    data!: AloituskeskusteluLomake

    get tyotunnitViikossa() {
      return this.data?.tyotunnitViikossa?.toString().replace('.', ',')
    }

    get allekirjoitukset(): KoejaksonVaiheAllekirjoitus[] {
      const allekirjoitusErikoistuva = allekirjoituksetHelper.mapAllekirjoitusErikoistuva(
        this,
        this.data.erikoistuvanNimi,
        this.data.erikoistuvanAllekirjoitusaika
      ) as KoejaksonVaiheAllekirjoitus
      const allekirjoitusLahikouluttaja = allekirjoituksetHelper.mapAllekirjoitusLahikouluttaja(
        this,
        this.data.lahikouluttaja
      )
      const allekirjoitusLahiesimies = allekirjoituksetHelper.mapAllekirjoitusLahiesimies(
        this,
        this.data.lahiesimies
      )

      return [
        allekirjoitusErikoistuva,
        allekirjoitusLahikouluttaja,
        allekirjoitusLahiesimies
      ].filter((a) => a !== null)
    }
  }
</script>
