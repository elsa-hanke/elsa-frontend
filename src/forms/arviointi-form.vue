<template>
  <b-form @submit.stop.prevent="onSubmit">
    <elsa-form-group
      :label="$t('erikoistuva-laakari')"
      label-cols-md="4"
      label-cols-xl="3"
      label-cols="12"
      class="align-items-center mb-md-0"
    >
      <template v-slot="{ uid }">
        <user-avatar
          :id="uid"
          :src-base64="value.arvioinninSaaja.avatar"
          src-content-type="image/jpeg"
          :display-name="value.arvioinninSaaja.nimi"
        />
      </template>
    </elsa-form-group>
    <elsa-form-group
      :label="$t('tyoskentelyjakso')"
      label-cols-md="4"
      label-cols-xl="3"
      label-cols="12"
      class="align-items-center mb-md-0"
    >
      <template v-slot="{ uid }">
        <span :id="uid">
          {{ value.tyoskentelyjakso.tyoskentelypaikka.nimi }} ({{
            value.tyoskentelyjakso.alkamispaiva ? $date(value.tyoskentelyjakso.alkamispaiva) : ''
          }}
          –
          {{
            value.tyoskentelyjakso.paattymispaiva
              ? $date(value.tyoskentelyjakso.paattymispaiva)
              : $t('kesken') | lowercase
          }})
        </span>
      </template>
    </elsa-form-group>
    <elsa-form-group
      :label="$t('arvioitava-kokonaisuus')"
      label-cols-md="4"
      label-cols-xl="3"
      label-cols="12"
      class="align-items-center mb-md-0"
    >
      <template v-slot="{ uid }">
        <div :id="uid">
          {{ value.arvioitavaOsaalue.kategoria.nimi }}:
          {{ value.arvioitavaOsaalue.nimi }}
          <elsa-popover>
            <template>
              <p v-html="value.arvioitavaOsaalue.kuvaus" />
            </template>
          </elsa-popover>
        </div>
      </template>
    </elsa-form-group>
    <elsa-form-group
      :label="$t('arvioitava-tapahtuma')"
      label-cols-md="4"
      label-cols-xl="3"
      label-cols="12"
      class="align-items-center mb-md-0"
    >
      <template v-slot="{ uid }">
        <span :id="uid">{{ value.arvioitavaTapahtuma }}</span>
      </template>
    </elsa-form-group>
    <elsa-form-group
      :label="$t('ajankohta')"
      label-cols-md="4"
      label-cols-xl="3"
      label-cols="12"
      class="align-items-center mb-md-0"
    >
      <template v-slot="{ uid }">
        <span :id="uid">{{ $date(value.tapahtumanAjankohta) }}</span>
      </template>
    </elsa-form-group>
    <elsa-form-group
      v-if="value.lisatiedot"
      :label="$t('lisatiedot')"
      label-cols-md="4"
      label-cols-xl="3"
      label-cols="12"
      class="align-items-center mb-md-0"
    >
      <template v-slot="{ uid }">
        <span :id="uid" class="text-preline text-break">{{ value.lisatiedot }}</span>
      </template>
    </elsa-form-group>
    <elsa-form-group
      :label="$t('arvioija')"
      label-cols-md="4"
      label-cols-xl="3"
      label-cols="12"
      class="align-items-center mb-md-0 kouluttaja-form-input"
    >
      <template v-slot="{ uid }">
        <user-avatar
          :id="uid"
          :src-base64="value.arvioinninAntaja.avatar"
          src-content-type="image/jpeg"
          :display-name="value.arvioinninAntaja.nimi"
        />
      </template>
    </elsa-form-group>
    <div v-if="!editing">
      <elsa-form-group
        :label="$t('arviointipaiva')"
        label-cols-md="4"
        label-cols-xl="3"
        label-cols="12"
        class="align-items-center mb-md-0"
      >
        <template v-slot="{ uid }">
          <span :id="uid" class="text-preline text-break">
            {{ value.arviointiAika ? $date(value.arviointiAika) : '' }}
          </span>
        </template>
      </elsa-form-group>
      <elsa-form-group
        :label="$t('arviointityokalu')"
        label-cols-md="4"
        label-cols-xl="3"
        label-cols="12"
        class="align-items-center mb-md-0"
      >
        <template v-slot="{ uid }">
          <span :id="uid" class="text-preline text-break">
            {{ value.arviointityokalut.map((el) => el.nimi).join(', ') }}
          </span>
        </template>
      </elsa-form-group>
      <elsa-form-group
        :label="$t('arviointi-perustuu')"
        label-cols-md="4"
        label-cols-xl="3"
        label-cols="12"
        class="align-items-center mb-md-0"
      >
        <template v-slot="{ uid }">
          <span :id="uid" class="text-preline text-break">
            {{ muuValittu ? value.muuPeruste : $t(value.arviointiPerustuu) }}
          </span>
        </template>
      </elsa-form-group>
      <b-table-simple responsive bordered>
        <b-thead>
          <b-tr>
            <b-th scope="col" style="width: 24%"></b-th>
            <b-th scope="col" style="width: 38%">{{ $t('arviointi') }}</b-th>
            <b-th scope="col" style="width: 38%">
              {{ $t('itsearviointi') }}
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
                :tasot="value.arvioitavaOsaalue.arviointiasteikko.tasot"
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
                :tasot="value.arvioitavaOsaalue.arviointiasteikko.tasot"
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
      <elsa-form-group v-if="value.arviointiAika" :label="$t('sanallinen-arviointi')">
        <template v-slot="{ uid }">
          <p :id="uid" class="text-preline text-break">{{ value.sanallinenArviointi }}</p>
        </template>
      </elsa-form-group>
      <hr v-if="value.arviointiAsiakirja.nimi" />
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
      <div v-if="value.arviointiAika && ($isKouluttaja() || $isVastuuhenkilo())" class="text-right">
        <hr v-if="value.arviointiAsiakirja.nimi" />
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
      <elsa-form-group v-if="value.itsearviointiAika" :label="$t('sanallinen-itsearviointi')">
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
                    {{ asteikonTaso.taso }} {{ $t('arviointiasteikon-taso-' + asteikonTaso.nimi) }}
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
        <elsa-form-group :label="$t('vaativuustaso')" :required="true" class="col-lg-6">
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
              :state="validateState('vaativuustaso')"
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
          {{ $t('laheta') }}
        </elsa-button>
      </div>
    </div>
  </b-form>
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
        vaativuustaso: {
          required
        },
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
      this.value.arvioitavaOsaalue?.arviointiasteikko.tasot || []
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
      return this.value.arvioitavaOsaalue?.arviointiasteikko.nimi === ArviointiasteikkoTyyppi.EPA
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
          null,
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
          this.form.arviointiFile,
          this.params
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

  .border-bottom-none {
    ::v-deep table {
      border-bottom: none;
    }
  }

  ::v-deep table {
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
