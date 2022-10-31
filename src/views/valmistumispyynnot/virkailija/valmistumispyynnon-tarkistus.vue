<template>
  <div class="vp">
    <b-breadcrumb :items="items" class="mb-0" />
    <b-container fluid>
      <b-row lg>
        <b-col>
          <h1>{{ $t('valmistumispyynto') }}</h1>
          <div v-if="!loading">
            <div v-if="editable">
              <p class="mt-1 mb-3">
                {{ $t('valmistumispyynto-virkailijan-ingressi') }}
              </p>
            </div>
            <div class="mt-3" v-else>
              <b-alert :show="!allekirjoitettu" variant="dark">
                <div class="d-flex flex-row">
                  <em class="align-middle">
                    <font-awesome-icon
                      :icon="['fas', 'info-circle']"
                      class="text-muted text-size-md mr-2"
                    />
                  </em>
                  <div>
                    <span v-if="odottaaHyvaksyntaa">
                      {{ $t('valmistumispyynto-tarkistettu-odottaa-vastuuhenkiloa') }}
                    </span>
                    <span
                      v-if="odottaaHyvaksyntaa && valmistumispyynto.virkailijanSaate"
                      class="d-block"
                    >
                      <strong>{{ $t('lisatiedot-vastuuhenkilolle') }}:</strong>
                      {{ valmistumispyynto.virkailijanSaate }}
                    </span>
                    <span v-else-if="virkailijaPalauttanut">
                      {{
                        $t(
                          'valmistumispyynto-osaaminen-arvioitu-palautettu-erikoistujalle-virkailijan-toimesta'
                        )
                      }}
                    </span>
                    <span v-else-if="vastuuhenkiloHyvaksyjaPalauttanut">
                      {{
                        $t(
                          'valmistumispyynto-osaaminen-arvioitu-palautettu-erikoistujalle-hyvaksyjan-toimesta'
                        )
                      }}
                    </span>
                    <span v-else-if="odottaaAllekirjoituksia">
                      {{ $t('valmistumispyynto-osaaminen-arvioitu-odottaa-allekirjoituksia') }}
                    </span>
                    <span
                      v-if="virkailijaPalauttanut || vastuuhenkiloHyvaksyjaPalauttanut"
                      class="d-block"
                    >
                      {{ $t('syy') }}&nbsp;
                      <span>
                        {{ korjausehdotus }}
                      </span>
                    </span>
                  </div>
                </div>
              </b-alert>
              <b-alert :show="allekirjoitettu" variant="success">
                <div class="d-flex flex-row">
                  <em class="align-middle">
                    <font-awesome-icon :icon="['fas', 'check-circle']" class="mr-2" />
                  </em>
                  <div>
                    <span>
                      {{ $t('valmistumispyynto-osaaminen-arvioitu-allekirjoitettu') }}
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
              <div class="mb-3" v-if="yekSuorituspaivaTila">
                <p v-if="form.yekSuorituspaiva" class="mb-0">
                  <font-awesome-icon :icon="['fas', 'check-circle']" class="text-success mr-2" />
                  {{ $t('yek-suoritettu') }}
                  {{ $date(form.yekSuorituspaiva) }}
                </p>
                <p v-else>
                  {{ $t('yek-ei-suoritettu') }}
                </p>
              </div>
              <div class="my-3" v-if="editable && !yekSuorituspaivaTila">
                <b-form-checkbox
                  v-model="form.yekSuoritettu"
                  @input="$emit('skipRouteExitConfirm', false)"
                >
                  {{ $t('yek-suoritettu') }}
                </b-form-checkbox>
                <elsa-form-group
                  :label="$t('suorituspaiva')"
                  class="col-xs-6 col-sm-4 col-md-4 pr-sm-3 ml-2 mt-2"
                  v-if="form.yekSuoritettu"
                >
                  <template v-slot="{ uid }">
                    <elsa-form-datepicker
                      :id="uid"
                      v-model="form.yekSuorituspaiva"
                      @input="$emit('skipRouteExitConfirm', false)"
                    ></elsa-form-datepicker>
                  </template>
                </elsa-form-group>
              </div>
              <div class="mb-3" v-if="ptlSuorituspaivaTila">
                <p v-if="form.ptlSuorituspaiva" class="mb-0">
                  <font-awesome-icon :icon="['fas', 'check-circle']" class="text-success mr-2" />
                  {{ $t('ptl-suoritettu') }}
                  {{ $date(form.ptlSuorituspaiva) }}
                </p>
                <p v-else>
                  {{ $t('ptl-ei-suoritettu') }}
                </p>
              </div>
              <div class="my-3" v-if="editable && !ptlSuorituspaivaTila">
                <b-form-checkbox
                  v-model="form.ptlSuoritettu"
                  @input="$emit('skipRouteExitConfirm', false)"
                >
                  {{ $t('ptl-suoritettu') }}
                </b-form-checkbox>
                <elsa-form-group
                  :label="$t('suorituspaiva')"
                  class="col-xs-6 col-sm-4 col-md-4 pr-sm-3 ml-2 mt-2"
                  v-if="form.ptlSuoritettu"
                >
                  <template v-slot="{ uid }">
                    <elsa-form-datepicker
                      :id="uid"
                      v-model="form.ptlSuorituspaiva"
                      @input="$emit('skipRouteExitConfirm', false)"
                    ></elsa-form-datepicker>
                  </template>
                </elsa-form-group>
              </div>
              <div class="mb-3" v-if="aiempiElKoulutusSuorituspaivaTila">
                <p v-if="form.aiempiElKoulutusSuorituspaiva" class="mb-0">
                  <font-awesome-icon :icon="['fas', 'check-circle']" class="text-success mr-2" />
                  {{ $t('aiempi-el-koulutus-suoritettu') }}
                  {{ $date(form.aiempiElKoulutusSuorituspaiva) }}
                </p>
                <p v-else>
                  {{ $t('aiempi-el-koulutus-ei-suoritettu') }}
                </p>
              </div>
              <div class="my-3" v-if="editable && !aiempiElKoulutusSuorituspaivaTila">
                <b-form-checkbox
                  v-model="form.aiempiElKoulutusSuoritettu"
                  @input="$emit('skipRouteExitConfirm', false)"
                >
                  {{ $t('aiempi-el-koulutus-suoritettu') }}
                </b-form-checkbox>
                <elsa-form-group
                  :label="$t('suorituspaiva')"
                  class="col-xs-6 col-sm-4 col-md-4 pr-sm-3 ml-2 mt-2"
                  v-if="form.aiempiElKoulutusSuoritettu"
                >
                  <template v-slot="{ uid }">
                    <elsa-form-datepicker
                      :id="uid"
                      v-model="form.aiempiElKoulutusSuorituspaiva"
                      @input="$emit('skipRouteExitConfirm', false)"
                    ></elsa-form-datepicker>
                  </template>
                </elsa-form-group>
              </div>
              <div class="mb-3" v-if="ltTutkintoSuorituspaivaTila">
                <p v-if="form.ltTutkintoSuorituspaiva" class="mb-0">
                  <font-awesome-icon :icon="['fas', 'check-circle']" class="text-success mr-2" />
                  {{ $t('lt-tutkinto-suoritettu') }}
                  {{ $date(form.ltTutkintoSuorituspaiva) }}
                </p>
                <p v-else>
                  {{ $t('lt-tutkinto-ei-suoritettu') }}
                </p>
              </div>
              <div class="my-3" v-if="editable && !ltTutkintoSuorituspaivaTila">
                <b-form-checkbox
                  v-model="form.ltTutkintoSuoritettu"
                  @input="$emit('skipRouteExitConfirm', false)"
                >
                  {{ $t('lt-tutkinto-suoritettu') }}
                </b-form-checkbox>
                <elsa-form-group
                  :label="$t('suorituspaiva')"
                  class="col-xs-6 col-sm-4 col-md-4 pr-sm-3 ml-2 mt-2"
                  v-if="form.ltTutkintoSuoritettu"
                >
                  <template v-slot="{ uid }">
                    <elsa-form-datepicker
                      :id="uid"
                      v-model="form.ltTutkintoSuorituspaiva"
                      @input="$emit('skipRouteExitConfirm', false)"
                    ></elsa-form-datepicker>
                  </template>
                </elsa-form-group>
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
                  {{ $duration(form.tyoskentelyjaksotTilastot.terveyskeskusVaadittuVahintaan) }}
                </h5>
                <p class="mb-1">
                  {{ $t('suoritettu') }}
                  {{ $duration(form.tyoskentelyjaksotTilastot.terveyskeskusSuoritettu) }}
                </p>
                <span>
                  <font-awesome-icon :icon="['fas', 'check-circle']" class="text-success mr-2" />
                  {{ $t('kesto-ja-todistukset') }} {{ $t('tarkistettu') }}
                </span>
              </div>
              <elsa-form-group
                :label="$t('yliopistosairaalan-ulkopuolinen-tyo')"
                class="mt-3"
                :required="true"
                v-if="editable"
              >
                <template v-slot="{ uid }">
                  <p class="mb-1">
                    {{ $t('suoritettu') }}
                    {{
                      $duration(
                        form.tyoskentelyjaksotTilastot.yliopistosairaaloidenUlkopuolinenSuoritettu
                      )
                    }}
                  </p>
                  <b-form-checkbox
                    :id="uid"
                    :state="validateState('yliopistosairaalanUlkopuolinenTyoTarkistettu')"
                    v-model="form.yliopistosairaalanUlkopuolinenTyoTarkistettu"
                    @input="$emit('skipRouteExitConfirm', false)"
                  >
                    {{ $t('kesto-poissaolot-ja-vanheneminen-tarkistettu-tyotodistuksesta') }}
                  </b-form-checkbox>
                </template>
              </elsa-form-group>
              <div
                class="my-3"
                v-if="!editable && form.yliopistosairaalanUlkopuolinenTyoTarkistettu"
              >
                <h5>
                  {{ $t('yliopistosairaalatyo') }}
                </h5>
                <p class="mb-1">
                  {{ $t('suoritettu') }}
                  {{
                    $duration(
                      form.tyoskentelyjaksotTilastot.yliopistosairaaloidenUlkopuolinenSuoritettu
                    )
                  }}
                </p>
                <p class="mb-1">
                  <font-awesome-icon :icon="['fas', 'check-circle']" class="text-success mr-2" />
                  {{ $t('kesto-poissaolot-ja-vanheneminen-tarkistettu-tyotodistuksesta') }}
                </p>
              </div>
              <elsa-form-group
                :label="$t('yliopistosairaalatyo')"
                class="mt-3"
                :required="true"
                v-if="editable"
              >
                <template v-slot="{ uid }">
                  <p class="mb-1">
                    {{ $t('suoritettu') }}
                    {{ $duration(form.tyoskentelyjaksotTilastot.yliopistosairaalaSuoritettu) }}
                  </p>
                  <b-form-checkbox
                    :id="uid"
                    :state="validateState('yliopistosairaalatyoTarkistettu')"
                    v-model="form.yliopistosairaalatyoTarkistettu"
                    @input="$emit('skipRouteExitConfirm', false)"
                  >
                    {{ $t('kesto-poissaolot-ja-vanheneminen-tarkistettu-tyotodistuksesta') }}
                  </b-form-checkbox>
                </template>
              </elsa-form-group>
              <div class="my-3" v-if="!editable && form.yliopistosairaalatyoTarkistettu">
                <h5>
                  {{ $t('yliopistosairaalatyo') }}
                </h5>
                <p class="mb-1">
                  {{ $t('suoritettu') }}
                  {{ $duration(form.tyoskentelyjaksotTilastot.yhteensaSuoritettu) }}
                </p>
                <p class="mb-1">
                  <font-awesome-icon :icon="['fas', 'check-circle']" class="text-success mr-2" />
                  {{ $t('kesto-poissaolot-ja-vanheneminen-tarkistettu-tyotodistuksesta') }}
                </p>
              </div>
              <elsa-form-group
                :label="$t('kokonaistyoaika')"
                class="mt-3"
                :required="true"
                v-if="editable"
              >
                <template v-slot="{ uid }">
                  <p class="mb-1">
                    {{ $t('suoritettu') }}
                    {{ $duration(form.tyoskentelyjaksotTilastot.yhteensaSuoritettu) }}
                  </p>
                  <b-form-checkbox
                    :id="uid"
                    :state="validateState('kokonaistyoaikaTarkistettu')"
                    v-model="form.kokonaistyoaikaTarkistettu"
                    @input="$emit('skipRouteExitConfirm', false)"
                  >
                    {{ $t('kesto-tarkistettu-tyotodistuksista') }}
                  </b-form-checkbox>
                </template>
              </elsa-form-group>
              <div class="my-3" v-if="!editable && form.kokonaistyoaikaTarkistettu">
                <h5>
                  {{ $t('kokonaistyoaika') }}
                </h5>
                <p class="mb-1">
                  {{ $t('suoritettu') }}
                  {{ $duration(form.tyoskentelyjaksotTilastot.yhteensaSuoritettu) }}
                </p>
                <p class="mb-1">
                  <font-awesome-icon :icon="['fas', 'check-circle']" class="text-success mr-2" />
                  {{ $t('kesto-tarkistettu-tyotodistuksista') }}
                </p>
              </div>
              <hr />
              <h2 class="mb-3">{{ $t('koulutukset') }}</h2>
              <elsa-form-group
                :label="$t('teoriakoulutus')"
                class="mt-3"
                :required="true"
                v-if="editable"
              >
                <template v-slot="{ uid }">
                  <p class="mb-1">
                    {{ $t('suoritettu') }}
                    {{ Math.round(form.teoriakoulutusSuoritettu) }} /
                    {{ Math.round(form.teoriakoulutusVaadittu) }}
                    {{ $t('opintopistetta-lyhenne') }}
                  </p>
                  <b-form-checkbox
                    :id="uid"
                    v-model="form.teoriakoulutusTarkistettu"
                    :state="validateState('teoriakoulutusTarkistettu')"
                    @input="$emit('skipRouteExitConfirm', false)"
                  >
                    {{ $t('todistukset-tarkistettu') }}
                  </b-form-checkbox>
                </template>
              </elsa-form-group>
              <div class="my-3" v-if="!editable && form.teoriakoulutusTarkistettu">
                <h5>
                  {{ $t('teoriakoulutus') }}
                </h5>
                <p class="mb-1">
                  {{ $t('suoritettu') }}
                  {{ Math.round(form.teoriakoulutusSuoritettu) }} /
                  {{ Math.round(form.teoriakoulutusVaadittu) }}
                  {{ $t('opintopistetta-lyhenne') }}
                </p>
                <p class="mb-1">
                  <font-awesome-icon :icon="['fas', 'check-circle']" class="text-success mr-2" />
                  {{ $t('todistukset-tarkistettu') }}
                </p>
              </div>
              <div class="my-3" v-if="form.sateilusuojakoulutusVaadittu > 0">
                <h5>
                  {{ $t('sateilysuojelukoulutus') }}
                </h5>
                <p class="mb-1">
                  <font-awesome-icon :icon="['fas', 'check-circle']" class="text-success mr-2" />
                  {{ $t('suoritettu') }}
                  {{ Math.round(form.sateilusuojakoulutusSuoritettu) }} /
                  {{ Math.round(form.sateilusuojakoulutusVaadittu) }}
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
                  {{ Math.round(form.johtamiskoulutusSuoritettu) }} /
                  {{ Math.round(form.johtamiskoulutusVaadittu) }}
                  {{ $t('opintopistetta-lyhenne') }}
                </p>
              </div>
              <hr />
              <h2 class="mb-3">{{ $t('muut-tarkistukset') }}</h2>
              <opintosuoritus-tab
                class="mx-2"
                variant="kuulustelu"
                :suoritukset="form.kuulustelut"
              />
              <div class="my-3">
                <h5>
                  {{ $t('koejakso') }}
                </h5>
                <p class="mb-1" v-if="form.koejaksoHyvaksyttyPvm">
                  <font-awesome-icon :icon="['fas', 'check-circle']" class="text-success mr-2" />
                  {{ $t('hyvaksytty') }}
                  {{ $date(form.koejaksoHyvaksyttyPvm) }}
                </p>
                <p class="mb-1" v-if="!form.koejaksoHyvaksyttyPvm">
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
              <elsa-form-group
                :label="$t('kommentit-muille-virkailijoille-ei-nayteta-muille')"
                v-if="editable"
              >
                <template v-slot="{ uid }">
                  <b-form-textarea
                    :id="uid"
                    v-model="form.kommentitVirkailijoille"
                    rows="7"
                    class="textarea-min-height"
                  ></b-form-textarea>
                </template>
              </elsa-form-group>
              <div class="my-3" v-if="!editable">
                <h5>{{ $t('kommentit-muille-virkailijoille-ei-nayteta-muille') }}</h5>
                <p v-if="form.kommentitVirkailijoille">
                  {{ form.kommentitVirkailijoille }}
                </p>
                <p v-else>
                  {{ $t('ei-kommentteja') }}
                </p>
              </div>
              <div v-if="valmistumispyynto.virkailijanKuittausaika && !editable">
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
              <hr v-if="odottaaOsaamisenArviointia" />
              <div class="text-right" v-if="editable">
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
                  style="min-width: 14rem"
                  variant="outline-primary"
                  class="ml-2"
                  v-b-modal.confirm-save
                >
                  {{ $t('tallenna-keskeneraisena') }}
                </elsa-button>
                <elsa-button
                  :loading="sending"
                  @click="onValidateAndConfirmSend('confirm-send')"
                  variant="primary"
                  class="ml-2"
                >
                  {{ $t('hyvaksy-laheta') }}
                </elsa-button>
              </div>
            </b-form>
          </div>
          <div v-else class="text-center mt-3">
            <b-spinner variant="primary" :label="$t('ladataan')" />
          </div>
        </b-col>
      </b-row>
      <b-row>
        <elsa-form-error :active="this.$v.$anyError" />
      </b-row>
    </b-container>
    <elsa-confirmation-modal
      id="confirm-send"
      :title="$t('vahvista-lomakkeen-lahetys')"
      :text="$t('lahetyksen-jalkeen-vastuuhenkilo-hyvaksynta')"
      :submitText="$t('hyvaksy-laheta')"
      @submit="onSend"
    >
      <template #modal-content>
        <elsa-form-group :label="$t('lisatiedot-vastuuhenkilolle')">
          <template v-slot="{ uid }">
            <b-form-textarea
              :id="uid"
              v-model="form.lisatiedotVastuuhenkilolle"
              rows="7"
            ></b-form-textarea>
          </template>
        </elsa-form-group>
      </template>
    </elsa-confirmation-modal>
    <elsa-return-to-sender-modal
      id="return-to-sender"
      :title="$t('palauta-erikoistuvalle-muokattavaksi')"
      @submit="onReturnToSender"
    />
    <elsa-confirmation-modal
      id="confirm-save"
      :title="$t('vahvista-tallennus-keskeneraisena-title')"
      :text="$t('vahvista-tallennus-keskeneraisena-body')"
      :submitText="$t('tallenna-keskeneraisena')"
      @submit="saveAndExit"
    />
  </div>
