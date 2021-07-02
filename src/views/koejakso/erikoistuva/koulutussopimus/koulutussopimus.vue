<template>
  <div class="koulutussopimus col-lg-8 px-0">
    <b-breadcrumb :items="items" class="mb-0" />
    <b-container fluid v-if="!loading">
      <b-row lg>
        <b-col>
          <h1 class="mb-3">{{ $t('koulutussopimus') }}</h1>
          <div v-if="editable">
            <p>{{ $t('koulutussopimus-ingressi-1') }}</p>
            <p>
              {{ $t('koulutussopimus-ingressi-2') }}
              <b-link :to="{ name: 'koejakso-yleiset-tavoitteet' }">
                {{ $t('koejakso-tavoitteet-linkki') }}
              </b-link>
            </p>
          </div>
          <div v-if="odottaaHyvaksyntaa" class="d-flex bg-light border rounded px-4 py-3">
            <font-awesome-icon icon="info-circle" fixed-width class="text-muted mr-2" />
            <div>{{ $t('koulutussopimus-text-odottaa-hyväksyntää') }}</div>
          </div>
        </b-col>
      </b-row>
      <hr />
      <b-row>
        <b-col>
          <erikoistuva-details
            :firstName="account.firstName"
            :lastName="account.lastName"
            :erikoisala="account.erikoistuvaLaakari.erikoisalaNimi"
            :opiskelijatunnus="account.erikoistuvaLaakari.opiskelijatunnus"
            :syntymaaika="account.erikoistuvaLaakari.syntymaaika"
            :yliopisto="account.erikoistuvaLaakari.yliopisto"
          ></erikoistuva-details>
        </b-col>
      </b-row>
      <hr />
      <b-row>
        <b-col>
          <koulutussopimus-form
            v-if="editable"
            :editable="editable"
            :data="koejaksoData.koulutussopimus"
            :account="account"
            :kouluttajat="kouluttajat"
            :vastuuhenkilot="vastuuhenkilot"
            :yliopistot="yliopistot"
            @saveAndExit="onSaveDraftAndExit"
            @submit="onSubmit"
          ></koulutussopimus-form>

          <koulutussopimus-readonly
            v-if="!editable"
            :data="koejaksoData.koulutussopimus"
          ></koulutussopimus-readonly>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script lang="ts">
  import Component from 'vue-class-component'
  import { Mixins } from 'vue-property-decorator'
  import { KoulutussopimusLomake } from '@/types'
  import { toastFail, toastSuccess } from '@/utils/toast'
  import store from '@/store'
  import ConfirmRouteExit from '@/mixins/confirm-route-exit'
  import ErikoistuvaDetails from '@/components/erikoistuva-details/erikoistuva-details.vue'
  import KoulutussopimusForm from '@/views/koejakso/erikoistuva/koulutussopimus/koulutussopimus-form.vue'
  import KoulutussopimusReadonly from '@/views/koejakso/erikoistuva/koulutussopimus/koulutussopimus-readonly.vue'
  import { checkCurrentRouteAndRedirect } from '@/utils/functions'
  import { LomakeTilat } from '@/utils/constants'
  import { getKoulutussopimusLomake } from '@/api/erikoistuva'

  @Component({
    components: {
      ErikoistuvaDetails,
      KoulutussopimusForm,
      KoulutussopimusReadonly
    }
  })
  export default class ErikoistuvaKoulutussopimus extends Mixins(ConfirmRouteExit) {
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
        text: this.$t('koulutussopimus'),
        active: true
      }
    ]
    loading = true
    koulutussopimusLomake: null | KoulutussopimusLomake = null
    vastuuhenkilot = []
    yliopistot = []

    get account() {
      return store.getters['auth/account']
    }

    get editable() {
      switch (this.koejaksoData.koulutusSopimuksenTila) {
        case LomakeTilat.PALAUTETTU_KORJATTAVAKSI:
          return true
        case LomakeTilat.UUSI:
          return true
        case LomakeTilat.TALLENNETTU_KESKENERAISENA:
          return true
      }
      return false
    }

    get odottaaHyvaksyntaa() {
      return this.koejaksoData.koulutusSopimuksenTila === LomakeTilat.ODOTTAA_HYVAKSYNTAA
    }

    get kouluttajat() {
      return store.getters['erikoistuva/kouluttajat']
    }

    get koejaksoData() {
      return store.getters['erikoistuva/koejakso']
    }

    setKoejaksoData() {
      if (this.koejaksoData.koulutussopimus) {
        this.koulutussopimusLomake = this.koejaksoData.koulutussopimus
      }

      if (!this.editable) {
        this.skipRouteExitConfirm = true
      }
    }

    async onSaveDraftAndExit(form: KoulutussopimusLomake, params: any) {
      params.saving = true
      this.koulutussopimusLomake = form
      try {
        if (this.koejaksoData.koulutusSopimuksenTila === LomakeTilat.UUSI) {
          await store.dispatch('erikoistuva/postKoulutussopimus', this.koulutussopimusLomake)
        }
        if (this.koejaksoData.koulutusSopimuksenTila === LomakeTilat.TALLENNETTU_KESKENERAISENA) {
          await store.dispatch('erikoistuva/putKoulutussopimus', this.koulutussopimusLomake)
        }

        toastSuccess(this, this.$t('koulutussopimus-tallennettu-onnistuneesti'))
        this.skipRouteExitConfirm = true
        checkCurrentRouteAndRedirect(this.$router, '/koejakso')
      } catch (err) {
        toastFail(this, this.$t('koulutussopimuksen-tallennus-epaonnistui'))
      }
      params.saving = false
    }

    async saveNewForm() {
      try {
        await store.dispatch('erikoistuva/postKoulutussopimus', this.koulutussopimusLomake)
        toastSuccess(this, this.$t('koulutussopimus-lisatty-onnistuneesti'))
        this.skipRouteExitConfirm = true
      } catch (err) {
        toastFail(this, this.$t('koulutussopimuksen-lisaaminen-epaonnistui'))
      }
    }

    async updateSentForm() {
      try {
        await store.dispatch('erikoistuva/putKoulutussopimus', this.koulutussopimusLomake)
        toastSuccess(this, this.$t('koulutussopimus-lisatty-onnistuneesti'))
        this.skipRouteExitConfirm = true
      } catch (err) {
        toastFail(this, this.$t('koulutussopimuksen-lisaaminen-epaonnistui'))
      }
    }

    async onSubmit(form: KoulutussopimusLomake, params: any) {
      params.saving = true
      this.koulutussopimusLomake = form
      this.koulutussopimusLomake.lahetetty = true
      if (
        this.koejaksoData.koulutusSopimuksenTila === LomakeTilat.TALLENNETTU_KESKENERAISENA ||
        this.koejaksoData.koulutusSopimuksenTila === LomakeTilat.PALAUTETTU_KORJATTAVAKSI
      ) {
        this.updateSentForm()
      } else {
        this.saveNewForm()
      }
      params.saving = false
    }

    watch() {
      if (!this.editable) {
        this.skipRouteExitConfirm = true
      }
    }

    async mounted() {
      this.loading = true

      if (!this.koejaksoData) {
        await store.dispatch('erikoistuva/getKoejakso')
      }
      await store.dispatch('erikoistuva/getKouluttajat')

      this.setKoejaksoData()

      const koulutussopimusLomake = (await getKoulutussopimusLomake()).data
      this.vastuuhenkilot = koulutussopimusLomake.vastuuhenkilot
      this.yliopistot = koulutussopimusLomake.yliopistot

      this.loading = false

      if (!this.editable) {
        this.skipRouteExitConfirm = true
      }
    }
  }
</script>
