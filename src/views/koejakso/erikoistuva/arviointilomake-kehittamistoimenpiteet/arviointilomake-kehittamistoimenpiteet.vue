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
        <b-row>
          <b-col lg="10">
            <h3>{{ $t('koulutuspaikan-arvioijat') }}</h3>
            <elsa-form-group
              :label="$t('lahikouluttaja')"
              :add-new-enabled="true"
              :add-new-label="$t('lisaa-kouluttaja')"
              :required="true"
              @submit="onKouluttajaSubmit"
            >
              <template v-slot:modal-content="{ submit, cancel }">
                <kouluttaja-form @submit="submit" @cancel="cancel" />
              </template>
              <template v-slot="{ uid }">
                <elsa-form-multiselect
                  v-model="kehittamistoimenpiteetLomake.lahikouluttaja"
                  :id="uid"
                  :options="lahikouluttajatList"
                  :state="validateState('lahikouluttaja.nimi')"
                  label="nimi"
                  track-by="nimi"
                >
                  <template v-slot:option="{ option }">
                    <div v-if="option.nimi">{{ optionDisplayName(option) }}</div>
                  </template>
                </elsa-form-multiselect>
                <b-form-invalid-feedback :id="`${uid}-feedback`">
                  {{ $t('pakollinen-tieto') }}
                </b-form-invalid-feedback>
              </template>
            </elsa-form-group>

            <elsa-form-group
              :label="$t('lahiesimies-tai-muu')"
              :add-new-enabled="true"
              :add-new-label="$t('lisaa-henkilo')"
              :required="true"
              @submit="onKouluttajaSubmit"
            >
              <template v-slot:modal-content="{ submit, cancel }">
                <kouluttaja-form @submit="submit" @cancel="cancel" />
              </template>
              <template v-slot="{ uid }">
                <elsa-form-multiselect
                  v-model="kehittamistoimenpiteetLomake.lahiesimies"
                  :id="uid"
                  :options="lahiesimiesList"
                  :state="validateState('lahiesimies.nimi')"
                  label="nimi"
                  track-by="nimi"
                >
                  <template v-slot:option="{ option }">
                    <div v-if="option.nimi">{{ optionDisplayName(option) }}</div>
                  </template>
                </elsa-form-multiselect>
                <b-form-invalid-feedback :id="`${uid}-feedback`">
                  {{ $t('pakollinen-tieto') }}
                </b-form-invalid-feedback>
              </template>
            </elsa-form-group>
          </b-col>
        </b-row>

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
        <b-row>
          <b-col lg="10">
            <h3>{{ $t('koulutuspaikan-arvioijat') }}</h3>
            <h5>{{ $t('lahikouluttaja') }}</h5>
            <p>{{ kehittamistoimenpiteetLomake.lahikouluttaja.nimi }}</p>
            <h5>{{ $t('lahiesimies-tai-muu') }}</h5>
            <p>{{ kehittamistoimenpiteetLomake.lahiesimies.nimi }}</p>
          </b-col>
        </b-row>
        <hr />
        <koejakson-vaihe-allekirjoitukset :allekirjoitukset="allekirjoitukset" />
        <hr v-if="waitingForKouluttaja || waitingForErikoistuva" />
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
  import axios from 'axios'
  import Component from 'vue-class-component'
  import { Mixins } from 'vue-property-decorator'
  import { validationMixin } from 'vuelidate'
  import { required } from 'vuelidate/lib/validators'
  import _get from 'lodash/get'
  import { toastFail, toastSuccess } from '@/utils/toast'
  import store from '@/store'
  import { KehittamistoimenpiteetLomake } from '@/types'
  import { LomakeTilat } from '@/utils/constants'
  import ErikoistuvaDetails from '@/components/erikoistuva-details/erikoistuva-details.vue'
  import KouluttajaForm from '@/forms/kouluttaja-form.vue'
  import ElsaFormGroup from '@/components/form-group/form-group.vue'
  import ElsaFormMultiselect from '@/components/multiselect/multiselect.vue'
  import ElsaButton from '@/components/button/button.vue'
  import KoejaksonVaiheAllekirjoitukset from '@/components/koejakson-vaiheet/koejakson-vaihe-allekirjoitukset.vue'
  import { KoejaksonVaiheAllekirjoitus } from '@/types'
  import * as allekirjoituksetHelper from '@/utils/koejaksonVaiheAllekirjoitusMapper'

  @Component({
    components: {
      ErikoistuvaDetails,
      KouluttajaForm,
      ElsaFormGroup,
      ElsaFormMultiselect,
      ElsaButton,
      KoejaksonVaiheAllekirjoitukset
    }
  })
  export default class ErikoistuvaArviointilomakeKehittamistoimenpiteet extends Mixins(
    validationMixin
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
        text: this.$t('koejakson-kehittamistoimenpiteet'),
        active: true
      }
    ]
    validations() {
      return {
        kehittamistoimenpiteetLomake: {
          lahikouluttaja: {
            nimi: {
              required
            }
          },
          lahiesimies: {
            nimi: {
              required
            }
          }
        }
      }
    }

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

    validateState(value: string) {
      const form = this.$v.kehittamistoimenpiteetLomake
      const { $dirty, $error } = _get(form, value) as any
      return $dirty ? ($error ? false : null) : null
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

    get kouluttajat() {
      return store.getters['erikoistuva/kouluttajat']
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

    get lahikouluttajatList() {
      return this.kouluttajat.map((k: any) => {
        if (this.kehittamistoimenpiteetLomake.lahiesimies.id === k.id) {
          return {
            ...k,
            $isDisabled: true
          }
        }
        return k
      })
    }

    get lahiesimiesList() {
      return this.kouluttajat.map((k: any) => {
        if (this.kehittamistoimenpiteetLomake.lahikouluttaja.id === k.id) {
          return {
            ...k,
            $isDisabled: true
          }
        }
        return k
      })
    }

    optionDisplayName(option: any) {
      return option.nimike ? option.nimi + ', ' + option.nimike : option.nimi
    }

    async onKouluttajaSubmit(value: any, params: any, modal: any) {
      this.params.saving = true
      try {
        await axios.post('/erikoistuva-laakari/lahikouluttajat', value)
        modal.hide('confirm')
        toastSuccess(this, this.$t('uusi-kouluttaja-lisatty'))
        await store.dispatch('erikoistuva/getKouluttajat')
      } catch (err) {
        toastFail(
          this,
          this.$t('uuden-kouluttajan-lisaaminen-epaonnistui', {
            virhe: err.response.data.title
          })
        )
      }
      this.params.saving = false
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
      this.$v.$touch()
      if (this.$v.$anyError) {
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
      await store.dispatch('erikoistuva/getKouluttajat')
      this.setKoejaksoData()
      this.loading = false
    }
  }
</script>
