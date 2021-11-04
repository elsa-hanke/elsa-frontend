<template>
  <b-form @submit.stop.prevent="onSubmit">
    <elsa-form-group
      v-if="form.koulutusjaksot.length > 0 && uusiJakso"
      :label="$t('koulutusjakso')"
    >
      <template v-slot="{ uid }">
        <div
          :id="uid"
          v-for="koulutusjakso in form.koulutusjaksot"
          :key="koulutusjakso.id"
          class="mb-1"
        >
          <span>{{ koulutusjakso.nimi }}</span>
        </div>
      </template>
    </elsa-form-group>
    <b-row v-if="!uusiJakso">
      <b-col>
        <div class="seurantajakso-erikoistuva-details">
          <erikoistuva-details
            :avatar="account.avatar"
            :name="`${account.firstName} ${account.lastName}`"
            :erikoisala="account.erikoistuvaLaakari.erikoisalaNimi"
            :opiskelijatunnus="account.erikoistuvaLaakari.opiskelijatunnus"
            :yliopisto="account.erikoistuvaLaakari.yliopisto"
            :show-birthdate="false"
          ></erikoistuva-details>
          <elsa-form-group
            :label="$t('seurantajakso')"
            label-cols-md="4"
            label-cols-xl="3"
            label-cols="12"
            class="align-items-center mb-md-0 ml-md-0 kouluttaja-form-input"
          >
            <template v-slot="{ uid }">
              <span :id="uid" v-if="form.alkamispaiva != null">
                {{ $date(form.alkamispaiva) }} - {{ $date(form.paattymispaiva) }}
              </span>
            </template>
          </elsa-form-group>
        </div>
      </b-col>
    </b-row>
    <b-row v-else>
      <b-col>
        <elsa-form-group :label="$t('seurantajakso')" class="mb-0">
          <template v-slot="{ uid }">
            <div :id="uid" class="mb-1">
              <span v-if="form.alkamispaiva != null">
                {{ $date(form.alkamispaiva) }} - {{ $date(form.paattymispaiva) }}
              </span>
            </div>
          </template>
        </elsa-form-group>
      </b-col>
      <b-col>
        <elsa-button
          @click.stop.prevent="onUusiHaku"
          variant="outline-primary"
          class="mt-2 float-right uusihaku"
        >
          {{ $t('tee-uusi-haku') }}
        </elsa-button>
      </b-col>
    </b-row>

    <hr />

    <div v-if="seurantajaksonTiedot.osaamistavoitteet.length > 0">
      <h3 class="mb-3">{{ $t('suunnitellut-tavoitteet') }}</h3>
      <elsa-form-group :label="$t('osaamistavoitteet-omalla-erikoisalalla')">
        <template v-slot="{ uid }">
          <b-badge
            :id="uid"
            v-for="osaamistavoite in seurantajaksonTiedot.osaamistavoitteet"
            :key="osaamistavoite.id"
            pill
            variant="light"
            class="font-weight-400 mr-2 osaamistavoitteet"
          >
            {{ osaamistavoite }}
          </b-badge>
        </template>
      </elsa-form-group>
      <elsa-form-group
        v-if="seurantajaksonTiedot.muutOsaamistavoitteet.length > 0"
        :label="$t('muut-osaamistavoitteet')"
      >
        <template v-slot="{ uid }">
          <div
            :id="uid"
            v-for="muutavoite in seurantajaksonTiedot.muutOsaamistavoitteet"
            :key="muutavoite.id"
            class="mb-1"
          >
            <span>{{ muutavoite }}</span>
          </div>
        </template>
      </elsa-form-group>
      <hr />
    </div>

    <h3 v-b-toggle.arvioinnit-toggle class="mb-4">
      <span class="closed">
        <font-awesome-icon icon="caret-down" class="text-muted" />
      </span>
      <span class="open">
        <font-awesome-icon icon="caret-up" class="text-muted" />
      </span>
      {{ $t('arvioinnit') }} ({{ seurantajaksonTiedot.arviointienMaara }} {{ $t('kpl') }})
    </h3>

    <b-collapse id="arvioinnit-toggle" visible class="mb-4">
      <div v-for="(kategoria, index) in seurantajaksonTiedot.arvioinnit" :key="index">
        <div v-if="kategoria.nimi != null">
          <h4>{{ kategoria.nimi }}</h4>
          <hr class="mt-0 mb-0" />
        </div>
        <div v-for="(oa, index) in kategoria.arvioitavatKokonaisuudet" :key="index">
          <p class="font-weight-500 pt-2 mb-1">{{ oa.nimi }}</p>

          <b-card-group class="mt-2" v-if="!$screen.sm" deck>
            <b-card
              class="mt-2 border"
              v-for="(arviointi, index) in oa.arvioinnit"
              :key="`arviointi-${index}`"
            >
              <b-card-text>
                <h5 class="mb-3">{{ arviointi.arvioitavaTapahtuma }}</h5>
                <dl class="mb-0">
                  <dt class="text-uppercase text-size-sm font-weight-400">
                    {{ $t('luottamuksen-taso') }}
                  </dt>
                  <dd class="mb-4">
                    <elsa-arviointiasteikon-taso
                      :value="arviointi.arviointiasteikonTaso"
                      :tasot="arviointi.arvioitavaOsaalue.arviointiasteikko.tasot"
                    />
                  </dd>
                  <dt class="text-uppercase text-size-sm font-weight-400">
                    {{ $t('suorituspaiva') }}
                  </dt>
                  <dd class="mb-0">
                    <elsa-button variant="link" class="pl-0" @click="showArviointi(arviointi)">
                      {{ $date(arviointi.tapahtumanAjankohta) }}
                    </elsa-button>
                  </dd>
                </dl>
              </b-card-text>
            </b-card>
          </b-card-group>
          <b-table-simple v-else small fixed class="mb-4 arvioinnit-table" stacked="md" responsive>
            <b-thead>
              <b-tr class="text-size-sm">
                <b-th scope="col" style="width: 35%">
                  {{ $t('tapahtuma') | uppercase }}
                </b-th>
                <b-th scope="col" style="width: 50%">
                  {{ $t('luottamuksen-taso') | uppercase }}
                </b-th>
                <b-th scope="col">
                  {{ $t('suorituspaiva') | uppercase }}
                </b-th>
              </b-tr>
            </b-thead>
            <b-tbody>
              <b-tr v-for="(arviointi, index) in oa.arvioinnit" :key="`arviointi-${index}`">
                <b-td :stacked-heading="$t('tapahtuma')">
                  {{ arviointi.arvioitavaTapahtuma }}
                </b-td>
                <b-td :stacked-heading="$t('luottamuksen-taso')">
                  <elsa-arviointiasteikon-taso
                    :value="arviointi.arviointiasteikonTaso"
                    :tasot="arviointi.arvioitavaOsaalue.arviointiasteikko.tasot"
                  />
                </b-td>
                <b-td :stacked-heading="$t('suorituspaiva')">
                  <elsa-button variant="link" class="pl-0" @click="showArviointi(arviointi)">
                    {{ $date(arviointi.tapahtumanAjankohta) }}
                  </elsa-button>
                </b-td>
              </b-tr>
            </b-tbody>
          </b-table-simple>
        </div>
      </div>
    </b-collapse>

    <h3 v-b-toggle.suoritemerkinnat-toggle class="mb-4">
      <span class="closed">
        <font-awesome-icon icon="caret-down" class="text-muted" />
      </span>
      <span class="open">
        <font-awesome-icon icon="caret-up" class="text-muted" />
      </span>
      {{ $t('suoritemerkinnat') }} ({{ seurantajaksonTiedot.suoritemerkinnatMaara }}
      {{ $t('kpl') }})
    </h3>

    <b-collapse id="suoritemerkinnat-toggle" visible class="mb-4">
      <b-card-group
        class="mt-2"
        v-if="!$screen.sm && seurantajaksonTiedot.suoritemerkinnat.length > 0"
        deck
      >
        <template v-for="(oppimistavoite, tavoiteIndex) in seurantajaksonTiedot.suoritemerkinnat">
          <b-card
            class="mt-2 border"
            v-for="(suoritemerkinta, index) in oppimistavoite.suoritemerkinnat"
            :key="`suoritemerkinta-${tavoiteIndex}-${index}`"
          >
            <b-card-text>
              <h5 class="mb-3">{{ oppimistavoite.oppimistavoite }}</h5>
              <dl class="mb-0">
                <dt class="text-uppercase text-size-sm font-weight-400">
                  {{ $t('luottamuksen-taso') }}
                </dt>
                <dd class="mb-4">
                  <elsa-arviointiasteikon-taso
                    :value="suoritemerkinta.arviointiasteikonTaso"
                    :tasot="suoritemerkinta.arviointiasteikko.tasot"
                  />
                </dd>
                <dt class="text-uppercase text-size-sm font-weight-400">
                  {{ $t('suorituspaiva') }}
                </dt>
                <dd class="mb-0">
                  <elsa-button
                    variant="link"
                    class="pl-0"
                    @click="showSuoritemerkinta(suoritemerkinta)"
                  >
                    {{ $date(suoritemerkinta.suorituspaiva) }}
                  </elsa-button>
                </dd>
              </dl>
            </b-card-text>
          </b-card>
        </template>
      </b-card-group>
      <b-table-simple
        v-if="$screen.sm && seurantajaksonTiedot.suoritemerkinnat.length > 0"
        small
        fixed
        class="mb-4 suoritemerkinnat-table"
        stacked="md"
        responsive
      >
        <b-thead>
          <b-tr class="text-size-sm">
            <b-th scope="col" style="width: 35%">
              {{ $t('suorite') | uppercase }}
            </b-th>
            <b-th scope="col" style="width: 50%">
              {{ $t('luottamuksen-taso') | uppercase }}
            </b-th>
            <b-th scope="col">
              {{ $t('suorituspaiva') | uppercase }}
            </b-th>
          </b-tr>
        </b-thead>
        <b-tbody>
          <template v-for="(oppimistavoite, tavoiteIndex) in seurantajaksonTiedot.suoritemerkinnat">
            <b-tr
              v-for="(suoritemerkinta, index) in oppimistavoite.suoritemerkinnat"
              :key="`suoritemerkinta-${tavoiteIndex}-${index}`"
            >
              <b-td
                v-if="index == 0"
                :stacked-heading="$t('suorite')"
                :rowspan="oppimistavoite.suoritemerkinnat.length"
              >
                {{ oppimistavoite.oppimistavoite }}
              </b-td>

              <b-td :stacked-heading="$t('luottamuksen-taso')">
                <elsa-arviointiasteikon-taso
                  :value="suoritemerkinta.arviointiasteikonTaso"
                  :tasot="suoritemerkinta.arviointiasteikko.tasot"
                />
              </b-td>
              <b-td :stacked-heading="$t('suorituspaiva')">
                <elsa-button
                  variant="link"
                  class="pl-0"
                  @click="showSuoritemerkinta(suoritemerkinta)"
                >
                  {{ $date(suoritemerkinta.suorituspaiva) }}
                </elsa-button>
              </b-td>
            </b-tr>
          </template>
        </b-tbody>
      </b-table-simple>
    </b-collapse>

    <h3 v-b-toggle.teoriakoulutukset-toggle class="mb-5">
      <span class="closed">
        <font-awesome-icon icon="caret-down" class="text-muted" />
      </span>
      <span class="open">
        <font-awesome-icon icon="caret-up" class="text-muted" />
      </span>
      {{ $t('teoriakoulutukset') }} ({{ seurantajaksonTiedot.teoriakoulutukset.length }}
      {{ $t('kpl') }})
    </h3>

    <b-collapse id="teoriakoulutukset-toggle" visible class="mb-4">
      <b-card-group
        class="mt-2"
        v-if="!$screen.sm && seurantajaksonTiedot.teoriakoulutukset.length > 0"
        deck
      >
        <b-card
          class="mt-2 border"
          v-for="(koulutus, index) in seurantajaksonTiedot.teoriakoulutukset"
          :key="`teoriakoulutus-${index}`"
        >
          <b-card-text>
            <h5 class="mb-3">{{ koulutus.koulutuksenNimi }}</h5>
            <dl class="mb-0">
              <dt class="text-uppercase text-size-sm font-weight-400">
                {{ $t('paikka') }}
              </dt>
              <dd class="mb-4">
                {{ koulutus.koulutuksenPaikka }}
              </dd>
              <dt class="text-uppercase text-size-sm font-weight-400">
                {{ $t('pvm') }}
              </dt>
              <dd class="mb-0">
                {{ $date(koulutus.alkamispaiva) }}
                <span v-if="koulutus.paattymispaiva != null">
                  -{{ $date(koulutus.paattymispaiva) }}
                </span>
              </dd>
              <template v-if="koulutus.erikoistumiseenHyvaksyttavaTuntimaara != null">
                <dt class="mt-4 text-uppercase text-size-sm font-weight-400">
                  {{ $t('tunnit') }}
                </dt>
                <dd class="mb-0">
                  {{ koulutus.erikoistumiseenHyvaksyttavaTuntimaara }}
                </dd>
              </template>
            </dl>
          </b-card-text>
        </b-card>
      </b-card-group>
      <b-table-simple
        v-if="$screen.sm && seurantajaksonTiedot.teoriakoulutukset.length > 0"
        fixed
        class="mb-4"
        stacked="md"
        responsive
      >
        <b-thead>
          <b-tr class="text-size-sm">
            <b-th scope="col">
              {{ $t('koulutuksen-nimi') | uppercase }}
            </b-th>
            <b-th scope="col">
              {{ $t('paikka') | uppercase }}
            </b-th>
            <b-th scope="col">
              {{ $t('pvm') | uppercase }}
            </b-th>
            <b-th scope="col">
              {{ $t('tunnit') | uppercase }}
            </b-th>
          </b-tr>
        </b-thead>
        <b-tbody>
          <b-tr
            v-for="(koulutus, index) in seurantajaksonTiedot.teoriakoulutukset"
            :key="`teoriakoulutus-${index}`"
          >
            <b-td :stacked-heading="$t('koulutuksen-nimi')">
              {{ koulutus.koulutuksenNimi }}
            </b-td>

            <b-td :stacked-heading="$t('paikka')">{{ koulutus.koulutuksenPaikka }}</b-td>
            <b-td :stacked-heading="$t('pvm')">
              {{ $date(koulutus.alkamispaiva) }}
              <span v-if="koulutus.paattymispaiva != null">
                -{{ $date(koulutus.paattymispaiva) }}
              </span>
            </b-td>
            <b-td :stacked-heading="$t('tunnit')">
              {{ koulutus.erikoistumiseenHyvaksyttavaTuntimaara }}
            </b-td>
          </b-tr>
        </b-tbody>
      </b-table-simple>
    </b-collapse>

    <h3 class="mb-3">{{ $t('erikoistujan-oma-arviointi') }}</h3>
    <div v-if="editing">
      <elsa-form-group :label="$t('oma-arviointi-seurantajaksolta')" :required="true">
        <template v-slot="{ uid }">
          <b-form-textarea
            :id="uid"
            v-model="form.omaArviointi"
            :state="validateState('omaArviointi')"
            rows="3"
          />
          <b-form-invalid-feedback :id="`${uid}-feedback`">
            {{ $t('pakollinen-tieto') }}
          </b-form-invalid-feedback>
        </template>
        <template #label-help>
          <elsa-popover>
            <template>
              {{ $t('oma-arviointi-seurantajaksolta-ohje') }}
            </template>
          </elsa-popover>
        </template>
      </elsa-form-group>
      <elsa-form-group :label="$t('lisahuomioita')">
        <template v-slot="{ uid }">
          <b-form-textarea :id="uid" v-model="form.lisahuomioita" rows="3" />
        </template>
        <template #label-help>
          <elsa-popover>
            <template>
              {{ $t('lisahuomioita-ohje') }}
            </template>
          </elsa-popover>
        </template>
      </elsa-form-group>
      <elsa-form-group :label="$t('seuraavan-jakson-tavoitteet')">
        <template v-slot="{ uid }">
          <b-form-textarea :id="uid" v-model="form.seuraavanJaksonTavoitteet" rows="3" />
        </template>
        <template #label-help>
          <elsa-popover>
            <template>
              {{ $t('seuraavan-jakson-tavoitteet-ohje') }}
            </template>
          </elsa-popover>
        </template>
      </elsa-form-group>
    </div>
    <div v-else>
      <elsa-form-group
        v-if="form.omaArviointi != null"
        :label="$t('oma-arviointi-seurantajaksolta')"
      >
        <template v-slot="{ uid }">
          <div :id="uid">{{ form.omaArviointi }}</div>
        </template>
      </elsa-form-group>
      <elsa-form-group v-if="form.lisahuomioita != null" :label="$t('lisahuomioita')">
        <template v-slot="{ uid }">
          <div :id="uid">{{ form.lisahuomioita }}</div>
        </template>
      </elsa-form-group>
      <elsa-form-group
        v-if="form.seuraavanJaksonTavoitteet != null"
        :label="$t('seuraavan-jakson-tavoitteet')"
      >
        <template v-slot="{ uid }">
          <div :id="uid">{{ form.seuraavanJaksonTavoitteet }}</div>
        </template>
      </elsa-form-group>
    </div>

    <hr />

    <b-row>
      <b-col lg="10">
        <h3 class="mb-3">{{ $t('seurantakeskustelun-osapuoli') }}</h3>
        <div v-if="uusiJakso">
          <elsa-form-group
            :label="$t('lahikouluttaja')"
            :add-new-enabled="true"
            :add-new-label="$t('lisaa-kouluttaja')"
            :required="true"
            @submit="onKouluttajaSubmit"
          >
            <template v-slot:modal-content="{ submit, cancel }">
              <kouluttaja-form @submit="submit" @cancel="cancel" />
            </template>
            <template v-slot="{ uid }">
              <elsa-form-multiselect
                v-model="form.kouluttaja"
                :id="uid"
                :options="kouluttajat"
                :state="validateState('kouluttaja')"
                label="nimi"
                track-by="nimi"
              >
                <template v-slot:option="{ option }">
                  <div v-if="option.nimi != null">{{ optionDisplayName(option) }}</div>
                </template>
              </elsa-form-multiselect>
              <b-form-invalid-feedback :id="`${uid}-feedback`">
                {{ $t('pakollinen-tieto') }}
              </b-form-invalid-feedback>
            </template>
          </elsa-form-group>
        </div>
        <div v-else>
          <elsa-form-group
            v-if="form.kouluttaja != null"
            class="mb-0"
            :label="$t('lahikouluttaja')"
          >
            <template v-slot="{ uid }">
              <div :id="uid">{{ form.kouluttaja.nimi }}</div>
            </template>
          </elsa-form-group>
        </div>
      </b-col>
    </b-row>

    <hr />

    <h3 id="seurantakeskustelun_merkinnat" class="mb-2">
      {{ $t('seurantakeskustelun-merkinnat') }}
    </h3>
    <div v-if="editing">
      <p class="mb-3">{{ $t('seurantakeskustelun-merkinnat-kuvaus-muokkaus') }}</p>
      <elsa-form-group
        :label="$t('yhteiset-merkinnat-keskustelusta-ja-jatkosuunnitelmista')"
        :required="!uusiJakso"
      >
        <template v-slot="{ uid }">
          <b-form-textarea
            :id="uid"
            v-model="form.seurantakeskustelunYhteisetMerkinnat"
            :state="validateState('seurantakeskustelunYhteisetMerkinnat')"
            :disabled="uusiJakso"
            rows="3"
          />
          <b-form-invalid-feedback :id="`${uid}-feedback`">
            {{ $t('pakollinen-tieto') }}
          </b-form-invalid-feedback>
        </template>
      </elsa-form-group>
      <elsa-form-group :label="$t('seuraavan-keskustelun-ajankohta')">
        <template v-slot="{ uid }">
          <elsa-form-datepicker
            :id="uid"
            :disabled="uusiJakso"
            class="col-sm-4 col-md-2"
            v-model="form.seuraavanKeskustelunAjankohta"
          ></elsa-form-datepicker>
        </template>
      </elsa-form-group>
    </div>
    <div v-else>
      <div v-if="form.seurantakeskustelunYhteisetMerkinnat != null">
        <elsa-form-group :label="$t('yhteiset-merkinnat-keskustelusta-ja-jatkosuunnitelmista')">
          <template v-slot="{ uid }">
            <div :id="uid">{{ form.seurantakeskustelunYhteisetMerkinnat }}</div>
          </template>
        </elsa-form-group>
        <elsa-form-group
          v-if="form.seuraavanKeskustelunAjankohta != null"
          :label="$t('seuraavan-keskustelun-ajankohta')"
        >
          <template v-slot="{ uid }">
            <div :id="uid">{{ $date(form.seuraavanKeskustelunAjankohta) }}</div>
          </template>
        </elsa-form-group>
      </div>
      <div v-else>
        <p class="mb-1">{{ $t('seurantakeskustelun-merkinnat-kuvaus-1') }}</p>
        <ul class="pl-5">
          <li class="font-weight-bold">{{ $t('seurantakeskustelun-merkinnat-kuvaus-2') }}</li>
          <li class="font-weight-bold">{{ $t('seurantakeskustelun-merkinnat-kuvaus-3') }}</li>
        </ul>
      </div>
    </div>

    <hr />

    <div v-if="editing" class="d-flex flex-row-reverse flex-wrap">
      <elsa-button :loading="params.saving" type="submit" variant="primary" class="ml-2 mb-2">
        {{ $t('tallenna-ja-laheta') }}
      </elsa-button>
      <elsa-button
        v-if="$isErikoistuva() && !uusiJakso"
        :loading="params.deleting"
        variant="outline-danger"
        @click="onSeurantajaksoDelete"
        class="mb-2"
      >
        {{ $t('poista-seurantajakso') }}
      </elsa-button>
      <elsa-button variant="back" @click.stop.prevent="onCancel" class="mb-2">
        {{ $t('peruuta') }}
      </elsa-button>
    </div>

    <b-modal id="arviointi-modal" :title="$t('arviointi')" size="lg">
      <arviointi-form :value="selectedArviointi" :editing="false" />

      <template #modal-footer>
        <elsa-button variant="primary" @click="hideArviointiModal">
          {{ $t('sulje-arviointi') }}
        </elsa-button>
      </template>
    </b-modal>

    <b-modal id="suoritemerkinta-modal" :title="$t('suoritemerkinta')" size="lg">
      <suoritemerkinta-details :value="selectedSuoritemerkinta" />

      <template #modal-footer>
        <elsa-button variant="primary" @click="hideSuoritemerkintaModal">
          {{ $t('sulje-suoritemerkinta') }}
        </elsa-button>
      </template>
    </b-modal>

    <elsa-confirmation-modal
      id="confirm-modal"
      :title="$t('vahvista-lomakkeen-lahetys')"
      :submitText="$t('tallenna-ja-laheta')"
      @submit="onSend"
    >
      <template #modal-content>
        <div v-if="!form.id" class="d-block">
          <p>{{ $t('vahvista-seurantajakson-lahetys-1') }}</p>
          <p class="mb-1">{{ $t('vahvista-seurantajakson-lahetys-2') }}</p>
          <ul>
            <li>{{ $t('vahvista-seurantajakson-lahetys-3') }}</li>
            <li>{{ $t('vahvista-seurantajakson-lahetys-4') }}</li>
          </ul>
        </div>
        <div v-else>
          {{ $t('vahvista-seurantajakson-yhteiset-merkinnat') }}
        </div>
      </template>
    </elsa-confirmation-modal>
  </b-form>
