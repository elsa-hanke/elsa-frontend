<template>
  <div class="koulutussopimus col-lg-8 px-0">
    <b-breadcrumb :items="items" class="mb-0" />
    <b-container fluid v-if="!loading">
      <b-row lg>
        <b-col>
          <h1 class="mb-3">{{ $t('koejakson-aloituskeskustelu') }}</h1>
          <div v-if="editable">
            <p>{{ $t('koejakson-aloituskeskustelu-ingressi-1') }}</p>
            <p>
              {{ $t('koejakson-aloituskeskustelu-ingressi-2') }}
              <b-link :to="{ name: 'koejakso-yleiset-tavoitteet' }">
                {{ $t('koejakso-tavoitteet-linkki') }}
              </b-link>
            </p>
          </div>
        </b-col>
      </b-row>
      <hr />
      <b-row>
        <b-col>
          <erikoistuva-details :account="account" :show-birthdate="false"></erikoistuva-details>
        </b-col>
      </b-row>
      <hr />
      <arviointilomake-aloituskeskustelu-form
        v-if="editable"
        :editable="editable"
        :account="account"
        :data="koejaksoData.aloituskeskustelu"
        :kouluttajat="kouluttajat"
        :henkilot="kouluttajat"
        @saveAndExit="onSaveDraftAndExit"
        @submit="onSubmit"
      ></arviointilomake-aloituskeskustelu-form>

      <arviointilomake-aloituskeskustelu-readonly
        v-if="!editable"
        :data="koejaksoData.aloituskeskustelu"
      ></arviointilomake-aloituskeskustelu-readonly>
    </b-container>
  </div>
</template>

<script lang="ts">
  import Component from 'vue-class-component'
  import { Mixins } from 'vue-property-decorator'
  import { toastFail, toastSuccess } from '@/utils/toast'
  import store from '@/store'
  import ConfirmRouteExit from '@/mixins/confirm-route-exit'
  import { AloituskeskusteluLomake } from '@/types'
  import { checkCurrentRouteAndRedirect } from '@/utils/functions'
  import { LomakeTilat } from '@/utils/constants'
  import ErikoistuvaDetails from '@/components/erikoistuva-details/erikoistuva-details.vue'
  import ArviointilomakeAloituskeskusteluForm from '@/views/koejakso/erikoistuva/arviointilomake-aloituskeskustelu/arviointilomake-aloituskeskustelu-form.vue'
  import ArviointilomakeAloituskeskusteluReadonly from '@/views/koejakso/erikoistuva/arviointilomake-aloituskeskustelu/arviointilomake-aloituskeskustelu-readonly.vue'

  @Component({
    components: {
      ErikoistuvaDetails,
      ArviointilomakeAloituskeskusteluForm,
      ArviointilomakeAloituskeskusteluReadonly
    }
  })
  export default class ErikoistuvaArviointilomakeAloituskeskustelu extends Mixins(
    ConfirmRouteExit
  ) {
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
        text: this.$t('koejakson-aloituskeskustelu'),
        active: true
      }
    ]
    loading = true
    aloituskeskusteluLomake: null | AloituskeskusteluLomake = null

    get account() {
      return store.getters['auth/account']
    }

    get editable() {
      switch (this.koejaksoData.aloituskeskustelunTila) {
        case LomakeTilat.PALAUTETTU_KORJATTAVAKSI:
          return true
        case LomakeTilat.UUSI:
          return true
        case LomakeTilat.TALLENNETTU_KESKENERAISENA:
          return true
      }
      return false
    }

    get kouluttajat() {
      return store.getters['erikoistuva/kouluttajat']
    }

    get koejaksoData() {
      return store.getters['erikoistuva/koejakso']
    }

    setKoejaksoData() {
      if (this.koejaksoData.aloituskeskustelu) {
        this.aloituskeskusteluLomake = this.koejaksoData.aloituskeskustelu
      }
      if (!this.editable) {
        this.skipRouteExitConfirm = true
      }
    }

    async onSaveDraftAndExit(form: AloituskeskusteluLomake, params: any) {
      params.saving = true
      this.aloituskeskusteluLomake = form
      try {
        if (this.koejaksoData.aloituskeskustelunTila === LomakeTilat.UUSI) {
          await store.dispatch('erikoistuva/postAloituskeskustelu', this.aloituskeskusteluLomake)
        }

        if (this.koejaksoData.aloituskeskustelunTila === LomakeTilat.TALLENNETTU_KESKENERAISENA) {
          await store.dispatch('erikoistuva/putAloituskeskustelu', this.aloituskeskusteluLomake)
        }

        toastSuccess(this, this.$t('aloituskeskustelu-tallennettu-onnistuneesti'))
        this.skipRouteExitConfirm = true
        checkCurrentRouteAndRedirect(this.$router, '/koejakso')
      } catch (err) {
        toastFail(this, this.$t('aloituskeskustelu-tallennus-epaonnistui'))
      }
      params.saving = false
    }

    async saveNewForm() {
      try {
        await store.dispatch('erikoistuva/postAloituskeskustelu', this.aloituskeskusteluLomake)
        toastSuccess(this, this.$t('aloituskeskustelu-lisatty-onnistuneesti'))
        this.skipRouteExitConfirm = true
      } catch (err) {
        toastFail(this, this.$t('aloituskeskustelu-lisaaminen-epaonnistui'))
      }
    }

    async updateSentForm() {
      try {
        await store.dispatch('erikoistuva/putAloituskeskustelu', this.aloituskeskusteluLomake)
        toastSuccess(this, this.$t('aloituskeskustelu-lisatty-onnistuneesti'))
        this.skipRouteExitConfirm = true
      } catch (err) {
        toastFail(this, this.$t('aloituskeskustelu-lisaaminen-epaonnistui'))
      }
    }

    async onSubmit(form: AloituskeskusteluLomake, params: any) {
      params.saving = true
      this.aloituskeskusteluLomake = form
      this.aloituskeskusteluLomake.lahetetty = true
      if (
        this.koejaksoData.aloituskeskustelunTila === LomakeTilat.TALLENNETTU_KESKENERAISENA ||
        this.koejaksoData.aloituskeskustelunTila === LomakeTilat.PALAUTETTU_KORJATTAVAKSI
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
      this.loading = false
      if (!this.editable) {
        this.skipRouteExitConfirm = true
      }
    }
  }
</script>
