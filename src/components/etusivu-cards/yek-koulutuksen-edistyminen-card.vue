<template>
  <b-card-skeleton :header="$t('yek.koulutuksen-edistyminen')" :loading="initializing" class="mb-4">
    <b-container v-if="!initializing && edistyminen" fluid class="p-0">
      <b-row>
        <b-col xl="8">
          <div class="border rounded pt-3 pb-2 mb-4">
            <div class="container-fluid">
              <elsa-button
                :to="{
                  name: 'tyoskentelyjaksot'
                }"
                variant="link"
                class="pl-0 border-0 pt-0"
              >
                <h3 class="mb-0">
                  {{ $t('tyoskentelyjaksot') }}
                </h3>
              </elsa-button>
              <div class="d-flex justify-content-center">
                <b-col class="p-0" md="10">
                  <tyoskentelyjaksot-yek-bar-chart
                    :tilastot="edistyminen.tyoskentelyjaksoTilastot"
                  />
                </b-col>
              </div>
              <div class="d-flex flex-row">
                <em class="align-middle">
                  <font-awesome-icon :icon="['fas', 'info-circle']" class="text-muted mr-2" />
                </em>
                <div>
                  {{ $t('yek.aiempi-hyvaksiluettu-suoritus') }}
                </div>
              </div>
            </div>
          </div>
        </b-col>
        <b-col xl="4">
          <div class="border rounded pt-3 pb-2 mb-2">
            <div class="container-fluid">
              <h3>{{ $t('opintooikeus') }}</h3>
              <div class="d-flex align-items-center">
                <font-awesome-icon
                  v-if="showOpintooikeusAlert(edistyminen.opintooikeudenPaattymispaiva)"
                  :icon="['fas', 'exclamation-circle']"
                  class="text-danger"
                />
                <span
                  :class="{
                    'text-danger ml-1': showOpintooikeusAlert(
                      edistyminen.opintooikeudenPaattymispaiva
                    )
                  }"
                >
                  {{ $date(edistyminen.opintooikeudenMyontamispaiva) }} -
                  {{ $date(edistyminen.opintooikeudenPaattymispaiva) }}
                </span>
              </div>
            </div>
          </div>
          <div class="border rounded pt-3 pb-2 mb-4">
            <div class="container-fluid">
              <elsa-button
                :to="{ name: 'teoriakoulutukset' }"
                variant="link"
                class="pl-0 border-0 pt-0"
              >
                <h3 class="mb-0">
                  {{ $t('teoriakoulutus') }}
                </h3>
              </elsa-button>
              <div>
                {{
                  teoriakoulutukset.length > 0
                    ? `${teoriakoulutukset.length} ${$t('kpl')}`
                    : $t('ei-suoritettu')
                }}
              </div>
            </div>
          </div>
        </b-col>
      </b-row>
    </b-container>
  </b-card-skeleton>
</template>

