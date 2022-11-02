<template>
  <div class="valmistumispyynto">
    <b-breadcrumb :items="items" class="mb-0" />
    <b-container fluid>
      <b-row lg>
        <b-col>
          <h1>{{ $t('valmistumispyynnon-hyvaksynta') }}</h1>
          <div v-if="!loading">
            <div class="mt-3">
              <b-alert :show="odottaaHyvaksyntaa || odottaaAllekirjoituksia" variant="dark">
                <div class="d-flex flex-row">
                  <em class="align-middle">
                    <font-awesome-icon
                      :icon="['fas', 'info-circle']"
                      class="text-muted text-size-md mr-2"
                    />
                  </em>
                  <div v-if="odottaaHyvaksyntaa">
                    <span>
                      {{ $t('valmistumispyynto-hyvaksynta-virkailija-tarkastanut') }}
                    </span>
                    <span v-if="valmistumispyynto.virkailijanSaate" class="d-block">
                      <strong>{{ $t('lisatiedot-virkailijalta') }}: &nbsp;</strong>
                      <span>
                        {{ valmistumispyynto.virkailijanSaate }}
                      </span>
                    </span>
                  </div>
                  <span v-if="odottaaAllekirjoituksia">
                    {{ $t('valmistumispyynto-hyvaksynta-odottaa-allekirjoituksia') }}
                  </span>
                </div>
              </b-alert>
              <b-alert :show="allekirjoitettu" variant="success">
                <div class="d-flex flex-row">
                  <em class="align-middle">
                    <font-awesome-icon :icon="['fas', 'check-circle']" class="mr-2" />
                  </em>
                  <div>
                    <span>
                      {{ $t('valmistumispyynto-hyvaksynta-virkailija-tarkastanut') }}
                    </span>
                  </div>
                </div>
              </b-alert>
              <elsa-button
                variant="primary"
                class="mt-2 mb-1"
                :to="{
                  name: 'valmistumispyynnot'
                }"
              >
                {{ $t('palaa-valmistumispyyntoihin') }}
              </elsa-button>
            </div>
            <hr />
            <div>
              <erikoistuva-details
                :avatar="valmistumispyynto.erikoistujanAvatar"
                :name="valmistumispyynto.erikoistujanNimi"
                :erikoisala="valmistumispyynto.erikoistujanErikoisala"
                :opiskelijatunnus="valmistumispyynto.erikoistujanOpiskelijatunnus"
                :syntymaaika="valmistumispyynto.erikoistujanSyntymaaika"
                :yliopisto="valmistumispyynto.erikoistujanYliopisto"
                :laillistamispaiva="valmistumispyynto.erikoistujanLaillistamispaiva"
                :laillistamistodistus="valmistumispyynto.erikoistujanLaillistamistodistus"
                :laillistamistodistusNimi="valmistumispyynto.erikoistujanLaillistamistodistusNimi"
                :laillistamistodistusTyyppi="
                  valmistumispyynto.erikoistujanLaillistamistodistusTyyppi
                "
                :opintooikeudenMyontamispaiva="valmistumispyynto.opintooikeudenMyontamispaiva"
                :asetus="valmistumispyynto.erikoistujanAsetus"
              ></erikoistuva-details>
            </div>
            <hr />
            <h2 class="mb-3">{{ $t('osaamisen-arviointi') }}</h2>
            <div>
              <h5>
                {{ $t('erikoistujan-osaaminen-riittavalla-tasolla-valmistumiseen') }}
              </h5>
              <p>
                {{ $t('kylla') }}
              </p>
            </div>
            <div class="mt-3" v-if="valmistumispyynto.vastuuhenkiloOsaamisenArvioijaKuittausaika">
              <h2 class="mb-3">{{ $t('erikoisalan-vastuuhenkilo') }}</h2>
              <b-row>
                <b-col class="allekirjoitus-pvm col-xxl-1" lg="2">
                  <h5>{{ $t('paivays') }}</h5>
                  <p>
                    {{ $date(valmistumispyynto.vastuuhenkiloOsaamisenArvioijaKuittausaika) }}
                  </p>
                </b-col>
                <b-col>
                  <h5>{{ $t('vastuuhenkilon-nimi-ja-nimike') }}</h5>
                  <p>
                    {{ valmistumispyynto.vastuuhenkiloOsaamisenArvioijaNimi }}
                  </p>
                </b-col>
              </b-row>
            </div>
            <b-form @submit.stop.prevent="onSubmit">
              <hr />
              <h2 class="mb-3">{{ $t('maaralliset-tarkistukset') }}</h2>
              <elsa-button
                variant="outline-primary"
                class="mt-2 mb-4"
                @click="vaihdaRooli(valmistumispyynto.opintooikeusId)"
              >
                {{ $t('nayta-erikoistujan-suoritustiedot') }}
              </elsa-button>
              <h5>{{ $t('muut-koulutukset-ja-tutkinnot') }}</h5>
              <div class="mb-3">
                <p v-if="virkailijanTarkistus.yekSuorituspaiva" class="mb-0">
                  <font-awesome-icon :icon="['fas', 'check-circle']" class="text-success mr-2" />
                  {{ $t('yek-suoritettu') }}
                  {{ $date(virkailijanTarkistus.yekSuorituspaiva) }}
                </p>
                <p v-else>
                  {{ $t('yek-ei-suoritettu') }}
                </p>
              </div>
              <div class="mb-3">
                <p v-if="virkailijanTarkistus.ptlSuorituspaiva" class="mb-0">
                  <font-awesome-icon :icon="['fas', 'check-circle']" class="text-success mr-2" />
                  {{ $t('ptl-suoritettu') }}
                  {{ $date(virkailijanTarkistus.ptlSuorituspaiva) }}
                </p>
                <p v-else>
                  {{ $t('ptl-ei-suoritettu') }}
                </p>
              </div>
              <div class="mb-3">
                <p v-if="virkailijanTarkistus.aiempiElKoulutusSuorituspaiva" class="mb-0">
                  <font-awesome-icon :icon="['fas', 'check-circle']" class="text-success mr-2" />
                  {{ $t('aiempi-el-koulutus-suoritettu') }}
                  {{ $date(virkailijanTarkistus.aiempiElKoulutusSuorituspaiva) }}
                </p>
                <p v-else>
                  {{ $t('aiempi-el-koulutus-ei-suoritettu') }}
                </p>
              </div>
              <div class="mb-3">
                <p v-if="virkailijanTarkistus.ltTutkintoSuorituspaiva" class="mb-0">
                  <font-awesome-icon :icon="['fas', 'check-circle']" class="text-success mr-2" />
                  {{ $t('lt-tutkinto-suoritettu') }}
                  {{ $date(virkailijanTarkistus.ltTutkintoSuorituspaiva) }}
                </p>
                <p v-else>
                  {{ $t('lt-tutkinto-ei-suoritettu') }}
                </p>
              </div>
              <hr />
              <h2 class="mb-3">{{ $t('tyoskentelyjaksot') }}</h2>
              <b-alert variant="dark" show>
                <font-awesome-icon icon="info-circle" fixed-width class="text-muted" />
                <span>
                  {{ $t('valmistumispyynto-virkailija-tyoskentelyjaksot-huomio') }}
                </span>
              </b-alert>
              <div class="my-3">
                <h5>
                  {{ $t('terveyskeskustyo') }}
                  {{
                    $duration(
                      virkailijanTarkistus.tyoskentelyjaksotTilastot.terveyskeskusVaadittuVahintaan
                    )
                  }}
                </h5>
                <p class="mb-1">
                  {{ $t('suoritettu') }}
                  {{
                    $duration(
                      virkailijanTarkistus.tyoskentelyjaksotTilastot.terveyskeskusSuoritettu
                    )
                  }}
                </p>
                <span>
                  <font-awesome-icon :icon="['fas', 'check-circle']" class="text-success mr-2" />
                  {{ $t('kesto-ja-todistukset') }} {{ $t('tarkistettu') }}
                </span>
              </div>
              <div
                class="my-3"
                v-if="virkailijanTarkistus.yliopistosairaalanUlkopuolinenTyoTarkistettu"
              >
                <h5>
                  {{ $t('yliopistosairaalatyo') }}
                </h5>
                <p class="mb-1">
                  {{ $t('suoritettu') }}
                  {{
                    $duration(
                      virkailijanTarkistus.tyoskentelyjaksotTilastot
                        .yliopistosairaaloidenUlkopuolinenSuoritettu
                    )
                  }}
                </p>
                <p class="mb-1">
                  <font-awesome-icon :icon="['fas', 'check-circle']" class="text-success mr-2" />
                  {{ $t('kesto-poissaolot-ja-vanheneminen-tarkistettu-tyotodistuksesta') }}
                </p>
              </div>
              <div class="my-3" v-if="virkailijanTarkistus.yliopistosairaalatyoTarkistettu">
                <h5>
                  {{ $t('yliopistosairaalatyo') }}
                </h5>
                <p class="mb-1">
                  {{ $t('suoritettu') }}
                  {{ $duration(virkailijanTarkistus.tyoskentelyjaksotTilastot.yhteensaSuoritettu) }}
                </p>
                <p class="mb-1">
                  <font-awesome-icon :icon="['fas', 'check-circle']" class="text-success mr-2" />
                  {{ $t('kesto-poissaolot-ja-vanheneminen-tarkistettu-tyotodistuksesta') }}
                </p>
              </div>
              <div class="my-3" v-if="virkailijanTarkistus.kokonaistyoaikaTarkistettu">
                <h5>
                  {{ $t('kokonaistyoaika') }}
                </h5>
                <p class="mb-1">
                  {{ $t('suoritettu') }}
                  {{ $duration(virkailijanTarkistus.tyoskentelyjaksotTilastot.yhteensaSuoritettu) }}
                </p>
                <p class="mb-1">
                  <font-awesome-icon :icon="['fas', 'check-circle']" class="text-success mr-2" />
                  {{ $t('kesto-tarkistettu-tyotodistuksista') }}
                </p>
              </div>
              <hr />
              <h2 class="mb-3">{{ $t('koulutukset') }}</h2>
              <div class="my-3" v-if="virkailijanTarkistus.teoriakoulutusTarkistettu">
                <h5>
                  {{ $t('teoriakoulutus') }}
                </h5>
                <p class="mb-1">
                  {{ $t('suoritettu') }}
                  {{ Math.round(virkailijanTarkistus.teoriakoulutusSuoritettu) }} /
                  {{ Math.round(virkailijanTarkistus.teoriakoulutusVaadittu) }}
                  {{ $t('opintopistetta-lyhenne') }}
                </p>
                <p class="mb-1">
                  <font-awesome-icon :icon="['fas', 'check-circle']" class="text-success mr-2" />
                  {{ $t('todistukset-tarkistettu') }}
                </p>
              </div>
              <div class="my-3" v-if="virkailijanTarkistus.sateilusuojakoulutusVaadittu > 0">
                <h5>
                  {{ $t('sateilysuojelukoulutus') }}
                </h5>
                <p class="mb-1">
                  <font-awesome-icon :icon="['fas', 'check-circle']" class="text-success mr-2" />
                  {{ $t('suoritettu') }}
                  {{ Math.round(virkailijanTarkistus.sateilusuojakoulutusSuoritettu) }} /
                  {{ Math.round(virkailijanTarkistus.sateilusuojakoulutusVaadittu) }}
                  {{ $t('opintopistetta-lyhenne') }}
                </p>
              </div>
              <div class="my-3">
                <h5>
                  {{ $t('johtamiskoulutus') }}
                </h5>
                <p class="mb-1">
                  <font-awesome-icon :icon="['fas', 'check-circle']" class="text-success mr-2" />
                  {{ $t('suoritettu') }}
                  {{ Math.round(virkailijanTarkistus.johtamiskoulutusSuoritettu) }} /
                  {{ Math.round(virkailijanTarkistus.johtamiskoulutusVaadittu) }}
                  {{ $t('opintopistetta-lyhenne') }}
                </p>
              </div>
              <hr />
              <h2 class="mb-3">{{ $t('muut-tarkistukset') }}</h2>
              <opintosuoritus-tab
                class="mx-2"
                variant="kuulustelu"
                :suoritukset="virkailijanTarkistus.kuulustelut"
              />
              <div class="my-3">
                <h5>
                  {{ $t('koejakso') }}
                </h5>
                <p class="mb-1" v-if="virkailijanTarkistus.koejaksoHyvaksyttyPvm">
                  <font-awesome-icon :icon="['fas', 'check-circle']" class="text-success mr-2" />
                  {{ $t('hyvaksytty') }}
                  {{ $date(virkailijanTarkistus.koejaksoHyvaksyttyPvm) }}
                </p>
                <p class="mb-1" v-if="!virkailijanTarkistus.koejaksoHyvaksyttyPvm">
                  {{ $t('koejakso-ei-hyvaksytty') }}
                </p>
              </div>
              <div class="my-3">
                <h5>
                  {{ $t('vanhat-suoritukset') }}
                </h5>
                <p class="mb-1" v-if="valmistumispyynto.selvitysVanhentuneistaSuorituksista">
                  {{ $t('erikoistuvalla-on-vanhoja-yli-10v-suorituksia') }}
                </p>
                <p class="mb-1" v-if="!valmistumispyynto.selvitysVanhentuneistaSuorituksista">
                  {{ $t('erikoistuvalla-ei-vanhoja-yli-10v-suorituksia') }}
                </p>
              </div>
              <div class="my-3" v-if="valmistumispyynto.selvitysVanhentuneistaSuorituksista">
                <h5>
                  {{ $t('selvitys-vanhentuneista-suorituksista-virkailija') }}
                </h5>
                <p class="mb-1">
                  {{ valmistumispyynto.selvitysVanhentuneistaSuorituksista }}
                </p>
              </div>
              <hr />
              <h2 class="mb-3">{{ $t('huomiot') }}</h2>
              <div class="my-3">
                <h5>{{ $t('kommentit-muille-virkailijoille-ei-nayteta-muille') }}</h5>
                <p v-if="virkailijanTarkistus.kommentitVirkailijoille">
                  {{ virkailijanTarkistus.kommentitVirkailijoille }}
                </p>
                <p v-else>
                  {{ $t('ei-kommentteja') }}
                </p>
              </div>
              <div v-if="valmistumispyynto.virkailijanKuittausaika">
                <hr />
                <b-row>
                  <b-col>
                    <h3>{{ $t('tarkistanut') }}</h3>
                  </b-col>
                </b-row>
                <b-row>
                  <b-col lg="4">
                    <h5>{{ $t('paivays') }}</h5>
                    <p>{{ $date(valmistumispyynto.virkailijanKuittausaika) }}</p>
                  </b-col>
                  <b-col lg="4">
                    <h5>{{ $t('nimi-ja-nimike') }}</h5>
                    <p>
                      {{ valmistumispyynto.vastuuhenkiloOsaamisenArvioijaNimi
                      }}{{
                        valmistumispyynto.vastuuhenkiloOsaamisenArvioijaNimike
                          ? ', ' + valmistumispyynto.vastuuhenkiloOsaamisenArvioijaNimike
                          : ''
                      }}
                    </p>
                  </b-col>
                </b-row>
                <hr />
              </div>
              <elsa-form-group
                class="mt-3"
                v-if="vastuuhenkiloOsaamisenArvioijaPalauttanut"
                :label="$t('lisatiedot-erikoistujalle')"
              >
                <span>{{ valmistumispyynto.vastuuhenkiloOsaamisenArvioijaKorjausehdotus }}</span>
              </elsa-form-group>
              <hr v-if="odottaaHyvaksyntaa" />
              <div class="text-right" v-if="odottaaHyvaksyntaa">
                <elsa-button
                  variant="back"
                  :to="{
                    name: 'valmistumispyynnot'
                  }"
                >
                  {{ $t('peruuta') }}
                </elsa-button>
                <elsa-button variant="outline-primary" v-b-modal.return-to-sender class="ml-6">
                  {{ $t('palauta-erikoistujalle') }}
                </elsa-button>
                <elsa-button
                  :loading="sending"
                  @click="openConfirmationModal('confirm-send')"
                  variant="primary"
                  class="ml-2"
                >
                  {{ $t('laheta-allekirjoitettavaksi') }}
                </elsa-button>
              </div>
            </b-form>
          </div>
          <div v-else class="text-center mt-3">
            <b-spinner variant="primary" :label="$t('ladataan')" />
          </div>
        </b-col>
      </b-row>
    </b-container>
    <elsa-return-to-sender-modal
      id="return-to-sender"
      :title="$t('palauta-erikoistuvalle-muokattavaksi')"
      @submit="onReturnToSender"
    />
    <elsa-confirmation-modal
      id="confirm-send"
      :title="$t('vahvista-lomakkeen-lahetys')"
      :text="$t('valmistumispyynto-hyvaksynta-vahvistus')"
      :submitText="$t('laheta-allekirjoitettavaksi')"
      @submit="onSend"
    />
  </div>
