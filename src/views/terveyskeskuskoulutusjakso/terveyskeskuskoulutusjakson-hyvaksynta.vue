<template>
  <div class="terveyskeskuskoulutusjakso">
    <b-breadcrumb :items="items" class="mb-0" />
    <b-container fluid>
      <b-row lg>
        <b-col>
          <h1>{{ $t('terveyskeskuskoulutusjakson-hyvaksynta') }}</h1>
          <div v-if="hyvaksynta != null">
            <b-alert :show="showSent" variant="dark">
              <font-awesome-icon icon="info-circle" fixed-width class="text-muted" />
              <span>
                {{ $t('terveyskeskuskoulutusjakso-on-lahetetty-hyvaksyttavaksi') }}
              </span>
            </b-alert>
            <b-alert :show="showReturned" variant="danger" class="mt-3">
              <div class="d-flex flex-row">
                <em class="align-middle">
                  <font-awesome-icon :icon="['fas', 'exclamation-circle']" class="mr-2" />
                </em>
                <div>
                  {{ $t('terveyskeskuskoulutusjakso-on-palautettu-muokattavaksi') }}
                  <span class="d-block">
                    {{ $t('syy') }}&nbsp;
                    <span class="font-weight-500">{{ hyvaksynta.korjausehdotus }}</span>
                  </span>
                </div>
              </div>
            </b-alert>
            <p v-if="editable">{{ $t('terveyskeskuskoulutusjakson-hyvaksynta-kuvaus') }}</p>
            <hr />
            <terveyskeskuskoulutusjakso-form
              :hyvaksynta="hyvaksynta"
              :reservedAsiakirjaNimetMutable="reservedAsiakirjaNimetMutable"
              :editable="editable"
              @submit="onSubmit"
              @cancel="onCancel"
            />
            <elsa-button
              v-if="!editable"
              :to="{ name: 'tyoskentelyjaksot' }"
              variant="link"
              :class="'mb-3 mr-auto font-weight-500 tyoskentelyjaksot-link'"
            >
              {{ $t('palaa-tyoskentelyjaksoihin') }}
            </elsa-button>
          </div>
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

  import { getTerveyskeskuskoulutusjakso } from '@/api/erikoistuva'
  import ElsaButton from '@/components/button/button.vue'
  import TerveyskeskuskoulutusjaksoForm from '@/forms/terveyskeskuskoulutusjakso-form.vue'
  import store from '@/store'
  import {
    ElsaError,
    TerveyskeskuskoulutusjaksonHyvaksyminen,
    TerveyskeskuskoulutusjaksonHyvaksyntaForm
  } from '@/types'
  import { TerveyskeskuskoulutusjaksonTila } from '@/utils/constants'
  import { toastFail, toastSuccess } from '@/utils/toast'

  @Component({
    components: {
      ElsaButton,
      TerveyskeskuskoulutusjaksoForm
    }
  })
  export default class TerveyskeskuskoulutusjaksonHyvaksynta extends Vue {
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
        text: this.$t('terveyskeskuskoulutusjakson-hyvaksynta'),
        active: true
      }
    ]

    params = {
      saving: false
    }

    hyvaksynta: TerveyskeskuskoulutusjaksonHyvaksyminen | null = null
    reservedAsiakirjaNimetMutable: string[] | undefined = []

    async mounted() {
      try {
        this.hyvaksynta = (await getTerveyskeskuskoulutusjakso()).data
        this.reservedAsiakirjaNimetMutable = (
          await axios.get('erikoistuva-laakari/asiakirjat/nimet')
        ).data
      } catch (err) {
        const axiosError = err as AxiosError<ElsaError>
        const message = axiosError?.response?.data?.message
        toastFail(
          this,
          message
            ? `${this.$t('terveyskeskuskoulutusjakson-tietojen-hakeminen-epaonnistui')}: ${this.$t(
                message
              )}`
            : this.$t('terveyskeskuskoulutusjakson-tietojen-hakeminen-epaonnistui')
        )
        this.$router.replace({ name: 'tyoskentelyjaksot' })
      }
    }

    get account() {
      return store.getters['auth/account']
    }

    get editable() {
      return (
        (this.hyvaksynta?.id == null || this.hyvaksynta?.korjausehdotus != null) &&
        !this.account.impersonated
      )
    }

    get showReturned() {
      return this.hyvaksynta?.tila === TerveyskeskuskoulutusjaksonTila.PALAUTETTU_KORJATTAVAKSI
    }

    get showSent() {
      return (
        this.hyvaksynta?.tila === TerveyskeskuskoulutusjaksonTila.ODOTTAA_VIRKAILIJAN_TARKISTUSTA ||
        this.hyvaksynta?.tila === TerveyskeskuskoulutusjaksonTila.ODOTTAA_VASTUUHENKILON_HYVAKSYNTAA
      )
    }

    async onSubmit(
      submitData: {
        hyvaksynta: TerveyskeskuskoulutusjaksonHyvaksyminen
        form: TerveyskeskuskoulutusjaksonHyvaksyntaForm
      },
      params: { saving: boolean }
    ) {
      params.saving = true

      for (const asiakirjat of submitData.form.tyoskentelyjaksoAsiakirjat) {
        const formData = new FormData()
        asiakirjat.addedFiles.forEach((file: File) =>
          formData.append(`addedFiles`, file, file.name)
        )
        asiakirjat.deletedFiles.forEach((file: number) =>
          formData.append(`deletedFiles`, String(file))
        )

        try {
          await axios.put(
            `erikoistuva-laakari/tyoskentelyjaksot/${asiakirjat.id}/asiakirjat`,
            formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data'
              },
              timeout: 120000
            }
          )
        } catch (err) {
          const axiosError = err as AxiosError<ElsaError>
          const message = axiosError?.response?.data?.message
          toastFail(
            this,
            message
              ? `${this.$t('terveyskeskuskoulutusjakson-lahetys-epaonnistui')}: ${this.$t(message)}`
              : this.$t('terveyskeskuskoulutusjakson-lahetys-epaonnistui')
          )
          return
        }
      }

      try {
        const formData = new FormData()
        if (submitData.form.laillistamispaiva != null)
          formData.append('laillistamispaiva', submitData.form.laillistamispaiva)
        if (submitData.form.laillistamispaivanLiite != null)
          formData.append(
            'laillistamispaivanLiite',
            submitData.form.laillistamispaivanLiite,
            submitData.form.laillistamispaivanLiite?.name
          )
        if (this.hyvaksynta?.id === null) {
          await axios.post(
            'erikoistuva-laakari/tyoskentelyjaksot/terveyskeskuskoulutusjakson-hyvaksynta',
            formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data'
              },
              timeout: 120000
            }
          )
        } else {
          await axios.put(
            'erikoistuva-laakari/tyoskentelyjaksot/terveyskeskuskoulutusjakson-hyvaksynta',
            formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data'
              },
              timeout: 120000
            }
          )
        }
        toastSuccess(this, this.$t('terveyskeskuskoulutusjakson-lahetys-onnistui'))
        this.$emit('skipRouteExitConfirm', true)
        this.$router.push({ name: 'tyoskentelyjaksot' })
      } catch (err) {
        const axiosError = err as AxiosError<ElsaError>
        const message = axiosError?.response?.data?.message
        toastFail(
          this,
          message
            ? `${this.$t('terveyskeskuskoulutusjakson-lahetys-epaonnistui')}: ${this.$t(message)}`
            : this.$t('terveyskeskuskoulutusjakson-lahetys-epaonnistui')
        )
      }
      this.params.saving = false
    }

    async onCancel() {
      this.$router.push({ name: 'tyoskentelyjaksot' })
    }
  }
</script>

<style lang="scss" scoped>
  .terveyskeskuskoulutusjakso {
    max-width: 1024px;
  }

  .tyoskentelyjaksot-link::before {
    content: '<';
    position: absolute;
    left: 1rem;
  }
</style>