<script lang="ts">
  import { parseISO, differenceInMonths } from 'date-fns'
  import { Vue, Component } from 'vue-property-decorator'

  import { getErikoistumisenEdistyminen } from '@/api/erikoistuva'
  import ElsaArviointiasteikonTasoTooltipContent from '@/components/arviointiasteikon-taso/arviointiasteikon-taso-tooltip.vue'
  import ElsaArviointiasteikonTaso from '@/components/arviointiasteikon-taso/arviointiasteikon-taso.vue'
  import ElsaButton from '@/components/button/button.vue'
  import BCardSkeleton from '@/components/card/card.vue'
  import ElsaFormGroup from '@/components/form-group/form-group.vue'
  import ElsaPopover from '@/components/popover/popover.vue'
  import ElsaProgressBar from '@/components/progress-bar/progress-bar.vue'
  import TyoskentelyjaksotYekBarChart from '@/components/yek/tyoskentelyjaksot-yek-bar-chart.vue'
  import { ErikoistumisenEdistyminen, Teoriakoulutus } from '@/types'
  import { LomakeTilat, ArviointiasteikkoTyyppi } from '@/utils/constants'
  import { getKeskiarvoFormatted } from '@/utils/keskiarvoFormatter'

  @Component({
    components: {
      BCardSkeleton,
      ElsaButton,
      ElsaFormGroup,
      ElsaPopover,
      TyoskentelyjaksotYekBarChart,
      ElsaProgressBar,
      ElsaArviointiasteikonTaso,
      ElsaArviointiasteikonTasoTooltipContent
    }
  })
  export default class YekKoulutuksenEdistyminenCard extends Vue {
    initializing = true

    teoriakoulutukset: Teoriakoulutus[] = []
    edistyminen: ErikoistumisenEdistyminen | null = null

    async mounted() {
      this.edistyminen = (await getErikoistumisenEdistyminen()).data
      this.initializing = false
    }

    koejaksoComponent(suoritusmerkintaExists: boolean) {
      return suoritusmerkintaExists ? 'opintosuoritukset' : 'koejakso'
    }

    koejaksoComponentHash(suoritusmerkintaExists: boolean) {
      return suoritusmerkintaExists ? '#muut' : ''
    }

    koejaksoIcon(status: string, opintooikeudenPaattymispaiva: string) {
      switch (status) {
        case LomakeTilat.HYVAKSYTTY:
          return ['fas', 'check-circle']
        case LomakeTilat.ODOTTAA_HYVAKSYNTAA:
          return ['far', 'clock']
        case LomakeTilat.EI_AKTIIVINEN:
          if (differenceInMonths(parseISO(opintooikeudenPaattymispaiva), new Date()) <= 12) {
            return ['fas', 'exclamation-circle']
          } else return ['fas', 'info-circle']
      }
    }

    koejaksoIconClass(status: string, opintooikeudenPaattymispaiva: string) {
      switch (status) {
        case LomakeTilat.HYVAKSYTTY:
          return 'text-success'
        case LomakeTilat.ODOTTAA_HYVAKSYNTAA:
          return 'text-warning'
        case LomakeTilat.EI_AKTIIVINEN:
          if (differenceInMonths(parseISO(opintooikeudenPaattymispaiva), new Date()) <= 12) {
            return 'text-danger'
          } else return 'text-warning'
      }
    }

    koejaksoStatusText(status: string) {
      switch (status) {
        case LomakeTilat.HYVAKSYTTY:
          return this.$t('hyvaksytty')
        case LomakeTilat.ODOTTAA_HYVAKSYNTAA:
          return this.$t('kesken')
        case LomakeTilat.EI_AKTIIVINEN:
          return this.$t('aloittamatta')
      }
    }

    koejaksoStatusClass(status: string, opintooikeudenPaattymispaiva: string) {
      if (
        status === LomakeTilat.EI_AKTIIVINEN &&
        differenceInMonths(parseISO(opintooikeudenPaattymispaiva), new Date()) <= 12
      )
        return 'text-danger'
    }

    terveyskeskusjaksoComponent(suoritusmerkintaExists: boolean) {
      return suoritusmerkintaExists ? 'opintosuoritukset' : 'tyoskentelyjaksot'
    }

    terveyskeskusjaksoComponentHash(suoritusmerkintaExists: boolean) {
      return suoritusmerkintaExists ? '#muut' : ''
    }

    terveyskeskusjaksoIcon(suoritusmerkintaExists: boolean) {
      if (suoritusmerkintaExists) {
        return ['fas', 'check-circle']
      }
    }

    terveyskeskusjaksoIconClass(suoritusmerkintaExists: boolean) {
      if (suoritusmerkintaExists) {
        return 'text-success mr-1'
      }
    }

    terveyskeskusjaksoStatusText(suoritusmerkintaExists: boolean) {
      if (suoritusmerkintaExists) {
        return this.$t('hyvaksytty')
      } else {
        return this.$t('ei-suoritettu')
      }
    }

    showOpintooikeusAlert(opintooikeudenPaattymispaiva: string) {
      return differenceInMonths(parseISO(opintooikeudenPaattymispaiva), new Date()) <= 6
    }

    get arviointiAsteikonNimi() {
      return this.edistyminen?.arviointiasteikko.nimi === ArviointiasteikkoTyyppi.EPA
        ? this.$t('luottamuksen-tason-keskiarvo')
        : this.$t('etapin-keskiarvo')
    }

    get arviointiAsteikonSelite() {
      return this.edistyminen?.arviointiasteikko.nimi === ArviointiasteikkoTyyppi.EPA
        ? this.$t('arviointien-ka-selite-epa')
        : this.$t('arviointien-ka-selite-etappi')
    }

    keskiarvoFormatted(keskiarvo: number) {
      return getKeskiarvoFormatted(keskiarvo)
    }
  }
</script>

<style lang="scss" scoped>
  @import '~@/styles/variables';

  .col-min-width {
    min-width: 250px;
  }
</style>
