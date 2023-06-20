<template>
  <div class="col-lg-8 px-0">
    <b-breadcrumb :items="items" class="mb-0" />

    <b-container fluid>
      <h1 class="mb-3">{{ $t('erikoisalan-vastuuhenkilon-arvio-koejaksosta') }}</h1>
      <div v-if="!loading && vastuuhenkilonArvio">
        <b-row lg>
          <b-col>
            <b-alert :show="editable" variant="dark" class="mt-3 mb-0">
              <div class="d-flex flex-row">
                <em class="align-middle">
                  <font-awesome-icon :icon="['fas', 'info-circle']" class="text-muted mr-2" />
                </em>
                <div>
                  {{ $t('vastuuhenkilon-arvio-ingressi-vastuuhenkilo') }}
                  <div v-show="vastuuhenkilonArvio.lisatiedotVirkailijalta">
                    <p class="mb-2 mt-3">
                      <strong>{{ $t('lisatiedot-virkailijalta') }}:</strong>
                      {{ vastuuhenkilonArvio.lisatiedotVirkailijalta }}
                    </p>
                  </div>
                </div>
              </div>
            </b-alert>
            <b-alert :show="returned" variant="dark" class="mt-3">
              <div class="d-flex flex-row">
                <em class="align-middle">
                  <font-awesome-icon :icon="['fas', 'info-circle']" class="text-muted mr-2" />
                </em>
                <div>
                  {{ $t('vastuuhenkilon-arvio-tila-palautettu-korjattavaksi-virkailija') }}
                  <span class="d-block">
                    {{ $t('syy') }} {{ vastuuhenkilonArvio.vastuuhenkilonKorjausehdotus }}
                  </span>
                </div>
              </div>
            </b-alert>
            <b-alert :show="waitingForSignatures" variant="dark" class="mt-3">
              <div class="d-flex flex-row">
                <em class="align-middle">
                  <font-awesome-icon :icon="['fas', 'info-circle']" class="text-muted mr-2" />
                </em>
                <div>
                  {{ $t('vastuuhenkilon-arvio-tila-odottaa-allekirjoitusta') }}
                </div>
              </div>
            </b-alert>
            <b-alert variant="success" :show="acceptedByEveryone">
              <div class="d-flex flex-row">
                <em class="align-middle">
                  <font-awesome-icon :icon="['fas', 'check-circle']" class="mr-2" />
                </em>
                {{ $t('koejakso-on-hyvaksytty-allekirjoitettu-vastuuhenkilo-erikoistuja') }}
              </div>
            </b-alert>
          </b-col>
        </b-row>
        <hr />
        <erikoistuva-details
          :avatar="erikoistuvanAvatar"
          :name="erikoistuvanNimi"
          :erikoisala="vastuuhenkilonArvio.erikoistuvanErikoisala"
          :opiskelijatunnus="vastuuhenkilonArvio.erikoistuvanOpiskelijatunnus"
          :yliopisto="vastuuhenkilonArvio.erikoistuvanYliopisto"
          :show-birthdate="false"
        />
        <hr />
        <div v-if="vastuuhenkilonArvio.koejaksonSuorituspaikat">
          <div
            v-for="(sp, index) in vastuuhenkilonArvio.koejaksonSuorituspaikat.tyoskentelyjaksot"
            :key="index"
          >
            <b-row>
              <b-col>
                <h3>{{ $t('koejakson-suorituspaikka') }}</h3>
              </b-col>
            </b-row>
            <b-row>
              <b-col>
                <h5>{{ $t('tyyppi') }}</h5>
                <p>
                  {{
                    displayTyoskentelypaikkaTyyppiLabel(
                      sp.tyoskentelypaikka.muuTyyppi,
                      sp.tyoskentelypaikka.tyyppi
                    )
                  }}
                </p>
              </b-col>
            </b-row>
            <b-row>
              <b-col>
                <h5>{{ $t('tyoskentelypaikka') }}</h5>
                <p>{{ sp.tyoskentelypaikka.nimi }}</p>
              </b-col>
            </b-row>
            <b-row>
              <b-col>
                <h5>{{ $t('kunta') }}</h5>
                <p>{{ sp.tyoskentelypaikka.kunta.abbreviation }}</p>
              </b-col>
            </b-row>
            <b-row>
              <b-col>
                <h5>{{ $t('tyoaika-taydesta-tyopaivasta-prosentti') }}</h5>
                <p>{{ sp.osaaikaprosentti }}%</p>
              </b-col>
            </b-row>
            <b-row>
              <b-col lg="4">
                <h5>{{ $t('alkamispaiva') }}</h5>
                <p>{{ $date(sp.alkamispaiva) }}</p>
              </b-col>
              <b-col lg="4">
                <h5>{{ $t('paattymispaiva') }}</h5>
                <p>{{ sp.paattymispaiva ? $date(sp.paattymispaiva) : '-' }}</p>
              </b-col>
            </b-row>
            <b-row>
              <b-col>
                <h5>{{ $t('liitetiedostot') }}</h5>
                <asiakirjat-content
                  :asiakirjat="sp.asiakirjat"
                  :sorting-enabled="false"
                  :pagination-enabled="false"
                  :enable-search="false"
                  :enable-delete="false"
                  :no-results-info-text="$t('ei-liitetiedostoja')"
                  :asiakirja-data-endpoint-url="asiakirjaDataEndpointUrl"
                  :loading="loading"
                />
              </b-col>
            </b-row>
            <b-row>
              <b-col>
                <h5>{{ $t('kaytannon-koulutus') }}</h5>
                <p>
                  {{ displayKaytannonKoulutus(sp.kaytannonKoulutus) }}
                  {{ sp.omaaErikoisalaaTukeva ? ': ' + sp.omaaErikoisalaaTukeva.nimi : '' }}
                </p>
              </b-col>
            </b-row>
            <b-row v-if="sp.hyvaksyttyAiempaanErikoisalaan">
              <b-col>
                <h5>{{ $t('lisatiedot') }}</h5>
                <p>{{ $t('tyoskentelyjakso-on-aiemmin-hyvaksytty-toiselle-erikoisalalle') }}</p>
              </b-col>
            </b-row>
            <b-row v-if="sp.poissaolot && sp.poissaolot.length > 0">
              <b-col>
                <h5>{{ $t('poissaolot') }}</h5>
                <elsa-poissaolot-display :poissaolot="sp.poissaolot" />
              </b-col>
            </b-row>
            <hr />
          </div>
        </div>
        <div v-if="vastuuhenkilonArvio.aloituskeskustelu">
          <b-row>
            <b-col>
              <h3>{{ $t('aloituskeskustelu-kouluttaja') }}</h3>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <b-alert variant="dark" show>
                <div class="d-flex flex-row">
                  <em class="align-middle">
                    <font-awesome-icon :icon="['fas', 'check-circle']" class="text-success mr-2" />
                  </em>
                  <span>{{ $t('aloituskeskustelu-tila-hyvaksytty') }}</span>
                </div>
              </b-alert>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <h5>{{ $t('koejakson-suorituspaikka') }}</h5>
              <p>{{ vastuuhenkilonArvio.aloituskeskustelu.koejaksonSuorituspaikka }}</p>
            </b-col>
          </b-row>
          <b-row v-if="vastuuhenkilonArvio.aloituskeskustelu.koejaksonToinenSuorituspaikka">
            <b-col>
              <h5>{{ $t('koejakson-toinen-suorituspaikka') }}</h5>
              <p>{{ vastuuhenkilonArvio.aloituskeskustelu.koejaksonToinenSuorituspaikka }}</p>
            </b-col>
          </b-row>
          <b-row>
            <b-col lg="4">
              <h5>{{ $t('koejakson-alkamispäivä') }}</h5>
              <p>{{ $date(vastuuhenkilonArvio.aloituskeskustelu.koejaksonAlkamispaiva) }}</p>
            </b-col>
            <b-col lg="4">
              <h5>{{ $t('koejakson-päättymispäivä') }}</h5>
              <p>{{ $date(vastuuhenkilonArvio.aloituskeskustelu.koejaksonPaattymispaiva) }}</p>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <h5>{{ $t('koejakso-suoritettu-kokoaikatyössä') }}</h5>
              <p v-if="vastuuhenkilonArvio.aloituskeskustelu.suoritettuKokoaikatyossa">
                {{ $t('kylla') }}
              </p>
              <p v-else>
                {{ $t('koejakso-suoritettu-osaaikatyossa') }}:
                {{ vastuuhenkilonArvio.aloituskeskustelu.tyotunnitViikossa
                }}{{ $t('tuntia-viikossa') }}
              </p>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <h5>{{ $t('koejakso-osaamistavoitteet') }}</h5>
              <p>{{ vastuuhenkilonArvio.aloituskeskustelu.koejaksonOsaamistavoitteet }}</p>
            </b-col>
          </b-row>
          <b-row>
            <b-col lg="4">
              <h5>{{ $t('lahikouluttaja') }}</h5>
              <p>{{ vastuuhenkilonArvio.aloituskeskustelu.lahikouluttaja.nimi }}</p>
            </b-col>
            <b-col lg="4">
              <h5>{{ $t('lahiesimies-tai-muu') }}</h5>
              <p>{{ vastuuhenkilonArvio.aloituskeskustelu.lahiesimies.nimi }}</p>
            </b-col>
          </b-row>
        </div>
        <hr />
        <div v-if="vastuuhenkilonArvio.valiarviointi">
          <b-row>
            <b-col>
              <h3>{{ $t('soveltuvuus-erikoisalalle-valiarvioinnin-perusteella') }}</h3>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <b-alert variant="dark" show>
                <div class="d-flex flex-row">
                  <em class="align-middle">
                    <font-awesome-icon :icon="['fas', 'check-circle']" class="text-success mr-2" />
                  </em>
                  <span>{{ $t('valiarviointi-tila-hyvaksytty') }}</span>
                </div>
              </b-alert>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <h5>{{ $t('edistyminen-osaamistavoitteiden-mukaista') }}</h5>
              <p v-if="vastuuhenkilonArvio.valiarviointi.edistyminenTavoitteidenMukaista">
                {{ $t('kylla') }}
              </p>
              <p v-else>{{ $t('ei-huolenaiheita-on') }}</p>
            </b-col>
          </b-row>
          <b-row v-if="!vastuuhenkilonArvio.valiarviointi.edistyminenTavoitteidenMukaista">
            <b-col>
              <h5>{{ $t('keskustelu-ja-toimenpiteet-tarpeen-ennen-hyvaksymista') }}</h5>
              <ul>
                <li
                  v-for="(k, index) in vastuuhenkilonArvio.valiarviointi
                    .kehittamistoimenpideKategoriat"
                  :key="index"
                >
                  {{ displayKehittamistoimenpideKategoria(k) }}
                </li>
              </ul>
            </b-col>
          </b-row>
          <b-row v-if="vastuuhenkilonArvio.valiarviointi.vahvuudet">
            <b-col>
              <h5>{{ $t('vahvuudet') }}</h5>
              <p>{{ vastuuhenkilonArvio.valiarviointi.vahvuudet }}</p>
            </b-col>
          </b-row>
          <b-row v-if="vastuuhenkilonArvio.valiarviointi.kehittamistoimenpiteet">
            <b-col>
              <h5>{{ $t('selvitys-kehittamistoimenpiteista') }}</h5>
              <p>{{ vastuuhenkilonArvio.valiarviointi.kehittamistoimenpiteet }}</p>
            </b-col>
          </b-row>
          <b-row>
            <b-col lg="4">
              <h5>{{ $t('lahikouluttaja') }}</h5>
              <p>{{ vastuuhenkilonArvio.valiarviointi.lahikouluttaja.nimi }}</p>
            </b-col>
            <b-col lg="4">
              <h5>{{ $t('lahiesimies-tai-muu') }}</h5>
              <p>{{ vastuuhenkilonArvio.valiarviointi.lahiesimies.nimi }}</p>
            </b-col>
          </b-row>
        </div>
        <hr v-if="vastuuhenkilonArvio.kehittamistoimenpiteet" />
        <div
          v-if="
            vastuuhenkilonArvio.valiarviointi &&
            vastuuhenkilonArvio.kehittamistoimenpiteet &&
            !vastuuhenkilonArvio.valiarviointi.edistyminenTavoitteidenMukaista
          "
        >
          <b-row>
            <b-col>
              <h3>{{ $t('kehittamistoimenpiteet-otsikko') }}</h3>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <b-alert variant="dark" show>
                <div class="d-flex flex-row">
                  <em class="align-middle">
                    <font-awesome-icon :icon="['fas', 'check-circle']" class="text-success mr-2" />
                  </em>
                  <span>{{ $t('kehittamistoimenpiteet-tila-hyvaksytty') }}</span>
                </div>
              </b-alert>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <h5>{{ $t('kehittamistoimenpiteiden-arviointi') }}</h5>
              <p v-if="vastuuhenkilonArvio.kehittamistoimenpiteet.kehittamistoimenpiteetRiittavat">
                {{ $t('kehittamistoimenpiteet-riittavat') }}
              </p>
              <p v-else>
                {{ $t('kehittamistoimenpiteet-ei-riittavat') }}
              </p>
            </b-col>
          </b-row>
          <b-row>
            <b-col lg="4">
              <h5>{{ $t('lahikouluttaja') }}</h5>
              <p>{{ vastuuhenkilonArvio.kehittamistoimenpiteet.lahikouluttaja.nimi }}</p>
            </b-col>
            <b-col lg="4">
              <h5>{{ $t('lahiesimies-tai-muu') }}</h5>
              <p>{{ vastuuhenkilonArvio.kehittamistoimenpiteet.lahiesimies.nimi }}</p>
            </b-col>
          </b-row>
        </div>
        <hr />
        <div v-if="vastuuhenkilonArvio.loppukeskustelu">
          <b-row>
            <b-col>
              <h3>{{ $t('loppukeskustelu') }}</h3>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <b-alert variant="dark" show>
                <div class="d-flex flex-row">
                  <em class="align-middle">
                    <font-awesome-icon :icon="['fas', 'check-circle']" class="text-success mr-2" />
                  </em>
                  <span>{{ $t('loppukeskustelu-tila-hyvaksytty') }}</span>
                </div>
              </b-alert>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <h5>{{ $t('koejakson-tavoitteet-on-kasitelty-loppukeskustelussa') }}</h5>
              <p v-if="vastuuhenkilonArvio.loppukeskustelu.esitetaanKoejaksonHyvaksymista">
                {{ $t('loppukeskustelu-kayty-hyvaksytty') }}
              </p>
              <p v-else>
                {{ $t('loppukeskustelu-kayty-jatkotoimenpiteet') }}
              </p>
            </b-col>
          </b-row>
          <b-row v-if="!vastuuhenkilonArvio.loppukeskustelu.esitetaanKoejaksonHyvaksymista">
            <b-col>
              <h5>{{ $t('selvitys-jatkotoimista') }}</h5>
              <p>{{ vastuuhenkilonArvio.loppukeskustelu.jatkotoimenpiteet }}</p>
            </b-col>
          </b-row>
          <b-row>
            <b-col lg="4">
              <h5>{{ $t('lahikouluttaja') }}</h5>
              <p>{{ vastuuhenkilonArvio.loppukeskustelu.lahikouluttaja.nimi }}</p>
            </b-col>
            <b-col lg="4">
              <h5>{{ $t('lahiesimies-tai-muu') }}</h5>
              <p>{{ vastuuhenkilonArvio.loppukeskustelu.lahiesimies.nimi }}</p>
            </b-col>
          </b-row>
        </div>
        <hr />
        <div>
          <b-row>
            <b-col v-if="!vastuuhenkilonArvio.koulutussopimusHyvaksytty">
              <h5>{{ $t('koulutussopimus') }}</h5>
              <p>{{ $t('vastuuhenkilon-arvio-koulutussopimus-varmistus-vastuuhenkilo') }}</p>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <h5>{{ $t('koulutussuunnitelma') }}</h5>
              <p>{{ $t('vastuuhenkilon-arvio-koulutussuunnitelma-varmistus') }}</p>
            </b-col>
          </b-row>
        </div>
        <hr />
        <div>
          <b-row>
            <b-col>
              <h3>{{ $t('erikoisala-vastuuhenkilö') }}</h3>
            </b-col>
          </b-row>
          <b-row v-if="vastuuhenkilonArvio.vastuuhenkilo">
            <b-col>
              <h5>{{ $t('erikoisala-vastuuhenkilö-label') }}</h5>
              <p>
                {{ vastuuhenkilonArvio.vastuuhenkilo.nimi }}
                {{
                  vastuuhenkilonArvio.vastuuhenkilo.nimike
                    ? ', ' + vastuuhenkilonArvio.vastuuhenkilo.nimike
                    : ''
                }}
              </p>
            </b-col>
          </b-row>
          <div v-if="editable">
            <b-row>
              <b-col lg="4">
                <elsa-form-group :label="$t('sahkopostiosoite')" :required="true">
                  <template #default="{ uid }">
                    <b-form-input
                      :id="uid"
                      v-model="vastuuhenkilonArvio.vastuuhenkilonSahkoposti"
                      :state="validateState('vastuuhenkilonSahkoposti')"
                      :value="vastuuhenkilonArvio.vastuuhenkilonSahkoposti"
                      @input="$emit('skipRouteExitConfirm', false)"
                    />
                    <b-form-invalid-feedback
                      v-if="
                        $v.vastuuhenkilonArvio.vastuuhenkilonSahkoposti &&
                        !$v.vastuuhenkilonArvio.vastuuhenkilonSahkoposti.required
                      "
                      :id="`${uid}-feedback`"
                    >
                      {{ $t('pakollinen-tieto') }}
                    </b-form-invalid-feedback>
                    <b-form-invalid-feedback
                      v-if="
                        $v.vastuuhenkilonArvio.vastuuhenkilonSahkoposti &&
                        !$v.vastuuhenkilonArvio.vastuuhenkilonSahkoposti.email
                      "
                      :id="`${uid}-feedback`"
                      :state="validateState('vastuuhenkilonSahkoposti')"
                    >
                      {{ $t('sahkopostiosoite-ei-kelvollinen') }}
                    </b-form-invalid-feedback>
                  </template>
                </elsa-form-group>
              </b-col>

              <b-col lg="4">
                <elsa-form-group :label="$t('matkapuhelinnumero')" :required="true">
                  <template #default="{ uid }">
                    <b-form-input
                      :id="uid"
                      v-model="vastuuhenkilonArvio.vastuuhenkilonPuhelinnumero"
                      :state="validateState('vastuuhenkilonPuhelinnumero')"
                      :value="vastuuhenkilonArvio.vastuuhenkilonPuhelinnumero"
                      @input="$emit('skipRouteExitConfirm', false)"
                    />
                    <small class="form-text text-muted">
                      {{ $t('syota-puhelinnumero-muodossa') }}
                    </small>
                    <b-form-invalid-feedback :id="`${uid}-feedback`">
                      {{ $t('tarkista-puhelinnumeron-muoto') }}
                    </b-form-invalid-feedback>
                  </template>
                </elsa-form-group>
              </b-col>
            </b-row>
          </div>
          <div v-else>
            <b-row>
              <b-col lg="4">
                <h5>{{ $t('sahkopostiosoite') }}</h5>
                <p>{{ vastuuhenkilonArvio.vastuuhenkilonSahkoposti }}</p>
              </b-col>

              <b-col lg="4">
                <h5>{{ $t('matkapuhelinnumero') }}</h5>
                <p>{{ vastuuhenkilonArvio.vastuuhenkilonPuhelinnumero }}</p>
              </b-col>
            </b-row>
          </div>
        </div>
        <hr />
        <div v-if="vastuuhenkilonArvio.virkailija && vastuuhenkilonArvio.virkailija.kuittausaika">
          <b-row>
            <b-col>
              <h3>{{ $t('tarkistanut') }}</h3>
            </b-col>
          </b-row>
          <b-row>
            <b-col lg="4">
              <h5>{{ $t('paivays') }}</h5>
              <p>{{ $date(vastuuhenkilonArvio.virkailija.kuittausaika) }}</p>
            </b-col>
            <b-col lg="4">
              <h5>{{ $t('nimi-ja-nimike') }}</h5>
              <p>
                {{ vastuuhenkilonArvio.virkailija.nimi + ' '
                }}{{
                  vastuuhenkilonArvio.virkailija.nimike
                    ? ', ' + vastuuhenkilonArvio.virkailija.nimike
                    : ''
                }}
              </p>
            </b-col>
          </b-row>
          <hr />
        </div>
        <elsa-form-group
          v-if="editable || vastuuhenkilonArvio.koejaksoHyvaksytty != null"
          :label="$t('koejakso-on')"
          :required="editable"
        >
          <template #default="{ uid }">
            <div v-if="editable">
              <b-form-radio-group
                :id="uid"
                v-model="vastuuhenkilonArvio.koejaksoHyvaksytty"
                :options="koejaksoHyvaksyttyVaihtoehdot"
                :state="validateState('koejaksoHyvaksytty')"
                stacked
                @input="$emit('skipRouteExitConfirm', false)"
              ></b-form-radio-group>
              <b-form-invalid-feedback
                :id="`${uid}-feedback`"
                :state="validateState('koejaksoHyvaksytty')"
              >
                {{ $t('pakollinen-tieto') }}
              </b-form-invalid-feedback>
            </div>
            <div v-else>
              {{ vastuuhenkilonArvio.koejaksoHyvaksytty ? $t('hyvaksytty') : $t('hylatty') }}
            </div>
          </template>
        </elsa-form-group>
        <elsa-form-group
          v-if="vastuuhenkilonArvio.koejaksoHyvaksytty === false"
          :label="$t('perustelu-hylkaamiselle')"
          :required="editable"
        >
          <template #default="{ uid }">
            <div v-if="editable">
              <b-form-textarea
                :id="uid"
                v-model="vastuuhenkilonArvio.perusteluHylkaamiselle"
                :state="validateState('perusteluHylkaamiselle')"
                rows="7"
              ></b-form-textarea>
              <b-form-invalid-feedback :id="`${uid}-feedback`">
                {{ $t('pakollinen-tieto') }}
              </b-form-invalid-feedback>
            </div>
            <div v-else>
              {{ vastuuhenkilonArvio.perusteluHylkaamiselle }}
            </div>
          </template>
        </elsa-form-group>
        <elsa-form-group
          v-if="vastuuhenkilonArvio.koejaksoHyvaksytty === false"
          :label="$t('hylatyn-koejakson-arviointi-kayty-lapi-keskustellen')"
          :required="editable"
        >
          <template #default="{ uid }">
            <div v-if="editable">
              <b-form-checkbox
                v-model="vastuuhenkilonArvio.hylattyArviointiKaytyLapiKeskustellen"
                :state="validateState('hylattyArviointiKaytyLapiKeskustellen')"
              >
                {{ $t('kylla') }}
              </b-form-checkbox>
              <b-form-invalid-feedback
                :id="`${uid}-feedback`"
                :state="validateState('hylattyArviointiKaytyLapiKeskustellen')"
              >
                {{ $t('hylatty-arviointi-kaytava-lapi-keskustellen') }}
              </b-form-invalid-feedback>
            </div>
            <div v-else>
              {{ $t('kylla') }}
            </div>
          </template>
        </elsa-form-group>
        <div v-if="waitingForSignatures || acceptedByEveryone">
          <hr />
          <koejakson-vaihe-allekirjoitukset
            :allekirjoitukset="allekirjoitukset"
            title="hyvaksymispaivamaarat"
          />
        </div>
        <div v-if="editable">
          <hr />
          <b-row>
            <b-col class="text-right">
              <elsa-button
                variant="back"
                class="ml-1 mr-3 d-block d-md-inline-block d-lg-block d-xl-inline-block text-left"
                :to="{ name: 'koejakso' }"
              >
                {{ $t('peruuta') }}
              </elsa-button>
              <elsa-button
                v-b-modal.return-to-sender
                class="my-2 mr-3 d-block d-md-inline-block d-lg-block d-xl-inline-block"
                style="min-width: 14rem"
                :disabled="buttonStates.primaryButtonLoading"
                :loading="buttonStates.secondaryButtonLoading"
                variant="outline-primary"
              >
                {{ $t('palauta-muokattavaksi') }}
              </elsa-button>
              <elsa-button
                v-if="!loading"
                :loading="buttonStates.primaryButtonLoading"
                variant="primary"
                class="my-2 d-block d-md-inline-block d-lg-block d-xl-inline-block"
                @click="onValidateAndConfirm('confirm-sign')"
              >
                {{ $t('laheta-allekirjoitettavaksi') }}
              </elsa-button>
            </b-col>
          </b-row>
        </div>
      </div>
      <div v-else class="text-center">
        <b-spinner variant="primary" :label="$t('ladataan')" />
      </div>
    </b-container>

    <elsa-confirmation-modal
      id="confirm-sign"
      :title="$t('vahvista-lomakkeen-lahetys')"
      :text="$t('lahetyksen-jalkeen-koejakso-arvioitu')"
      :submit-text="$t('laheta-allekirjoitettavaksi')"
      @submit="onSign"
    />
    <elsa-return-to-sender-modal
      id="return-to-sender"
      :title="$t('palauta-erikoistuvalle-muokattavaksi')"
      @submit="onReturnToSender"
    />
  </div>
