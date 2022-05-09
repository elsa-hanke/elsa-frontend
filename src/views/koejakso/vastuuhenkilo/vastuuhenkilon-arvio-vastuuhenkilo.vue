<template>
  <div class="col-lg-8 px-0">
    <b-breadcrumb :items="items" class="mb-0" />

    <b-container fluid>
      <h1 class="mb-3">{{ $t('erikoisalan-vastuuhenkilon-arvio-koejaksosta') }}</h1>
      <div v-if="!loading">
        <b-row lg>
          <b-col>
            <b-alert :show="editable" variant="dark" class="mt-3 mb-0">
              <div class="d-flex flex-row">
                <em class="align-middle">
                  <font-awesome-icon :icon="['fas', 'info-circle']" class="text-muted mr-2" />
                </em>
                <div>
                  {{ $t('vastuuhenkilon-arvio-ingressi-vastuuhenkilo') }}
                </div>
              </div>
            </b-alert>
            <b-alert :show="waitingForErikoistuva" variant="dark" class="mt-3">
              <div class="d-flex flex-row">
                <em class="align-middle">
                  <font-awesome-icon :icon="['fas', 'info-circle']" class="text-muted mr-2" />
                </em>
                <div>
                  {{ $t('vastuuhenkilon-arvio-tila-vastuuhenkilo-allekirjoittanut') }}
                </div>
              </div>
            </b-alert>
            <b-alert variant="success" :show="acceptedByEveryone">
              <div class="d-flex flex-row">
                <em class="align-middle">
                  <font-awesome-icon :icon="['fas', 'check-circle']" class="mr-2" />
                </em>
                {{ $t('vastuuhenkilon-arvio-tila-vastuuhenkilo-hyvaksytty') }}
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
        <elsa-form-group :label="$t('koejakso-on')" :required="editable">
          <template v-slot="{ uid }">
            <div v-if="editable">
              <b-form-radio-group
                :id="uid"
                v-model="vastuuhenkilonArvio.koejaksoHyvaksytty"
                :options="koejaksoHyvaksyttyVaihtoehdot"
                :state="validateState('koejaksoHyvaksytty')"
                stacked
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
          <template v-slot="{ uid }">
            <div v-if="editable">
              <b-form-textarea
                :id="uid"
                :state="validateState('perusteluHylkaamiselle')"
                v-model="vastuuhenkilonArvio.perusteluHylkaamiselle"
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
          <template v-slot="{ uid }">
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
        <div v-if="waitingForErikoistuva || acceptedByEveryone">
          <hr />
          <koejakson-vaihe-allekirjoitukset :allekirjoitukset="allekirjoitukset" />
        </div>
        <div v-if="editable">
          <hr />
          <b-row>
            <b-col class="text-right">
              <elsa-button variant="back" :to="{ name: 'koejakso' }">
                {{ $t('peruuta') }}
              </elsa-button>
              <elsa-button
                v-if="!loading"
                @click="onValidateAndConfirm('confirm-sign')"
                :loading="buttonStates.primaryButtonLoading"
                variant="primary"
                class="ml-4 px-6"
              >
                {{ $t('allekirjoita-laheta') }}
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
      :submitText="$t('allekirjoita-laheta')"
      @submit="onSign"
    />
  </div>
</template>

<script lang="ts">
  import _get from 'lodash/get'
  import Component from 'vue-class-component'
  import { Mixins } from 'vue-property-decorator'
  import { validationMixin } from 'vuelidate'
  import { required, requiredIf } from 'vuelidate/lib/validators'

  import { getVastuuhenkilonArvio } from '@/api/vastuuhenkilo'
  import ElsaButton from '@/components/button/button.vue'
  import ErikoistuvaDetails from '@/components/erikoistuva-details/erikoistuva-details.vue'
  import ElsaFormGroup from '@/components/form-group/form-group.vue'
  import KoejaksonVaiheAllekirjoitukset from '@/components/koejakson-vaiheet/koejakson-vaihe-allekirjoitukset.vue'
  import ElsaConfirmationModal from '@/components/modal/confirmation-modal.vue'
  import ElsaFormMultiselect from '@/components/multiselect/multiselect.vue'
  import store from '@/store'
  import {
    Koejakso,
    KoejaksonVaiheAllekirjoitus,
    KoejaksonVaiheButtonStates,
    VastuuhenkilonArvioLomake
  } from '@/types'
  import { LomakeTilat } from '@/utils/constants'
  import { checkCurrentRouteAndRedirect } from '@/utils/functions'
  import * as allekirjoituksetHelper from '@/utils/koejaksonVaiheAllekirjoitusMapper'
  import { toastFail, toastSuccess } from '@/utils/toast'

  @Component({
    components: {
      ErikoistuvaDetails,
      ElsaFormGroup,
      ElsaFormMultiselect,
      ElsaButton,
      ElsaConfirmationModal,
      KoejaksonVaiheAllekirjoitukset
    },
    validations: {
      vastuuhenkilonArvio: {
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
      return this.vastuuhenkilonArvioTila === LomakeTilat.ODOTTAA_HYVAKSYNTAA
    }

    get waitingForErikoistuva() {
      return this.vastuuhenkilonArvioTila === LomakeTilat.ODOTTAA_ERIKOISTUVAN_HYVAKSYNTAA
    }

    get acceptedByEveryone() {
      return this.vastuuhenkilonArvioTila === LomakeTilat.HYVAKSYTTY
    }

    get koejaksoData(): Koejakso {
      return store.getters['vastuuhenkilo/koejaksot']
    }

    get vastuuhenkilonArvioTila() {
      return store.getters['vastuuhenkilo/koejaksot'].find(
        (k: any) => k.id === this.vastuuhenkilonArvio?.id
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
        this.vastuuhenkilonArvio?.erikoistuvanAllekirjoitusaika
      )
      const allekirjoitusVastuuhenkilo = allekirjoituksetHelper.mapAllekirjoitusVastuuhenkilo(
        this.vastuuhenkilonArvio?.vastuuhenkilo ?? null
      ) as KoejaksonVaiheAllekirjoitus

      return [allekirjoitusVastuuhenkilo, allekirjoitusErikoistuva].filter(
        (a): a is KoejaksonVaiheAllekirjoitus => a !== null
      )
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
    async onSign() {
      try {
        this.buttonStates.primaryButtonLoading = true
        await store.dispatch('vastuuhenkilo/putVastuuhenkilonArvio', this.vastuuhenkilonArvio)
        this.buttonStates.primaryButtonLoading = false
        checkCurrentRouteAndRedirect(this.$router, '/koejakso')
        toastSuccess(this, this.$t('vastuuhenkilon-arvio-allekirjoitettu-onnistuneesti'))
      } catch {
        toastFail(this, this.$t('vastuuhenkilon-arvio-allekirjoitus-epaonnistui'))
      }
    }

    async mounted() {
      this.loading = true
      await store.dispatch('vastuuhenkilo/getKoejaksot')

      try {
        const { data } = await getVastuuhenkilonArvio(this.vastuuhenkilonArvioId)
        this.vastuuhenkilonArvio = data
        this.loading = false
      } catch {
        toastFail(this, this.$t('vastuuhenkilon-arvion-hakeminen-epaonnistui'))
        this.$router.replace({ name: 'koejakso' })
      }
    }
  }
</script>