</template>

<script lang="ts">
  import { AxiosError } from 'axios'
  import { BModal } from 'bootstrap-vue'
  import Component from 'vue-class-component'
  import { Mixins, Prop } from 'vue-property-decorator'
  import { validationMixin } from 'vuelidate'
  import { required, requiredIf } from 'vuelidate/lib/validators'

  import { postLahikouluttaja } from '@/api/erikoistuva'
  import ElsaArviointiasteikonTaso from '@/components/arviointiasteikon-taso/arviointiasteikon-taso.vue'
  import ElsaButton from '@/components/button/button.vue'
  import ElsaFormDatepicker from '@/components/datepicker/datepicker.vue'
  import ErikoistuvaDetails from '@/components/erikoistuva-details/erikoistuva-details.vue'
  import ElsaFormGroup from '@/components/form-group/form-group.vue'
  import ElsaConfirmationModal from '@/components/modal/confirmation-modal.vue'
  import ElsaFormMultiselect from '@/components/multiselect/multiselect.vue'
  import ElsaPopover from '@/components/popover/popover.vue'
  import ArviointiForm from '@/forms/arviointi-form.vue'
  import KouluttajaForm from '@/forms/kouluttaja-form.vue'
  import TyoskentelyjaksoMixin from '@/mixins/tyoskentelyjakso'
  import store from '@/store'
  import {
    ElsaError,
    Kayttaja,
    Seurantajakso,
    SeurantajaksonTiedot,
    Suoritemerkinta,
    Suoritusarviointi
  } from '@/types'
  import { toastFail, toastSuccess } from '@/utils/toast'
  import SuoritemerkintaDetails from '@/views/suoritemerkinnat/suoritemerkinta-details.vue'

  @Component({
    components: {
      ArviointiForm,
      ElsaArviointiasteikonTaso,
      ElsaButton,
      ElsaConfirmationModal,
      ElsaFormDatepicker,
      ElsaFormGroup,
      ElsaFormMultiselect,
      ElsaPopover,
      ErikoistuvaDetails,
      KouluttajaForm,
      SuoritemerkintaDetails
    },
    validations() {
      const vm = this as SeurantajaksoForm
      return {
        form: {
          kouluttaja: {
            required
          },
          omaArviointi: {
            required
          },
          seurantakeskustelunYhteisetMerkinnat: {
            required: requiredIf(function () {
              if (vm.$isErikoistuva && !vm.uusiJakso) {
                return true
              }
              return false
            })
          }
        }
      }
    }
  })
  export default class SeurantajaksoForm extends Mixins(validationMixin, TyoskentelyjaksoMixin) {
    @Prop({
      required: false,
      type: Object,
      default: () => ({
        osaamistavoitteet: [],
        muutOsaamistavoitteet: [],
        arvioinnit: [],
        arviointienMaara: 0,
        suoritemerkinnat: [],
        suoritemerkinnatMaara: 0,
        teoriakoulutukset: []
      })
    })
    seurantajaksonTiedot!: SeurantajaksonTiedot

    @Prop({
      required: false,
      default: () => ({
        alkamispaiva: null,
        paattymispaiva: null,
        koulutusjaksot: []
      })
    })
    seurantajakso!: Seurantajakso

    @Prop({ required: false, default: false })
    editing!: boolean

    form: Seurantajakso = {
      alkamispaiva: null,
      paattymispaiva: null,
      koulutusjaksot: [],
      omaArviointi: null,
      lisahuomioita: null,
      seuraavanJaksonTavoitteet: null,
      kouluttaja: null,
      seurantakeskustelunYhteisetMerkinnat: null,
      seuraavanKeskustelunAjankohta: null
    }

    selectedArviointi: Suoritusarviointi | null = null
    selectedSuoritemerkinta: Suoritemerkinta | null = null

    params = {
      saving: false,
      deleting: false
    }

    async mounted() {
      this.form = {
        ...this.seurantajakso
      }
      await store.dispatch('erikoistuva/getKouluttajat')
    }

    validateState(name: string) {
      const { $dirty, $error } = this.$v.form[name] as any
      return $dirty ? ($error ? false : null) : null
    }

    get account() {
      return store.getters['auth/account']
    }

    get maxAlkamispaiva() {
      return this.form.paattymispaiva
    }

    get minPaattymispaiva() {
      return this.form.alkamispaiva
    }

    get kouluttajat(): Kayttaja[] {
      return store.getters['erikoistuva/kouluttajat'] || []
    }

    get uusiJakso() {
      return this.form.id == null
    }

    optionDisplayName(option: Kayttaja) {
      return option.nimike ? option.nimi + ', ' + option.nimike : option.nimi
    }

    async onKouluttajaSubmit(value: Kayttaja, modal: BModal) {
      try {
        await postLahikouluttaja(value)
        modal.hide('confirm')
        toastSuccess(this, this.$t('uusi-kouluttaja-lisatty'))
        await store.dispatch('erikoistuva/getKouluttajat')
      } catch (err) {
        const axiosError = err as AxiosError<ElsaError>
        const message = axiosError?.response?.data?.message
        toastFail(
          this,
          message
            ? `${this.$t('uuden-kouluttajan-lisaaminen-epaonnistui')}: ${this.$t(message)}`
            : this.$t('uuden-kouluttajan-lisaaminen-epaonnistui')
        )
      }
    }

    showArviointi(arviointi: Suoritusarviointi) {
      arviointi.lukittu = true
      this.selectedArviointi = arviointi
      this.$bvModal.show('arviointi-modal')
    }

    hideArviointiModal() {
      this.$bvModal.hide('arviointi-modal')
    }

    showSuoritemerkinta(suoritemerkinta: Suoritemerkinta) {
      suoritemerkinta.lukittu = true
      this.selectedSuoritemerkinta = suoritemerkinta
      this.$bvModal.show('suoritemerkinta-modal')
    }

    hideSuoritemerkintaModal() {
      this.$bvModal.hide('suoritemerkinta-modal')
    }

    onSubmit() {
      this.$v.form.$touch()
      if (this.$v.form.$anyError) {
        return
      }
      this.$bvModal.show('confirm-modal')
    }

    onSend() {
      this.$emit('submit', this.form, this.params)
    }

    onCancel() {
      this.$emit('cancel')
    }

    onUusiHaku() {
      this.$emit('uusiHaku')
    }

    onSeurantajaksoDelete() {
      this.$emit('delete', this.params)
    }
  }
</script>

<style lang="scss" scoped>
  @import '~@/styles/variables';
  @import '~bootstrap/scss/mixins/breakpoints';

  .suoritemerkinnat-table,
  .arvioinnit-table {
    td {
      padding-top: 0.25rem;
      padding-bottom: 0.25rem;
      vertical-align: middle;
    }
  }

  .osaamistavoitteet {
    font-size: $font-size-base;
  }

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

  .seurantajakso-erikoistuva-details::v-deep {
    .table-responsive {
      margin-bottom: 0rem;
    }
  }

  .card-body {
    padding-top: 0.75rem;
    padding-bottom: 0.75rem;
  }

  .uusihaku {
    width: 50%;
  }

  @include media-breakpoint-down(xs) {
    .uusihaku {
      width: 100%;
    }
  }
</style>
