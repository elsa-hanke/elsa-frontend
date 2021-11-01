<template>
  <div class="uusi-kayttaja">
    <b-breadcrumb :items="items" class="mb-0" />
    <b-container fluid>
      <b-row lg>
        <b-col>
          <h1>{{ $t('lisaa-uusi-kayttaja') }}</h1>
          <hr />
          <kayttaja-form
            v-if="!loading"
            :yliopistot="yliopistot"
            :erikoisalat="erikoisalat"
            @submit="onSubmit"
            @cancel="onCancel"
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
  import { AxiosError } from 'axios'
  import { Component, Vue } from 'vue-property-decorator'

  import { getKayttajaLomake, postErikoistuvaLaakari } from '@/api/tekninen-paakayttaja'
  import KayttajaForm from '@/forms/kayttaja-form.vue'
  import { ElsaError, KayttajaLomake, UusiKayttaja } from '@/types'
  import { ELSA_ROLE } from '@/utils/roles'
  import { toastFail, toastSuccess } from '@/utils/toast'

  @Component({
    components: {
      KayttajaForm
    }
  })
  export default class UusiKayttajaView extends Vue {
    items = [
      {
        text: this.$t('kayttajahallinta'),
        to: { name: 'kayttajahallinta' }
      },
      {
        text: this.$t('uusi-kayttaja'),
        active: true
      }
    ]
    kayttajaLomake: null | KayttajaLomake = null
    loading = true

    async mounted() {
      await this.fetchLomake()
      this.loading = false
    }

    async fetchLomake() {
      try {
        this.kayttajaLomake = (await getKayttajaLomake()).data
      } catch {
        toastFail(this, this.$t('tyoskentelyjakson-lomakkeen-hakeminen-epaonnistui'))
      }
    }

    async onSubmit(
      value: UusiKayttaja,
      params: {
        saving: boolean
      }
    ) {
      params.saving = true
      try {
        let kayttajaId: number | null = null
        if (value.rooli === ELSA_ROLE.ErikoistuvaLaakari) {
          kayttajaId = (
            await postErikoistuvaLaakari({
              ...value.erikoistuvaLaakari,
              yliopistoId: value.erikoistuvaLaakari.yliopisto?.id,
              erikoisalaId: value.erikoistuvaLaakari.erikoisala?.id
            })
          ).data.kayttajaId
        }
        // TODO: muut roolit
        toastSuccess(this, this.$t('uusi-kayttaja-lisatty-onnistuneesti'))
        this.$emit('skipRouteExitConfirm', true)
        this.$router.push({
          name: 'kayttaja',
          params: { kayttajaId: `${kayttajaId}` }
        })
      } catch (err) {
        const axiosError = err as AxiosError<ElsaError>
        const message = axiosError?.response?.data?.message
        toastFail(
          this,
          message
            ? `${this.$t('uuden-kayttajan-lisaaminen-epaonnistui')}: ${this.$t(message)}`
            : this.$t('uuden-kayttajan-lisaaminen-epaonnistui')
        )
      }
      params.saving = false
    }

    onCancel() {
      this.$router.push({
        name: 'kayttajahallinta'
      })
    }

    get yliopistot() {
      return this.kayttajaLomake?.yliopistot ?? []
    }

    get erikoisalat() {
      return this.kayttajaLomake?.erikoisalat ?? []
    }
  }
</script>

<style lang="scss" scoped>
  .uusi-kayttaja {
    max-width: 768px;
  }
</style>
