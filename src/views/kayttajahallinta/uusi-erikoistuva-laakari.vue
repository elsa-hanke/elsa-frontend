<template>
  <div>
    <div v-if="!loading">
      <b-form @submit.stop.prevent="onSubmit">
        <b-form-row>
          <elsa-form-group
            :label="$t('etunimi')"
            class="col-sm-12 col-md-6 pr-md-3"
            :required="true"
          >
            <template v-slot="{ uid }">
              <b-form-input
                :id="uid"
                v-model="form.etunimi"
                @input="$emit('skipRouteExitConfirm', false)"
                :state="validateState('etunimi')"
              ></b-form-input>
              <b-form-invalid-feedback :id="`${uid}-feedback`">
                {{ $t('pakollinen-tieto') }}
              </b-form-invalid-feedback>
            </template>
          </elsa-form-group>
          <elsa-form-group
            :label="$t('sukunimi')"
            class="col-sm-12 col-md-6 pl-md-3"
            :required="true"
          >
            <template v-slot="{ uid }">
              <b-form-input
                :id="uid"
                v-model="form.sukunimi"
                @input="$emit('skipRouteExitConfirm', false)"
                :state="validateState('sukunimi')"
              ></b-form-input>
              <b-form-invalid-feedback :id="`${uid}-feedback`">
                {{ $t('pakollinen-tieto') }}
              </b-form-invalid-feedback>
            </template>
          </elsa-form-group>
        </b-form-row>
        <elsa-form-group :label="$t('sahkopostiosoite')" :required="true">
          <template v-slot="{ uid }">
            <b-form-input
              :id="uid"
              v-model="form.sahkopostiosoite"
              @input="$emit('skipRouteExitConfirm', false)"
              :state="validateState('sahkopostiosoite')"
            ></b-form-input>
            <b-form-invalid-feedback :id="`${uid}-feedback`">
              {{ $t('pakollinen-tieto') }}
            </b-form-invalid-feedback>
          </template>
        </elsa-form-group>
        <elsa-form-group :label="$t('sahkopostiosoite-uudelleen')" :required="true">
          <template v-slot="{ uid }">
            <b-form-input
              :id="uid"
              v-model="form.sahkopostiosoiteUudelleen"
              @input="$emit('skipRouteExitConfirm', false)"
              :state="validateState('sahkopostiosoiteUudelleen')"
            ></b-form-input>
            <b-form-invalid-feedback :id="`${uid}-feedback`">
              {{ $t('pakollinen-tieto') }}
            </b-form-invalid-feedback>
          </template>
        </elsa-form-group>
        <hr />
        <h2>{{ $t('opintooikeus') }}</h2>
        <div class="border rounded p-3 mb-4">
          <elsa-form-group v-if="yliopistot.length > 1" :label="$t('yliopisto')" :required="true">
            <template v-slot="{ uid }">
              <elsa-form-multiselect
                :id="uid"
                v-model="form.yliopisto"
                @input="$emit('skipRouteExitConfirm', false)"
                :options="yliopistot"
                :state="validateState('yliopisto')"
                :custom-label="(value) => $t(`yliopisto-nimi.${value.nimi}`)"
                track-by="id"
              />
              <b-form-invalid-feedback :id="`${uid}-feedback`">
                {{ $t('pakollinen-tieto') }}
              </b-form-invalid-feedback>
            </template>
          </elsa-form-group>
          <elsa-form-group v-else :label="$t('yliopisto')">
            <template v-slot="{ uid }">
              <span :id="uid">{{ $t(`yliopisto-nimi.${form.yliopisto.nimi}`) }}</span>
            </template>
          </elsa-form-group>
          <elsa-form-group :label="$t('erikoisala')" :required="true">
            <template v-slot="{ uid }">
              <elsa-form-multiselect
                :id="uid"
                v-model="form.erikoisala"
                @input="$emit('skipRouteExitConfirm', false)"
                :options="erikoisalatSorted"
                :state="validateState('erikoisala')"
                label="nimi"
                track-by="id"
                @select="onErikoisalaSelected"
              />
              <b-form-invalid-feedback :id="`${uid}-feedback`">
                {{ $t('pakollinen-tieto') }}
              </b-form-invalid-feedback>
            </template>
          </elsa-form-group>
          <elsa-form-group :label="$t('opiskelijatunnus')">
            <template v-slot="{ uid }">
              <b-form-input
                :id="uid"
                v-model="form.opiskelijatunnus"
                @input="$emit('skipRouteExitConfirm', false)"
              ></b-form-input>
              <b-form-invalid-feedback :id="`${uid}-feedback`">
                {{ $t('pakollinen-tieto') }}
              </b-form-invalid-feedback>
            </template>
          </elsa-form-group>
          <b-form-row>
            <elsa-form-group
              :label="$t('opintooikeuden-alkupvm')"
              class="col-xs-12 col-sm-6 pr-sm-3"
              :required="true"
            >
              <template v-slot="{ uid }">
                <elsa-form-datepicker
                  ref="opiskeluoikeudenAlkamispaiva"
                  :id="uid"
                  :value.sync="form.opintooikeusAlkaa"
                  @input="onOpiskeluoikeudenAlkamispaivaChange"
                  :max="maxAlkamispaiva"
                  :maxErrorText="$t('alkamispaiva-ei-voi-olla-paattymispaivan-jalkeen')"
                ></elsa-form-datepicker>
              </template>
            </elsa-form-group>
            <elsa-form-group
              :label="$t('opintooikeuden-loppupvm')"
              class="col-xs-12 col-sm-6 pl-sm-3"
              :required="true"
            >
              <template v-slot="{ uid }">
                <elsa-form-datepicker
                  ref="opiskeluoikeudenPaattymispaiva"
                  :id="uid"
                  :value.sync="form.opintooikeusPaattyy"
                  @input="$emit('skipRouteExitConfirm', false)"
                  :min="minPaattymispaiva"
                  :minErrorText="$t('paattymispaiva-ei-voi-olla-ennen-alkamispaivaa')"
                  class="datepicker-range"
                ></elsa-form-datepicker>
              </template>
            </elsa-form-group>
          </b-form-row>
          <elsa-form-group :label="$t('asetus')" :required="true">
            <template v-slot="{ uid }">
              <b-form-radio-group
                :id="uid"
                v-model="form.asetusId"
                @input="$emit('skipRouteExitConfirm', false)"
                :options="asetuksetSorted"
                value-field="id"
                text-field="nimi"
                stacked
                :state="validateState('asetusId')"
              />
            </template>
          </elsa-form-group>
          <elsa-form-group :label="$t('kaytossa-oleva-opintoopas')" :required="true">
            <template v-slot="{ uid }">
              <elsa-form-multiselect
                :id="uid"
                v-model="form.opintoopas"
                @input="$emit('skipRouteExitConfirm', false)"
                :options="opintooppaatFilteredAndSorted"
                :state="validateState('opintoopas')"
                label="nimi"
                value-field="id"
                track-by="id"
              />
              <b-form-invalid-feedback :id="`${uid}-feedback`">
                {{ $t('pakollinen-tieto') }}
              </b-form-invalid-feedback>
            </template>
          </elsa-form-group>
          <elsa-form-group :label="$t('osaamisen-arvioinnin-oppaan-paivamaara')" :required="true">
            <template v-slot="{ uid }">
              <elsa-form-datepicker
                ref="osaamisenArvioinninOppaanPvm"
                :id="uid"
                :value.sync="form.osaamisenArvioinninOppaanPvm"
                @input="$emit('skipRouteExitConfirm', false)"
              ></elsa-form-datepicker>
            </template>
          </elsa-form-group>
        </div>
        <div class="d-flex flex-row-reverse flex-wrap">
          <elsa-button :loading="saving" type="submit" variant="primary" class="ml-2 mb-2">
            {{ $t('tallenna') }}
          </elsa-button>
          <elsa-button variant="back" @click.stop.prevent="onCancel" class="mb-2">
            {{ $t('peruuta') }}
          </elsa-button>
        </div>
        <div class="row">
          <elsa-form-error :active="this.$v.$anyError" />
        </div>
      </b-form>
    </div>
    <div v-else class="text-center">
      <b-spinner variant="primary" :label="$t('ladataan')" />
    </div>
  </div>
