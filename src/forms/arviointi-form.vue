<template>
  <div>
    <b-table-simple borderless class="arviointi-table">
      <b-tr>
        <b-th scope="row" class="align-middle font-weight-500">
          {{ $t('erikoistuva-laakari') }}
        </b-th>
        <b-td>
          <user-avatar
            :src-base64="value.arvioinninSaaja.avatar"
            src-content-type="image/jpeg"
            :display-name="value.arvioinninSaaja.nimi"
          />
        </b-td>
      </b-tr>
      <b-tr>
        <b-th scope="row" class="font-weight-500">{{ $t('tyoskentelyjakso') }}</b-th>
        <b-td>
          {{ value.tyoskentelyjakso.tyoskentelypaikka.nimi }} ({{
            value.tyoskentelyjakso.alkamispaiva ? $date(value.tyoskentelyjakso.alkamispaiva) : ''
          }}
          –
          {{
            value.tyoskentelyjakso.paattymispaiva
              ? $date(value.tyoskentelyjakso.paattymispaiva)
              : $t('kesken') | lowercase
          }})
        </b-td>
      </b-tr>
      <b-tr>
        <b-th scope="row" class="font-weight-500">{{ $t('arvioitava-kokonaisuus') }}</b-th>
        <b-td>
          {{ value.arvioitavaKokonaisuus.kategoria.nimi }}:
          {{ value.arvioitavaKokonaisuus.nimi }}
          <elsa-popover>
            <template>
              <p v-html="value.arvioitavaKokonaisuus.kuvaus" />
            </template>
          </elsa-popover>
          <span v-if="$isErikoistuva() && !value.arviointiAika">
            <br />
            <span>(</span>
            <elsa-button
              variant="link"
              class="text-decoration-none shadow-none d-table-row border-0 m-0 p-0"
              :to="{ name: 'arviointipyynto-muokkaus', params: { arviointiId: value.id } }"
            >
              {{ $t('muokkaa-arviointipyyntoa') | lowercase }}
            </elsa-button>
            <span>)</span>
          </span>
        </b-td>
      </b-tr>
      <b-tr>
        <b-th scope="row" class="font-weight-500">{{ $t('arvioitava-tapahtuma') }}</b-th>
        <b-td>
          {{ value.arvioitavaTapahtuma }}
        </b-td>
      </b-tr>
      <b-tr>
        <b-th scope="row" class="font-weight-500">{{ $t('tapahtuman-ajankohta') }}</b-th>
        <b-td>{{ $date(value.tapahtumanAjankohta) }}</b-td>
      </b-tr>
      <b-tr v-if="value.lisatiedot">
        <b-th scope="row" class="font-weight-500">{{ $t('lisatiedot') }}</b-th>
        <b-td>
          {{ value.lisatiedot }}
        </b-td>
      </b-tr>
      <b-tr>
        <b-th scope="row" class="align-middle font-weight-500">{{ $t('arvioija') }}</b-th>
        <b-td>
          <user-avatar
            :src-base64="value.arvioinninAntaja.avatar"
            src-content-type="image/jpeg"
            :display-name="value.arvioinninAntaja.nimi"
          />
        </b-td>
      </b-tr>
      <b-tr v-if="!editing">
        <b-th scope="row" class="align-middle font-weight-500">{{ $t('arviointityokalu') }}</b-th>
        <b-td>
          {{ value.arviointityokalut.map((el) => el.nimi).join(', ') }}
        </b-td>
      </b-tr>
      <b-tr v-if="!editing">
        <b-th scope="row" class="align-middle font-weight-500">{{ $t('arviointi-perustuu') }}</b-th>
        <b-td>
          {{ muuValittu ? value.muuPeruste : $t(value.arviointiPerustuu) }}
        </b-td>
      </b-tr>
    </b-table-simple>

    <b-form @submit.stop.prevent="onSubmit">
      <div v-if="!editing">
        <b-table-simple class="mt-2 mb-4" responsive bordered>
          <b-thead>
            <b-tr>
              <b-th scope="col" style="width: 24%"></b-th>
              <b-th scope="col" style="width: 38%">
                {{ $t('arviointi') }}
                <span v-if="value.arviointiAika" class="font-weight-400">
                  {{ ` (${$date(value.arviointiAika)})` }}
                </span>
              </b-th>
              <b-th scope="col" style="width: 38%">
                {{ $t('itsearviointi') }}
                <span v-if="value.itsearviointiAika" class="font-weight-400">
                  {{ ` (${$date(value.itsearviointiAika)})` }}
                </span>
              </b-th>
            </b-tr>
          </b-thead>
          <b-tbody>
            <b-tr>
              <b-th scope="row">
                {{ arviointiAsteikonNimi }}
                <elsa-popover>
                  <template>
                    <h3>{{ arviointiAsteikonNimi }}</h3>
                    <div v-for="(asteikonTaso, index) in arviointiasteikonTasot" :key="index">
                      <h4>
                        {{ asteikonTaso.taso }}
                        {{ $t('arviointiasteikon-taso-' + asteikonTaso.nimi) }}
                      </h4>
                      <p>{{ $t('arviointiasteikon-tason-kuvaus-' + asteikonTaso.nimi) }}</p>
                    </div>
                  </template>
                </elsa-popover>
              </b-th>
              <b-td>
                <div v-if="!value.arviointiAika" class="d-inline-flex">
                  <elsa-button
                    v-if="$isKouluttaja() || $isVastuuhenkilo()"
                    variant="primary"
                    class="d-flex align-items-center text-decoration-none"
                    :to="{
                      name: 'muokkaa-arviointia',
                      params: { arviointiId: value.id }
                    }"
                  >
                    {{ $t('tee-arviointi') }}
                  </elsa-button>
                  <span class="text-size-sm text-lighter ml-2" v-else>
                    {{ $t('arviointia-ei-ole-viela-annettu') }}
                  </span>
                </div>
                <elsa-arviointiasteikon-taso
                  v-if="value.arviointiAika"
                  :value="value.arviointiasteikonTaso"
                  :tasot="value.arvioitavaKokonaisuus.arviointiasteikko.tasot"
                />
              </b-td>
              <b-td>
                <div v-if="!value.itsearviointiAika" class="d-inline-flex">
                  <elsa-button
                    v-if="$isErikoistuva() && !value.lukittu"
                    variant="primary"
                    class="d-flex align-items-center text-decoration-none"
                    :to="{
                      name: 'itsearviointi',
                      params: { arviointiId: value.id }
                    }"
                  >
                    {{ $t('tee-itsearviointi') }}
                  </elsa-button>
                  <span class="text-size-sm text-lighter ml-2" v-else-if="!value.lukittu">
                    {{ $t('itsearviointia-ei-viela-tehty') }}
                  </span>
                  <span class="text-size-sm text-lighter ml-2" v-else-if="$isErikoistuva()">
                    {{ $t('suoritusarviointi-on-lukittu-itsearviointi-luonti') }}
                  </span>
                  <span class="text-size-sm text-lighter ml-2" v-else>
                    {{ $t('itsearviointia-ei-tehty') }}
                  </span>
                </div>
                <elsa-arviointiasteikon-taso
                  v-if="value.itsearviointiAika"
                  :value="value.itsearviointiArviointiasteikonTaso"
                  :tasot="value.arvioitavaKokonaisuus.arviointiasteikko.tasot"
                />
              </b-td>
            </b-tr>
            <b-tr>
              <b-th scope="row">
                {{ $t('vaativuustaso') }}
                <elsa-popover>
                  <template>
                    <h3>{{ $t('vaativuustaso') }}</h3>
                    <div v-for="(taso, index) in vaativuustasot" :key="index">
                      <h4>{{ taso.arvo }} {{ $t(taso.nimi) }}</h4>
                      <p>{{ $t(taso.kuvaus) }}</p>
                    </div>
                  </template>
                </elsa-popover>
              </b-th>
              <b-td>
                <elsa-vaativuustaso v-if="value.vaativuustaso" :value="value.vaativuustaso" />
              </b-td>
              <b-td>
                <elsa-vaativuustaso
                  v-if="value.itsearviointiAika"
                  :value="value.itsearviointiVaativuustaso"
                />
              </b-td>
            </b-tr>
          </b-tbody>
        </b-table-simple>
        <elsa-form-group :label="$t('sanallinen-arviointi')">
          <template v-slot="{ uid }">
            <p :id="uid" class="text-preline text-break">{{ value.sanallinenArviointi }}</p>
          </template>
        </elsa-form-group>
        <div
          v-if="value.arviointiAika && ($isKouluttaja() || $isVastuuhenkilo())"
          class="text-right"
        >
          <elsa-button
            variant="primary"
            :disabled="value.lukittu"
            :to="{
              name: 'muokkaa-arviointia',
              params: { arviointiId: value.id }
            }"
          >
            {{ $t('muokkaa-arviointia') }}
          </elsa-button>
          <b-row v-if="value.lukittu">
            <b-col>
              <div class="d-flex flex-row mb-4">
                <em class="align-middle">
                  <font-awesome-icon icon="info-circle" fixed-width class="text-muted mr-1" />
                </em>
                <div>
                  <span class="text-size-sm">{{ $t('suoritusarviointi-on-lukittu') }}</span>
                </div>
              </div>
            </b-col>
          </b-row>
        </div>
        <hr />
        <elsa-form-group v-if="value.arviointiAsiakirja.nimi" :label="$t('liitetiedosto')">
          <asiakirjat-content
            class="px-0 col-md-8 col-lg-12 col-xl-8 border-bottom-none"
            :asiakirjat="asiakirjatTableItems"
            :sortingEnabled="false"
            :paginationEnabled="false"
            :enableSearch="false"
            :showInfoIfEmpty="false"
            :enableDelete="false"
            :asiakirjaDataEndpointUrl="asiakirjaDataEndpointUrl"
          />
        </elsa-form-group>
        <hr v-if="value.arviointiAsiakirja.nimi" />
        <elsa-form-group :label="$t('sanallinen-itsearviointi')">
          <template v-slot="{ uid }">
            <p :id="uid" class="text-preline text-break">
              {{ value.sanallinenItsearviointi }}
            </p>
          </template>
        </elsa-form-group>
        <div v-if="value.itsearviointiAika && $isErikoistuva()" class="text-right">
          <elsa-button
            variant="primary"
            :disabled="value.lukittu"
            :to="{
              name: 'itsearviointi',
              params: { arviointiId: value.id }
            }"
          >
            {{ $t('muokkaa-itsearviointia') }}
          </elsa-button>
          <b-row v-if="value.lukittu">
            <b-col>
              <div class="d-flex flex-row mb-4">
                <em class="align-middle">
                  <font-awesome-icon icon="info-circle" fixed-width class="text-muted mr-1" />
                </em>
                <div>
                  <span class="text-size-sm">
                    {{ $t('suoritusarviointi-on-lukittu-itsearviointi-muokkaus') }}
                  </span>
                </div>
              </div>
            </b-col>
          </b-row>
        </div>
        <hr />
      </div>
      <div v-else>
        <hr />
        <b-form-row>
          <elsa-form-group :label="arviointiAsteikonNimi" :required="true" class="col-lg-6">
            <template #label-help>
              <elsa-popover>
                <template>
                  <h3>{{ arviointiAsteikonNimi }}</h3>
                  <div v-for="(asteikonTaso, index) in arviointiasteikonTasot" :key="index">
                    <h4>
                      {{ asteikonTaso.taso }}
                      {{ $t('arviointiasteikon-taso-' + asteikonTaso.nimi) }}
                    </h4>
                    <p>{{ $t('arviointiasteikon-tason-kuvaus-' + asteikonTaso.nimi) }}</p>
                  </div>
                </template>
              </elsa-popover>
            </template>
            <template v-slot="{ uid }">
              <elsa-form-multiselect
                :id="uid"
                v-model="form.arviointiasteikonTaso"
                :options="arviointiasteikonTasot"
                :state="validateState('arviointiasteikonTaso')"
                :custom-label="(value) => `${value.taso} ${value.nimi}`"
                track-by="taso"
              >
                <template slot="singleLabel" slot-scope="{ option }">
                  <span class="font-weight-700">{{ option.taso }}</span>
                  {{ $t('arviointiasteikon-taso-' + option.nimi) }}
                </template>
                <template slot="option" slot-scope="{ option }">
                  <span class="font-weight-700">{{ option.taso }}</span>
                  {{ $t('arviointiasteikon-taso-' + option.nimi) }}
                </template>
              </elsa-form-multiselect>
              <b-form-invalid-feedback :id="`${uid}-feedback`">
                {{ $t('pakollinen-tieto') }}
              </b-form-invalid-feedback>
            </template>
          </elsa-form-group>
        </b-form-row>
        <b-form-row>
          <elsa-form-group :label="$t('vaativuustaso')" class="col-lg-6">
            <template #label-help>
              <elsa-popover>
                <template>
                  <h3>{{ $t('vaativuustaso') }}</h3>
                  <div v-for="(taso, index) in vaativuustasot" :key="index">
                    <h4>{{ taso.arvo }} {{ $t(taso.nimi) }}</h4>
                    <p>{{ $t(taso.kuvaus) }}</p>
                  </div>
                </template>
              </elsa-popover>
            </template>
            <template v-slot="{ uid }">
              <elsa-form-multiselect
                :id="uid"
                v-model="form.vaativuustaso"
                :options="vaativuustasot"
                :custom-label="(value) => `${value.arvo} ${value.nimi}`"
                track-by="arvo"
              >
                <template slot="singleLabel" slot-scope="{ option }">
                  <span class="font-weight-700">{{ option.arvo }}</span>
                  {{ $t(option.nimi) }}
                </template>
                <template slot="option" slot-scope="{ option }">
                  <span class="font-weight-700">{{ option.arvo }}</span>
                  {{ $t(option.nimi) }}
                </template>
              </elsa-form-multiselect>
              <b-form-invalid-feedback :id="`${uid}-feedback`">
                {{ $t('pakollinen-tieto') }}
              </b-form-invalid-feedback>
            </template>
          </elsa-form-group>
        </b-form-row>
        <b-form-row v-if="$isKouluttaja() || $isVastuuhenkilo()">
          <elsa-form-group :label="$t('arviointityokalu')" :required="false" class="col-lg-6">
            <template v-slot="{ uid }">
              <elsa-form-multiselect
                :id="uid"
                v-model="form.arviointityokalut"
                :options="arviointityokalut"
                :custom-label="(value) => `${value.nimi}`"
                :multiple="true"
                :allow-empty="true"
                track-by="nimi"
              >
                <template slot="option" slot-scope="{ option }">
                  {{ option.nimi }}
                </template>
              </elsa-form-multiselect>
            </template>
          </elsa-form-group>
        </b-form-row>
        <elsa-form-group
          v-if="$isKouluttaja() || $isVastuuhenkilo()"
          :label="$t('liitetiedostot')"
          :help="$t('arviointi-liite-tooltip')"
        >
          <span>
            {{ $t('arviointi-liitetiedostot-kuvaus') }}
          </span>
          <asiakirjat-upload
            class="mt-3"
            :isPrimaryButton="false"
            :allowMultiplesFiles="false"
            :buttonText="$t('lisaa-liitetiedosto')"
            :wrongFileTypeErrorMessage="$t('sallitut-tiedostoformaatit-pdf')"
            @selectedFiles="onArviointiFileAdded"
          />
          <asiakirjat-content
            class="px-0 col-md-8 col-lg-12 col-xl-8"
            :asiakirjat="asiakirjatTableItems"
            :sortingEnabled="false"
            :paginationEnabled="false"
            :enableSearch="false"
            :showInfoIfEmpty="false"
            :asiakirjaDataEndpointUrl="asiakirjaDataEndpointUrl"
            @deleteAsiakirja="onArviointiFileDeleted"
          />
        </elsa-form-group>
        <elsa-form-group v-if="editing" :label="$t('sanallinen-arviointi')" :required="true">
          <template #label-help>
            <elsa-popover>
              <template>
                <h3>{{ $t('arvioinnin-osa-alueita') }}</h3>
                <div class="d-flex flex-column canmeds-container">
                  <img src="@/assets/canmeds.svg" class="m-2" alt="canmeds" />
                  <a href="#" class="text-size-normal" rel="noreferrer noopener" target="_blank">
                    {{ $t('canmeds-linkki-teksti') }}
                  </a>
                </div>
              </template>
            </elsa-popover>
          </template>
          <template v-slot="{ uid }">
            <div v-if="itsearviointi">
              <p class="mb-2">
                {{ $t('sanallinen-itsearviointi-ohjeteksti') }}
              </p>
            </div>
            <b-form-textarea
              :id="uid"
              v-model="form.sanallinenArviointi"
              :state="validateState('sanallinenArviointi')"
              rows="5"
            ></b-form-textarea>
            <b-form-invalid-feedback :id="`${uid}-feedback`">
              {{ $t('pakollinen-tieto') }}
            </b-form-invalid-feedback>
          </template>
        </elsa-form-group>
        <elsa-form-group
          v-if="editing && ($isKouluttaja() || $isVastuuhenkilo())"
          :label="$t('lisatiedot')"
        >
          <template v-slot="{ uid }">
            <b-form-checkbox v-model="form.perustuuMuuhun">
              {{ $t('arviointi-perustuu-lasna') }}
            </b-form-checkbox>
            <div v-if="form.perustuuMuuhun" class="arviointi-perustuu">
              <b-form-radio-group
                :id="uid"
                v-model="form.arviointiPerustuu"
                :options="arviointiperusteet"
                :state="validateState('arviointiPerustuu')"
                stacked
              ></b-form-radio-group>
              <b-form-invalid-feedback
                :id="`${uid}-feedback`"
                :state="validateState('arviointiPerustuu')"
              >
                {{ $t('pakollinen-tieto') }}
              </b-form-invalid-feedback>
              <b-form-input
                v-if="muuValittu"
                v-model="form.muuPeruste"
                :state="validateState('muuPeruste')"
              ></b-form-input>
              <b-form-invalid-feedback>{{ $t('pakollinen-tieto') }}</b-form-invalid-feedback>
            </div>
          </template>
        </elsa-form-group>
        <div class="text-right">
          <elsa-button
            variant="back"
            :to="{
              name: 'arviointi',
              params: { arviointiId: this.$route.params.arviointiId }
            }"
          >
            {{ $t('peruuta') }}
          </elsa-button>
          <elsa-button :loading="params.saving" type="submit" variant="primary" class="ml-2">
            {{ itsearviointi ? $t('tallenna') : $t('laheta') }}
          </elsa-button>
        </div>
      </div>
    </b-form>
  </div>
