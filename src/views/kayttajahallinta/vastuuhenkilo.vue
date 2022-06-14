<template>
  <div class="kayttaja">
    <b-breadcrumb :items="items" class="mb-0" />
    <b-container fluid>
      <b-row lg>
        <b-col>
          <h1>{{ $t('kayttaja') }}</h1>
          <hr />
          <div v-if="kayttajaWrapper">
            <elsa-form-group :label="$t('tilin-tila')">
              <template v-slot="{ uid }">
                <span :id="uid" :class="tilaColor">{{ tilinTilaText }}</span>
              </template>
            </elsa-form-group>
            <elsa-form-group v-if="rooli" :label="$t('rooli')">
              <template v-slot="{ uid }">
                <span :id="uid">{{ rooli }}</span>
              </template>
            </elsa-form-group>
            <b-form-row>
              <elsa-form-group :label="$t('etunimi')" class="col-sm-12 col-md-6 pr-md-3">
                <template v-slot="{ uid }">
                  <span :id="uid">{{ etunimi }}</span>
                </template>
              </elsa-form-group>
              <elsa-form-group :label="$t('sukunimi')" class="col-sm-12 col-md-6 pl-md-3">
                <template v-slot="{ uid }">
                  <span :id="uid">{{ sukunimi }}</span>
                </template>
              </elsa-form-group>
            </b-form-row>
            <div v-if="editing">
              <elsa-form-group :label="$t('sahkopostiosoite')" :required="true">
                <template v-slot="{ uid }">
                  <b-form-input
                    :id="uid"
                    v-model="form.sahkoposti"
                    @input="skipRouteExitConfirm = false"
                    :state="validateState('sahkoposti')"
                  ></b-form-input>
                  <b-form-invalid-feedback
                    v-if="!$v.form.sahkoposti.required"
                    :id="`${uid}-feedback`"
                  >
                    {{ $t('pakollinen-tieto') }}
                  </b-form-invalid-feedback>
                  <b-form-invalid-feedback v-if="!$v.form.sahkoposti.email" :id="`${uid}-feedback`">
                    {{ $t('sahkopostiosoite-ei-kelvollinen') }}
                  </b-form-invalid-feedback>
                </template>
              </elsa-form-group>
              <elsa-form-group :label="$t('sahkopostiosoite-uudelleen')" :required="true">
                <template v-slot="{ uid }">
                  <b-form-input
                    :id="uid"
                    v-model="form.sahkopostiUudelleen"
                    @input="skipRouteExitConfirm = false"
                    :state="validateState('sahkopostiUudelleen')"
                  ></b-form-input>
                  <b-form-invalid-feedback
                    v-if="!$v.form.sahkopostiUudelleen.required"
                    :id="`${uid}-feedback`"
                  >
                    {{ $t('pakollinen-tieto') }}
                  </b-form-invalid-feedback>
                  <b-form-invalid-feedback
                    v-if="!$v.form.sahkopostiUudelleen.email"
                    :id="`${uid}-feedback`"
                  >
                    {{ $t('sahkopostiosoite-ei-kelvollinen') }}
                  </b-form-invalid-feedback>
                  <b-form-invalid-feedback
                    v-if="
                      $v.form.sahkopostiUudelleen.required &&
                      $v.form.sahkopostiUudelleen.email &&
                      !$v.form.sahkopostiUudelleen.sameAsSahkoposti
                    "
                    :id="`${uid}-feedback`"
                  >
                    {{ $t('sahkopostiosoitteet-eivat-tasmaa') }}
                  </b-form-invalid-feedback>
                </template>
              </elsa-form-group>
            </div>
            <div v-else>
              <elsa-form-group :label="$t('sahkopostiosoite')">
                <template v-slot="{ uid }">
                  <span :id="uid">
                    {{ form.sahkoposti }}
                  </span>
                </template>
              </elsa-form-group>
            </div>
            <hr />
            <h2 class="mb-3">{{ $t('yliopisto-ja-erikoisalat') }}</h2>
            <elsa-form-group :label="$t('yliopisto')">
              <template v-slot="{ uid }">
                <span :id="uid">{{ $t(`yliopisto-nimi.${yliopisto.nimi}`) }}</span>
              </template>
            </elsa-form-group>
            <elsa-form-group
              :required="editing && isKutsuttu"
              :label="$t('yliopiston-kayttajatunnus')"
            >
              <template v-slot="{ uid }">
                <div v-if="editing && isKutsuttu">
                  <b-form-input
                    class="col-sm-12 col-md-6 pr-md-3"
                    :id="uid"
                    v-model="form.eppn"
                    @input="skipRouteExitConfirm = false"
                    :state="validateState('eppn')"
                  ></b-form-input>
                  <b-form-invalid-feedback :id="`${uid}-feedback`">
                    {{ $t('pakollinen-tieto') }}
                  </b-form-invalid-feedback>
                </div>
                <div v-else>
                  <span :id="uid">{{ form.eppn }}</span>
                </div>
              </template>
            </elsa-form-group>
            <vastuuhenkilon-tehtavat
              :yliopisto="yliopisto"
              :kayttajaId="kayttajaId"
              :yliopistotAndErikoisalat="yliopistotAndErikoisalat"
              :editing="editing"
              :disabled="updatingKayttaja"
              @skipRouteExitConfirm="(value) => (skipRouteExitConfirm = value)"
              ref="vastuuhenkilonTehtavat"
            />
            <div class="d-flex flex-row-reverse flex-wrap">
              <elsa-button
                v-if="editing"
                variant="primary"
                @click="onSave"
                :loading="updatingKayttaja"
                class="mb-3 ml-3"
              >
                {{ $t('tallenna') }}
              </elsa-button>
              <elsa-button
                v-else
                variant="primary"
                @click="onEditUser"
                :disabled="updatingTila"
                class="mb-3 ml-3"
              >
                {{ $t('muokkaa-kayttajaa') }}
              </elsa-button>
              <elsa-button
                v-if="isPassiivinen"
                variant="outline-success"
                :loading="updatingTila"
                :disabled="updatingKayttaja"
                @click="onActivateKayttaja"
                class="mb-3"
              >
                {{ $t('aktivoi-kayttaja') }}
              </elsa-button>
              <elsa-button
                v-else-if="isAktiivinen || isKutsuttu"
                variant="outline-danger"
                :loading="updatingTila"
                :disabled="updatingKayttaja"
                @click="onPassivateKayttaja"
                class="mb-3"
              >
                {{ $t('passivoi-kayttaja') }}
              </elsa-button>
              <elsa-button
                v-if="editing"
                variant="back"
                :disabled="updatingKayttaja"
                @click.stop.prevent="onCancel"
                class="mb-3 mr-3"
              >
                {{ $t('peruuta') }}
              </elsa-button>
              <elsa-button
                v-if="!editing"
                :disabled="updatingTila"
                :to="{ name: 'kayttajahallinta', hash: '#vastuuhenkilot' }"
                variant="link"
                class="mb-3 mr-auto font-weight-500 kayttajahallinta-link"
              >
                {{ $t('palaa-kayttajahallintaan') }}
              </elsa-button>
            </div>
          </div>
          <div v-else class="text-center">
            <b-spinner variant="primary" :label="$t('ladataan')" />
          </div>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script lang="ts">
  import { AxiosError } from 'axios'
  import { Component, Mixins } from 'vue-property-decorator'
  import { required, email, sameAs } from 'vuelidate/lib/validators'

  import { getVastuuhenkilo, putVastuuhenkilo } from '@/api/kayttajahallinta'
  import ElsaButton from '@/components/button/button.vue'
  import ElsaFormGroup from '@/components/form-group/form-group.vue'
  import KayttajahallintaKayttajaMixin from '@/mixins/kayttajahallinta-kayttaja'
  import {
    KayttajahallintaUpdateKayttaja,
    ErikoisalaForVastuuhenkilonTehtavat,
    ElsaError,
    KayttajaYliopistoErikoisala,
    VastuuhenkilonTehtava,
    ReassignedVastuuhenkilonTehtava
  } from '@/types'
  import { confirmExit } from '@/utils/confirm'
  import { toastFail, toastSuccess } from '@/utils/toast'
  import VastuuhenkilonTehtavat from '@/views/kayttajahallinta/vastuuhenkilon-tehtavat.vue'

  @Component({
    components: {
      ElsaButton,
      ElsaFormGroup,
      VastuuhenkilonTehtavat
    },
    validations: {
      form: {
        sahkoposti: {
          required,
          email
        },
        sahkopostiUudelleen: {
          required,
          email,
          sameAsSahkoposti: sameAs('sahkoposti')
        },
        eppn: {
          required
        }
      }
    }
  })
  export default class VastuuhenkiloView extends Mixins(KayttajahallintaKayttajaMixin) {
    $refs!: {
      vastuuhenkilonTehtavat: any
    }

    items = [
      {
        text: this.$t('kayttajahallinta'),
        to: { name: 'kayttajahallinta' }
      },
      {
        text: this.$t('kayttaja'),
        active: true
      }
    ]

    form: KayttajahallintaUpdateKayttaja = {
      sahkoposti: null,
      sahkopostiUudelleen: null,
      eppn: null,
      yliopistotAndErikoisalat: [],
      reassignedTehtavat: []
    }

    async mounted() {
      await this.fetchKayttaja()
      this.loading = false
    }

    async fetchKayttaja() {
      try {
        this.kayttajaWrapper = (await getVastuuhenkilo(this.$route?.params?.kayttajaId)).data
        this.initForm()
      } catch (err) {
        toastFail(this, this.$t('kayttajan-hakeminen-epaonnistui'))
        this.$router.replace({ name: 'kayttajahallinta' })
      }
    }

    initForm() {
      const sahkoposti = this.sahkoposti
      this.form.sahkoposti = sahkoposti
      this.form.sahkopostiUudelleen = sahkoposti
      this.form.eppn = this.eppn
      this.form.yliopistotAndErikoisalat = []
      this.form.reassignedTehtavat = []
    }

    onEditUser() {
      this.editing = true
      this.$refs.vastuuhenkilonTehtavat.initForm()
      window.scrollTo(0, 0)
    }

    async onCancel() {
      if (this.skipRouteExitConfirm || (await confirmExit(this))) {
        this.initForm()
        this.$v.form.$reset()
        this.$refs.vastuuhenkilonTehtavat.initForm()
        this.skipRouteExitConfirm = true
        this.editing = false
      }
    }

    async onSave() {
      const vastuuhenkilonTehtavatForm = this.$refs.vastuuhenkilonTehtavat.getFormIfValid()
      if (
        !this.kayttajaWrapper?.kayttaja?.userId ||
        !this.validateForm() ||
        !vastuuhenkilonTehtavatForm
      ) {
        return
      }
      this.updatingKayttaja = true
      this.form.yliopistotAndErikoisalat = vastuuhenkilonTehtavatForm.yliopistotAndErikoisalat.map(
        (ye: KayttajaYliopistoErikoisala) => {
          return {
            ...ye,
            vastuuhenkilonTehtavat: ye.vastuuhenkilonTehtavat.filter(
              (vt: VastuuhenkilonTehtava | boolean) => vt !== false
            )
          }
        }
      )
      this.form.reassignedTehtavat = vastuuhenkilonTehtavatForm.erikoisalatForTehtavat
        .map((e: ErikoisalaForVastuuhenkilonTehtavat) => e.reassignedTehtavat)
        .flat()
        .filter((r: ReassignedVastuuhenkilonTehtava) => r !== undefined)

      try {
        if (!this.kayttajaWrapper.kayttaja?.id) return
        this.kayttajaWrapper = (
          await putVastuuhenkilo(this.kayttajaWrapper.kayttaja?.id, {
            ...this.form,
            yliopistotAndErikoisalat: this.form.yliopistotAndErikoisalat,
            reassignedTehtavat: this.form.reassignedTehtavat
          })
        ).data

        toastSuccess(this, this.$t('kayttajan-tiedot-paivitetty'))
        this.$emit('skipRouteExitConfirm', true)
        this.editing = false
      } catch (err) {
        const axiosError = err as AxiosError<ElsaError>
        const message = axiosError?.response?.data?.message
        toastFail(
          this,
          message
            ? `${this.$t('tietojen-tallennus-epaonnistui')}: ${this.$t(message)}`
            : this.$t('tietojen-tallennus-epaonnistui')
        )
      }

      this.skipRouteExitConfirm = true
      this.updatingKayttaja = false
    }
  }
</script>
<style lang="scss" scoped>
  .kayttaja {
    max-width: 768px;
  }

  .kayttajahallinta-link::before {
    content: '<';
    position: absolute;
    left: 1rem;
  }
</style>
