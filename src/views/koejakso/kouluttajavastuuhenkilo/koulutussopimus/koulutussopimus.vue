<template>
  <div class="koulutussopimus col-lg-8 px-0">
    <b-breadcrumb :items="items" class="mb-0" />
    <b-container fluid v-if="!loading">
      <h1 class="mb-3">{{ $t('koulutussopimus') }}</h1>
      <div v-if="!signed && !returned">
        <p>{{ $t('koulutussopimus-kouluttaja-ingressi') }}</p>
      </div>
      <b-alert :show="showWaitingForVastuuhenkilo" variant="dark" class="mt-3">
        <div class="d-flex flex-row">
          <em class="align-middle">
            <font-awesome-icon :icon="['fas', 'info-circle']" class="text-muted mr-2" />
          </em>
          <div>{{ $t('koulutussopimus-tila-odottaa-vastuuhenkilon-hyvaksyntaa') }}</div>
        </div>
      </b-alert>
      <b-alert :show="showWaitingForAnotherKouluttaja" variant="dark" class="mt-3">
        <div class="d-flex flex-row">
          <em class="align-middle">
            <font-awesome-icon :icon="['fas', 'info-circle']" class="text-muted mr-2" />
          </em>
          <div>{{ $t('koulutussopimus-tila-odottaa-toisen-kouluttajan-hyvaksyntaa') }}</div>
        </div>
      </b-alert>
      <b-alert :show="returned" variant="dark" class="mt-3">
        <div class="d-flex flex-row">
          <em class="align-middle">
            <font-awesome-icon :icon="['fas', 'info-circle']" class="text-muted mr-2" />
          </em>
          <div>
            {{ $t('koulutussopimus-kouluttaja-palautettu') }}
            <span class="d-block">{{ $t('syy') }}&nbsp;{{ form.korjausehdotus }}</span>
          </div>
        </div>
      </b-alert>
      <b-alert variant="success" :show="showAcceptedByEveryone">
        <div class="d-flex flex-row">
          <em class="align-middle">
            <font-awesome-icon :icon="['fas', 'check-circle']" class="mr-2" />
          </em>
          <div>
            {{ $t('koulutussopimus-tila-hyvaksytty') }}
            <span class="d-block">{{ $t('koulutussopimus-tila-hyvaksytty-lisatiedot') }}</span>
          </div>
        </div>
      </b-alert>
      <hr />
      <b-row>
        <b-col>
          <erikoistuva-details
            :firstName="erikoistuvanEtunimi"
            :lastName="erikoistuvanSukunimi"
            :erikoisala="erikoistuvanErikoisala"
            :opiskelijatunnus="form.erikoistuvanOpiskelijatunnus"
            :syntymaaika="form.erikoistuvanSyntymaaika"
            :yliopisto="form.erikoistuvanYliopisto"
          ></erikoistuva-details>
        </b-col>
      </b-row>
      <hr />
      <b-form @submit.stop.prevent="onSubmit">
        <b-row>
          <b-col lg="8">
            <h5>{{ $t('opinto-oikeuden-alkamispäivä') }}</h5>
            <p>{{ $date(form.opintooikeudenMyontamispaiva) }}</p>
          </b-col>
        </b-row>
        <b-row>
          <b-col lg="8">
            <h5>{{ $t('koejakson-alkamispäivä') }}</h5>
            <p>{{ $date(form.koejaksonAlkamispaiva) }}</p>
          </b-col>
        </b-row>
        <b-row>
          <b-col lg="4">
            <h5>{{ $t('sahkopostiosoite') }}</h5>
            <p>{{ form.erikoistuvanSahkoposti }}</p>
          </b-col>
          <b-col lg="4">
            <h5>{{ $t('puhelin-virka-aikaan') }}</h5>
            <p>{{ form.erikoistuvanPuhelinnumero }}</p>
          </b-col>
        </b-row>

        <hr />

        <b-row>
          <b-col lg="12">
            <h3>{{ $t('koulutuspaikan-tiedot') }}</h3>
            <div v-for="(koulutuspaikka, index) in form.koulutuspaikat" :key="index">
              <h5>{{ $t('toimipaikan-nimi') }}</h5>
              <p>{{ koulutuspaikka.nimi }}</p>
              <h5>{{ $t('toimipaikalla-koulutussopimus.header') }}</h5>
              <p v-if="!koulutuspaikka.yliopisto">{{ $t('kylla') }}</p>
              <p v-else>
                {{ $t('toimipaikalla-koulutussopimus.ei-sopimusta') }}:
                {{ koulutuspaikka.yliopisto }}
              </p>
            </div>
          </b-col>
        </b-row>

        <hr />

        <b-row>
          <b-col>
            <h3>{{ $t('koulutuspaikan-lahikouluttaja') }}</h3>
            <div
              v-for="(kouluttaja, index) in form.kouluttajat"
              :key="index"
              class="kouluttaja-section"
            >
              <kouluttaja-koulutussopimus-form
                v-if="isCurrentKouluttaja(kouluttaja) && editable"
                ref="kouluttajaKoulutussopimusForm"
                v-model="form.kouluttajat[index]"
                :kouluttaja="kouluttaja"
                :index="index"
              ></kouluttaja-koulutussopimus-form>

              <kouluttaja-koulutussopimus-readonly
                v-if="!isCurrentKouluttaja(kouluttaja) || !editable"
                :kouluttaja="kouluttaja"
              ></kouluttaja-koulutussopimus-readonly>
            </div>
          </b-col>
        </b-row>

        <hr />

        <b-row>
          <b-col lg="8">
            <h3>{{ $t('erikoisala-vastuuhenkilö') }}</h3>
            <h5>{{ $t('erikoisala-vastuuhenkilö-label') }}</h5>
            <p>{{ form.vastuuhenkilo.nimi }}, {{ form.vastuuhenkilo.nimike }}</p>
          </b-col>
        </b-row>
        <koejakson-vaihe-allekirjoitukset :allekirjoitukset="allekirjoitukset" />
        <hr v-if="editable" />
        <b-row v-if="editable && !signed">
          <b-col class="text-right">
            <elsa-button
              class="ml-1 mr-3 d-block d-md-inline-block d-lg-block d-xl-inline-block text-left"
              style="max-width: 14rem"
              variant="back"
              :to="{ name: 'koejakso' }"
            >
              {{ $t('peruuta') }}
            </elsa-button>
            <elsa-button
              class="my-2 mr-3 d-block d-md-inline-block d-lg-block d-xl-inline-block"
              style="width: 14rem"
              variant="outline-primary"
              v-b-modal.return-to-sender
            >
              {{ $t('palauta-muokattavaksi') }}
            </elsa-button>
            <elsa-button
              class="my-2 d-block d-md-inline-block d-lg-block d-xl-inline-block"
              style="width: 14rem"
              :loading="params.saving"
              type="submit"
              variant="primary"
            >
              {{ $t('allekirjoita-laheta') }}
            </elsa-button>
          </b-col>
        </b-row>
      </b-form>
    </b-container>

    <elsa-confirmation-modal
      id="confirm-send-kouluttaja"
      :title="$t('vahvista-lomakkeen-lahetys')"
      :text="$t('vahvista-koulutussopimus-kouluttajat-hyvaksytty')"
      :submitText="$t('allekirjoita-laheta')"
      @submit="updateSentForm"
    />
    <elsa-confirmation-modal
      id="confirm-send-vastuuhenkilo"
      :title="$t('vahvista-lomakkeen-lahetys')"
      :text="$t('vahvista-koulutussopimus-hyvaksytty')"
      :submitText="$t('allekirjoita-laheta')"
      @submit="updateSentForm"
    />
    <elsa-return-to-sender-modal
      id="return-to-sender"
      :title="$t('palauta-erikoistuvalle-muokattavaksi')"
      @submit="returnToSender"
    />
  </div>