</template>

<script lang="ts">
  import axios from 'axios'
  import Component from 'vue-class-component'
  import { Mixins, Prop, Vue } from 'vue-property-decorator'
  import { validationMixin } from 'vuelidate'
  import { required, requiredIf } from 'vuelidate/lib/validators'

  import ElsaArviointiasteikonTaso from '@/components/arviointiasteikon-taso/arviointiasteikon-taso.vue'
  import AsiakirjatContent from '@/components/asiakirjat/asiakirjat-content.vue'
  import AsiakirjatUpload from '@/components/asiakirjat/asiakirjat-upload.vue'
  import ElsaBadge from '@/components/badge/badge.vue'
  import ElsaButton from '@/components/button/button.vue'
  import ElsaFormGroup from '@/components/form-group/form-group.vue'
  import ElsaFormMultiselect from '@/components/multiselect/multiselect.vue'
  import ElsaPopover from '@/components/popover/popover.vue'
  import UserAvatar from '@/components/user-avatar/user-avatar.vue'
  import ElsaVaativuustaso from '@/components/vaativuustaso/vaativuustaso.vue'
  import {
    ArviointiasteikonTaso,
    Suoritusarviointi,
    SuoritusarviointiForm,
    Arviointityokalu
  } from '@/types'
  import { resolveRolePath } from '@/utils/apiRolePathResolver'
  import {
    ArvioinninPerustuminen,
    ArviointiasteikkoTyyppi,
    vaativuustasot
  } from '@/utils/constants'
  import { mapFile } from '@/utils/fileMapper'
  import { sortByAsc } from '@/utils/sort'

  @Component({
    components: {
      ElsaFormGroup,
      ElsaFormMultiselect,
      UserAvatar,
      ElsaArviointiasteikonTaso,
      ElsaBadge,
      ElsaPopover,
      ElsaButton,
      ElsaVaativuustaso,
      AsiakirjatUpload,
      AsiakirjatContent
    },
    validations: {
      form: {
        arviointiasteikonTaso: {
          required
        },
        sanallinenArviointi: {
          required
        },
        arviointiPerustuu: {
          required: requiredIf((value) => {
            return value.perustuuMuuhun === true
          })
        },
        muuPeruste: {
          required: requiredIf((value) => {
            return value.arviointiPerustuu === ArvioinninPerustuminen.MUU
          })
        }
      }
    }
  })
  export default class ArviointiForm extends Mixins(validationMixin) {
    @Prop({ required: false, default: false })
    editing!: boolean

    @Prop({ required: true, type: Object })
    value!: Suoritusarviointi

    @Prop({ required: false, default: false })
    itsearviointi!: boolean

    // Joko arviointi tai itsearviointi
    form: SuoritusarviointiForm = {
      vaativuustaso: null,
      arviointiasteikonTaso: null,
      sanallinenArviointi: null,
      arviointityokalut: [],
      arviointiPerustuu: null,
      muuPeruste: null,
      perustuuMuuhun: false,
      arviointiAsiakirja: null,
      arviointiAsiakirjaUpdated: false,
      arviointiFile: null
    }
    vaativuustasot = vaativuustasot
    arviointiasteikonTasot: ArviointiasteikonTaso[] =
      this.value.arvioitavaKokonaisuus?.arviointiasteikko.tasot || []
    arviointityokalut: Arviointityokalu[] = []
    params = {
      saving: false
    }
    arviointiperusteet = [
      {
        text: this.$t('arviointi-perustuu-kirjallinen'),
        value: ArvioinninPerustuminen.KIRJALLINEN
      },
      {
        text: this.$t('arviointi-perustuu-etayhteys'),
        value: ArvioinninPerustuminen.ETA
      },
      {
        text: this.$t('arviointi-perustuu-muu'),
        value: ArvioinninPerustuminen.MUU
      }
    ]

    async mounted() {
      if (this.itsearviointi) {
        this.form = {
          vaativuustaso: vaativuustasot.find(
            (taso) => taso.arvo === this.value.itsearviointiVaativuustaso
          ),
          arviointiasteikonTaso: this.arviointiasteikonTasot.find(
            (asteikonTaso) => asteikonTaso.taso === this.value.itsearviointiArviointiasteikonTaso
          ),
          sanallinenArviointi: this.value.sanallinenItsearviointi,
          arviointiAsiakirjaUpdated: false
        }
      } else {
        this.form = {
          ...this.value,
          vaativuustaso: vaativuustasot.find((taso) => taso.arvo === this.value.vaativuustaso),
          arviointiasteikonTaso: this.arviointiasteikonTasot.find(
            (asteikonTaso) => asteikonTaso.taso === this.value.arviointiasteikonTaso
          ),
          sanallinenArviointi: this.value.sanallinenArviointi,
          arviointityokalut: this.value.arviointityokalut,
          arviointiPerustuu:
            this.value.arviointiPerustuu === ArvioinninPerustuminen.LASNA
              ? null
              : this.value.arviointiPerustuu,
          muuPeruste: this.value.muuPeruste,
          perustuuMuuhun:
            this.value.arviointiPerustuu !== null &&
            this.value.arviointiPerustuu !== ArvioinninPerustuminen.LASNA
        }
        this.arviointityokalut = ((await axios.get(`/arviointityokalut`))
          .data as Arviointityokalu[])?.sort((a, b) => sortByAsc(a.nimi, b.nimi))
      }
    }

    get muuValittu() {
      return this.form.arviointiPerustuu === ArvioinninPerustuminen.MUU
    }

    get arviointiAsteikonNimi() {
      return this.value.arvioitavaKokonaisuus?.arviointiasteikko.nimi ===
        ArviointiasteikkoTyyppi.EPA
        ? this.$t('luottamuksen-taso')
        : this.$t('etappi')
    }

    get asiakirjatTableItems() {
      return this.form.arviointiAsiakirja?.nimi ? [this.form.arviointiAsiakirja] : []
    }

    validateState(name: string) {
      const { $dirty, $error } = this.$v.form[name] as any
      return $dirty ? ($error ? false : null) : null
    }

    onArviointiFileAdded(files: File[]) {
      const file = files[0]
      Vue.set(this.form, 'arviointiAsiakirja', mapFile(file))
      this.form.arviointiAsiakirjaUpdated = true
      this.form.arviointiFile = file
    }

    onArviointiFileDeleted() {
      Vue.set(this.form, 'arviointiFile', null)
      this.form.arviointiAsiakirjaUpdated = true
      this.form.arviointiAsiakirja = null
    }

    onSubmit() {
      this.$v.form.$touch()
      if (this.$v.form.$anyError) {
        return
      }
      if (this.itsearviointi) {
        this.$emit(
          'submit',
          {
            ...this.value,
            itsearviointiVaativuustaso: this.form.vaativuustaso?.arvo,
            itsearviointiArviointiasteikonTaso: this.form.arviointiasteikonTaso?.taso,
            sanallinenItsearviointi: this.form.sanallinenArviointi
          },
          this.params
        )
      } else {
        this.$emit(
          'submit',
          {
            ...this.value,
            vaativuustaso: this.form.vaativuustaso?.arvo,
            arviointiasteikonTaso: this.form.arviointiasteikonTaso?.taso,
            sanallinenArviointi: this.form.sanallinenArviointi,
            arviointityokalut: this.form.arviointityokalut,
            arviointiPerustuu: this.form.perustuuMuuhun
              ? this.form.arviointiPerustuu
              : ArvioinninPerustuminen.LASNA,
            muuPeruste: this.muuValittu ? this.form.muuPeruste : null,
            arviointiAsiakirja: null,
            arviointiAsiakirjaUpdated: this.form.arviointiAsiakirjaUpdated
          },
          this.params,
          this.form.arviointiFile
        )
      }
    }

    get asiakirjaDataEndpointUrl() {
      return this.value.id
        ? `${resolveRolePath()}/suoritusarvioinnit/${this.value.id}/arviointi-liite`
        : ''
    }
  }
</script>

<style lang="scss" scoped>
  @import '~@/styles/variables';
  @import '~bootstrap/scss/mixins/breakpoints';

  .border-bottom-none {
    ::v-deep table {
      border-bottom: none;
    }
  }

  ::v-deep {
    table {
      thead th {
        border: none;
      }
      th:first-child {
        padding-left: 0;
        border-left: none;
      }
      th:last-child {
        padding-right: 0;
        border-right: none;
      }
      tbody td,
      tbody th {
        vertical-align: middle;
      }
      tbody th {
        font-weight: $font-weight-500;
      }
      tbody td:first-child {
        padding-left: 0;
      }
      tbody td:last-child {
        padding-right: 0;
        border-right: none;
      }
    }

    .arviointi-table {
      border-bottom: none;

      th {
        width: 25%;
      }

      @include media-breakpoint-down(sm) {
        th {
          padding-left: 0;
        }
        tr {
          margin-top: 0.5rem !important;
        }
        tr,
        td {
          display: block;
          padding-left: 0 !important;
        }
      }
    }
  }

  .canmeds-container {
    max-width: 450px;
  }

  .kouluttaja-form-input {
    margin-top: 10px;
  }

  .arviointi-perustuu {
    margin-left: 20px;
  }
</style>