</template>

<script lang="ts">
  import { Component, Mixins } from 'vue-property-decorator'
  import { validationMixin } from 'vuelidate'

  import { ELSA_API_LOCATION } from '@/api'
  import {
    getValmistumispyyntoHyvaksynta,
    putValmistumispyyntoHyvaksynta
  } from '@/api/vastuuhenkilo'
  import ElsaButton from '@/components/button/button.vue'
  import ErikoistuvaDetails from '@/components/erikoistuva-details/erikoistuva-details.vue'
  import ElsaFormGroup from '@/components/form-group/form-group.vue'
  import ElsaConfirmationModal from '@/components/modal/confirmation-modal.vue'
  import ElsaReturnToSenderModal from '@/components/modal/return-to-sender-modal.vue'
  import ValmistumispyyntoMixin from '@/mixins/valmistumispyynto'
  import {
    ValmistumispyyntoArviointienTila,
    ValmistumispyyntoVirkailijanTarkistus,
    ValmistumispyyntoHyvaksynta
  } from '@/types'
  import { toastSuccess, toastFail } from '@/utils/toast'
  import OpintosuoritusTab from '@/views/opintosuoritukset/opintosuoritus-tab.vue'

  @Component({
    components: {
      ElsaButton,
      ElsaFormGroup,
      ErikoistuvaDetails,
      ElsaConfirmationModal,
      ElsaReturnToSenderModal,
      OpintosuoritusTab
    }
  })
  export default class ValmistumispyynnonHyvaksynta extends Mixins<ValmistumispyyntoMixin>(
    validationMixin,
    ValmistumispyyntoMixin
  ) {
    items = [
      {
        text: this.$t('etusivu'),
        to: { name: 'etusivu' }
      },
      {
        text: this.$t('valmistumispyynnot'),
        to: { name: 'valmistumispyynnot' }
      },
      {
        text: this.$t('valmistumispyynnon-hyvaksynta'),
        active: true
      }
    ]

    form: ValmistumispyyntoHyvaksynta = {
      id: null,
      korjausehdotus: null
    }

    virkailijanTarkistus: ValmistumispyyntoVirkailijanTarkistus = {
      id: null,
      yekSuoritettu: false,
      yekSuorituspaiva: null,
      ptlSuoritettu: false,
      ptlSuorituspaiva: null,
      aiempiElKoulutusSuoritettu: false,
      aiempiElKoulutusSuorituspaiva: null,
      ltTutkintoSuoritettu: false,
      ltTutkintoSuorituspaiva: null,
      virkailijanSaate: null,
      tyoskentelyjaksotTilastot: null,
      terveyskeskustyoHyvaksyttyPvm: null,
      terveyskeskustyoHyvaksyntaId: null,
      terveyskeskustyoOpintosuoritusId: null,
      yliopistosairaalanUlkopuolinenTyoTarkistettu: false,
      yliopistosairaalatyoTarkistettu: false,
      kokonaistyoaikaTarkistettu: false,
      teoriakoulutusSuoritettu: null,
      teoriakoulutusVaadittu: null,
      teoriakoulutusTarkistettu: false,
      sateilusuojakoulutusSuoritettu: null,
      sateilusuojakoulutusVaadittu: null,
      johtamiskoulutusSuoritettu: null,
      johtamiskoulutusVaadittu: null,
      kuulustelut: null,
      koejaksoHyvaksyttyPvm: null,
      suoritustenTila: null,
      kommentitVirkailijoille: null,
      lisatiedotVastuuhenkilolle: null,
      keskenerainen: false
    }

    valmistumispyyntoArviointienTila: ValmistumispyyntoArviointienTila | null = null
    loading = true
    sending = false

    async mounted() {
      const valmistumispyyntoId = this.$route?.params?.valmistumispyyntoId
      if (valmistumispyyntoId) {
        try {
          await getValmistumispyyntoHyvaksynta(parseInt(valmistumispyyntoId)).then((response) => {
            this.virkailijanTarkistus = response.data
            if (response.data.valmistumispyynto) {
              this.valmistumispyynto = response.data.valmistumispyynto
            }
          })
          this.loading = false
        } catch {
          toastFail(this, this.$t('valmistumispyynnon-hakeminen-epaonnistui'))
          this.$router.replace({ name: 'valmistumispyynnot' })
        }
      }
    }

    vaihdaRooli(id: number) {
      window.location.href = `${ELSA_API_LOCATION}/api/login/impersonate?opintooikeusId=${id}&originalUrl=${window.location.href}`
    }

    openConfirmationModal(modalId: string) {
      return this.$bvModal.show(modalId)
    }

    async onSend() {
      try {
        this.sending = true
        if (this.valmistumispyynto.id) {
          this.form = (await putValmistumispyyntoHyvaksynta({ id: this.valmistumispyynto.id })).data
          this.$emit('skipRouteExitConfirm', true)
          toastSuccess(this, this.$t('valmistumispyynto-hyvaksynta-lahetys-onnistui'))
          this.$router.replace({ name: 'valmistumispyynnot' })
        }
      } catch (err) {
        toastFail(this, this.$t('valmistumispyynto-hyvaksynta-lahetys-epaonnistui'))
      }
      this.sending = false
    }

    async onReturnToSender(korjausehdotus: string) {
      try {
        this.sending = true
        if (this.valmistumispyynto.id) {
          this.form = (
            await putValmistumispyyntoHyvaksynta({
              id: this.valmistumispyynto.id,
              korjausehdotus: korjausehdotus
            })
          ).data
          this.$emit('skipRouteExitConfirm', true)
          toastSuccess(this, this.$t('valmistumispyynto-hyvaksynta-lahetys-palautettu'))
          this.$router.replace({ name: 'valmistumispyynnot' })
        }
      } catch (err) {
        toastFail(this, this.$t('valmistumispyynto-hyvaksynta-palautus-epaonnistui'))
      }
      this.sending = false
    }
  }
</script>

<style lang="scss" scoped>
  .valmistumispyynto {
    max-width: 970px;
  }

  .allekirjoitus-pvm {
    min-width: 7rem;
  }
</style>
