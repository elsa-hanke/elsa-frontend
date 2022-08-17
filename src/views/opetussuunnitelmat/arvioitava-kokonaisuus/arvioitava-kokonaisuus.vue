<template>
  <div class="kokonaisuus mb-4">
    <b-breadcrumb :items="items" class="mb-0" />
    <b-container fluid>
      <b-row lg>
        <b-col>
          <h1>{{ $t('arvioitava-kokonaisuus') }}</h1>
          <hr />
          <div v-if="!loading">
            <arvioitava-kokonaisuus-form :kokonaisuus="kokonaisuus" />
            <div class="d-flex flex-row-reverse flex-wrap">
              <elsa-button
                :to="{ name: 'korvaa-arvioitava-kokonaisuus' }"
                variant="primary"
                class="ml-2 mb-3"
              >
                {{ $t('luo-uusi-paattaa-nykyisen') }}
              </elsa-button>
              <elsa-button
                :to="{ name: 'muokkaa-arvioitavaa-kokonaisuutta' }"
                variant="outline-primary"
                class="ml-2 mb-3"
              >
                {{ $t('muokkaa') }}
              </elsa-button>
              <elsa-button
                :to="{ name: 'erikoisala', hash: '#arvioitavat-kokonaisuudet' }"
                variant="link"
                class="mb-3 mr-auto font-weight-500 arvioitava-kokonaisuus-link"
              >
                {{ $t('palaa-arvioitaviin-kokonaisuuksiin') }}
              </elsa-button>
            </div>
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
  import { Component, Vue } from 'vue-property-decorator'

  import { getArvioitavaKokonaisuus } from '@/api/tekninen-paakayttaja'
  import ElsaButton from '@/components/button/button.vue'
  import ArvioitavaKokonaisuusForm from '@/forms/arvioitava-kokonaisuus-form.vue'
  import { ArvioitavaKokonaisuusWithErikoisala } from '@/types'
  import { toastFail } from '@/utils/toast'

  @Component({
    components: {
      ArvioitavaKokonaisuusForm,
      ElsaButton
    }
  })
  export default class ArvioitavaKokonaisuusView extends Vue {
    kokonaisuus: ArvioitavaKokonaisuusWithErikoisala | null = null

    loading = true

    get items() {
      return [
        {
          text: this.$t('etusivu'),
          to: { name: 'etusivu' }
        },
        {
          text: this.$t('opetussuunnitelmat'),
          to: { name: 'opetussuunnitelmat' }
        },
        {
          text: this.kokonaisuus?.kategoria.erikoisala.nimi,
          to: { name: 'erikoisala' }
        },
        {
          text: this.$t('arvioitava-kokonaisuus'),
          active: true
        }
      ]
    }

    async mounted() {
      await this.fetchKokonaisuus()
      this.loading = false
    }

    async fetchKokonaisuus() {
      try {
        this.kokonaisuus = (await getArvioitavaKokonaisuus(this.$route?.params?.kokonaisuusId)).data
      } catch (err) {
        toastFail(this, this.$t('arvioitavan-kokonaisuuden-hakeminen-epaonnistui'))
        this.$router.replace({ name: 'opetussuunnitelmat', hash: '#arvioitavat-kokonaisuudet' })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .kokonaisuus {
    max-width: 970px;
  }

  .arvioitava-kokonaisuus-link::before {
    content: '<';
    position: absolute;
    left: 1rem;
  }
</style>