</template>

<script lang="ts">
  import Component from 'vue-class-component'
  import _get from 'lodash/get'
  import { Mixins } from 'vue-property-decorator'
  import { validationMixin } from 'vuelidate'
  import { required } from 'vuelidate/lib/validators'
  import { getKoulutussopimus as getKoulutussopimusKouluttaja } from '@/api/kouluttaja'
  import { getKoulutussopimus as getKoulutussopimusVastuuhenkilo } from '@/api/vastuuhenkilo'
  import store from '@/store'
  import KouluttajaKoulutussopimusForm from '@/views/koejakso/kouluttaja/koulutussopimus/kouluttaja-koulutussopimus-form.vue'
  import ElsaButton from '@/components/button/button.vue'
  import ConfirmRouteExit from '@/mixins/confirm-route-exit'
  import { checkCurrentRouteAndRedirect } from '@/utils/functions'
  import { toastFail, toastSuccess } from '@/utils/toast'
  import { KoulutussopimusLomake, Kouluttaja } from '@/types'
  import { defaultKoulutuspaikka, LomakeTilat } from '@/utils/constants'
  import KouluttajaKoulutussopimusReadonly from '@/views/koejakso/kouluttaja/koulutussopimus/kouluttaja-koulutussopimus-readonly.vue'
  import ErikoistuvaDetails from '@/components/erikoistuva-details/erikoistuva-details.vue'
  import ElsaFormGroup from '@/components/form-group/form-group.vue'
  import KoejaksonVaiheAllekirjoitukset from '@/components/koejakson-vaiheet/koejakson-vaihe-allekirjoitukset.vue'
  import { KoejaksonVaiheAllekirjoitus } from '@/types'
  import * as allekirjoituksetHelper from '@/utils/koejaksonVaiheAllekirjoitusMapper'
  import { resolveRolePath } from '@/utils/apiRolePathResolver'
  import ElsaConfirmationModal from '@/components/modal/confirmation-modal.vue'
  import ElsaReturnToSenderModal from '@/components/modal/return-to-sender-modal.vue'

  @Component({
    components: {
      KouluttajaKoulutussopimusForm,
      ElsaFormGroup,
      ElsaButton,
      KouluttajaKoulutussopimusReadonly,
      ErikoistuvaDetails,
      KoejaksonVaiheAllekirjoitukset,
      ElsaConfirmationModal,
      ElsaReturnToSenderModal
    },
    validations: {
      form: {
        korjausehdotus: {
          required
        }
      }
    }
  })
  export default class Koulutussopimus extends Mixins(ConfirmRouteExit, validationMixin) {
    skipRouteExitConfirm!: boolean
    $refs!: {
      kouluttajaKoulutussopimusForm: any
    }
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
        text: this.$t('koulutussopimus-kouluttaja'),
        active: true
      }
    ]

    params = {
      saving: false,
      deleting: false
    }

    form: KoulutussopimusLomake = {
      id: null,
      erikoistuvanNimi: '',
      erikoistuvanErikoisala: '',
      erikoistuvanOpiskelijatunnus: '',
      erikoistuvanPuhelinnumero: '',
      erikoistuvanSahkoposti: '',
      erikoistuvanSyntymaaika: '',
      erikoistuvanYliopisto: '',
      koejaksonAlkamispaiva: '',
      korjausehdotus: '',
      kouluttajat: [],
      koulutuspaikat: [defaultKoulutuspaikka],
      lahetetty: false,
      muokkauspaiva: '',
      opintooikeudenMyontamispaiva: '',
      opintooikeudenPaattymispaiva: '',
      vastuuhenkilo: undefined
    }

    loading = true
    childFormValid = false

    validateState(value: string) {
      const form = this.$v.form
      const { $dirty, $error } = _get(form, value) as any
      return $dirty ? ($error ? false : null) : null
    }

    isFormValid(): boolean {
      this.$v.$touch()
      if (this.$v.$anyError) {
        return false
      }
      return true
    }

    hideModal(id: string) {
      this.params.saving = false
      return this.$bvModal.hide(id)
    }

    onChildFormValid(index: number, form: Kouluttaja) {
      this.form.kouluttajat[index] = form
      this.childFormValid = true
    }

    get koulutussopimusData() {
      return store.getters[`${resolveRolePath()}/koejaksot`].find(
        (a: any) => a.id === this.koulutussopimusId
      )
    }

    get koulutussopimusId() {
      return Number(this.$route.params.id)
    }

    get account() {
      return store.getters['auth/account']
    }

    get editable() {
      return !this.loading && this.koulutussopimusData.tila === LomakeTilat.ODOTTAA_HYVAKSYNTAA
    }

    get signed() {
      let signed = false
      this.form.kouluttajat.forEach((k: Kouluttaja) => {
        if (this.isCurrentKouluttaja(k)) {
          signed = k.sopimusHyvaksytty
        }
      })
      return signed
    }

    get allKouluttajatSigned() {
      return this.form.kouluttajat.every((k: Kouluttaja) => k.sopimusHyvaksytty)
    }

    get returned() {
      return !this.loading && this.koulutussopimusData.tila === LomakeTilat.PALAUTETTU_KORJATTAVAKSI
    }

    get showAcceptedByEveryone() {
      return this.koulutussopimusData.tila === LomakeTilat.HYVAKSYTTY
    }

    get showWaitingForVastuuhenkilo() {
      return this.koulutussopimusData.tila === LomakeTilat.ODOTTAA_VASTUUHENKILON_HYVAKSYNTAA
    }

    get showWaitingForAnotherKouluttaja() {
      return this.koulutussopimusData.tila === LomakeTilat.ODOTTAA_TOISEN_KOULUTTAJAN_HYVAKSYNTAA
    }

    get erikoistuvanEtunimi() {
      return this.form.erikoistuvanNimi.split(' ')[0]
    }

    get erikoistuvanSukunimi() {
      return this.form.erikoistuvanNimi.split(' ')[1]
    }

    get erikoistuvanErikoisala() {
      return this.form.erikoistuvanErikoisala ?? ''
    }

    get isLastKouluttajaToAccept() {
      return (
        this.form.kouluttajat.length === 1 ||
        this.form.kouluttajat.filter((k) => k.sopimusHyvaksytty).length === 1
      )
    }

    isCurrentKouluttaja(kouluttaja: any) {
      return this.account.id === kouluttaja.kayttajaUserId
    }

    async returnToSender(korjausehdotus: string) {
      const form = {
        ...this.form,
        korjausehdotus: korjausehdotus,
        lahetetty: false
      }
      try {
        await store.dispatch(`${resolveRolePath()}/putKoulutussopimus`, form)
        this.skipRouteExitConfirm = true
        checkCurrentRouteAndRedirect(this.$router, '/koejakso')
        toastSuccess(this, this.$t('koulutussopimus-palautettu-onnistuneesti'))
      } catch (err) {
        toastFail(this, this.$t('koulutussopimus-palautus-epaonnistui'))
      }
    }

    async updateSentForm() {
      this.skipRouteExitConfirm = true
      try {
        await store.dispatch(`${resolveRolePath()}/putKoulutussopimus`, this.form)
        checkCurrentRouteAndRedirect(this.$router, '/koejakso')
        toastSuccess(this, this.$t('koulutussopimus-lisatty-onnistuneesti'))
      } catch (err) {
        toastFail(this, this.$t('koulutussopimuksen-lisaaminen-epaonnistui'))
      }
    }

    onSubmit() {
      this.params.saving = true

      if (this.$isVastuuhenkilo()) {
        this.handleSubmitVastuuhenkilo()
      } else {
        this.handleSubmitKouluttaja()
      }

      this.params.saving = false
    }

    private handleSubmitKouluttaja() {
      if (this.$refs.kouluttajaKoulutussopimusForm.length === 2) {
        this.$refs.kouluttajaKoulutussopimusForm[0].checkForm()
        this.$refs.kouluttajaKoulutussopimusForm[1].checkForm()
      } else {
        this.$refs.kouluttajaKoulutussopimusForm[0].checkForm()
      }

      if (this.childFormValid) {
        if (this.isLastKouluttajaToAccept) {
          this.$bvModal.show('confirm-send-kouluttaja')
        } else {
          this.updateSentForm()
        }
      }
    }

    private handleSubmitVastuuhenkilo() {
      this.$bvModal.show('confirm-send-vastuuhenkilo')
    }

    async mounted() {
      this.loading = true
      await store.dispatch(`${resolveRolePath()}/getKoejaksot`)
      const { data } = await (this.$isVastuuhenkilo()
        ? getKoulutussopimusVastuuhenkilo(this.koulutussopimusId)
        : getKoulutussopimusKouluttaja(this.koulutussopimusId))
      this.form = data
      this.loading = false

      if (!this.editable || this.returned) {
        this.skipRouteExitConfirm = true
      }
    }

    get allekirjoitukset(): KoejaksonVaiheAllekirjoitus[] {
      const allekirjoitusErikoistuva = allekirjoituksetHelper.mapAllekirjoitusErikoistuva(
        this,
        this.form.erikoistuvanNimi,
        this.form.erikoistuvanAllekirjoitusaika
      ) as KoejaksonVaiheAllekirjoitus
      const allekirjoituksetKouluttajat = allekirjoituksetHelper.mapAllekirjoituksetSopimuksenKouluttajat(
        this.form.kouluttajat
      ) as KoejaksonVaiheAllekirjoitus[]
      const allekirjoitusVastuuhenkilo = allekirjoituksetHelper.mapAllekirjoitusVastuuhenkilo(
        this.form.vastuuhenkilo
      ) as KoejaksonVaiheAllekirjoitus

      return [
        allekirjoitusErikoistuva,
        ...allekirjoituksetKouluttajat,
        allekirjoitusVastuuhenkilo
      ].filter((a) => a !== null)
    }
  }
</script>

<style lang="scss" scoped>
  .kouluttaja-section + .kouluttaja-section {
    margin-top: 2.5rem;
  }
</style>
