<template>
  <div class="opintosuoritukset">
    <b-breadcrumb :items="items" class="mb-0" />
    <b-container fluid>
      <b-row lg v-if="!loading">
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
          <b-tabs content-class="mt-3" :no-fade="true">
            <b-tab :title="$t('johtamisopinnot')" active>
              <opintosuoritus-tab
                variant="johtaminen"
                progress
                :suoritettu="opintosuorituksetWrapper.johtamisopinnotSuoritettu"
                :vaadittu="opintosuorituksetWrapper.johtamisopinnotVaadittu"
                :os="johtamisopinnot"
              />
            </b-tab>
            <b-tab
              v-if="sateilysuojelukoulutukset.length > 0"
              :title="$t('sateilysuojelukoulutukset')"
            >
              <opintosuoritus-tab
                variant="sateily"
                progress
                :suoritettu="opintosuorituksetWrapper.sateilysuojakoulutuksetSuoritettu"
                :vaadittu="opintosuorituksetWrapper.sateilysuojakoulutuksetVaadittu"
                :os="sateilysuojelukoulutukset"
              />
            </b-tab>
            <b-tab :title="$t('kuulustelu')">
              <opintosuoritus-tab variant="kuulustelu" :os="kuulustelut" />
            </b-tab>
            <b-tab :title="$t('muut')">
              <opintosuoritus-tab variant="muu" :os="muut" />
            </b-tab>
          </b-tabs>
        </b-col>
      </b-row>
      <b-row lg>
        <b-col>
          <div v-if="loading" class="text-center mt-6">
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

  import ElsaFormGroup from '@/components/form-group/form-group.vue'
  import ElsaProgressBar from '@/components/progress-bar/progress-bar.vue'
  import store from '@/store'
  import { OpintosuorituksetWrapper, Opintosuoritus } from '@/types'
  import { OpintosuoritusTyyppiEnum } from '@/utils/constants'
  import { toastFail } from '@/utils/toast'
  import OpintosuoritusTab from '@/views/opintosuoritukset/opintosuoritus-tab.vue'

  @Component({
    components: {
      ElsaFormGroup,
      ElsaProgressBar,
      OpintosuoritusTab
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
        toastFail(this, this.$t('opintosuoritusten-haku-epaonnistui'))
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
