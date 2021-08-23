<template>
  <b-form @submit.stop.prevent="onSubmit">
    <b-row>
      <b-col lg="8">
        <elsa-form-group :label="$t('sahkopostiosoite')" :required="true">
          <template v-slot="{ uid }">
            <b-form-input
              :id="uid"
              v-model="form.erikoistuvanSahkoposti"
              :state="validateState('erikoistuvanSahkoposti')"
            />
            <b-form-invalid-feedback :id="`${uid}-feedback`">
              {{ $t('pakollinen-tieto') }}
            </b-form-invalid-feedback>
          </template>
        </elsa-form-group>
      </b-col>
    </b-row>

    <b-row>
      <b-col lg="8">
        <elsa-form-group :label="$t('koejakson-suorituspaikka')" :required="true">
          <template v-slot="{ uid }">
            <b-form-input
              :id="uid"
              v-model="form.koejaksonSuorituspaikka"
              :state="validateState('koejaksonSuorituspaikka')"
            />
            <b-form-invalid-feedback :id="`${uid}-feedback`">
              {{ $t('pakollinen-tieto') }}
            </b-form-invalid-feedback>
          </template>
        </elsa-form-group>
        <elsa-button
          v-if="!local.toinenSuorituspaikka"
          @click="local.toinenSuorituspaikka = true"
          variant="outline-primary"
          class="border-0 p-0"
        >
          + {{ $t('suorituspaikka-toinen') }}
        </elsa-button>
      </b-col>
    </b-row>

    <b-row v-if="local.toinenSuorituspaikka">
      <b-col lg="8">
        <elsa-form-group :label="$t('koejakson-toinen-suorituspaikka')" :required="true">
          <template v-slot="{ uid }">
            <b-form-input
              :id="uid"
              v-model="form.koejaksonToinenSuorituspaikka"
              :state="validateState('koejaksonToinenSuorituspaikka')"
            />
            <b-form-invalid-feedback :id="`${uid}-feedback`">
              {{ $t('pakollinen-tieto') }}
            </b-form-invalid-feedback>
          </template>
        </elsa-form-group>
        <elsa-button
          @click="deleteToinenSuorituspaikka"
          variant="outline-primary"
          class="border-0 p-0"
        >
          <font-awesome-icon :icon="['far', 'trash-alt']" fixed-width size="lg" />
          {{ $t('suorituspaikka-poista') }}
        </elsa-button>
      </b-col>
    </b-row>

    <b-row class="mt-4">
      <b-col xl="4" lg="8">
        <elsa-form-group :label="$t('koejakson-alkamispäivä')" :required="true">
          <template #label-help>
            <elsa-popover>
              <template>
                <h3>{{ $t('koejakson-alkamispäivä') }}</h3>
                <p>{{ $t('koejakson-alkamis-tooltip') }}</p>
              </template>
            </elsa-popover>
          </template>
          <template v-slot="{ uid }">
            <elsa-form-datepicker
              :id="uid"
              v-model="form.koejaksonAlkamispaiva"
              :state="validateState('koejaksonAlkamispaiva')"
              :min="account.erikoistuvaLaakari.opintooikeudenMyontamispaiva"
              :max="maxKoejaksonAlkamispaiva"
            ></elsa-form-datepicker>
            <b-form-invalid-feedback :id="`${uid}-feedback`">
              {{ $t('pakollinen-tieto') }}
            </b-form-invalid-feedback>
          </template>
        </elsa-form-group>
      </b-col>

      <b-col xl="4" lg="8">
        <elsa-form-group :label="$t('koejakson-päättymispäivä')" :required="true">
          <template v-slot="{ uid }">
            <elsa-form-datepicker
              :id="uid"
              :disabled="!form.koejaksonAlkamispaiva"
              v-model="form.koejaksonPaattymispaiva"
              :min="minKoejaksonPaattymispaiva"
              :max="maxKoejaksonPaattymispaiva"
              :state="validateState('koejaksonPaattymispaiva')"
            ></elsa-form-datepicker>
            <b-form-invalid-feedback :id="`${uid}-feedback`">
              {{ $t('pakollinen-tieto') }}
            </b-form-invalid-feedback>
          </template>
        </elsa-form-group>
      </b-col>
    </b-row>

    <b-row>
      <b-col lg="8">
        <elsa-form-group
          :label="$t('koejakso-suoritettu-kokoaikatyössä')"
          :required="true"
          class="mb-1"
        >
          <template #label-help>
            <elsa-popover>
              <template>
                <h3>{{ $t('koejakso-suoritettu-kokoaikatyössä-tooltip-header') }}</h3>
                <p>{{ $t('koejakso-suoritettu-kokoaikatyössä-tooltip-content') }}</p>
              </template>
            </elsa-popover>
          </template>
          <template v-slot="{ uid }">
            <b-form-radio-group
              :id="uid"
              v-model="form.suoritettuKokoaikatyossa"
              :options="suorittettuKokoaikatyossaOptions"
              :state="validateState('suoritettuKokoaikatyossa')"
              name="suoritettu-kokoaikatyossa"
              stacked
            ></b-form-radio-group>
            <b-form-invalid-feedback
              :id="`${uid}-feedback`"
              :state="validateState('suoritettuKokoaikatyossa')"
            >
              {{ $t('pakollinen-tieto') }}
            </b-form-invalid-feedback>
          </template>
        </elsa-form-group>
      </b-col>
    </b-row>
    <b-row v-if="form.suoritettuKokoaikatyossa === false" class="mb-3">
      <b-col lg="3">
        <elsa-form-group :label="$t('suoritettu-osa-aikatyossa')" :required="true" class="ml-4">
          <template v-slot="{ uid }">
            <div class="d-inline-flex align-items-center">
              <b-form-input
                :id="uid"
                v-model="local.tyotunnitViikossa"
                class="tyotunnit-viikossa-input"
                :state="validateState('tyotunnitViikossa')"
                @change="onTyotunnitViikossaChange"
              />
              <span class="ml-2">({{ $t('tuntia-viikossa') }})</span>
            </div>
            <b-form-invalid-feedback
              v-if="!$v.form.tyotunnitViikossa.required"
              :state="validateState('tyotunnitViikossa')"
              :id="`${uid}-feedback`"
            >
              {{ $t('pakollinen-tieto') }}
            </b-form-invalid-feedback>
            <b-form-invalid-feedback
              v-if="!$v.form.tyotunnitViikossa.between"
              :state="validateState('tyotunnitViikossa')"
              :id="`${uid}-feedback`"
            >
              {{ $t('koejakso-suoritettu-osaaikatyossa.invalid') }}
            </b-form-invalid-feedback>
          </template>
        </elsa-form-group>
      </b-col>
    </b-row>
    <hr />
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
              v-model="form.lahikouluttaja"
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
              v-model="form.lahiesimies"
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
      <b-col>
        <h3>{{ $t('aloituskeskustelu-tavoitteet') }}</h3>
        <elsa-form-group :label="$t('koejakso-osaamistavoitteet')" :required="true">
          <template v-slot="{ uid }">
            <b-form-textarea
              :id="uid"
              v-model="form.koejaksonOsaamistavoitteet"
              :state="validateState('koejaksonOsaamistavoitteet')"
              rows="7"
              class="textarea-min-height"
            ></b-form-textarea>
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
          v-b-modal.confirm-save
        >
          {{ $t('tallenna-keskeneraisena') }}
        </elsa-button>
        <elsa-button
          class="my-2 d-block d-md-inline-block d-lg-block d-xl-inline-block"
          style="width: 14rem"
          :loading="params.saving"
          variant="primary"
          @click="sendForm"
        >
          {{ $t('allekirjoita-laheta') }}
        </elsa-button>
      </b-col>
    </b-row>
    <elsa-confirmation-modal
      id="confirm-send"
      :title="$t('vahvista-lomakkeen-lahetys')"
      :text="$t('vahvista-koejakson-vaihe-lahetys')"
      :submitText="$t('allekirjoita-laheta')"
      @submit="onSubmit"
    />
    <elsa-confirmation-modal
      id="confirm-save"
      :title="$t('vahvista-tallennus-keskeneraisena.title')"
      :text="$t('vahvista-tallennus-keskeneraisena.body')"
      :submitText="$t('tallenna-keskeneraisena')"
      @submit="saveAndExit"
    />
  </b-form>