</template>

<script lang="ts">
  import { AxiosError } from 'axios'
  import Component from 'vue-class-component'
  import { Mixins } from 'vue-property-decorator'
  import { validationMixin } from 'vuelidate'
  import { required, email, sameAs } from 'vuelidate/lib/validators'

  import { getErikoistuvaLaakariLomake, postErikoistuvaLaakari } from '@/api/kayttajahallinta'
  import ElsaButton from '@/components/button/button.vue'
  import ElsaFormDatepicker from '@/components/datepicker/datepicker.vue'
  import ElsaFormError from '@/components/form-error/form-error.vue'
  import ElsaFormGroup from '@/components/form-group/form-group.vue'
  import ElsaFormMultiselect from '@/components/multiselect/multiselect.vue'
  import {
    ElsaError,
    ErikoistuvaLaakariLomake,
    UusiErikoistuvaLaakari,
    OpintoopasSimple
  } from '@/types'
  import { dateBetween } from '@/utils/date'
  import { sortByAsc } from '@/utils/sort'
  import { toastFail, toastSuccess } from '@/utils/toast'

  @Component({
    components: {
      ElsaFormGroup,
      ElsaFormError,
      ElsaButton,
      ElsaFormDatepicker,
      ElsaFormMultiselect
    },
    validations: {
      form: {
        etunimi: {
          required
        },
        sukunimi: {
          required
        },
        sahkopostiosoite: {
          required,
          email
        },
        sahkopostiosoiteUudelleen: {
          required,
          sameAsSahkopostiosoite: sameAs('sahkopostiosoite')
        },
        yliopisto: {
          required
        },
        erikoisala: {
          required
        },
        asetusId: {
          required
        },
        opintoopas: {
          required
        },
        osaamisenArvioinninOppaanPvm: {
          required
        }
      }
    }
  })
  export default class ErikoistuvaLaakariForm extends Mixins(validationMixin) {
    $refs!: {
      opiskeluoikeudenAlkamispaiva: ElsaFormDatepicker
      opiskeluoikeudenPaattymispaiva: ElsaFormDatepicker
      osaamisenArvioinninOppaanPvm: ElsaFormDatepicker
    }

    form: UusiErikoistuvaLaakari = {
      etunimi: null,
      sukunimi: null,
      sahkopostiosoite: null,
      sahkopostiosoiteUudelleen: null,
      yliopisto: null,
      erikoisala: null,
      opiskelijatunnus: null,
      opintooikeusAlkaa: null,
      opintooikeusPaattyy: null,
      asetusId: null,
      opintoopas: null,
      osaamisenArvioinninOppaanPvm: null
    }
    erikoistuvaLaakariLomake: null | ErikoistuvaLaakariLomake = null
    saving = false
    loading = true

    async mounted() {
      await this.fetchLomake()
      if (this.asetuksetSorted && this.asetuksetSorted.length > 0) {
        this.form.asetusId = this.asetuksetSorted[0].id ?? null
      }
      this.loading = false
    }

    async fetchLomake() {
      try {
        this.erikoistuvaLaakariLomake = (await getErikoistuvaLaakariLomake()).data
        if (this.yliopistot.length === 1) {
          this.form.yliopisto = this.yliopistot[0]
        }
      } catch {
        toastFail(this, this.$t('kayttajalomakkeen-hakeminen-epaonnistui'))
      }
    }

    async onSubmit() {
      const validations = [
        this.validateForm(),
        this.$refs.opiskeluoikeudenAlkamispaiva.validateForm(),
        this.$refs.opiskeluoikeudenPaattymispaiva.validateForm(),
        this.$refs.osaamisenArvioinninOppaanPvm.validateForm()
      ]
      if (validations.includes(false)) {
        return
      }

      try {
        let kayttajaId: number | null = null
        kayttajaId = (
          await postErikoistuvaLaakari({
            ...this.form,
            yliopistoId: this.form.yliopisto?.id,
            erikoisalaId: this.form.erikoisala?.id,
            opintoopasId: this.form.opintoopas?.id
          })
        ).data.kayttajaId

        toastSuccess(this, this.$t('kayttaja-lisatty-ja-kutsulinkki-lahetetty'))
        this.$emit('skipRouteExitConfirm', true)
        this.$router.push({
          name: 'erikoistuva-laakari',
          params: { kayttajaId: `${kayttajaId}` }
        })
      } catch (err) {
        const axiosError = err as AxiosError<ElsaError>
        const message = axiosError?.response?.data?.message
        toastFail(
          this,
          message
            ? `${this.$t('uuden-kayttajan-lisaaminen-epaonnistui')}: ${this.$t(message)}`
            : this.$t('uuden-kayttajan-lisaaminen-epaonnistui')
        )
      }
      this.saving = false
    }

    onCancel() {
      this.$router.push({
        name: 'kayttajahallinta'
      })
    }

    get yliopistot() {
      return this.erikoistuvaLaakariLomake?.yliopistot ?? []
    }

    get erikoisalat() {
      return this.erikoistuvaLaakariLomake?.erikoisalat ?? []
    }

    get asetukset() {
      return this.erikoistuvaLaakariLomake?.asetukset ?? []
    }

    get opintooppaat() {
      return this.erikoistuvaLaakariLomake?.opintooppaat ?? []
    }

    validateState(name: string) {
      const { $dirty, $error } = this.$v.form?.[name] as any
      return $dirty ? ($error ? false : null) : null
    }

    get maxAlkamispaiva() {
      return this.form.opintooikeusPaattyy
    }

    get minPaattymispaiva() {
      return this.form.opintooikeusAlkaa
    }

    onOpiskeluoikeudenAlkamispaivaChange(value: string) {
      this.$emit('skipRouteExitConfirm', false)

      this.form.osaamisenArvioinninOppaanPvm = value

      const opintoopas = this.opintooppaatFilteredAndSorted.find((o) =>
        dateBetween(value, o.voimassaoloAlkaa, o.voimassaoloPaattyy ?? undefined)
      )
      if (opintoopas) {
        this.form.opintoopas = opintoopas
      }
    }

    validateForm(): boolean {
      this.$v.form.$touch()
      return !this.$v.$anyError
    }

    onErikoisalaSelected() {
      this.form.opintoopas = null
    }

    get opintooppaatFilteredAndSorted() {
      let opintooppaat: OpintoopasSimple[]
      if (this.form.erikoisala) {
        opintooppaat = this.opintooppaat.filter((o) => o.erikoisalaId === this.form.erikoisala?.id)
      } else {
        opintooppaat = this.opintooppaat
      }
      return opintooppaat.sort((a, b) => sortByAsc(a.nimi, b.nimi))
    }

    get asetuksetSorted() {
      if (this.asetukset) {
        return this.asetukset.sort((a, b) => (a.id ?? 0) - (b.id ?? 0)).reverse()
      } else {
        return []
      }
    }

    get erikoisalatSorted() {
      return this.erikoisalat.sort((a, b) => sortByAsc(a.nimi, b.nimi))
    }
  }
</script>

<style lang="scss" scoped>
  @import '~@/styles/variables';
  @import '~bootstrap/scss/mixins/breakpoints';

  .datepicker-range::before {
    content: '–';
    position: absolute;
    left: -1.5rem;
    padding: 0.375rem 0.75rem;
    @include media-breakpoint-down(xs) {
      display: none;
    }
  }
</style>
