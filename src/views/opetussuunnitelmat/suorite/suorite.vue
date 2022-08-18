<template>
  <div class="suorite mb-4">
    <b-breadcrumb :items="items" class="mb-0" />
    <b-container fluid>
      <b-row lg>
        <b-col>
          <h1>{{ $t('suorite') }}</h1>
          <hr />
          <div v-if="!loading">
            <suorite-form :suorite="suorite" />
            <div class="d-flex flex-row-reverse flex-wrap">
              <elsa-button :to="{ name: 'korvaa-suorite' }" variant="primary" class="ml-2 mb-3">
                {{ $t('luo-uusi-paattaa-nykyisen') }}
              </elsa-button>
              <elsa-button
                :to="{ name: 'muokkaa-suoritetta' }"
                variant="outline-primary"
                class="ml-2 mb-3"
              >
                {{ $t('muokkaa') }}
              </elsa-button>
              <elsa-button
                :to="{ name: 'erikoisala', hash: '#suoritteet' }"
                variant="link"
                class="mb-3 mr-auto font-weight-500 suorite-link"
              >
                {{ $t('palaa-suoritteisiin') }}
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

  import { getSuorite } from '@/api/tekninen-paakayttaja'
  import ElsaButton from '@/components/button/button.vue'
  import SuoriteForm from '@/forms/suorite-form.vue'
  import { SuoriteWithErikoisala } from '@/types'
  import { toastFail } from '@/utils/toast'

  @Component({
    components: {
      ElsaButton,
      SuoriteForm
    }
  })
  export default class SuoriteView extends Vue {
    suorite: SuoriteWithErikoisala | null = null

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
          text: this.suorite?.kategoria?.erikoisala.nimi,
          to: { name: 'erikoisala' }
        },
        {
          text: this.$t('suorite'),
          active: true
        }
      ]
    }

    async mounted() {
      await this.fetchSuorite()
      this.loading = false
    }

    async fetchSuorite() {
      try {
        this.suorite = (await getSuorite(this.$route?.params?.suoriteId)).data
      } catch (err) {
        toastFail(this, this.$t('suoritteen-hakeminen-epaonnistui'))
        this.$router.replace({ name: 'opetussuunnitelmat', hash: '#suoritteet' })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .suorite {
    max-width: 970px;
  }

  .suorite-link::before {
    content: '<';
    position: absolute;
    left: 1rem;
  }
</style>