</template>

<script lang="ts">
  import Vue from 'vue'
  import axios from 'axios'
  import Component from 'vue-class-component'
  import { toastFail, toastSuccess } from '@/utils/toast'
  import { Prop } from 'vue-property-decorator'
  import { validationMixin } from 'vuelidate'
  import { required, requiredIf, email, between } from 'vuelidate/lib/validators'
  import _get from 'lodash/get'
  import store from '@/store'
  import { format } from 'date-fns'
  import ElsaButton from '@/components/button/button.vue'
  import ElsaFormGroup from '@/components/form-group/form-group.vue'
  import ElsaPopover from '@/components/popover/popover.vue'
  import ElsaFormDatepicker from '@/components/datepicker/datepicker.vue'
  import ElsaFormMultiselect from '@/components/multiselect/multiselect.vue'
  import KouluttajaForm from '@/forms/kouluttaja-form.vue'
  import { AloituskeskusteluLomake, Kouluttaja, UserAccount } from '@/types'
  import ElsaConfirmationModal from '@/components/modal/confirmation-modal.vue'

  @Component({
    mixins: [validationMixin],
    components: {
      ElsaFormGroup,
      ElsaFormDatepicker,
      ElsaButton,
      ElsaPopover,
      ElsaFormMultiselect,
      KouluttajaForm,
      ElsaConfirmationModal
    }
  })
  export default class ArviointilomakeAloituskeskusteluForm extends Vue {
    @Prop({ required: true, default: {} })
    data!: AloituskeskusteluLomake

    @Prop({ required: true, default: {} })
    account!: UserAccount

    @Prop({ required: false, default: () => [] })
    kouluttajat!: Kouluttaja[]

    validations() {
      return {
        form: {
          erikoistuvanSahkoposti: {
            required,
            email
          },
          koejaksonSuorituspaikka: {
            required
          },
          koejaksonToinenSuorituspaikka: {
            required: requiredIf(() => {
              return this.local.toinenSuorituspaikka
            })
          },
          koejaksonAlkamispaiva: {
            required
          },
          koejaksonPaattymispaiva: {
            required
          },
          suoritettuKokoaikatyossa: {
            required
          },
          tyotunnitViikossa: {
            required: requiredIf((value) => {
              return value.suoritettuKokoaikatyossa == false
            }),
            between: between(19.125, 38.25)
          },
          lahikouluttaja: {
            nimi: {
              required
            }
          },
          lahiesimies: {
            nimi: {
              required
            }
          },
          koejaksonOsaamistavoitteet: {
            required
          }
        }
      }
    }

    suorittettuKokoaikatyossaOptions = [
      { value: true, text: this.$t('kylla') },
      { value: false, text: this.$t('ei') }
    ]

    form: AloituskeskusteluLomake = {
      erikoistuvanErikoisala: '',
      erikoistuvanNimi: '',
      erikoistuvanOpiskelijatunnus: '',
      erikoistuvanSahkoposti: '',
      erikoistuvanYliopisto: '',
      id: null,
      koejaksonAlkamispaiva: '',
      koejaksonOsaamistavoitteet: '',
      koejaksonPaattymispaiva: '',
      koejaksonSuorituspaikka: '',
      koejaksonToinenSuorituspaikka: '',
      korjausehdotus: '',
      lahetetty: false,
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
      muokkauspaiva: '',
      suoritettuKokoaikatyossa: null,
      tyotunnitViikossa: null
    }

    local: any = {
      tyotunnitViikossa: String,
      toinenSuorituspaikka: false
    }

    params = {
      saving: false,
      deleting: false
    }

    get hasErrors() {
      return this.$v.$anyError
    }

    validateState(value: string) {
      const form = this.$v.form
      const { $dirty, $error } = _get(form, value) as any
      return $dirty ? ($error ? false : null) : null
    }

    deleteToinenSuorituspaikka() {
      this.form.koejaksonToinenSuorituspaikka = ''
      this.local.toinenSuorituspaikka = false
    }

    optionDisplayName(option: any) {
      return option.nimike ? option.nimi + ', ' + option.nimike : option.nimi
    }

    onTyotunnitViikossaChange(val: string) {
      this.form.tyotunnitViikossa = parseFloat(val.replace(',', '.'))
    }

    async onKouluttajaSubmit(value: any, params: any, modal: any) {
      params.saving = true
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
      params.saving = false
    }

    get lahikouluttajatList() {
      return this.kouluttajat.map((k) => {
        if (this.form.lahiesimies.id === k.id) {
          return {
            ...k,
            $isDisabled: true
          }
        }
        return k
      })
    }

    get lahiesimiesList() {
      return this.kouluttajat.map((k) => {
        if (this.form.lahikouluttaja.id === k.id) {
          return {
            ...k,
            $isDisabled: true
          }
        }
        return k
      })
    }

    get maxKoejaksonAlkamispaiva() {
      const dateFormat = 'yyyy-MM-dd'
      if (!this.account.erikoistuvaLaakari.opintooikeudenPaattymispaiva) {
        return null
      }

      const opintooikeudenPaattymispaivaDate = new Date(
        this.account.erikoistuvaLaakari.opintooikeudenPaattymispaiva
      )
      // Koejakson voi aloittaa viimeistään 6kk ennen määrä-aikaisen
      // opinto-oikeuden päättymispäivää, koska koejakson kesto on 6kk.
      opintooikeudenPaattymispaivaDate.setMonth(opintooikeudenPaattymispaivaDate.getMonth() - 6)
      return format(opintooikeudenPaattymispaivaDate, dateFormat)
    }

    get minKoejaksonPaattymispaiva() {
      const dateFormat = 'yyyy-MM-dd'
      const koejaksonAlkamispaiva = this.form.koejaksonAlkamispaiva
      if (!koejaksonAlkamispaiva) {
        return null
      }

      const koejaksonAlkamispaivaDate = new Date(koejaksonAlkamispaiva)
      // Koejakson kesto on vähintään 6kk.
      koejaksonAlkamispaivaDate.setMonth(koejaksonAlkamispaivaDate.getMonth() + 6)
      return format(koejaksonAlkamispaivaDate, dateFormat)
    }

    get maxKoejaksonPaattymispaiva() {
      const dateFormat = 'yyyy-MM-dd'
      const koejaksonAlkamispaiva = this.form.koejaksonAlkamispaiva
      if (!this.account.erikoistuvaLaakari.opintooikeudenPaattymispaiva || !koejaksonAlkamispaiva) {
        return null
      }

      const koejaksonAlkamispaivaDate = new Date(this.form.koejaksonAlkamispaiva)
      // Koejakson kesto on maksimissaan 2 vuotta.
      koejaksonAlkamispaivaDate.setFullYear(koejaksonAlkamispaivaDate.getFullYear() + 2)
      const opintooikeudenPaattymispaivaDate = new Date(
        this.account.erikoistuvaLaakari.opintooikeudenPaattymispaiva
      )
      // Mikäli maksimikesto 2 vuotta ylittää opinto-oikeuden päättymispäivän,
      // on maksimi päättymispäivä opinto-oikeuden päättymispäivä.
      if (koejaksonAlkamispaivaDate > opintooikeudenPaattymispaivaDate) {
        return format(opintooikeudenPaattymispaivaDate, dateFormat)
      }

      return format(koejaksonAlkamispaivaDate, dateFormat)
    }

    saveAndExit() {
      this.$emit('saveAndExit', this.form, this.params)
    }

    onSubmit() {
      this.$emit('submit', this.form, this.params)
    }

    sendForm() {
      this.$v.$touch()
      if (this.$v.$anyError) {
        return
      }
      return this.$bvModal.show('confirm-send')
    }

    hideModal(id: string) {
      return this.$bvModal.hide(id)
    }

    mounted(): void {
      if (this.data !== null) {
        this.form = this.data
      }

      if (!this.form.erikoistuvanSahkoposti) {
        this.form.erikoistuvanSahkoposti = this.account.email
      }

      // Asetetaan ei-muokattavien kenttien arvot
      this.form.erikoistuvanNimi = this.account.firstName.concat(' ', this.account.lastName)
      this.form.erikoistuvanOpiskelijatunnus = this.account.erikoistuvaLaakari.opiskelijatunnus
      this.form.erikoistuvanErikoisala = this.account.erikoistuvaLaakari.erikoisalaNimi
      this.form.erikoistuvanYliopisto = this.account.erikoistuvaLaakari.yliopisto

      if (!this.form.koejaksonAlkamispaiva) {
        this.form.koejaksonAlkamispaiva = this.data?.koejaksonAlkamispaiva
      }

      this.local.tyotunnitViikossa = this.form.tyotunnitViikossa?.toString().replace('.', ',')
    }
  }
</script>

<style lang="scss">
  .textarea-min-height {
    min-height: 200px;
  }

  .tyotunnit-viikossa-input {
    width: 5rem;
  }
</style>
