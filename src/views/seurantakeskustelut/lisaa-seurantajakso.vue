<template>
  <div class="lisaa-seurantajakso">
    <b-breadcrumb :items="items" class="mb-0" />
    <b-container fluid>
      <b-row lg>
        <b-col>
          <h1>{{ $t('lisaa-seurantajakso') }}</h1>
          <p class="mt-3 mb-0">
            {{ $t('lisaa-seurantajakso-kuvaus') }}
          </p>
        </b-col>
      </b-row>
      <hr />
      <div v-if="!loading">
        <div v-if="seurantajaksonTiedot != null">
          <seurantajakso-form
            :editing="true"
            :seurantajakso="seurantajakso"
            :seurantajaksonTiedot="seurantajaksonTiedot"
            @submit="onSubmit"
            @cancel="onCancel"
            @uusiHaku="onUusiHaku"
          />
        </div>
        <div v-else>
          <seurantajakso-haku-form
            :seurantajakso="seurantajakso"
            :tyoskentelyjaksot="tyoskentelyjaksot"
            :kunnat="kunnat"
            :arvioitavan-kokonaisuuden-kategoriat="arvioitavanKokonaisuudenKategoriat"
            :koulutusjaksot="koulutusjaksot"
            @submit="onHakuSubmit"
            @cancel="onCancel"
          />
        </div>
      </div>
      <div v-else class="text-center">
        <b-spinner variant="primary" :label="$t('ladataan')" />
      </div>
    </b-container>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import Component from 'vue-class-component'

  import {
    getSeurantajaksonTiedot,
    getKoulutusjaksoLomake,
    getKoulutusjaksot,
    postSeurantajakso
  } from '@/api/erikoistuva'
  import SeurantajaksoForm from '@/forms/seurantajakso-form.vue'
  import SeurantajaksoHakuForm from '@/forms/seurantajakso-haku-form.vue'
  import {
    FormParams,
    Koulutusjakso,
    KoulutusjaksoLomake,
    Seurantajakso,
    SeurantajaksonTiedot
  } from '@/types'
  import { toastFail, toastSuccess } from '@/utils/toast'

  @Component({
    components: {
      SeurantajaksoForm,
      SeurantajaksoHakuForm
    }
  })
  export default class UusiSeurantajakso extends Vue {
    items = [
      {
        text: this.$t('etusivu'),
        to: { name: 'etusivu' }
      },
      {
        text: this.$t('seurantakeskustelut'),
        to: { name: 'seurantakeskustelut' }
      },
      {
        text: this.$t('lisaa-seurantajakso'),
        active: true
      }
    ]
    loading = true

    koulutusjaksot: Koulutusjakso[] | null = null
    koulutusjaksoLomake: KoulutusjaksoLomake | null = null

    seurantajakso: Seurantajakso | null = null
    seurantajaksonTiedot: SeurantajaksonTiedot | null = null

    params: FormParams = {
      saving: false
    }

    async mounted() {
      this.loading = true
      await this.fetchKoulutusjaksot()
      await this.fetchKoulutusjaksoLomake()
      this.loading = false
    }

    async fetchKoulutusjaksoLomake() {
      try {
        this.koulutusjaksoLomake = (await getKoulutusjaksoLomake()).data
      } catch (err) {
        toastFail(this, this.$t('koulutusjakson-lomakkeen-hakeminen-epaonnistui'))
      }
    }

    async fetchKoulutusjaksot() {
      try {
        this.koulutusjaksot = (await getKoulutusjaksot()).data
      } catch (err) {
        toastFail(this, this.$t('koulutusjaksojen-hakeminen-epaonnistui'))
      }
    }

    get tyoskentelyjaksot() {
      if (this.koulutusjaksoLomake) {
        return this.koulutusjaksoLomake.tyoskentelyjaksot
      } else {
        return []
      }
    }

    get kunnat() {
      if (this.koulutusjaksoLomake) {
        return this.koulutusjaksoLomake.kunnat
      } else {
        return []
      }
    }

    get arvioitavanKokonaisuudenKategoriat() {
      return this.koulutusjaksoLomake?.arvioitavanKokonaisuudenKategoriat ?? []
    }

    async onHakuSubmit(value: Seurantajakso) {
      try {
        this.seurantajakso = {
          ...value
        }
        this.seurantajaksonTiedot = (
          await getSeurantajaksonTiedot(
            value.alkamispaiva || '',
            value.paattymispaiva || '',
            value.koulutusjaksot.map((k) => k.id).filter((k): k is number => k !== null)
          )
        ).data
      } catch (err) {
        toastFail(this, this.$t('seurantajakson-tietojen-hakeminen-epaonnistui'))
      }
    }

    async onSubmit(value: Seurantajakso) {
      try {
        this.seurantajakso = (await postSeurantajakso(value)).data
        toastSuccess(this, this.$t('seurantajakson-tallennus-ja-lahetys-onnistui'))
        this.$emit('skipRouteExitConfirm', true)
        this.$router.push({
          name: 'seurantajakso',
          params: {
            seurantajaksoId: `${this.seurantajakso?.id}`
          }
        })
      } catch (err) {
        toastFail(this, this.$t('seurantajakson-lisaaminen-epaonnistui'))
      }
    }

    onUusiHaku() {
      this.seurantajaksonTiedot = null
    }

    onCancel() {
      this.$router.push({
        name: 'seurantakeskustelut'
      })
    }
  }
</script>

<style lang="scss" scoped>
  @import '~@/styles/variables';
  @import '~bootstrap/scss/mixins/breakpoints';

  .lisaa-seurantajakso {
    max-width: 970px;
  }
</style>
