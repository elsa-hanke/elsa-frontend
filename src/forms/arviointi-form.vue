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
      :label="$t('epa-osaamisalue')"
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
              <h3>{{ value.arvioitavaOsaalue.nimi }}</h3>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                incididunt ut labore et dolore magna aliqua.
              </p>
              <p>
                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
                ex ea commodo consequat.
              </p>
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
        <thead>
          <tr>
            <th scope="col" style="width: 24%"></th>
            <th scope="col" style="width: 38%">{{ $t('arviointi') }}</th>
            <th scope="col" style="width: 38%">
              {{ $t('itsearviointi') }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">
              {{ $t('luottamuksen-taso') }}
              <elsa-popover>
                <template>
                  <h3>{{ $t('luottamuksen-taso') }}</h3>
                  <div v-for="(taso, index) in luottamuksenTasot" :key="index">
                    <h4>{{ taso.arvo }} {{ $t(taso.nimi) }}</h4>
                    <p>{{ $t(taso.kuvaus) }}</p>
                  </div>
                </template>
              </elsa-popover>
            </th>
            <td>
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
              <elsa-luottamuksen-taso v-if="value.arviointiAika" :value="value.luottamuksenTaso" />
            </td>
            <td>
              <div v-if="!value.itsearviointiAika" class="d-inline-flex">
                <elsa-button
                  v-if="$isErikoistuva()"
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
                <span class="text-size-sm text-lighter ml-2" v-else>
                  {{ $t('itsearviointia-ei-tehty') }}
                </span>
              </div>
              <elsa-luottamuksen-taso
                v-if="value.itsearviointiAika"
                :value="value.itsearviointiLuottamuksenTaso"
              />
            </td>
          </tr>
          <tr>
            <th scope="row">
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
            </th>
            <td>
              <elsa-vaativuustaso v-if="value.vaativuustaso" :value="value.vaativuustaso" />
            </td>
            <td>
              <elsa-vaativuustaso
                v-if="value.itsearviointiAika"
                :value="value.itsearviointiVaativuustaso"
              />
            </td>
          </tr>
        </tbody>
      </b-table-simple>
      <elsa-form-group v-if="value.arviointiAika" :label="$t('sanallinen-arviointi')">
        <template v-slot="{ uid }">
          <p :id="uid" class="text-preline text-break">{{ value.sanallinenArviointi }}</p>
        </template>
      </elsa-form-group>
      <div
        v-if="!value.lukittu && value.arviointiAika && ($isKouluttaja() || $isVastuuhenkilo())"
        class="text-right"
      >
        <elsa-button
          variant="primary"
          :to="{
            name: 'muokkaa-arviointia',
            params: { arviointiId: value.id }
          }"
        >
          {{ $t('muokkaa-arviointia') }}
        </elsa-button>
      </div>
      <elsa-form-group v-if="value.itsearviointiAika" :label="$t('sanallinen-itsearviointi')">
        <template v-slot="{ uid }">
          <p :id="uid" class="text-preline text-break">
            {{ value.sanallinenItsearviointi }}
          </p>
        </template>
      </elsa-form-group>
      <div v-if="!value.lukittu && value.itsearviointiAika && $isErikoistuva()" class="text-right">
        <elsa-button
          variant="primary"
          :to="{
            name: 'itsearviointi',
            params: { arviointiId: value.id }
          }"
        >
          {{ $t('muokkaa-itsearviointia') }}
        </elsa-button>
      </div>
    </div>
    <div v-else>
      <hr />
      <b-form-row>
        <elsa-form-group :label="$t('luottamuksen-taso')" :required="true" class="col-lg-6">
          <template #label-help>
            <elsa-popover>
              <template>
                <h3>{{ $t('luottamuksen-taso') }}</h3>
                <div v-for="(taso, index) in luottamuksenTasot" :key="index">
                  <h4>{{ taso.arvo }} {{ $t(taso.nimi) }}</h4>
                  <p>{{ $t(taso.kuvaus) }}</p>
                </div>
              </template>
            </elsa-popover>
          </template>
          <template v-slot="{ uid }">
            <elsa-form-multiselect
              :id="uid"
              v-model="form.luottamuksenTaso"
              :options="luottamuksenTasot"
              :state="validateState('luottamuksenTaso')"
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
  import { Mixins, Prop } from 'vue-property-decorator'
  import { validationMixin } from 'vuelidate'
  import { required, requiredIf } from 'vuelidate/lib/validators'

  import ElsaBadge from '@/components/badge/badge.vue'
  import ElsaButton from '@/components/button/button.vue'
  import ElsaFormGroup from '@/components/form-group/form-group.vue'
  import ElsaLuottamuksenTaso from '@/components/luottamuksen-taso/luottamuksen-taso.vue'
  import ElsaFormMultiselect from '@/components/multiselect/multiselect.vue'
  import ElsaPopover from '@/components/popover/popover.vue'
  import UserAvatar from '@/components/user-avatar/user-avatar.vue'
  import ElsaVaativuustaso from '@/components/vaativuustaso/vaativuustaso.vue'
  import { vaativuustasot, luottamuksenTasot, arvioinninPerustuminen } from '@/utils/constants'

  @Component({
    components: {
      ElsaFormGroup,
      ElsaFormMultiselect,
      UserAvatar,
      ElsaLuottamuksenTaso,
      ElsaBadge,
      ElsaPopover,
      ElsaButton,
      ElsaVaativuustaso
    },
    validations: {
      form: {
        vaativuustaso: {
          required
        },
        luottamuksenTaso: {
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
            return value.arviointiPerustuu === arvioinninPerustuminen.Muu
          })
        }
      }
    }
  })
  export default class ArviointiForm extends Mixins(validationMixin) {
    @Prop({ required: false, default: false })
    editing!: boolean

    @Prop({ required: true, type: Object })
    value!: any

    @Prop({ required: false, default: false })
    itsearviointi!: boolean

    // Joko arviointi tai itsearviointi
    form: any = {
      vaativuustaso: null,
      luottamuksenTaso: null,
      sanallinenArviointi: null,
      arviointityokalut: [],
      arviointiPerustuu: null,
      muuPeruste: null,
      perustuuMuuhun: false
    }
    vaativuustasot = vaativuustasot
    luottamuksenTasot = luottamuksenTasot
    arviointityokalut = []
    params = {
      saving: false
    }
    arviointiperusteet = [
      {
        text: this.$t('arviointi-perustuu-kirjallinen'),
        value: arvioinninPerustuminen.KirjallinenMateriaali
      },
      {
        text: this.$t('arviointi-perustuu-etayhteys'),
        value: arvioinninPerustuminen.Etayhteys
      },
      {
        text: this.$t('arviointi-perustuu-muu'),
        value: arvioinninPerustuminen.Muu
      }
    ]

    async mounted() {
      if (this.itsearviointi) {
        this.form = {
          vaativuustaso: vaativuustasot.find(
            (taso) => taso.arvo === this.value.itsearviointiVaativuustaso
          ),
          luottamuksenTaso: luottamuksenTasot.find(
            (taso) => taso.arvo === this.value.itsearviointiLuottamuksenTaso
          ),
          sanallinenArviointi: this.value.sanallinenItsearviointi
        }
      } else {
        this.form = {
          vaativuustaso: vaativuustasot.find((taso) => taso.arvo === this.value.vaativuustaso),
          luottamuksenTaso: luottamuksenTasot.find(
            (taso) => taso.arvo === this.value.luottamuksenTaso
          ),
          sanallinenArviointi: this.value.sanallinenArviointi,
          arviointityokalut: this.value.arviointityokalut,
          arviointiPerustuu:
            this.value.arviointiPerustuu === arvioinninPerustuminen.LasnaolevaHavainnointi
              ? null
              : this.value.arviointiPerustuu,
          muuPeruste: this.value.muuPeruste,
          perustuuMuuhun:
            this.value.arviointiPerustuu !== null &&
            this.value.arviointiPerustuu !== arvioinninPerustuminen.LasnaolevaHavainnointi
        }
        this.arviointityokalut = (await axios.get(`/arviointityokalut`)).data
      }
    }

    get muuValittu() {
      return this.form.arviointiPerustuu === arvioinninPerustuminen.Muu
    }

    validateState(name: string) {
      const { $dirty, $error } = this.$v.form[name] as any
      return $dirty ? ($error ? false : null) : null
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
            itsearviointiVaativuustaso: this.form.vaativuustaso.arvo,
            itsearviointiLuottamuksenTaso: this.form.luottamuksenTaso.arvo,
            sanallinenItsearviointi: this.form.sanallinenArviointi
          },
          this.params
        )
      } else {
        this.$emit(
          'submit',
          {
            ...this.value,
            vaativuustaso: this.form.vaativuustaso.arvo,
            luottamuksenTaso: this.form.luottamuksenTaso.arvo,
            sanallinenArviointi: this.form.sanallinenArviointi,
            arviointityokalut: this.form.arviointityokalut,
            arviointiPerustuu: this.form.perustuuMuuhun
              ? this.form.arviointiPerustuu
              : arvioinninPerustuminen.LasnaolevaHavainnointi,
            muuPeruste: this.muuValittu ? this.form.muuPeruste : null
          },
          this.params
        )
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '~@/styles/variables';

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