</template>

<script lang="ts">
  import { Component, Mixins } from 'vue-property-decorator'
  import { validationMixin } from 'vuelidate'

  import { ELSA_API_LOCATION } from '@/api'
  import { getValmistumispyyntoTarkistus, putValmistumispyynto } from '@/api/virkailija'
  import ElsaButton from '@/components/button/button.vue'
  import ElsaFormDatepicker from '@/components/datepicker/datepicker.vue'
  import ErikoistuvaDetails from '@/components/erikoistuva-details/erikoistuva-details.vue'
  import ElsaFormError from '@/components/form-error/form-error.vue'
  import ElsaFormGroup from '@/components/form-group/form-group.vue'
  import ElsaConfirmationModal from '@/components/modal/confirmation-modal.vue'
  import ElsaReturnToSenderModal from '@/components/modal/return-to-sender-modal.vue'
  import ValmistumispyyntoMixin from '@/mixins/valmistumispyynto'
  import {
    ValmistumispyyntoArviointienTila,
    ValmistumispyyntoVirkailijanTarkistus,
    ValmistumispyynnonVirkailijanTarkistusLomake
  } from '@/types'
  import { ValmistumispyynnonTila } from '@/utils/constants'
  import { toastSuccess, toastFail } from '@/utils/toast'
  import OpintosuoritusTab from '@/views/opintosuoritukset/opintosuoritus-tab.vue'

  @Component({
    components: {
      ElsaButton,
      ElsaFormGroup,
      ElsaFormDatepicker,
      ElsaFormError,
      ErikoistuvaDetails,
      ElsaConfirmationModal,
      ElsaReturnToSenderModal,
      OpintosuoritusTab
    }
  })
  export default class ValmistumispyynnonTarkistus extends Mixins<ValmistumispyyntoMixin>(
    validationMixin,
    ValmistumispyyntoMixin
  ) {
    validations() {
      return {
        form: {
          yliopistosairaalanUlkopuolinenTyoTarkistettu: {
            checked: (value: boolean) => value === true
          },
          yliopistosairaalatyoTarkistettu: { checked: (value: boolean) => value === true },
          kokonaistyoaikaTarkistettu: { checked: (value: boolean) => value === true },
          teoriakoulutusTarkistettu: { checked: (value: boolean) => value === true }
        }
      }
    }

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
        text: this.$t('valmistumispyynto'),
        active: true
      }
    ]

    form: ValmistumispyyntoVirkailijanTarkistus = {
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
    response: ValmistumispyynnonVirkailijanTarkistusLomake | null = null
    loading = true
    sending = false
    editable = true
    draft = false
    yekSuorituspaivaTila = false
    ptlSuorituspaivaTila = false
    aiempiElKoulutusSuorituspaivaTila = false
    ltTutkintoSuorituspaivaTila = false

    async mounted() {
      const valmistumispyyntoId = this.$route?.params?.valmistumispyyntoId
      if (valmistumispyyntoId) {
        try {
          await getValmistumispyyntoTarkistus(parseInt(valmistumispyyntoId)).then((response) => {
            this.form = response.data
            if (response.data.valmistumispyynto) {
              this.valmistumispyynto = response.data.valmistumispyynto
            }
            if (
              this.valmistumispyynto.tila ==
                ValmistumispyynnonTila.ODOTTAA_VASTUUHENKILON_HYVAKSYNTAA ||
              this.valmistumispyynto.tila ==
                ValmistumispyynnonTila.VIRKAILIJAN_TARKASTUS_PALAUTETTU ||
              this.valmistumispyynto.tila == ValmistumispyynnonTila.ODOTTAA_ALLEKIRJOITUKSIA
            ) {
              this.editable = false
            }
            if (
              this.valmistumispyynto.tila == ValmistumispyynnonTila.VIRKAILIJAN_TARKASTUS_KESKEN
            ) {
              this.draft = true
              this.editable = true
            }
            if (!this.draft || !this.editable) {
              this.yekSuorituspaivaTila = response.data.yekSuorituspaiva ? true : false
              this.ptlSuorituspaivaTila = response.data.ptlSuorituspaiva ? true : false
              this.aiempiElKoulutusSuorituspaivaTila = response.data.aiempiElKoulutusSuorituspaiva
                ? true
                : false
              this.ltTutkintoSuorituspaivaTila = response.data.ltTutkintoSuorituspaiva
                ? true
                : false
            } else {
              this.yekSuorituspaivaTila = false
              this.ptlSuorituspaivaTila = false
              this.aiempiElKoulutusSuorituspaivaTila = false
              this.ltTutkintoSuorituspaivaTila = false
            }
          })
          this.loading = false
        } catch {
          toastFail(this, this.$t('valmistumispyynnon-hakeminen-epaonnistui'))
          this.loading = false
          this.$router.replace({ name: 'valmistumispyynnot' })
        }
      }
    }

    vaihdaRooli(id: number) {
      window.location.href = `${ELSA_API_LOCATION}/api/login/impersonate?opintooikeusId=${id}`
    }

    validateState(name: string) {
      const { $dirty, $error } = this.$v.form[name] as any
      return $dirty ? ($error ? false : null) : null
    }

    validateForm(): boolean {
      this.$v.form.$touch()
      return !this.$v.$anyError
    }

    onValidateAndConfirmSend(modalId: string) {
      if (!this.validateForm()) return
      return this.$bvModal.show(modalId)
    }

    saveAndExit() {
      this.form.keskenerainen = true
      this.onSend()
    }

    async onSend() {
      try {
        this.sending = true
        if (this.valmistumispyynto?.id) {
          this.form.id = this.valmistumispyynto.id
        }
        const form: ValmistumispyynnonVirkailijanTarkistusLomake = {
          id: this.form.id,
          yekSuoritettu: this.form.yekSuoritettu,
          yekSuorituspaiva: this.form.yekSuorituspaiva,
          ptlSuoritettu: this.form.ptlSuoritettu,
          ptlSuorituspaiva: this.form.ptlSuorituspaiva,
          aiempiElKoulutusSuoritettu: this.form.aiempiElKoulutusSuoritettu,
          aiempiElKoulutusSuorituspaiva: this.form.aiempiElKoulutusSuorituspaiva,
          ltTutkintoSuoritettu: this.form.ltTutkintoSuoritettu,
          ltTutkintoSuorituspaiva: this.form.ltTutkintoSuorituspaiva,
          yliopistosairaalanUlkopuolinenTyoTarkistettu:
            this.form.yliopistosairaalanUlkopuolinenTyoTarkistettu,
          yliopistosairaalatyoTarkistettu: this.form.yliopistosairaalatyoTarkistettu,
          kokonaistyoaikaTarkistettu: this.form.kokonaistyoaikaTarkistettu,
          teoriakoulutusTarkistettu: this.form.teoriakoulutusTarkistettu,
          kommentitVirkailijoille: this.form.kommentitVirkailijoille,
          lisatiedotVastuuhenkilolle: this.form.lisatiedotVastuuhenkilolle,
          keskenerainen: this.form.keskenerainen
        }
        this.response = (await putValmistumispyynto(form)).data
        this.$emit('skipRouteExitConfirm', true)
        if (this.form.keskenerainen) {
          toastSuccess(this, this.$t('virkailijan-tarkistus-tallennettu-keskeneraisena'))
        } else {
          toastSuccess(this, this.$t('virkailijan-tarkistus-lahetetty-onnistuneesti'))
        }
        this.$router.replace({ name: 'valmistumispyynnot' })
      } catch (err) {
        toastFail(this, this.$t('virkailijan-tarkistus-lahetys-epaonnistui'))
      }
      this.sending = false
    }

    async onReturnToSender(korjausehdotus: string) {
      if (this.valmistumispyynto?.id) {
        this.form.id = this.valmistumispyynto.id
      }
      const form: ValmistumispyynnonVirkailijanTarkistusLomake = {
        id: this.form.id,
        yekSuoritettu: this.form.yekSuoritettu,
        yekSuorituspaiva: this.form.yekSuorituspaiva,
        ptlSuoritettu: this.form.ptlSuoritettu,
        ptlSuorituspaiva: this.form.ptlSuorituspaiva,
        aiempiElKoulutusSuoritettu: this.form.aiempiElKoulutusSuoritettu,
        aiempiElKoulutusSuorituspaiva: this.form.aiempiElKoulutusSuorituspaiva,
        ltTutkintoSuoritettu: this.form.ltTutkintoSuoritettu,
        ltTutkintoSuorituspaiva: this.form.ltTutkintoSuorituspaiva,
        yliopistosairaalanUlkopuolinenTyoTarkistettu:
          this.form.yliopistosairaalanUlkopuolinenTyoTarkistettu,
        yliopistosairaalatyoTarkistettu: this.form.yliopistosairaalatyoTarkistettu,
        kokonaistyoaikaTarkistettu: this.form.kokonaistyoaikaTarkistettu,
        teoriakoulutusTarkistettu: this.form.teoriakoulutusTarkistettu,
        kommentitVirkailijoille: this.form.kommentitVirkailijoille,
        keskenerainen: false,
        korjausehdotus: korjausehdotus
      }
      try {
        this.sending = true
        this.response = (await putValmistumispyynto(form)).data
        this.$emit('skipRouteExitConfirm', true)
        toastSuccess(this, this.$t('virkailijan-tarkistus-palautettu-onnistuneesti'))
        this.$router.replace({ name: 'valmistumispyynnot' })
      } catch (err) {
        toastFail(this, this.$t('virkailijan-tarkistus-palautus-epaonnistui'))
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
