<template>
  <div class="muokkaa-koulutussuunnitelma">
    <b-breadcrumb :items="items" class="mb-0" />
    <b-container fluid>
      <b-row lg>
        <b-col>
          <elsa-error-message
            v-if="error"
            @click="fetchKoulutussuunnitelma"
            :loading="loading"
            class="text-center"
          >
            {{ $t('koulutussuunnitelman-hakeminen-epaonnistui') }}
          </elsa-error-message>
          <div v-else-if="!loading" class="mb-4">
            <h2>{{ $t('henkilokohtainen-koulutussuunnitelma') }}</h2>
            <p>
              {{ $t('henkilokohtainen-koulutussuunnitelma-kuvaus') }}
              <a
                href="https://www.laaketieteelliset.fi/ammatillinen-jatkokoulutus/opinto-oppaat/"
                target="_blank"
                rel="noopener noreferrer"
              >
                {{ $t('henkilokohtainen-koulutussuunnitelma-linkki') }}
              </a>
            </p>
            <hr />
            <koulutussuunnitelma-form
              :value="koulutussuunnitelma"
              @submit="onSubmit"
              @cancel="onCancel"
            />
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
  import axios from 'axios'
  import { Component, Vue } from 'vue-property-decorator'

  import { putKoulutussuunnitelma } from '@/api/erikoistuva'
  import ElsaButton from '@/components/button/button.vue'
  import ElsaErrorMessage from '@/components/error-message/error-message.vue'
  import KoulutussuunnitelmaForm from '@/forms/koulutussuunnitelma-form.vue'
  import { Koulutussuunnitelma } from '@/types'
  import { toastFail, toastSuccess } from '@/utils/toast'

  @Component({
    components: {
      ElsaButton,
      ElsaErrorMessage,
      KoulutussuunnitelmaForm
    }
  })
  export default class MuokkaaKoulutussuunnitelma extends Vue {
    items = [
      {
        text: this.$t('etusivu'),
        to: { name: 'etusivu' }
      },
      {
        text: this.$t('koulutussuunnitelma'),
        to: { name: 'koulutussuunnitelma' }
      },
      {
        text: this.$t('muokkaa-koulutussuunnitelma'),
        active: true
      }
    ]
    koulutussuunnitelma: null | Koulutussuunnitelma = null
    loading = true
    error = false

    async mounted() {
      await this.fetchKoulutussuunnitelma()
      this.loading = false
    }

    async fetchKoulutussuunnitelma() {
      try {
        this.loading = true
        this.koulutussuunnitelma = (await axios.get(`erikoistuva-laakari/koulutussuunnitelma`)).data
        this.error = false
      } catch (err) {
        toastFail(this, this.$t('koulutussuunnitelman-hakeminen-epaonnistui'))
        this.error = true
      } finally {
        this.loading = false
      }
    }

    async onSubmit(data: any, params: any) {
      params.saving = true
      try {
        await putKoulutussuunnitelma(data)
        toastSuccess(this, this.$t('koulutussuunnitelman-tallentaminen-onnistui'))
        this.$emit('skipRouteExitConfirm', true)
        this.$router.push({
          name: 'koulutussuunnitelma'
        })
      } catch (err) {
        toastFail(
          this,
          this.$t('koulutussuunnitelman-tallentaminen-epaonnistui', {
            virhe: err.response.data.title
          })
        )
      }
      params.saving = false
    }

    onCancel() {
      this.$router.push({
        name: 'koulutussuunnitelma'
      })
    }
  }
</script>

<style lang="scss" scoped>
  @import '~@/styles/variables';
  @import '~bootstrap/scss/mixins/breakpoints';

  .muokkaa-koulutussuunnitelma {
    max-width: 1024px;
  }
</style>
