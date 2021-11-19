<template>
  <div class="arviointipyynto">
    <b-breadcrumb :items="items" class="mb-0" />
    <b-container fluid>
      <b-row lg>
        <b-col>
          <h1>{{ $t('pyyda-arviointia') }}</h1>
          <p class="mb-0 mt-3">{{ $t('pyyda-arviointia-ennalta-sovitusta-suorituksesta') }}</p>
          <hr />
          <arviointipyynto-form
            v-if="!loading"
            :value="arviointipyynto"
            :tyoskentelyjaksot="tyoskentelyjaksot"
            :kunnat="kunnat"
            :erikoisalat="erikoisalat"
            :arvioitavan-kokonaisuuden-kategoriat="arvioitavanKokonaisuudenKategoriat"
            :kouluttajatAndVastuuhenkilot="kouluttajatAndVastuuhenkilot"
            :editing="editing"
            @submit="onSubmit"
            @delete="onDelete"
          />
          <div v-else class="text-center">
            <b-spinner variant="primary" :label="$t('ladataan')" />
          </div>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script lang="ts">
  import axios from 'axios'
  import { formatISO } from 'date-fns'
  import { Component, Vue } from 'vue-property-decorator'

  import ArviointipyyntoForm from '@/forms/arviointipyynto-form.vue'
  import { ArviointipyyntoLomake, Suoritusarviointi } from '@/types'
  import { decorate } from '@/utils/arvioinninAntajaListDecorator'
  import { confirmDelete } from '@/utils/confirm'
  import { dateBetween } from '@/utils/date'
  import { toastFail, toastSuccess } from '@/utils/toast'
  import { tyoskentelyjaksoLabel } from '@/utils/tyoskentelyjakso'

  @Component({
    components: {
      ArviointipyyntoForm
    }
  })
  export default class Arviointipyynto extends Vue {
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
        text: this.$t('pyyda-arviointia'),
        active: true
      }
    ]
    arviointipyyntoLomake: null | ArviointipyyntoLomake = null
    arviointipyynto: Suoritusarviointi | null = null
    loading = true

    async mounted() {
      await Promise.all([this.fetchLomake(), this.fetchArviointipyynto()])
      this.loading = false
    }

    async fetchLomake() {
      try {
        this.arviointipyyntoLomake = (
          await axios.get(`erikoistuva-laakari/arviointipyynto-lomake`)
        ).data
        if (this.arviointipyyntoLomake !== null) {
          this.arviointipyyntoLomake.kouluttajatAndVastuuhenkilot = decorate(
            this,
            this.arviointipyyntoLomake.kouluttajatAndVastuuhenkilot
          )
        }
      } catch {
        toastFail(this, this.$t('arviointipyynnon-lomakkeen-hakeminen-epaonnistui'))
      }
    }

    async fetchArviointipyynto() {
      const arviointiId = this.$route?.params?.arviointiId
      if (arviointiId) {
        try {
          this.arviointipyynto = (
            await axios.get(`erikoistuva-laakari/suoritusarvioinnit/${arviointiId}`)
          ).data
        } catch {
          toastFail(this, this.$t('arviointipyynnon-hakeminen-epaonnistui'))
          this.$emit('skipRouteExitConfirm', true)
          this.$router.replace({ name: 'arvioinnit' })
        }
      }
    }

    async onSubmit(value: any, params: any) {
      params.saving = true
      if (this.arviointipyynto) {
        try {
          await axios.put('erikoistuva-laakari/suoritusarvioinnit', {
            id: this.arviointipyynto.id,
            tyoskentelyjaksoId: value.tyoskentelyjaksoId,
            arvioitavaKokonaisuusId: value.arvioitavaKokonaisuusId,
            arvioitavaTapahtuma: value.arvioitavaTapahtuma,
            arvioinninAntajaId: value.arvioinninAntajaId,
            tapahtumanAjankohta: value.tapahtumanAjankohta,
            lisatiedot: value.lisatiedot
          })
          toastSuccess(this, this.$t('arviointipyynnon-tallentaminen-onnistui'))
          this.$emit('skipRouteExitConfirm', true)
          this.$router.push({
            name: 'arvioinnit'
          })
        } catch {
          toastFail(this, this.$t('arviointipyynnon-tallentaminen-epaonnistui'))
        }
      } else {
        try {
          const arviointipyynto = (
            await axios.post('erikoistuva-laakari/suoritusarvioinnit/arviointipyynto', value)
          ).data
          this.$emit('skipRouteExitConfirm', true)
          this.$router.push({
            name: 'arviointipyynto-lahetetty',
            params: { arviointiId: `${arviointipyynto.id}` }
          })
        } catch {
          toastFail(this, this.$t('uuden-arviointipyynnon-lisaaminen-epaonnistui'))
        }
      }
      params.saving = false
    }

    async onDelete(params: any) {
      if (
        await confirmDelete(
          this,
          this.$t('poista-arviointipyynto') as string,
          (this.$t('arviointipyynnon') as string).toLowerCase()
        )
      ) {
        params.deleting = true
        try {
          await axios.delete(`erikoistuva-laakari/suoritusarvioinnit/${this.arviointipyynto?.id}`)
          toastSuccess(this, this.$t('arviointipyynto-poistettu-onnistuneesti'))
          this.$emit('skipRouteExitConfirm', true)
          this.$router.push({
            name: 'arvioinnit'
          })
        } catch {
          toastFail(this, this.$t('arviointipyynnon-poistaminen-epaonnistui'))
        }
        params.deleting = false
      }
    }

    get tyoskentelyjaksot() {
      if (this.arviointipyyntoLomake) {
        return this.arviointipyyntoLomake.tyoskentelyjaksot
      } else {
        return []
      }
    }

    get kunnat() {
      if (this.arviointipyyntoLomake) {
        return this.arviointipyyntoLomake.kunnat
      } else {
        return []
      }
    }

    get erikoisalat() {
      if (this.arviointipyyntoLomake) {
        return this.arviointipyyntoLomake.erikoisalat
      } else {
        return []
      }
    }

    get arvioitavanKokonaisuudenKategoriat() {
      if (this.arviointipyyntoLomake) {
        return this.arviointipyyntoLomake.arvioitavanKokonaisuudenKategoriat
          .map((kategoria) => ({
            ...kategoria,
            arvioitavatKokonaisuudet: kategoria.arvioitavatKokonaisuudet.filter((oa: any) =>
              dateBetween(formatISO(new Date()), oa.voimassaoloAlkaa, oa.voimassaoloLoppuu)
            )
          }))
          .filter((kategoria) => kategoria.arvioitavatKokonaisuudet.length > 0)
          .filter((kategoria) =>
            dateBetween(
              formatISO(new Date()),
              kategoria.voimassaoloAlkaa,
              kategoria.voimassaoloLoppuu
            )
          )
      } else {
        return []
      }
    }

    get kouluttajatAndVastuuhenkilot() {
      if (this.arviointipyyntoLomake) {
        return this.arviointipyyntoLomake.kouluttajatAndVastuuhenkilot
      } else {
        return []
      }
    }

    get arviointipyyntoWrapper() {
      if (this.arviointipyynto) {
        return {
          ...this.arviointipyynto,
          tyoskentelyjakso: {
            ...this.arviointipyynto.tyoskentelyjakso,
            label: tyoskentelyjaksoLabel(this, this.arviointipyynto.tyoskentelyjakso)
          },
          arvioitavaKokonaisuus: this.arviointipyynto.arvioitavaKokonaisuus,
          kouluttajaOrVastuuhenkilo: this.arviointipyynto.arvioinninAntaja
        }
      } else {
        return undefined
      }
    }

    get editing() {
      return this.arviointipyyntoWrapper ? true : false
    }
  }
</script>

<style lang="scss" scoped>
  .arviointipyynto {
    max-width: 970px;
  }
</style>
