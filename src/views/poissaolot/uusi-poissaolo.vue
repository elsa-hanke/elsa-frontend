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
  import axios, { AxiosError } from 'axios'
  import { Component, Vue } from 'vue-property-decorator'

  import PoissaoloForm from '@/forms/poissaolo-form.vue'
  import { Poissaolo, PoissaoloLomake, ElsaError } from '@/types'
  import { toastFail, toastSuccess } from '@/utils/toast'

  @Component({
    components: {
      PoissaoloForm
    }
  })
  export default class UusiPoissaolo extends Vue {
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
    poissaolo: null | Poissaolo = null
    loading = true

    async mounted() {
      await this.fetchLomake()
      this.loading = false
    }

    async fetchLomake() {
      try {
        this.poissaoloLomake = (await axios.get(`erikoistuva-laakari/poissaolo-lomake`)).data
      } catch {
        toastFail(this, this.$t('poissaolon-lomakkeen-hakeminen-epaonnistui'))
      }
    }

    async onSubmit(poissaolo: Poissaolo, params: any) {
      params.saving = true
      try {
        this.poissaolo = (
          await axios.post('erikoistuva-laakari/tyoskentelyjaksot/poissaolot', poissaolo)
        ).data
        toastSuccess(this, this.$t('poissaolo-lisatty-onnistuneesti'))
        this.$emit('skipRouteExitConfirm', true)
        this.$router.push({
          name: 'poissaolo',
          params: {
            poissaoloId: `${this.poissaolo?.id}`
          }
        })
      } catch (err) {
        const axiosError = err as AxiosError<ElsaError>
        const message = axiosError?.response?.data?.message
        toastFail(
          this,
          message
            ? `${this.$t('uuden-poissaolon-lisaaminen-epaonnistui')}: ${this.$t(message)}`
            : this.$t('uuden-poissaolon-lisaaminen-epaonnistui')
        )
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
