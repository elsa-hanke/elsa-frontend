<template>
  <div class="muokkaa-poissaoloa">
    <b-breadcrumb :items="items" class="mb-0"></b-breadcrumb>
    <b-container fluid>
      <b-row lg>
        <b-col>
          <h1>{{ $t('muokkaa-poissaoloa') }}</h1>
          <hr />
          <poissaolo-form
            v-if="!loading"
            :value="poissaoloWrapper"
            :tyoskentelyjaksot="tyoskentelyjaksot"
            :poissaolon-syyt="poissaolonSyyt"
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
  import ConfirmRouteExit from '@/mixins/confirm-route-exit'
  import PoissaoloForm from '@/forms/poissaolo-form.vue'
  import { PoissaoloLomake } from '@/types'
  import { toastFail, toastSuccess } from '@/utils/toast'
  import { confirmDelete } from '@/utils/confirm'
  import { tyoskentelyjaksoLabel } from '@/utils/tyoskentelyjakso'

  @Component({
    components: {
      PoissaoloForm
    }
  })
  export default class MuokkaaPoissaoloa extends Mixins(ConfirmRouteExit) {
    items = [
      {
        text: this.$t('etusivu'),
        to: { name: 'etusivu' }
      },
      {
        text: this.$t('tyoskentelyjaksot'),
        to: { name: 'tyoskentelyjaksot' }
      },
      {
        text: this.$t('muokkaa-poissaoloa'),
        active: true
      }
    ]
    poissaoloLomake: null | PoissaoloLomake = null
    poissaolo: any = null
    loading = true

    async mounted() {
      await Promise.all([this.fetchLomake(), this.fetchPoissaolo()])
      this.loading = false
    }

    async fetchPoissaolo() {
      const poissaoloId = this.$route?.params?.poissaoloId
      if (poissaoloId) {
        try {
          this.poissaolo = (
            await axios.get(`erikoistuva-laakari/tyoskentelyjaksot/poissaolot/${poissaoloId}`)
          ).data
        } catch (err) {
          this.$router.replace({ name: 'tyoskentelyjaksot' })
        }
      }
    }

    async fetchLomake() {
      try {
        this.poissaoloLomake = (await axios.get(`erikoistuva-laakari/poissaolo-lomake`)).data
      } catch (err) {
        toastFail(this, this.$t('poissaolon-lomakkeen-hakeminen-epaonnistui'))
      }
    }

    async onSubmit(value: any, params: any) {
      params.saving = true
      try {
        this.poissaolo = (
          await axios.put('erikoistuva-laakari/tyoskentelyjaksot/poissaolot', value)
        ).data
        toastSuccess(this, this.$t('poissaolon-tallentaminen-onnistui'))
        this.skipRouteExitConfirm = true
        this.$router.push({
          name: 'poissaolo',
          params: {
            poissaoloId: `${this.poissaolo.id}`
          }
        })
      } catch (err) {
        toastFail(this, this.$t('poissaolon-tallentaminen-epaonnistui'))
      }
      params.saving = false
    }

    async onDelete(params: any) {
      if (
        await confirmDelete(
          this,
          this.$t('poista-poissaolo') as string,
          (this.$t('poissaolon') as string).toLowerCase()
        )
      ) {
        params.deleting = true
        try {
          await axios.delete(
            `erikoistuva-laakari/tyoskentelyjaksot/poissaolot/${this.poissaolo.id}`
          )
          toastSuccess(this, this.$t('poissaolo-poistettu-onnistuneesti'))
          this.skipRouteExitConfirm = true
          this.$router.push({
            name: 'tyoskentelyjaksot'
          })
        } catch (err) {
          toastFail(this, this.$t('poissaolon-poistaminen-epaonnistui'))
        }
        params.deleting = false
      }
    }

    get tyoskentelyjaksot() {
      if (this.poissaoloLomake) {
        return this.poissaoloLomake.tyoskentelyjaksot
      } else {
        return []
      }
    }

    get poissaolonSyyt() {
      if (this.poissaoloLomake) {
        return this.poissaoloLomake.poissaolonSyyt
      } else {
        return []
      }
    }

    get poissaoloWrapper() {
      if (this.poissaolo) {
        return {
          ...this.poissaolo,
          tyoskentelyjakso: {
            ...this.poissaolo.tyoskentelyjakso,
            label: tyoskentelyjaksoLabel(this, this.poissaolo.tyoskentelyjakso)
          },
          kokoTyoajanPoissaolo: this.poissaolo.osaaikaprosentti === 0 ? true : false
        }
      } else {
        return undefined
      }
    }
  }
</script>

<style lang="scss" scoped>
  .muokkaa-poissaoloa {
    max-width: 768px;
  }
</style>
