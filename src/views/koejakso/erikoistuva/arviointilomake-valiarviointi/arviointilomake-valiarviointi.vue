<template>
  <div class="koulutussopimus col-lg-8 px-0">
    <b-breadcrumb :items="items" class="mb-0" />
    <b-container fluid v-if="!loading">
      <b-row lg>
        <b-col>
          <h1 class="mb-3">{{ $t('koejakson-valiarviointi') }}</h1>
          <b-alert :show="showWaitingForAcceptance" variant="dark" class="mt-3">
            <div class="d-flex flex-row">
              <em class="align-middle">
                <font-awesome-icon :icon="['fas', 'info-circle']" class="text-muted mr-2" />
              </em>
              <div>
                {{ $t('valiarviointi-tila-odottaa-hyvaksyntaa') }}
              </div>
            </div>
          </b-alert>
          <b-alert :show="showWaitingForErikoistuva" variant="dark" class="mt-3">
            <div class="d-flex flex-row">
              <em class="align-middle">
                <font-awesome-icon :icon="['fas', 'info-circle']" class="text-muted mr-2" />
              </em>
              <div>
                {{ $t('valiarviointi-tila-odottaa-erikoistuvan-hyvaksyntaa') }}
              </div>
            </div>
          </b-alert>
          <b-alert variant="success" :show="showAcceptedByEveryone">
            <div class="d-flex flex-row">
              <em class="align-middle">
                <font-awesome-icon :icon="['fas', 'check-circle']" class="mr-2" />
              </em>
              <span>{{ $t('valiarviointi-tila-hyvaksytty') }}</span>
            </div>
          </b-alert>
          <div v-if="editable">
            <p>{{ $t('koejakson-valiarviointi-ingressi') }}</p>
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
            :show-birthdate="false"
          ></erikoistuva-details>
        </b-col>
      </b-row>

      <hr />

      <b-form v-if="editable">
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
                  v-model="valiarviointiLomake.lahikouluttaja"
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
                  v-model="valiarviointiLomake.lahiesimies"
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
      </b-form>

      <div v-if="showWaitingForErikoistuva || showAcceptedByEveryone">
        <h3 class="mb-3">{{ $t('soveltuvuus-erikoisalalle-valiarvioinnin-perusteella') }}</h3>
        <b-row>
          <b-col lg="8">
            <h5>{{ $t('edistyminen-osaamistavoitteiden-mukaista') }}</h5>
            <p>
              {{
                valiarviointiLomake.edistyminenTavoitteidenMukaista
                  ? $t('kylla')
                  : $t('ei-huolenaiheita-on')
              }}
            </p>
          </b-col>
        </b-row>
        <b-row v-if="valiarviointiLomake.edistyminenTavoitteidenMukaista === false">
          <b-col lg="8">
            <h5>{{ $t('keskustelu-ja-toimenpiteet-tarpeen-ennen-hyvaksymista') }}</h5>
            <ul class="pl-4">
              <li v-for="kategoria in sortedKategoriat" :key="kategoria">
                {{ naytaKehittamistoimenpideKategoria(kategoria) }}
              </li>
            </ul>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <h5>{{ $t('vahvuudet') }}</h5>
            <p>{{ valiarviointiLomake.vahvuudet }}</p>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <h5>{{ $t('selvitys-kehittamistoimenpiteista') }}</h5>
            <p>{{ valiarviointiLomake.kehittamistoimenpiteet }}</p>
          </b-col>
        </b-row>
        <hr />
      </div>

      <div v-if="!editable">
        <b-row>
          <b-col lg="10">
            <h3>{{ $t('koulutuspaikan-arvioijat') }}</h3>
            <h5>{{ $t('lahikouluttaja') }}</h5>
            {{ valiarviointiLomake.lahikouluttaja.nimi }}

            <h5>{{ $t('lahiesimies-tai-muu') }}</h5>
            {{ valiarviointiLomake.lahiesimies.nimi }}
          </b-col>
        </b-row>
      </div>

      <div v-if="editable || showWaitingForErikoistuva">
        <hr />

        <b-row>
          <b-col class="text-right">
            <elsa-button variant="back" :to="{ name: 'koejakso' }">{{ $t('peruuta') }}</elsa-button>
            <elsa-button
              @click="sendForm(showWaitingForErikoistuva ? 'confirm-sign' : 'confirm-send')"
              :loading="params.saving"
              variant="primary"
              class="ml-4 px-5"
            >
              {{ $t('laheta') }}
            </elsa-button>
          </b-col>
        </b-row>
      </div>
    </b-container>

    <elsa-confirmation-modal
      id="confirm-send"
      :title="$t('vahvista-lomakkeen-lahetys')"
      :text="$t('vahvista-valiarviointi-lahetys')"
      :submitText="$t('laheta')"
      @submit="onSubmit"
    />
    <elsa-confirmation-modal
      id="confirm-sign"
      :title="$t('allekirjoita-valiarviointi')"
      :text="$t('vahvista-koejakson-vaihe-hyvaksytty', { koejaksonVaihe })"
      :submitText="$t('allekirjoita')"
      @submit="onSign"
    />
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
  import { ValiarviointiLomake } from '@/types'
  import { KehittamistoimenpideKategoria, LomakeTilat } from '@/utils/constants'
  import ErikoistuvaDetails from '@/components/erikoistuva-details/erikoistuva-details.vue'
  import KouluttajaForm from '@/forms/kouluttaja-form.vue'
  import ElsaFormGroup from '@/components/form-group/form-group.vue'
  import ElsaFormMultiselect from '@/components/multiselect/multiselect.vue'
  import ElsaButton from '@/components/button/button.vue'
  import ElsaConfirmationModal from '@/components/modal/confirmation-modal.vue'

  @Component({
    components: {
      ErikoistuvaDetails,
      KouluttajaForm,
      ElsaFormGroup,
      ElsaFormMultiselect,
      ElsaButton,
      ElsaConfirmationModal
    }
  })
  export default class ErikoistuvaArviointilomakeValiarviointi extends Mixins(validationMixin) {
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
        text: this.$t('koejakson-valiarviointi'),
        active: true
      }
    ]
    validations() {
      return {
        valiarviointiLomake: {
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

    koejaksonVaihe = 'väliarviointi'

    valiarviointiLomake: ValiarviointiLomake = {
      edistyminenTavoitteidenMukaista: null,
      erikoistuvaAllekirjoittanut: false,
      erikoistuvanErikoisala: this.account.erikoistuvaLaakari.erikoisalaNimi,
      erikoistuvanNimi: this.account.firstName.concat(' ', this.account.lastName),
      erikoistuvanOpiskelijatunnus: '', //this.account.erikoistuvaLaakari.opiskelijatunnus,
      erikoistuvanYliopisto: this.account.erikoistuvaLaakari.yliopisto,
      id: null,
      kehittamistoimenpideKategoriat: [],
      kehittamistoimenpiteet: '',
      korjausehdotus: '',
      lahiesimies: {
        id: null,
        kayttajaUserId: null,
        kuittausaika: '',
        nimi: '',
        sopimusHyvaksytty: false
      },
      lahikouluttaja: {
        id: 0,
        kayttajaUserId: null,
        kuittausaika: '',
        nimi: '',
        sopimusHyvaksytty: false
      },
      muokkauspaiva: '',
      muuKategoria: '',
      vahvuudet: ''
    }

    kategoriaOrder = [
      KehittamistoimenpideKategoria.TYOSSASUORIUTUMINEN,
      KehittamistoimenpideKategoria.TYOKAYTTAYTYMINEN,
      KehittamistoimenpideKategoria.POTILASPALAUTE,
      KehittamistoimenpideKategoria.MUU
    ]

    validateState(value: string) {
      const form = this.$v.valiarviointiLomake
      const { $dirty, $error } = _get(form, value) as any
      return $dirty ? ($error ? false : null) : null
    }

    get account() {
      return store.getters['auth/account']
    }

    get editable() {
      switch (this.koejaksoData.valiarvioinninTila) {
        case LomakeTilat.PALAUTETTU_KORJATTAVAKSI:
          return true
        case LomakeTilat.UUSI:
          return true
        case LomakeTilat.TALLENNETTU_KESKENERAISENA:
          return true
      }
      return false
    }

    get showWaitingForAcceptance() {
      return this.koejaksoData.valiarvioinninTila === LomakeTilat.ODOTTAA_HYVAKSYNTAA
    }

    get showWaitingForErikoistuva() {
      return this.koejaksoData.valiarvioinninTila === LomakeTilat.ODOTTAA_ERIKOISTUVAN_HYVAKSYNTAA
    }

    get showAcceptedByEveryone() {
      return this.koejaksoData.valiarvioinninTila === LomakeTilat.HYVAKSYTTY
    }

    get kouluttajat() {
      return store.getters['erikoistuva/kouluttajat']
    }

    get koejaksoData() {
      return store.getters['erikoistuva/koejakso']
    }

    setKoejaksoData() {
      if (this.koejaksoData.valiarviointi) {
        this.valiarviointiLomake = this.koejaksoData.valiarviointi
      }
    }

    get lahikouluttajatList() {
      return this.kouluttajat.map((k: any) => {
        if (this.valiarviointiLomake.lahiesimies.id === k.id) {
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
        if (this.valiarviointiLomake.lahikouluttaja.id === k.id) {
          return {
            ...k,
            $isDisabled: true
          }
        }
        return k
      })
    }

    naytaKehittamistoimenpideKategoria(kategoria: string) {
      if (kategoria === KehittamistoimenpideKategoria.MUU)
        return this.valiarviointiLomake?.muuKategoria
      return this.$t('kehittamistoimenpidekategoria-' + kategoria)
    }

    get sortedKategoriat() {
      return this.valiarviointiLomake?.kehittamistoimenpideKategoriat?.sort(
        (a, b) => this.kategoriaOrder.indexOf(a) - this.kategoriaOrder.indexOf(b)
      )
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

    hideModal(id: string) {
      return this.$bvModal.hide(id)
    }

    sendForm(modalId: string) {
      this.$v.$touch()
      if (this.$v.$anyError) {
        return
      }
      return this.$bvModal.show(modalId)
    }

    async saveNewForm() {
      try {
        await store.dispatch('erikoistuva/postValiarviointi', this.valiarviointiLomake)
        this.hideModal('confirm-send')
        toastSuccess(this, this.$t('valiarviointi-lahetetty-onnistuneesti'))
      } catch (err) {
        toastFail(this, this.$t('valiarviointi-tallennus-epaonnistui'))
      }
    }

    async updateForm() {
      try {
        await store.dispatch('erikoistuva/putValiarviointi', this.valiarviointiLomake)
        this.hideModal('confirm-sign')
        toastSuccess(this, this.$t('valiarviointi-allekirjoitettu-onnistuneesti'))
      } catch (err) {
        toastFail(this, this.$t('valiarviointi-tallennus-epaonnistui'))
      }
    }

    async onSubmit() {
      this.params.saving = true
      this.saveNewForm()
      this.params.saving = false
    }

    async onSign() {
      this.params.saving = true
      this.updateForm()
      this.params.saving = false
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
