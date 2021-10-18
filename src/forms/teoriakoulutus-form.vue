<template>
  <b-form @submit.stop.prevent="onSubmit">
    <elsa-form-group :label="$t('koulutuksen-nimi')" :required="true">
      <template v-slot="{ uid }">
        <b-form-input
          :id="uid"
          v-model="form.koulutuksenNimi"
          :state="validateState('koulutuksenNimi')"
        ></b-form-input>
        <b-form-invalid-feedback :id="`${uid}-feedback`">
          {{ $t('pakollinen-tieto') }}
        </b-form-invalid-feedback>
      </template>
    </elsa-form-group>
    <elsa-form-group :label="$t('paikka')" :required="true">
      <template v-slot="{ uid }">
        <b-form-input
          :id="uid"
          v-model="form.koulutuksenPaikka"
          :state="validateState('koulutuksenPaikka')"
        ></b-form-input>
        <b-form-invalid-feedback :id="`${uid}-feedback`">
          {{ $t('pakollinen-tieto') }}
        </b-form-invalid-feedback>
      </template>
    </elsa-form-group>
    <b-form-row>
      <elsa-form-group
        :label="$t('alkamispaiva')"
        class="col-sm-12 col-md-6 pr-md-3"
        :required="true"
      >
        <template v-slot="{ uid }">
          <div>
            <elsa-form-datepicker
              :id="uid"
              v-model="form.alkamispaiva"
              :state="validateState('alkamispaiva')"
              :max="form.paattymispaiva"
            ></elsa-form-datepicker>
            <b-form-invalid-feedback :id="`${uid}-feedback`">
              {{ $t('pakollinen-tieto') }}
            </b-form-invalid-feedback>
          </div>
        </template>
      </elsa-form-group>
      <elsa-form-group :label="$t('paattymispaiva')" class="col-sm-12 col-md-6 pl-md-3">
        <template v-slot="{ uid }">
          <elsa-form-datepicker
            :id="uid"
            v-model="form.paattymispaiva"
            :min="form.alkamispaiva"
            :aria-describedby="`${uid}-help`"
            class="datepicker-range"
          />
        </template>
      </elsa-form-group>
    </b-form-row>
    <elsa-form-group :label="$t('erikoistumiseen-hyvaksyttava-tuntimaara')">
      <template v-slot="{ uid }">
        <div>
          <div class="d-flex align-items-center">
            <b-form-input
              :id="uid"
              :value="form.erikoistumiseenHyvaksyttavaTuntimaara"
              type="number"
              step="any"
              class="col-sm-3"
              @input="onErikoistumiseenHyvaksyttavaTuntimaaraInput"
            />
            <span class="mx-3">{{ $t('t') }}</span>
          </div>
        </div>
      </template>
    </elsa-form-group>
    <elsa-form-group :label="$t('todistus')">
      <template v-slot="{ uid }">
        <div :id="uid">
          <p>{{ $t('teoriakoulutus-todistus-kuvaus') }}</p>
          <asiakirjat-upload
            :id="uid"
            :isPrimaryButton="false"
            :buttonText="$t('lisaa-liitetiedosto')"
            :existingFileNamesForCurrentView="[]"
            :existingFileNamesForOtherViews="[]"
            @selectedFiles="onFilesAdded"
          />
        </div>
      </template>
    </elsa-form-group>
    <div class="d-flex flex-row-reverse flex-wrap">
      <elsa-button :loading="params.saving" type="submit" variant="primary" class="ml-2 mb-2">
        {{ $t('tallenna-teoriakoulutus') }}
      </elsa-button>
      <elsa-button variant="back" @click.stop.prevent="onCancel" class="mb-2">
        {{ $t('peruuta') }}
      </elsa-button>
    </div>
  </b-form>
</template>

<script lang="ts">
  import Component from 'vue-class-component'
  import { Mixins, Prop } from 'vue-property-decorator'
  import { validationMixin } from 'vuelidate'
  import { required } from 'vuelidate/lib/validators'

  import AsiakirjatUpload from '@/components/asiakirjat/asiakirjat-upload.vue'
  import ElsaButton from '@/components/button/button.vue'
  import ElsaFormDatepicker from '@/components/datepicker/datepicker.vue'
  import ElsaFormGroup from '@/components/form-group/form-group.vue'
  import { Teoriakoulutus } from '@/types'

  @Component({
    components: {
      ElsaFormGroup,
      ElsaFormDatepicker,
      ElsaButton,
      AsiakirjatUpload
    },
    validations: {
      form: {
        koulutuksenNimi: {
          required
        },
        koulutuksenPaikka: {
          required
        },
        alkamispaiva: {
          required
        }
      }
    }
  })
  export default class TeoriakoulutusForm extends Mixins(validationMixin) {
    @Prop({
      required: false,
      type: Object
    })
    value!: Teoriakoulutus

    form: Teoriakoulutus = {
      koulutuksenNimi: null,
      koulutuksenPaikka: null,
      alkamispaiva: null,
      paattymispaiva: null,
      erikoistumiseenHyvaksyttavaTuntimaara: null
    }
    params = {
      saving: false
    }

    mounted() {
      if (this.value?.id) {
        this.form = {
          ...this.value
        }
      }
    }

    validateState(name: string) {
      const { $dirty, $error } = this.$v.form[name] as any
      return $dirty ? ($error ? false : null) : null
    }

    onErikoistumiseenHyvaksyttavaTuntimaaraInput(value: string) {
      if (value === '') {
        this.form.erikoistumiseenHyvaksyttavaTuntimaara = null
      } else {
        this.form.erikoistumiseenHyvaksyttavaTuntimaara = parseFloat(value)
      }
    }

    onFilesAdded(files: File[]) {
      // TODO
      console.log(files)
    }

    onSubmit() {
      this.$v.form.$touch()
      if (this.$v.form.$anyError) {
        return
      }
      this.$emit(
        'submit',
        {
          ...this.form
        },
        this.params
      )
    }

    onCancel() {
      this.$emit('cancel')
    }
  }
</script>

<style lang="scss" scoped>
  @import '~@/styles/variables';
  @import '~bootstrap/scss/mixins/breakpoints';

  .datepicker-range::before {
    content: '–';
    position: absolute;
    left: -2rem;
    padding: 0.375rem 0.75rem;
    @include media-breakpoint-down(sm) {
      display: none;
    }
  }
</style>
