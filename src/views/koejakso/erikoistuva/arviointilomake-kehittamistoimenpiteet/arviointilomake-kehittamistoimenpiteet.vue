<template>
  <div class="koulutussopimus col-lg-8 px-0">
    <b-breadcrumb :items="items" class="mb-0" />
    <b-container fluid v-if="!loading">
      <b-row lg>
        <b-col>
          <h1 class="mb-3">{{ $t('koejakson-kehittamistoimenpiteet') }}</h1>
          <div v-if="newOrReturned">
            <p>{{ $t('koejakson-kehittamistoimenpiteet-ingressi') }}</p>
          </div>
          <div v-else>
            <b-alert :show="waitingForKouluttaja" variant="dark" class="mt-3">
              <div class="d-flex flex-row">
                <em class="align-middle">
                  <font-awesome-icon :icon="['fas', 'info-circle']" class="text-muted mr-2" />
                </em>
                <div>
                  {{ $t('kehittamistoimenpiteet-tila-odottaa-hyvaksyntaa') }}
                </div>
              </div>
            </b-alert>
            <b-alert :show="waitingForErikoistuva" variant="dark" class="mt-3">
              <div class="d-flex flex-row">
                <em class="align-middle">
                  <font-awesome-icon :icon="['fas', 'info-circle']" class="text-muted mr-2" />
                </em>
                <div>
                  {{ $t('kehittamistoimenpiteet-tila-odottaa-erikoistuvan-hyvaksyntaa') }}
                </div>
              </div>
            </b-alert>
            <b-alert variant="success" :show="signed">
              <div class="d-flex flex-row">
                <em class="align-middle">
                  <font-awesome-icon :icon="['fas', 'check-circle']" class="mr-2" />
                </em>
                <span>{{ $t('kehittamistoimenpiteet-tila-hyvaksytty') }}</span>
              </div>
            </b-alert>
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
            :yliopisto="account.erikoistuvaLaakari.yliopisto"
            :kehittamistoimenpiteet="koejaksoData.valiarviointi.kehittamistoimenpiteet"
            :show-birthdate="false"
          ></erikoistuva-details>
        </b-col>
      </b-row>

      <hr />

      <b-form v-if="newOrReturned">
        <koulutuspaikan-arvioijat
          ref="koulutuspaikanArvioijat"
          :lahikouluttaja="kehittamistoimenpiteetLomake.lahikouluttaja"
          :lahiesimies="kehittamistoimenpiteetLomake.lahiesimies"
          :params="params"
          @lahikouluttajaSelect="onLahikouluttajaSelect"
          @lahiesimiesSelect="onLahiesimiesSelect"
        />

        <hr />

        <b-row v-if="newOrReturned">
          <b-col class="text-right">
            <elsa-button variant="back" :to="{ name: 'koejakso' }">{{ $t('peruuta') }}</elsa-button>
            <elsa-button
              @click="validateAndConfirmSend"
              :loading="params.saving"
              variant="primary"
              class="ml-4 px-5"
            >
              {{ $t('laheta') }}
            </elsa-button>
          </b-col>
        </b-row>
      </b-form>

      <div v-if="waitingForErikoistuva || signed">
        <b-row>
          <b-col lg="10">
            <h3>{{ $t('kehittamistoimenpiteiden-arviointi') }}</h3>
            <p v-if="koejaksoData.kehittamistoimenpiteet.kehittamistoimenpiteetRiittavat">
              {{ $t('kehittamistoimenpiteet-riittavat') }}
            </p>
            <p v-else>{{ $t('kehittamistoimenpiteet-ei-riittavat') }}</p>
          </b-col>
        </b-row>
        <hr />
      </div>

      <div v-if="waitingForKouluttaja || waitingForErikoistuva || signed">
        <koulutuspaikan-arvioijat
          :lahikouluttaja="kehittamistoimenpiteetLomake.lahikouluttaja"
          :lahiesimies="kehittamistoimenpiteetLomake.lahiesimies"
          :isReadonly="true"
        />
        <hr />
        <koejakson-vaihe-allekirjoitukset :allekirjoitukset="allekirjoitukset" />
        <hr v-if="waitingForErikoistuva" />
      </div>

      <b-form>
        <b-row v-if="waitingForErikoistuva">
          <b-col class="text-right">
            <elsa-button variant="back" :to="{ name: 'koejakso' }">{{ $t('peruuta') }}</elsa-button>
            <elsa-button
              :loading="params.saving"
              variant="primary"
              class="ml-4 px-5"
              v-b-modal.confirm-sign
            >
              {{ $t('allekirjoita') }}
            </elsa-button>
          </b-col>
        </b-row>
      </b-form>
    </b-container>

    <b-modal id="confirm-send" :title="$t('vahvista-lomakkeen-lahetys')">
      <div class="d-block">
        <p>{{ $t('vahvista-kehittamistoimenpiteet-lahetys') }}</p>
      </div>
      <template #modal-footer>
        <elsa-button variant="back" @click="hideModal">
          {{ $t('peruuta') }}
        </elsa-button>
        <elsa-button variant="primary" @click="onSendForm">
          {{ $t('laheta') }}
        </elsa-button>
      </template>
    </b-modal>
    <b-modal id="confirm-sign" :title="$t('allekirjoita-kehittamistoimenpiteet')">
      <div class="d-block">
        <p>{{ $t('vahvista-allekirjoita-kehittamistoimenpiteet') }}</p>
      </div>
      <template #modal-footer>
        <elsa-button variant="back" @click="hideModal('confirm-sign')">
          {{ $t('peruuta') }}
        </elsa-button>
        <elsa-button variant="primary" @click="onSignForm">
          {{ $t('allekirjoita') }}
        </elsa-button>
      </template>
    </b-modal>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator'
  import { toastFail, toastSuccess } from '@/utils/toast'
  import store from '@/store'
  import { KehittamistoimenpiteetLomake, KoejaksonVaiheHyvaksyja } from '@/types'
  import { LomakeTilat } from '@/utils/constants'
  import ErikoistuvaDetails from '@/components/erikoistuva-details/erikoistuva-details.vue'
  import ElsaFormGroup from '@/components/form-group/form-group.vue'
  import ElsaButton from '@/components/button/button.vue'
  import KoejaksonVaiheAllekirjoitukset from '@/components/koejakson-vaiheet/koejakson-vaihe-allekirjoitukset.vue'
  import { KoejaksonVaiheAllekirjoitus } from '@/types'
  import * as allekirjoituksetHelper from '@/utils/koejaksonVaiheAllekirjoitusMapper'
  import KoulutuspaikanArvioijat from '@/components/koejakson-vaiheet/koulutuspaikan-arvioijat.vue'

  @Component({
    components: {
      ErikoistuvaDetails,
      ElsaFormGroup,
      ElsaButton,
      KoulutuspaikanArvioijat,
      KoejaksonVaiheAllekirjoitukset
    }
  })
  export default class ErikoistuvaArviointilomakeKehittamistoimenpiteet extends Vue {
    $refs!: {
      koulutuspaikanArvioijat: any
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
        text: this.$t('koejakson-kehittamistoimenpiteet'),
        active: true
      }
    ]

    loading = true

    params = {
      saving: false
    }

    kehittamistoimenpiteetLomake: KehittamistoimenpiteetLomake = {
      erikoistuvaAllekirjoittanut: false,
      erikoistuvanAllekirjoitusaika: undefined,
      erikoistuvanErikoisala: '',
      erikoistuvanNimi: '',
      erikoistuvanOpiskelijatunnus: '',
      erikoistuvanYliopisto: '',
      id: null,
      kehittamistoimenpiteetRiittavat: false,
      korjausehdotus: '',
      lahiesimies: {
        id: null,
        kayttajaUserId: null,
        kuittausaika: '',
        nimi: '',
        sopimusHyvaksytty: false
      },
      lahikouluttaja: {
        id: null,
        kayttajaUserId: null,
        kuittausaika: '',
        nimi: '',
        sopimusHyvaksytty: false
      },
      muokkauspaiva: ''
    }

    get account() {
      return store.getters['auth/account']
    }

    get newOrReturned() {
      switch (this.koejaksoData.kehittamistoimenpiteidenTila) {
        case LomakeTilat.PALAUTETTU_KORJATTAVAKSI:
          return true
        case LomakeTilat.UUSI:
          return true
      }
      return false
    }

    get signed() {
      return this.koejaksoData.kehittamistoimenpiteidenTila == LomakeTilat.HYVAKSYTTY
    }

    get waitingForKouluttaja() {
      return (
        this.koejaksoData.kehittamistoimenpiteidenTila === LomakeTilat.ODOTTAA_HYVAKSYNTAA ||
        this.koejaksoData.kehittamistoimenpiteidenTila === LomakeTilat.ODOTTAA_ESIMIEHEN_HYVAKSYNTAA
      )
    }

    get waitingForErikoistuva() {
      return (
        this.koejaksoData.kehittamistoimenpiteidenTila ==
        LomakeTilat.ODOTTAA_ERIKOISTUVAN_HYVAKSYNTAA
      )
    }

    get koejaksoData() {
      return store.getters['erikoistuva/koejakso']
    }

    setKoejaksoData() {
      if (this.koejaksoData.kehittamistoimenpiteet) {
        this.kehittamistoimenpiteetLomake = this.koejaksoData.kehittamistoimenpiteet
      }
      this.kehittamistoimenpiteetLomake.erikoistuvanNimi = this.account.firstName.concat(
        ' ',
        this.account.lastName
      )
      this.kehittamistoimenpiteetLomake.erikoistuvanOpiskelijatunnus = this.account.erikoistuvaLaakari.opiskelijatunnus
      this.kehittamistoimenpiteetLomake.erikoistuvanErikoisala = this.account.erikoistuvaLaakari.erikoisalaNimi
      this.kehittamistoimenpiteetLomake.erikoistuvanYliopisto = this.account.erikoistuvaLaakari.yliopisto
    }

    get allekirjoitukset(): KoejaksonVaiheAllekirjoitus[] {
      const allekirjoitusLahikouluttaja = allekirjoituksetHelper.mapAllekirjoitusLahikouluttaja(
        this,
        this.kehittamistoimenpiteetLomake.lahikouluttaja
      )
      const allekirjoitusLahiesimies = allekirjoituksetHelper.mapAllekirjoitusLahiesimies(
        this,
        this.kehittamistoimenpiteetLomake.lahiesimies
      )
      const allekirjoitusErikoistuva = allekirjoituksetHelper.mapAllekirjoitusErikoistuva(
        this,
        this.kehittamistoimenpiteetLomake.erikoistuvanNimi,
        this.kehittamistoimenpiteetLomake.erikoistuvanAllekirjoitusaika
      ) as KoejaksonVaiheAllekirjoitus

      return [
        allekirjoitusLahikouluttaja,
        allekirjoitusLahiesimies,
        allekirjoitusErikoistuva
      ].filter((a) => a !== null)
    }

    hideModal(id: string) {
      return this.$bvModal.hide(id)
    }

    validateAndConfirmSend() {
      if (this.$refs.koulutuspaikanArvioijat.hasErrors()) {
        return
      }

      return this.$bvModal.show('confirm-send')
    }

    async onSendForm() {
      this.params.saving = true
      this.hideModal('confirm-send')
      this.saveNewForm()
      this.params.saving = false
    }

    async onSignForm() {
      this.params.saving = true
      this.hideModal('confirm-sign')
      this.kehittamistoimenpiteetLomake.erikoistuvaAllekirjoittanut = true
      this.signForm()
      this.params.saving = false
    }

    onLahikouluttajaSelect(lahikouluttaja: KoejaksonVaiheHyvaksyja) {
      this.kehittamistoimenpiteetLomake.lahikouluttaja = lahikouluttaja
    }

    onLahiesimiesSelect(lahiesimies: KoejaksonVaiheHyvaksyja) {
      this.kehittamistoimenpiteetLomake.lahiesimies = lahiesimies
    }

    async saveNewForm() {
      try {
        await store.dispatch(
          'erikoistuva/postKehittamistoimenpiteet',
          this.kehittamistoimenpiteetLomake
        )
        toastSuccess(this, this.$t('kehittamistoimenpiteet-lahetetty-onnistuneesti'))
      } catch (err) {
        toastFail(this, this.$t('kehittamistoimenpiteet-tallennus-epaonnistui'))
      }
    }

    async signForm() {
      try {
        await store
          .dispatch('erikoistuva/putKehittamistoimenpiteet', this.kehittamistoimenpiteetLomake)
          .then((res) => {
            this.kehittamistoimenpiteetLomake.erikoistuvanAllekirjoitusaika =
              res.data.erikoistuvanAllekirjoitusaika
          })

        toastSuccess(this, this.$t('kehittamistoimenpiteet-allekirjoitettu-onnistuneesti'))
      } catch (err) {
        toastFail(this, this.$t('kehittamistoimenpiteet-allekirjoitus-epaonnistui'))
      }
    }

    async mounted() {
      this.loading = true
      if (!this.koejaksoData) {
        await store.dispatch('erikoistuva/getKoejakso')
      }
      this.setKoejaksoData()
      this.loading = false
    }
  }
</script>
