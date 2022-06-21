<template>
  <div>
    <b-form @submit.stop.prevent="onSubmit">
      <b-form-row>
        <elsa-form-group :label="$t('etunimi')" class="col-sm-12 col-md-6 pr-md-3" :required="true">
          <template v-slot="{ uid }">
            <b-form-input
              :id="uid"
              v-model="form.etunimi"
              @input="$emit('skipRouteExitConfirm', false)"
              :state="validateState('etunimi')"
            ></b-form-input>
            <b-form-invalid-feedback :id="`${uid}-feedback`">
              {{ $t('pakollinen-tieto') }}
            </b-form-invalid-feedback>
          </template>
        </elsa-form-group>
        <elsa-form-group
          :label="$t('sukunimi')"
          class="col-sm-12 col-md-6 pl-md-3"
          :required="true"
        >
          <template v-slot="{ uid }">
            <b-form-input
              :id="uid"
              v-model="form.sukunimi"
              @input="$emit('skipRouteExitConfirm', false)"
              :state="validateState('sukunimi')"
            ></b-form-input>
            <b-form-invalid-feedback :id="`${uid}-feedback`">
              {{ $t('pakollinen-tieto') }}
            </b-form-invalid-feedback>
          </template>
        </elsa-form-group>
      </b-form-row>
      <elsa-form-group :required="true" :label="$t('yliopiston-kayttajatunnus')">
        <template v-slot="{ uid }">
          <b-form-input
            class="col-sm-12 col-md-6 pr-md-3"
            :id="uid"
            v-model="form.eppn"
            @input="$emit('skipRouteExitConfirm', false)"
            :state="validateState('eppn')"
          ></b-form-input>
          <b-form-invalid-feedback :id="`${uid}-feedback`">
            {{ $t('pakollinen-tieto') }}
          </b-form-invalid-feedback>
        </template>
      </elsa-form-group>
      <elsa-form-group :label="$t('sahkopostiosoite')" :required="true">
        <template v-slot="{ uid }">
          <b-form-input
            :id="uid"
            v-model="form.sahkoposti"
            @input="$emit('skipRouteExitConfirm', false)"
            :state="validateState('sahkoposti')"
          ></b-form-input>
          <b-form-invalid-feedback v-if="!$v.form.sahkoposti.required" :id="`${uid}-feedback`">
            {{ $t('pakollinen-tieto') }}
          </b-form-invalid-feedback>
          <b-form-invalid-feedback v-if="!$v.form.sahkoposti.email" :id="`${uid}-feedback`">
            {{ $t('sahkopostiosoite-ei-kelvollinen') }}
          </b-form-invalid-feedback>
        </template>
      </elsa-form-group>
      <elsa-form-group :label="$t('sahkopostiosoite-uudelleen')" :required="true">
        <template v-slot="{ uid }">
          <b-form-input
            :id="uid"
            v-model="form.sahkopostiUudelleen"
            @input="$emit('skipRouteExitConfirm', false)"
            :state="validateState('sahkopostiUudelleen')"
          ></b-form-input>
          <b-form-invalid-feedback
            v-if="!$v.form.sahkopostiUudelleen.required"
            :id="`${uid}-feedback`"
          >
            {{ $t('pakollinen-tieto') }}
          </b-form-invalid-feedback>
          <b-form-invalid-feedback
            v-if="!$v.form.sahkopostiUudelleen.email"
            :id="`${uid}-feedback`"
          >
            {{ $t('sahkopostiosoite-ei-kelvollinen') }}
          </b-form-invalid-feedback>
          <b-form-invalid-feedback
            v-if="
              $v.form.sahkopostiUudelleen.required &&
              $v.form.sahkopostiUudelleen.email &&
              !$v.form.sahkopostiUudelleen.sameAsSahkoposti
            "
            :id="`${uid}-feedback`"
          >
            {{ $t('sahkopostiosoitteet-eivat-tasmaa') }}
          </b-form-invalid-feedback>
        </template>
      </elsa-form-group>
      <hr />
      <div class="d-flex flex-row-reverse flex-wrap">
        <elsa-button variant="primary" @click="onSave" :loading="saving" class="mb-3 ml-3">
          {{ $t('tallenna') }}
        </elsa-button>
        <elsa-button
          variant="back"
          :disabled="saving"
          @click.stop.prevent="onCancel"
          class="mb-3 mr-3"
        >
          {{ $t('peruuta') }}
        </elsa-button>
      </div>
    </b-form>
  </div>
</template>

<script lang="ts">
  import { AxiosError } from 'axios'
  import { Component, Mixins } from 'vue-property-decorator'
  import { validationMixin } from 'vuelidate'
  import { required, email, sameAs } from 'vuelidate/lib/validators'

  import { postPaakayttaja } from '@/api/kayttajahallinta'
  import ElsaButton from '@/components/button/button.vue'
  import ElsaFormGroup from '@/components/form-group/form-group.vue'
  import ElsaFormMultiselect from '@/components/multiselect/multiselect.vue'
  import { KayttajahallintaNewKayttaja, ElsaError } from '@/types'
  import { toastFail, toastSuccess } from '@/utils/toast'
  import VastuuhenkilonTehtavat from '@/views/kayttajahallinta/vastuuhenkilon-tehtavat.vue'

  @Component({
    components: {
      ElsaButton,
      ElsaFormGroup,
      ElsaFormMultiselect,
      VastuuhenkilonTehtavat
    },
    validations: {
      form: {
        etunimi: { required },
        sukunimi: { required },
        sahkoposti: {
          required,
          email
        },
        sahkopostiUudelleen: {
          required,
          email,
          sameAsSahkoposti: sameAs('sahkoposti')
        },
        eppn: {
          required
        }
      }
    }
  })
  export default class PaakayttajaForm extends Mixins(validationMixin) {
    form: KayttajahallintaNewKayttaja = {
      etunimi: null,
      sukunimi: null,
      sahkoposti: null,
      sahkopostiUudelleen: null,
      eppn: null
    }
    saving = false

    async onSave() {
      if (!this.validateForm()) {
        return
      }
      this.saving = true

      try {
        const kayttajaId = (
          await postPaakayttaja({
            ...this.form
          })
        ).data.kayttaja?.id
        toastSuccess(this, this.$t('paakayttaja-lisatty'))
        this.$emit('skipRouteExitConfirm', true)
        this.saving = false
        this.$router.push({
          name: 'paakayttaja',
          params: { kayttajaId: `${kayttajaId}` }
        })
      } catch (err) {
        const axiosError = err as AxiosError<ElsaError>
        const message = axiosError?.response?.data?.message
        toastFail(
          this,
          message
            ? `${this.$t('tietojen-tallennus-epaonnistui')}: ${this.$t(message)}`
            : this.$t('tietojen-tallennus-epaonnistui')
        )
        this.saving = false
      }
    }

    onCancel() {
      this.$router.push({
        name: 'kayttajahallinta'
      })
    }

    validateState(name: string) {
      const { $dirty, $error } = this.$v.form?.[name] as any
      return $dirty ? ($error ? false : null) : null
    }

    validateForm(): boolean {
      this.$v.form.$touch()
      return !this.$v.$anyError
    }
  }
</script>
