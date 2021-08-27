<template>
  <div class="koulutussopimus col-lg-8 px-0">
    <b-breadcrumb :items="items" class="mb-0" />
    <b-container fluid>
      <h1 class="mb-3">{{ $t('koejakson-kehittamistoimenpiteet') }}</h1>
      <div v-if="!this.loading">
        <b-row lg>
          <b-col>
            <div v-if="editable">
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
              <b-alert variant="success" :show="acceptedByEveryone">
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
              :showKehittamistoimenpiteet="true"
            ></erikoistuva-details>
          </b-col>
        </b-row>
        <hr />
        <div v-if="waitingForErikoistuva || acceptedByEveryone">
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

        <koulutuspaikan-arvioijat
          ref="koulutuspaikanArvioijat"
          :lahikouluttaja="kehittamistoimenpiteetLomake.lahikouluttaja"
          :lahiesimies="kehittamistoimenpiteetLomake.lahiesimies"
          :params="params"
          :isReadonly="!editable"
          @lahikouluttajaSelect="onLahikouluttajaSelect"
          @lahiesimiesSelect="onLahiesimiesSelect"
        />
        <hr />

        <div v-if="waitingForErikoistuva || acceptedByEveryone">
          <koejakson-vaihe-allekirjoitukset :allekirjoitukset="allekirjoitukset" />
        </div>

        <div v-if="editable || waitingForErikoistuva">
          <hr v-if="allekirjoitukset.length > 0" />
          <b-row>
            <b-col class="text-right">
              <elsa-button variant="back" :to="{ name: 'koejakso' }">
                {{ $t('peruuta') }}
              </elsa-button>
              <elsa-button
                v-if="!loading"
                @click="sendForm(waitingForErikoistuva ? 'confirm-sign' : 'confirm-send')"
                :loading="params.saving"
                variant="primary"
                class="ml-4 px-5"
              >
                {{ waitingForErikoistuva ? $t('allekirjoita') : $t('laheta') }}
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
      id="confirm-send"
      :title="$t('vahvista-lomakkeen-lahetys')"
      :text="$t('vahvista-koejakson-vaihe-lahetys')"
      :submitText="$t('laheta')"
      @submit="onSubmit"
    />
    <elsa-confirmation-modal
      id="confirm-sign"
      :title="$t('allekirjoita-kehittamistoimenpiteet')"
      :text="$t('vahvista-koejakson-vaihe-hyvaksytty', { koejaksonVaihe })"
      :submitText="$t('allekirjoita')"
      @submit="onSign"
    />
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
  import ElsaConfirmationModal from '@/components/modal/confirmation-modal.vue'
  import ElsaReturnToSenderModal from '@/components/modal/return-to-sender-modal.vue'
  import KoulutuspaikanArvioijat from '@/components/koejakson-vaiheet/koulutuspaikan-arvioijat.vue'

  @Component({
    components: {
      ErikoistuvaDetails,
      ElsaFormGroup,
      ElsaButton,
      ElsaConfirmationModal,
      ElsaReturnToSenderModal,
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

    koejaksonVaihe = (this.$t('kehittamistoimenpiteiden-arviointi') as string).toLowerCase()

    kehittamistoimenpiteetLomake: KehittamistoimenpiteetLomake = {
      erikoistuvaAllekirjoittanut: false,
      erikoistuvanAllekirjoitusaika: undefined,
      erikoistuvanErikoisala: '',
      erikoistuvanNimi: '',
      erikoistuvanOpiskelijatunnus: '',
      erikoistuvanYliopisto: '',
      id: null,
      kehittamistoimenpiteetRiittavat: null,
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

    get editable() {
      return this.koejaksoData.kehittamistoimenpiteidenTila === LomakeTilat.UUSI
    }

    get acceptedByEveryone() {
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

    sendForm(modalId: string) {
      if (this.$refs.koulutuspaikanArvioijat && !this.$refs.koulutuspaikanArvioijat.checkForm()) {
        return
      }
      return this.$bvModal.show(modalId)
    }

    async onSubmit() {
      this.params.saving = true
      this.hideModal('confirm-send')
      this.saveNewForm()
      this.params.saving = false
    }

    async onSign() {
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
        toastSuccess(this, this.$t('kehittamistoimenpiteet-arviointipyynnon-lahetys-onnistui'))
      } catch (err) {
        toastFail(this, this.$t('kehittamistoimenpiteet-arviointipyynnon-lahetys-epaonnistui'))
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

        toastSuccess(this, this.$t('kehittamistoimenpiteet-allekirjoitus-onnistui'))
      } catch (err) {
        toastFail(this, this.$t('kehittamistoimenpiteet-allekirjoitus-epaonnistui'))
      }
    }

    async mounted() {
      if (!this.koejaksoData) {
        await store.dispatch('erikoistuva/getKoejakso')
      }
      this.setKoejaksoData()
      this.loading = false
    }
  }
</script>
