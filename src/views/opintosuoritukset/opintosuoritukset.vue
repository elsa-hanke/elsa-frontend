<template>
  <div class="opintosuoritukset">
    <b-breadcrumb :items="items" class="mb-0" />
    <b-container fluid>
      <b-row lg>
        <b-col>
          <h1>{{ $t('opintosuoritukset') }}</h1>
          <p>
            {{ $t('opintosuoritukset-kuvaus') }}
            <a
              href="https://www.laaketieteelliset.fi/ammatillinen-jatkokoulutus/yhteystiedot"
              target="_blank"
              rel="noopener noreferrer"
            >
              {{ $t('sahkopostitse') }}
            </a>
          </p>
          <div class="d-flex justify-content-center border rounded pt-3 mb-4">
            <b-container fluid>
              <elsa-form-group :label="$t('johtamisopinnot-yhteensa')">
                <template v-slot="{ uid }">
                  <div :id="uid">
                    <elsa-progress-bar
                      :value="opintosuorituksetWrapper.johtamisopinnotSuoritettu"
                      :min-required="opintosuorituksetWrapper.johtamisopinnotVaadittu"
                      :show-required-text="true"
                      color="#41b257"
                      backgroundColor="#b3e1bc"
                      textColor="#000"
                      class="mb-3"
                      :customUnit="$t('opintopistetta-lyhenne')"
                    />
                  </div>
                </template>
              </elsa-form-group>
            </b-container>
          </div>
          <b-tabs content-class="mt-3" :no-fade="true">
            <b-tab :title="$t('johtamisopinnot')" active>{{ johtamisopinnot }}</b-tab>
            <b-tab
              v-if="sateilysuojelukoulutukset.length > 0"
              :title="$t('sateilysuojelukoulutukset')"
            >
              {{ sateilysuojelukoulutukset }}
            </b-tab>
            <b-tab :title="$t('kuulustelut')">{{ kuulustelut }}</b-tab>
            <b-tab :title="$t('muut')">{{ muut }}</b-tab>
          </b-tabs>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script lang="ts">
  import axios from 'axios'
  import { Component, Vue } from 'vue-property-decorator'

  import ElsaFormGroup from '@/components/form-group/form-group.vue'
  import ElsaProgressBar from '@/components/progress-bar/progress-bar.vue'
  import store from '@/store'
  import { OpintosuorituksetWrapper, Opintosuoritus } from '@/types'
  import { OpintosuoritusTyyppiEnum } from '@/utils/constants'

  @Component({
    components: {
      ElsaFormGroup,
      ElsaProgressBar
    }
  })
  export default class Opintosuoritukset extends Vue {
    private endpointUrl = 'erikoistuva-laakari/opintosuoritukset'
    private opintosuorituksetWrapper: OpintosuorituksetWrapper | null = null
    private johtamisopinnot: Opintosuoritus[] = []
    private sateilysuojelukoulutukset: Opintosuoritus[] = []
    private kuulustelut: Opintosuoritus[] = []
    private muut: Opintosuoritus[] = []
    private loading = false
    private items = [
      {
        text: this.$t('etusivu'),
        to: { name: 'etusivu' }
      },
      {
        text: this.$t('opintosuoritukset'),
        active: true
      }
    ]

    async mounted() {
      await this.fetch()
    }

    get account() {
      return store.getters['auth/account']
    }

    async fetch() {
      try {
        this.loading = true
        this.opintosuorituksetWrapper = (await axios.get(this.endpointUrl)).data
        this.opintosuorituksetWrapper?.opintosuoritukset?.forEach((os: Opintosuoritus) => {
          switch (os.tyyppi?.nimi) {
            case OpintosuoritusTyyppiEnum.JOHTAMISOPINTO:
              this.johtamisopinnot.push(os)
              break
            case OpintosuoritusTyyppiEnum.SATEILYSUOJAKOULUTUS:
              this.sateilysuojelukoulutukset.push(os)
              break
            case OpintosuoritusTyyppiEnum.VALTAKUNNALLINEN_KUULUSTELU:
              this.kuulustelut.push(os)
              break
            default:
              this.muut.push(os)
          }
        })
      } catch {
        this.$t('asiakirjojen-haku-epaonnistui')
      }
      this.loading = false
    }
  }
</script>

<style lang="scss" scoped>
  .opintosuoritukset {
    max-width: 1024px;
  }
</style>
