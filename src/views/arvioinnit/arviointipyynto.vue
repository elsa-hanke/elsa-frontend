<template>
  <div class="arviointipyynto">
    <b-breadcrumb :items="items" class="mb-0" />
    <b-container fluid>
      <b-row lg>
        <b-col>
          <h1>{{ $t('pyyda-arviointia') }}</h1>
          <b-link :to="{ name: 'koejakso-yleiset-tavoitteet' }">
            {{ $t('koejakso-tavoitteet-linkki') }}
          </b-link>
          <hr />
          <arviointipyynto-form
            v-if="!loading"
            :value="arviointipyyntoWrapper"
            :tyoskentelyjaksot="tyoskentelyjaksot"
            :kunnat="kunnat"
            :erikoisalat="erikoisalat"
            :epa-osaamisalueen-kategoriat="epaOsaamisalueenKategoriat"
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
  import { Component, Mixins } from 'vue-property-decorator'
  import { confirmDelete } from '@/utils/confirm'
  import { ArviointipyyntoLomake } from '@/types'
  import { formatISO } from 'date-fns'
  import ArviointipyyntoForm from '@/forms/arviointipyynto-form.vue'
  import ConfirmRouteExit from '@/mixins/confirm-route-exit'
  import { tyoskentelyjaksoLabel } from '@/utils/tyoskentelyjakso'
  import { toastFail, toastSuccess } from '@/utils/toast'
  import { dateBetween } from '@/utils/date'
  import { decorate } from '@/utils/arvioinninAntajaListDecorator'

  @Component({
    components: {
      ArviointipyyntoForm
    }
  })
  export default class Arviointipyynto extends Mixins(ConfirmRouteExit) {
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
    arviointipyynto: any = null
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
      } catch (err) {
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
        } catch (err) {
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
            arvioitavaOsaalueId: value.arvioitavaOsaalueId,
            arvioitavaTapahtuma: value.arvioitavaTapahtuma,
            arvioinninAntajaId: value.arvioinninAntajaId,
            tapahtumanAjankohta: value.tapahtumanAjankohta,
            lisatiedot: value.lisatiedot
          })
          toastSuccess(this, this.$t('arviointipyynnon-tallentaminen-onnistui'))
          this.skipRouteExitConfirm = true
          this.$router.push({
            name: 'arvioinnit'
          })
        } catch (err) {
          toastFail(this, this.$t('arviointipyynnon-tallentaminen-epaonnistui'))
        }
      } else {
        try {
          const arviointipyynto = (
            await axios.post('erikoistuva-laakari/suoritusarvioinnit/arviointipyynto', value)
          ).data
          this.skipRouteExitConfirm = true
          this.$router.push({
            name: 'arviointipyynto-lahetetty',
            params: { arviointiId: `${arviointipyynto.id}` }
          })
        } catch (err) {
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
          await axios.delete(`erikoistuva-laakari/suoritusarvioinnit/${this.arviointipyynto.id}`)
          toastSuccess(this, this.$t('arviointipyynto-poistettu-onnistuneesti'))
          this.skipRouteExitConfirm = true
          this.$router.push({
            name: 'arvioinnit'
          })
        } catch (err) {
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

    get epaOsaamisalueenKategoriat() {
      if (this.arviointipyyntoLomake) {
        return this.arviointipyyntoLomake.epaOsaamisalueenKategoriat
          .map((kategoria) => ({
            ...kategoria,
            epaOsaamisalueet: kategoria.epaOsaamisalueet.filter((oa: any) =>
              dateBetween(formatISO(new Date()), oa.voimassaoloAlkaa, oa.voimassaoloLoppuu)
            )
          }))
          .filter((kategoria) => kategoria.epaOsaamisalueet.length > 0)
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
          epaOsaamisalue: this.arviointipyynto.arvioitavaOsaalue,
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
