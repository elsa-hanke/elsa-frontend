<template>
  <div class="uusi-poissaolo">
    <b-breadcrumb :items="items" class="mb-0" />
    <b-container fluid>
      <b-row lg>
        <b-col>
          <h1>{{ $t('lisaa-poissaolo') }}</h1>
          <hr />
          <poissaolo-form
            v-if="!loading"
            :tyoskentelyjaksot="tyoskentelyjaksot"
            :poissaolon-syyt="poissaolonSyyt"
            @submit="onSubmit"
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

  @Component({
    components: {
      PoissaoloForm
    }
  })
  export default class UusiPoissaolo extends Mixins(ConfirmRouteExit) {
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
        text: this.$t('lisaa-poissaolo'),
        active: true
      }
    ]
    poissaoloLomake: null | PoissaoloLomake = null
    poissaolo: any = null
    loading = true

    async mounted() {
      await this.fetchLomake()
      this.loading = false
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
          await axios.post('erikoistuva-laakari/tyoskentelyjaksot/poissaolot', value)
        ).data
        toastSuccess(this, this.$t('poissaolo-lisatty-onnistuneesti'))
        this.skipRouteExitConfirm = true
        this.$router.push({
          name: 'poissaolo',
          params: {
            poissaoloId: `${this.poissaolo.id}`
          }
        })
      } catch (err) {
        toastFail(this, this.$t('uuden-poissaolon-lisaaminen-epaonnistui'))
      }
      params.saving = false
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
  }
</script>

<style lang="scss" scoped>
  .uusi-poissaolo {
    max-width: 768px;
  }
</style>
