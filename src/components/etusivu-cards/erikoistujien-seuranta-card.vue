<template>
  <div>
    <h2>{{ $t('erikoistujien-seuranta') }}</h2>
    <b-card-skeleton :header="seurantaTitle" :loading="!seuranta">
      <div v-if="showKouluttajaKuvaus" class="mb-3 mb-lg-3">
        {{ $t('erikoistujien-seuranta-kouluttaja-kuvaus') }}
      </div>
      <b-row lg>
        <b-col cols="12" lg="4">
          <elsa-search-input
            class="mt-lg-3 mb-4 hakutermi"
            :hakutermi.sync="hakutermi"
            :placeholder="$t('hae-erikoistujan-nimella')"
          />
        </b-col>
        <b-col cols="12" lg="4">
          <div class="erikoisalat" v-if="seuranta.erikoisalat.length > 1">
            <elsa-form-group :label="$t('erikoisala')" class="mb-4">
              <template v-slot="{ uid }">
                <elsa-form-multiselect
                  :id="uid"
                  v-model="erikoisala"
                  :options="seuranta.erikoisalat"
                ></elsa-form-multiselect>
              </template>
            </elsa-form-group>
          </div>
        </b-col>
        <b-col cols="12" lg="4" class="">
          <div class="jarjestys">
            <elsa-form-group :label="$t('jarjestys')" class="mb-4">
              <template v-slot="{ uid }">
                <elsa-form-multiselect
                  :id="uid"
                  v-model="sortBy"
                  :options="sortFields"
                  label="name"
                  track-by="name"
                  :taggable="true"
                >
                  <template v-slot:option="{ option }">
                    <div v-if="option.name">{{ option.name }}</div>
                  </template>
                </elsa-form-multiselect>
              </template>
            </elsa-form-group>
          </div>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <b-alert v-if="rows === 0" variant="dark" show>
            <font-awesome-icon icon="info-circle" fixed-width class="text-muted" />
            <span v-if="hakutermi.length > 0 || erikoisala.length > 0">
              {{ $t('ei-hakutuloksia') }}
            </span>
            <span v-else>
              {{ $t('ei-seurattavia-erikoistujia') }}
            </span>
          </b-alert>
          <b-list-group>
            <b-list-group-item v-for="(eteneminen, index) in pagedTulokset" :key="index">
              <b-row>
                <b-col cols="12" lg="6">
                  <elsa-button
                    variant="link"
                    class="p-0"
                    @click="vaihdaRooli(eteneminen.opintooikeusId)"
                  >
                    <div>
                      {{ eteneminen.erikoistuvaLaakariEtuNimi }}
                      {{ eteneminen.erikoistuvaLaakariSukuNimi }}
                      <span v-if="eteneminen.erikoistuvaLaakariSyntymaaika != null">
                        ({{ $date(eteneminen.erikoistuvaLaakariSyntymaaika) }})
                      </span>
                    </div>
                  </elsa-button>
                  <div class="mb-2 text-size-sm">
                    {{ eteneminen.erikoisala }}. {{ eteneminen.asetus }}
                  </div>
                </b-col>
                <b-col cols="12" lg="6">
                  <div class="text-lg-right text-size-sm mb-2">
                    <span class="d-block d-lg-inline-block">
                      {{ $t('koejakso') }}:
                      <span
                        :class="
                          koejaksoTyyli(
                            eteneminen.koejaksoTila,
                            eteneminen.opintooikeudenPaattymispaiva
                          )
                        "
                      >
                        {{ koejaksoTila(eteneminen.koejaksoTila) }}
                      </span>
                    </span>
                    <span v-if="$screen.lg">{{ ' | ' }}</span>
                    <span class="d-block d-lg-inline-block">
                      {{ $t('opintooikeus') }}:
                      {{ $date(eteneminen.opintooikeudenMyontamispaiva) }} -
                      <span :class="opintoOikeusTyyli(eteneminen.opintooikeudenPaattymispaiva)">
                        {{ $date(eteneminen.opintooikeudenPaattymispaiva) }}
                      </span>
                    </span>
                  </div>
                </b-col>
              </b-row>
              <b-row>
                <b-col cols="12" lg="3" class="pr-3 mb-4">
                  <div class="text-uppercase font-weight-normal mb-1 text-size-sm">
                    {{ $t('tyoskentelyaika-yht') }}
                  </div>
                  <div v-b-toggle="`tyoskentelyaika-toggle-${index}`">
                    <b-row>
                      <b-col cols="11" class="pr-2">
                        <elsa-progress-bar
                          :value="
                            eteneminen.tyoskentelyjaksoTilastot.koulutustyypit.yhteensaSuoritettu
                          "
                          :min-required="
                            eteneminen.tyoskentelyjaksoTilastot.koulutustyypit
                              .yhteensaVaadittuVahintaan
                          "
                          :color="'#41b257'"
                          :background-color="'#b3e1bc'"
                          :textColor="'black'"
                          :showRequiredDuration="true"
                        />
                      </b-col>
                      <b-col cols="1" class="pl-0 pr-0">
                        <span class="closed">
                          <font-awesome-icon icon="chevron-down" class="text-muted" />
                        </span>
                        <span class="open">
                          <font-awesome-icon icon="chevron-up" class="text-muted" />
                        </span>
                      </b-col>
                    </b-row>
                  </div>
                  <b-collapse :id="`tyoskentelyaika-toggle-${index}`">
                    <b-row>
                      <b-col cols="11" class="pr-2">
                        <span
                          v-for="(row, index) in barValues(eteneminen.tyoskentelyjaksoTilastot)"
                          :key="index"
                        >
                          <div class="text-size-sm mt-1">{{ row.text }}</div>
                          <elsa-progress-bar
                            :value="row.value"
                            :min-required="row.minRequired"
                            :color="row.color"
                            :background-color="row.backgroundColor"
                            :showRequiredDuration="true"
                          />
                        </span>
                      </b-col>
                    </b-row>
                  </b-collapse>
                </b-col>
                <b-col cols="6" lg="auto" class="pl-lg-3 pr-1 pr-lg-3 mb-2">
                  <div class="text-uppercase font-weight-normal mb-1 text-size-sm">
                    {{ $t('arviointien-ka') }}
                  </div>
                  <div v-if="eteneminen.arviointienKeskiarvo != null">
                    <span class="font-weight-bold">
                      {{ keskiarvoFormatted(eteneminen.arviointienKeskiarvo) }}
                    </span>
                    / 5
                  </div>
                  <div v-else>- / 5</div>
                </b-col>
                <b-col cols="6" lg="auto" class="mb-2 pl-1 pl-lg-3">
                  <div class="text-uppercase font-weight-normal text-size-sm">
                    {{ $t('arv-kokonaisuutta') }}
                  </div>
                  <div class="mb-1 text-size-sm">({{ $t('sis-vah-1-arvion') }})</div>
                  <span class="font-weight-bold">
                    {{ eteneminen.arviointienLkm }} /
                    {{ eteneminen.arvioitavienKokonaisuuksienLkm }}
                  </span>
                </b-col>
                <b-col cols="6" lg="auto" class="pr-1 pr-lg-3">
                  <div class="text-uppercase font-weight-normal mb-1 text-size-sm">
                    {{ $t('seurantajaksot') }}
                  </div>
                  <span class="font-weight-bold">{{ eteneminen.seurantajaksotLkm }}</span>
                  <span>{{ ' ' }}{{ $t('kpl') }}</span>
                  <span v-if="eteneminen.seurantajaksonHuoletLkm > 0">
                    <span>,</span>
                    {{ eteneminen.seurantajaksonHuoletLkm }} {{ $t('sis-huolia') }}
                  </span>
                </b-col>
                <b-col cols="6" lg="auto" class="pr-1 pl-1 pl-lg-3">
                  <div class="text-uppercase font-weight-normal mb-1 text-size-sm">
                    {{ $t('suoritemerkinnat') }}
                  </div>
                  <span class="font-weight-bold">{{ eteneminen.suoritemerkinnatLkm }}</span>
                  <span v-if="eteneminen.vaaditutSuoritemerkinnatLkm > 0">
                    / {{ eteneminen.vaaditutSuoritemerkinnatLkm }}
                  </span>
                  {{ $t('kpl') }}
                </b-col>
              </b-row>
            </b-list-group-item>
          </b-list-group>
          <elsa-pagination
            :current-page.sync="currentPage"
            :per-page="perPage"
            :rows="rows"
            :style="{ 'max-width': '1420px' }"
          />
        </b-col>
      </b-row>
    </b-card-skeleton>
  </div>
