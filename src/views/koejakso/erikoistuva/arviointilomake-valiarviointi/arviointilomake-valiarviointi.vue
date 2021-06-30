<template>
  <div class="koulutussopimus col-lg-8 px-0">
    <b-breadcrumb :items="items" class="mb-0" />
    <b-container fluid v-if="!loading">
      <b-row lg>
        <b-col>
          <h1 class="mb-3">{{ $t('koejakson-valiarviointi') }}</h1>
          <div v-if="editable">
            <p>{{ $t('koejakson-valiarviointi-ingressi') }}</p>
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

      <b-form>
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

        <hr />

        <b-row>
          <b-col class="text-right">
            <elsa-button variant="back" :to="{ name: 'koejakso' }">{{ $t('peruuta') }}</elsa-button>
            <elsa-button
              @click="sendForm"
              :loading="params.saving"
              variant="primary"
              class="ml-4 px-5"
            >
              {{ $t('laheta') }}
            </elsa-button>
          </b-col>
        </b-row>
      </b-form>
    </b-container>

    <b-modal id="confirm-send" :title="$t('vahvista-lomakkeen-lahetys')">
      <div class="d-block">
        <p>{{ $t('vahvista-valiarviointi-lahetys') }}</p>
      </div>

      <template #modal-footer>
        <elsa-button variant="back" @click="hideModal">
          {{ $t('peruuta') }}
        </elsa-button>

        <elsa-button variant="primary" @click="onSubmit">
          {{ $t('laheta') }}
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
  import { ValiarviointiLomake } from '@/types'
  import { LomakeTilat } from '@/utils/constants'
  import ErikoistuvaDetails from '@/components/erikoistuva-details/erikoistuva-details.vue'
  import KouluttajaForm from '@/forms/kouluttaja-form.vue'
  import ElsaFormGroup from '@/components/form-group/form-group.vue'
  import ElsaFormMultiselect from '@/components/multiselect/multiselect.vue'
  import ElsaButton from '@/components/button/button.vue'

  @Component({
    components: {
      ErikoistuvaDetails,
      KouluttajaForm,
      ElsaFormGroup,
      ElsaFormMultiselect,
      ElsaButton
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

    valiarviointiLomake: ValiarviointiLomake = {
      edistyminenTavoitteidenMukaista: null,
      erikoistuvaAllekirjoittanut: false,
      erikoistuvanErikoisala: '',
      erikoistuvanNimi: '',
      erikoistuvanOpiskelijatunnus: '',
      erikoistuvanYliopisto: '',
      id: null,
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
      vahvuudet: ''
    }

    validateState(value: string) {
      const form = this.$v.valiarviointiLomake
      const { $dirty, $error } = _get(form, value) as any
      return $dirty ? ($error ? false : null) : null
    }

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
      if (this.koejaksoData.valiarviointi) {
        this.valiarviointiLomake = this.koejaksoData.valiarviointi
        this.valiarviointiLomake.erikoistuvanNimi = this.account.firstName.concat(
          ' ',
          this.account.lastName
        )
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

    hideModal() {
      return this.$bvModal.hide('confirm-send')
    }

    sendForm() {
      this.$v.$touch()
      if (this.$v.$anyError) {
        return
      }
      return this.$bvModal.show('confirm-send')
    }

    async saveNewForm() {
      try {
        await store.dispatch('erikoistuva/postValiarviointi', this.valiarviointiLomake)
        toastSuccess(this, this.$t('valiarviointi-lahetetty-onnistuneesti'))
      } catch (err) {
        toastFail(this, this.$t('valiarviointi-tallennus-epaonnistui'))
      }
    }

    async onSubmit() {
      this.params.saving = true
      this.valiarviointiLomake.erikoistuvaAllekirjoittanut = true
      this.saveNewForm()
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