</template>

<script lang="ts">
  import _get from 'lodash/get'
  import Component from 'vue-class-component'
  import { Mixins } from 'vue-property-decorator'
  import { validationMixin } from 'vuelidate'
  import { required, requiredIf, email } from 'vuelidate/lib/validators'

  import { getVastuuhenkilonArvio } from '@/api/vastuuhenkilo'
  import AsiakirjatContent from '@/components/asiakirjat/asiakirjat-content.vue'
  import ElsaButton from '@/components/button/button.vue'
  import ErikoistuvaDetails from '@/components/erikoistuva-details/erikoistuva-details.vue'
  import ElsaFormGroup from '@/components/form-group/form-group.vue'
  import KoejaksonVaiheAllekirjoitukset from '@/components/koejakson-vaiheet/koejakson-vaihe-allekirjoitukset.vue'
  import ElsaConfirmationModal from '@/components/modal/confirmation-modal.vue'
  import ElsaReturnToSenderModal from '@/components/modal/return-to-sender-modal.vue'
  import ElsaFormMultiselect from '@/components/multiselect/multiselect.vue'
  import ElsaPoissaolotDisplay from '@/components/poissaolot-display/poissaolot-display.vue'
  import store from '@/store'
  import {
    Koejakso,
    KoejaksonVaiheAllekirjoitus,
    KoejaksonVaiheButtonStates,
    VastuuhenkilonArvioLomake,
    KoejaksonVaihe
  } from '@/types'
  import {
    KaytannonKoulutusTyyppi,
    LomakeTilat,
    LomakeTyypit,
    TyoskentelyjaksoTyyppi,
    phoneNumber
  } from '@/utils/constants'
  import { checkCurrentRouteAndRedirect } from '@/utils/functions'
  import * as allekirjoituksetHelper from '@/utils/koejaksonVaiheAllekirjoitusMapper'
  import { toastFail, toastSuccess } from '@/utils/toast'
  import {
    tyoskentelypaikkaTyyppiLabel,
    tyoskentelyjaksoKaytannonKoulutusLabel
  } from '@/utils/tyoskentelyjakso'

  @Component({
    components: {
      ErikoistuvaDetails,
      ElsaFormGroup,
      ElsaFormMultiselect,
      ElsaButton,
      ElsaPoissaolotDisplay,
      ElsaConfirmationModal,
      ElsaReturnToSenderModal,
      KoejaksonVaiheAllekirjoitukset,
      AsiakirjatContent
    },
    validations: {
      vastuuhenkilonArvio: {
        vastuuhenkilonPuhelinnumero: {
          required,
          phoneNumber
        },
        vastuuhenkilonSahkoposti: {
          required,
          email
        },
        koejaksoHyvaksytty: {
          required
        },
        perusteluHylkaamiselle: {
          required: requiredIf((value) => {
            return value.koejaksoHyvaksytty === false
          })
        },
        hylattyArviointiKaytyLapiKeskustellen: {
          checked: function (val) {
            return this.$data.vastuuhenkilonArvio.koejaksoHyvaksytty === true || val === true
          }
        }
      }
    }
  })
  export default class VastuuhenkilonArvioVastuuhenkilo extends Mixins(validationMixin) {
    items = [
      {
        text: this.$t('etusivu'),
        to: { name: 'etusivu' }
      },
      {
        text: this.$t('koejakso'),
        to: { name: 'koejakso' }
      },
      {
        text: this.$t('koejakson-vastuuhenkilon-arvio'),
        active: true
      }
    ]

    koejaksoHyvaksyttyVaihtoehdot = [
      {
        text: this.$t('hyvaksytty'),
        value: true
      },
      {
        text: this.$t('hylatty'),
        value: false
      }
    ]

    buttonStates: KoejaksonVaiheButtonStates = {
      primaryButtonLoading: false,
      secondaryButtonLoading: false
    }
    vastuuhenkilonArvio: VastuuhenkilonArvioLomake | null = null
    loading = true

    validateState(value: string) {
      const form = this.$v.vastuuhenkilonArvio
      const { $dirty, $error } = _get(form, value) as any
      return $dirty ? ($error ? false : null) : null
    }

    get account() {
      return store.getters['auth/account']
    }

    get editable() {
      return (
        this.vastuuhenkilonArvioTila === LomakeTilat.ODOTTAA_HYVAKSYNTAA ||
        this.vastuuhenkilonArvioTila === LomakeTilat.ODOTTAA_VASTUUHENKILON_HYVAKSYNTAA
      )
    }

    get returned() {
      return this.vastuuhenkilonArvio?.vastuuhenkilonKorjausehdotus != null
    }

    get waitingForSignatures() {
      return this.vastuuhenkilonArvioTila === LomakeTilat.ODOTTAA_ALLEKIRJOITUSTA
    }

    get acceptedByEveryone() {
      return this.vastuuhenkilonArvioTila === LomakeTilat.ALLEKIRJOITETTU
    }

    get koejaksoData(): Koejakso {
      return store.getters['vastuuhenkilo/koejaksot']
    }

    get vastuuhenkilonArvioTila() {
      return store.getters['vastuuhenkilo/koejaksot'].find(
        (k: KoejaksonVaihe) =>
          k.id === this.vastuuhenkilonArvio?.id && k.tyyppi == LomakeTyypit.VASTUUHENKILON_ARVIO
      )?.tila
    }

    get vastuuhenkilonArvioId() {
      return Number(this.$route.params.id)
    }

    get erikoistuvanAvatar() {
      return this.vastuuhenkilonArvio?.erikoistuvanAvatar
    }

    get erikoistuvanNimi() {
      return this.vastuuhenkilonArvio?.erikoistuvanNimi
    }

    get allekirjoitukset(): KoejaksonVaiheAllekirjoitus[] {
      const allekirjoitusErikoistuva = allekirjoituksetHelper.mapAllekirjoitusErikoistuva(
        this,
        this.vastuuhenkilonArvio?.erikoistuvanNimi,
        this.vastuuhenkilonArvio?.erikoistuvanKuittausaika
      )
      const allekirjoitusVastuuhenkilo = allekirjoituksetHelper.mapAllekirjoitusVastuuhenkilo(
        this.vastuuhenkilonArvio?.vastuuhenkilo ?? null
      ) as KoejaksonVaiheAllekirjoitus

      return [allekirjoitusVastuuhenkilo, allekirjoitusErikoistuva].filter(
        (a): a is KoejaksonVaiheAllekirjoitus => a !== null
      )
    }

    get asiakirjaDataEndpointUrl() {
      return `/vastuuhenkilo/koejakso/vastuuhenkilonarvio/${this.vastuuhenkilonArvio?.id}/tyoskentelyjakso-liite`
    }

    hideModal(id: string) {
      return this.$bvModal.hide(id)
    }

    onValidateAndConfirm(modalId: string) {
      this.$v.$touch()
      if (this.$v.$anyError) {
        return
      }

      return this.$bvModal.show(modalId)
    }

    displayTyoskentelypaikkaTyyppiLabel(muu: string | null, tyyppi: TyoskentelyjaksoTyyppi) {
      return muu ? muu : tyoskentelypaikkaTyyppiLabel(this, tyyppi)
    }

    displayKehittamistoimenpideKategoria(kategoria: string) {
      if (kategoria === 'MUU') return this.vastuuhenkilonArvio?.valiarviointi?.muuKategoria
      return this.$t('kehittamistoimenpidekategoria-' + kategoria)
    }

    displayKaytannonKoulutus(value: KaytannonKoulutusTyyppi) {
      return tyoskentelyjaksoKaytannonKoulutusLabel(this, value)
    }

    yhdistaPoissaolot(data: VastuuhenkilonArvioLomake) {
      let obj = data

      obj.koejaksonSuorituspaikat?.tyoskentelyjaksot.forEach((tj) => {
        tj.poissaolot = obj.koejaksonSuorituspaikat?.keskeytykset?.filter(
          (keskeytys) => keskeytys.tyoskentelyjaksoId == tj.id
        )
      })
      return obj
    }

    async onSign() {
      try {
        this.buttonStates.primaryButtonLoading = true
        await store.dispatch('vastuuhenkilo/putVastuuhenkilonArvio', this.vastuuhenkilonArvio)
        this.buttonStates.primaryButtonLoading = false
        this.$emit('skipRouteExitConfirm', true)
        checkCurrentRouteAndRedirect(this.$router, '/koejakso')
        toastSuccess(this, this.$t('vastuuhenkilon-arvio-allekirjoitettu-onnistuneesti'))
      } catch {
        toastFail(this, this.$t('vastuuhenkilon-arvio-allekirjoitus-epaonnistui'))
      }
    }

    async onReturnToSender(korjausehdotus: string) {
      try {
        this.buttonStates.secondaryButtonLoading = true
        if (this.vastuuhenkilonArvio != null) {
          this.vastuuhenkilonArvio.vastuuhenkilonKorjausehdotus = korjausehdotus
        }
        await store.dispatch('vastuuhenkilo/putVastuuhenkilonArvio', this.vastuuhenkilonArvio)
        this.buttonStates.primaryButtonLoading = false
        checkCurrentRouteAndRedirect(this.$router, '/koejakso')
        toastSuccess(this, this.$t('koejakso-palautettu-muokattavaksi'))
      } catch {
        toastFail(this, this.$t('koejakso-palautus-epaonnistui'))
      }
    }

    async mounted() {
      this.loading = true
      await store.dispatch('vastuuhenkilo/getKoejaksot')

      try {
        const { data } = await getVastuuhenkilonArvio(this.vastuuhenkilonArvioId)
        this.vastuuhenkilonArvio = data
        this.vastuuhenkilonArvio.vastuuhenkilonSahkoposti = this.account.email
        this.vastuuhenkilonArvio.vastuuhenkilonPuhelinnumero = this.account.phoneNumber
        this.vastuuhenkilonArvio = this.yhdistaPoissaolot(this.vastuuhenkilonArvio)
        this.loading = false
      } catch {
        toastFail(this, this.$t('vastuuhenkilon-arvion-hakeminen-epaonnistui'))
        this.$router.replace({ name: 'koejakso' })
      }
    }
  }
</script>