</template>

<script lang="ts">
  import { Component, Mixins, Prop } from 'vue-property-decorator'

  import ElsaButton from '@/components/button/button.vue'
  import BCardSkeleton from '@/components/card/card.vue'
  import ElsaFormGroup from '@/components/form-group/form-group.vue'
  import ElsaFormMultiselect from '@/components/multiselect/multiselect.vue'
  import ElsaPagination from '@/components/pagination/pagination.vue'
  import ElsaProgressBar from '@/components/progress-bar/progress-bar.vue'
  import ElsaSearchInput from '@/components/search-input/search-input.vue'
  import ErikoistujienSeurantaMixin from '@/mixins/erikoistujien-seuranta'
  import { ErikoistujienSeuranta, SortByEnum } from '@/types'
  import { ErikoistuvanSeurantaJarjestys } from '@/utils/constants'
  import { getKeskiarvoFormatted } from '@/utils/keskiarvoFormatter'
  import { sortByAsc, sortByDesc } from '@/utils/sort'

  @Component({
    components: {
      BCardSkeleton,
      ElsaButton,
      ElsaFormGroup,
      ElsaFormMultiselect,
      ElsaPagination,
      ElsaProgressBar,
      ElsaSearchInput
    }
  })
  export default class ErikoistujienSeurantaCard extends Mixins(ErikoistujienSeurantaMixin) {
    @Prop({ required: true, default: undefined })
    seuranta!: ErikoistujienSeuranta

    @Prop({ required: false, default: false })
    showKouluttajaKuvaus!: boolean

    sortFields: SortByEnum[] = [
      {
        name: this.$t('opintooikeus-paattymassa'),
        value: ErikoistuvanSeurantaJarjestys.OPINTOOIKEUS_PAATTYMASSA
      } as SortByEnum,
      {
        name: this.$t('opintooikeus-alkaen'),
        value: ErikoistuvanSeurantaJarjestys.OPINTOOIKEUS_ALKAEN
      } as SortByEnum,
      {
        name: this.$t('tyoskentelyaikaa-vahiten'),
        value: ErikoistuvanSeurantaJarjestys.TYOSKENTELYAIKAA_VAHITEN
      } as SortByEnum,
      {
        name: this.$t('tyoskentelyaikaa-eniten'),
        value: ErikoistuvanSeurantaJarjestys.TYOSKENTELYAIKAA_ENITEN
      } as SortByEnum,
      {
        name: this.$t('sukunimi-a-o'),
        value: ErikoistuvanSeurantaJarjestys.SUKUNIMI_ASC
      } as SortByEnum,
      {
        name: this.$t('sukunimi-o-a'),
        value: ErikoistuvanSeurantaJarjestys.SUKUNIMI_DESC
      } as SortByEnum
    ]
    sortBy = this.sortFields[0]

    hakutermi = ''
    erikoisala = ''

    get seurantaTitle() {
      let result = ''
      this.seuranta.kayttajaYliopistoErikoisalat.forEach((kayttajaErikoisala) => {
        result +=
          this.$t(`yliopisto-nimi.${kayttajaErikoisala.yliopistoNimi}`) +
          ': ' +
          kayttajaErikoisala.erikoisalat.join(', ') +
          '. '
      })
      return result
    }

    get pagedTulokset() {
      const current = (this.currentPage - 1) * this.perPage
      return this.tulokset.slice(current, current + this.perPage)
    }

    get tulokset() {
      let result = this.seuranta.erikoistujienEteneminen
      if (this.hakutermi) {
        result = result.filter((item) =>
          (item.erikoistuvaLaakariEtuNimi + ' ' + item.erikoistuvaLaakariSukuNimi)
            .toLowerCase()
            .includes(this.hakutermi.toLowerCase())
        )
      }
      if (this.erikoisala) {
        result = result.filter((item) => item.erikoisala === this.erikoisala)
      }

      switch (this.sortBy.value) {
        case ErikoistuvanSeurantaJarjestys.OPINTOOIKEUS_PAATTYMASSA:
          result.sort((a, b) =>
            sortByAsc(a.opintooikeudenPaattymispaiva, b.opintooikeudenPaattymispaiva)
          )
          break
        case ErikoistuvanSeurantaJarjestys.OPINTOOIKEUS_ALKAEN:
          result.sort((a, b) =>
            sortByAsc(a.opintooikeudenMyontamispaiva, b.opintooikeudenMyontamispaiva)
          )
          break
        case ErikoistuvanSeurantaJarjestys.TYOSKENTELYAIKAA_VAHITEN:
          result.sort((a, b) =>
            sortByAsc(
              a.tyoskentelyjaksoTilastot.tyoskentelyaikaYhteensa,
              b.tyoskentelyjaksoTilastot.tyoskentelyaikaYhteensa
            )
          )
          break
        case ErikoistuvanSeurantaJarjestys.TYOSKENTELYAIKAA_ENITEN:
          result.sort((a, b) =>
            sortByDesc(
              a.tyoskentelyjaksoTilastot.tyoskentelyaikaYhteensa,
              b.tyoskentelyjaksoTilastot.tyoskentelyaikaYhteensa
            )
          )
          break
        case ErikoistuvanSeurantaJarjestys.SUKUNIMI_ASC:
          result.sort((a, b) =>
            sortByAsc(a.erikoistuvaLaakariSukuNimi, b.erikoistuvaLaakariSukuNimi)
          )
          break
        case ErikoistuvanSeurantaJarjestys.SUKUNIMI_DESC:
          result.sort((a, b) =>
            sortByDesc(a.erikoistuvaLaakariSukuNimi, b.erikoistuvaLaakariSukuNimi)
          )
          break
      }

      return result
    }

    get rows() {
      return this.tulokset.length
    }

    keskiarvoFormatted(keskiarvo: number) {
      return getKeskiarvoFormatted(keskiarvo)
    }
  }
</script>

<style lang="scss" scoped>
  @import '~@/styles/variables';

  .collapsed {
    .open {
      display: none;
    }
  }

  .not-collapsed {
    .closed {
      display: none;
    }
  }

  .hakutermi::v-deep .search-input {
    margin-top: 0 !important;
  }

  .jarjestys::v-deep .form-group,
  .erikoisalat::v-deep .form-group {
    label {
      font-weight: 300;
      text-transform: uppercase;
      font-size: $font-size-sm;
      margin-bottom: 0;
    }
  }
</style>
