<template>
  <b-form @submit.stop.prevent="onSubmit">
    <p>
      {{ $t('henkilokohtainen-koulutussuunnitelma-liitteena-kuvaus') }}
      <input
        ref="koulutussuunnitelma-file-input"
        id="koulutussuunnitelma-file-input"
        type="file"
        accept="application/pdf"
        @change="koulutussuunnitelmaChange"
        hidden
      />
      <elsa-button
        @click="selectMoulutussuunnitelma"
        variant="link"
        class="text-decoration-none p-0"
      >
        {{ $t('henkilokohtainen-koulutussuunnitelma-liitteena-linkki') }}
      </elsa-button>
    </p>
    <b-container
      v-if="form.koulutussuunnitelmaFile || form.koulutussuunnitelmaAsiakirja"
      fluid
      class="px-0"
    >
      <b-row>
        <b-col xl="6" lg="8">
          <b-table-simple responsive stacked="md" class="mb-0">
            <b-thead>
              <b-tr>
                <b-th>{{ $t('tiedoston-nimi') }}</b-th>
                <b-th>{{ $t('lisatty') }}</b-th>
                <b-th style="width: 0"></b-th>
              </b-tr>
            </b-thead>
            <b-tbody>
              <b-tr>
                <b-td>
                  <elsa-button
                    v-if="form.koulutussuunnitelmaFile"
                    variant="link"
                    class="shadow-none p-0"
                  >
                    {{ form.koulutussuunnitelmaFile.name }}
                  </elsa-button>
                  <elsa-button
                    v-else
                    variant="link"
                    class="shadow-none p-0"
                    @click="onViewAsiakirja(form.koulutussuunnitelmaAsiakirja)"
                    :loading="form.koulutussuunnitelmaAsiakirja.disablePreview"
                  >
                    {{ form.koulutussuunnitelmaAsiakirja.nimi }}
                  </elsa-button>
                </b-td>
                <b-td>
                  <span v-if="form.koulutussuunnitelmaFile">
                    {{ $today() }}
                  </span>
                  <span v-else>
                    {{ $date(form.koulutussuunnitelmaAsiakirja.lisattypvm) }}
                  </span>
                </b-td>
                <b-td>
                  <elsa-button
                    @click="removeKoulutussuunnitelmaAsiakirja"
                    variant="link"
                    class="shadow-none p-0"
                  >
                    <font-awesome-icon :icon="['far', 'trash-alt']" fixed-width size="lg" />
                  </elsa-button>
                </b-td>
              </b-tr>
            </b-tbody>
          </b-table-simple>
        </b-col>
      </b-row>
    </b-container>
    <hr />
    <elsa-form-group :label="$t('motivaatiokirje')">
      <template v-slot="{ uid }">
        <p>{{ $t('motivaatiokirje-kuvas') }}</p>
        <input
          ref="motivaatiokirje-file-input"
          id="motivaatiokirje-file-input"
          type="file"
          accept="application/pdf"
          @change="motivaatiokirjeChange"
          hidden
        />
        <elsa-button @click="selectMotivaatiokirje" variant="outline-primary" class="mb-3">
          {{ $t('lisaa-liitetiedosto') }}
        </elsa-button>
        <b-container
          v-if="form.motivaatiokirjeFile || form.motivaatiokirjeAsiakirja"
          fluid
          class="px-0"
        >
          <b-row>
            <b-col xl="6" lg="8">
              <b-table-simple responsive stacked="md">
                <b-thead>
                  <b-tr>
                    <b-th>{{ $t('tiedoston-nimi') }}</b-th>
                    <b-th>{{ $t('lisatty') }}</b-th>
                    <b-th style="width: 0"></b-th>
                  </b-tr>
                </b-thead>
                <b-tbody>
                  <b-tr>
                    <b-td>
                      <elsa-button
                        v-if="form.motivaatiokirjeFile"
                        variant="link"
                        class="shadow-none p-0"
                      >
                        {{ form.motivaatiokirjeFile.name }}
                      </elsa-button>
                      <elsa-button
                        v-else
                        variant="link"
                        class="shadow-none p-0"
                        @click="onViewAsiakirja(form.motivaatiokirjeAsiakirja)"
                        :loading="form.motivaatiokirjeAsiakirja.disablePreview"
                      >
                        {{ form.motivaatiokirjeAsiakirja.nimi }}
                      </elsa-button>
                    </b-td>
                    <b-td>
                      <span v-if="form.motivaatiokirjeFile">
                        {{ $today() }}
                      </span>
                      <span v-else>
                        {{ $date(form.motivaatiokirjeAsiakirja.lisattypvm) }}
                      </span>
                    </b-td>
                    <b-td>
                      <elsa-button
                        @click="removeMotivaatiokirjeAsiakirja"
                        variant="link"
                        class="shadow-none p-0"
                      >
                        <font-awesome-icon :icon="['far', 'trash-alt']" fixed-width size="lg" />
                      </elsa-button>
                    </b-td>
                  </b-tr>
                </b-tbody>
              </b-table-simple>
            </b-col>
          </b-row>
        </b-container>
        <b-form-textarea :id="uid" v-model="form.motivaatiokirje" rows="3" />
      </template>
    </elsa-form-group>
    <elsa-form-group
      :label="$t('opiskelu-ja-tyohistoria')"
      :help="$t('opiskelu-ja-tyohistoria-tooltip')"
    >
      <template #label-right>
        <b-form-checkbox v-model="form.opiskeluJaTyohistoriaYksityinen" class="py-0">
          {{ $t('piilota-kouluttajilta-kuvaus') }}
        </b-form-checkbox>
      </template>
      <template v-slot="{ uid }">
        <b-form-textarea :id="uid" v-model="form.opiskeluJaTyohistoria" rows="3" />
      </template>
    </elsa-form-group>
    <elsa-form-group :label="$t('vahvuudet')" :help="$t('vahvuudet-tooltip')">
      <template #label-right>
        <b-form-checkbox v-model="form.vahvuudetYksityinen" class="py-0">
          {{ $t('piilota-kouluttajilta-kuvaus') }}
        </b-form-checkbox>
      </template>
      <template v-slot="{ uid }">
        <b-form-textarea :id="uid" v-model="form.vahvuudet" rows="3" />
      </template>
    </elsa-form-group>
    <elsa-form-group
      :label="$t('tulevaisuuden-visiointi')"
      :help="$t('tulevaisuuden-visiointi-tooltip')"
    >
      <template #label-right>
        <b-form-checkbox v-model="form.tulevaisuudenVisiointiYksityinen" class="py-0">
          {{ $t('piilota-kouluttajilta-kuvaus') }}
        </b-form-checkbox>
      </template>
      <template v-slot="{ uid }">
        <b-form-textarea :id="uid" v-model="form.tulevaisuudenVisiointi" rows="3" />
      </template>
    </elsa-form-group>
    <elsa-form-group
      :label="$t('osaamisen-kartuttaminen')"
      :help="$t('osaamisen-kartuttaminen-tooltip')"
    >
      <template #label-right>
        <b-form-checkbox v-model="form.osaamisenKartuttaminenYksityinen" class="py-0">
          {{ $t('piilota-kouluttajilta-kuvaus') }}
        </b-form-checkbox>
      </template>
      <template v-slot="{ uid }">
        <b-form-textarea :id="uid" v-model="form.osaamisenKartuttaminen" rows="3" />
      </template>
    </elsa-form-group>
    <elsa-form-group :label="$t('elamankentta')" :help="$t('elamankentta-tooltip')">
      <template #label-right>
        <b-form-checkbox v-model="form.elamankenttaYksityinen" class="py-0">
          {{ $t('piilota-kouluttajilta-kuvaus') }}
        </b-form-checkbox>
      </template>
      <template v-slot="{ uid }">
        <b-form-textarea :id="uid" v-model="form.elamankentta" rows="3" />
      </template>
    </elsa-form-group>
    <div class="d-flex flex-row-reverse flex-wrap">
      <elsa-button :loading="params.saving" type="submit" variant="primary" class="ml-2 mb-2">
        {{ $t('tallenna') }}
      </elsa-button>
      <elsa-button variant="back" @click.stop.prevent="onCancel" class="mb-2">
        {{ $t('peruuta') }}
      </elsa-button>
    </div>
  </b-form>
</template>

<script lang="ts">
  import Component from 'vue-class-component'
  import { Vue, Mixins, Prop } from 'vue-property-decorator'
  import { validationMixin } from 'vuelidate'

  import ElsaButton from '@/components/button/button.vue'
  import ElsaFormGroup from '@/components/form-group/form-group.vue'
  import { Asiakirja, Koulutussuunnitelma } from '@/types'
  import { fetchAndOpenBlob } from '@/utils/blobs'
  import { toastFail } from '@/utils/toast'

  @Component({
    components: {
      ElsaFormGroup,
      ElsaButton
    },
    validations: {
      form: {}
    }
  })
  export default class KoulutussuunnitelmaForm extends Mixins(validationMixin) {
    @Prop({
      required: true
    })
    value!: Koulutussuunnitelma
    form: Koulutussuunnitelma = {
      id: null,
      motivaatiokirje: null,
      motivaatiokirjeYksityinen: false,
      opiskeluJaTyohistoria: null,
      opiskeluJaTyohistoriaYksityinen: false,
      vahvuudet: null,
      vahvuudetYksityinen: false,
      tulevaisuudenVisiointi: null,
      tulevaisuudenVisiointiYksityinen: false,
      osaamisenKartuttaminen: null,
      osaamisenKartuttaminenYksityinen: false,
      elamankentta: null,
      elamankenttaYksityinen: false,
      koulutussuunnitelmaAsiakirja: null,
      motivaatiokirjeAsiakirja: null,
      koulutussuunnitelmaFile: null,
      koulutussuunnitelmaAsiakirjaUpdated: false,
      motivaatiokirjeFile: null,
      motivaatiokirjeAsiakirjaUpdated: false
    }
    params = {
      saving: false
    }

    mounted() {
      this.form = {
        ...this.value,
        koulutussuunnitelmaAsiakirjaUpdated: false,
        motivaatiokirjeAsiakirjaUpdated: false
      }
    }

    selectMoulutussuunnitelma() {
      const inputEl = this.$refs['koulutussuunnitelma-file-input'] as HTMLInputElement
      inputEl.click()
    }

    koulutussuunnitelmaChange(e: Event) {
      const inputElement = e.target as HTMLInputElement
      if (inputElement.files && inputElement.files?.length > 0) {
        const file = inputElement.files[0]
        this.form = {
          ...this.form,
          koulutussuunnitelmaFile: file,
          koulutussuunnitelmaAsiakirjaUpdated: true
        }
      }
    }

    removeKoulutussuunnitelmaAsiakirja() {
      this.form = {
        ...this.form,
        koulutussuunnitelmaAsiakirja: null,
        koulutussuunnitelmaFile: null,
        koulutussuunnitelmaAsiakirjaUpdated: true
      }
      const inputElement = this.$refs['koulutussuunnitelma-file-input'] as HTMLInputElement
      inputElement.value = ''
    }

    selectMotivaatiokirje() {
      const inputEl = this.$refs['motivaatiokirje-file-input'] as HTMLInputElement
      inputEl.click()
    }

    motivaatiokirjeChange(e: Event) {
      const inputElement = e.target as HTMLInputElement
      if (inputElement.files && inputElement.files?.length > 0) {
        const file = inputElement.files[0]
        this.form = {
          ...this.form,
          motivaatiokirjeFile: file,
          motivaatiokirjeAsiakirjaUpdated: true
        }
      }
    }

    removeMotivaatiokirjeAsiakirja() {
      this.form = {
        ...this.form,
        motivaatiokirjeAsiakirja: null,
        motivaatiokirjeFile: null,
        motivaatiokirjeAsiakirjaUpdated: true
      }
      const inputElement = this.$refs['motivaatiokirje-file-input'] as HTMLInputElement
      inputElement.value = ''
    }

    onSubmit() {
      this.$v.form.$touch()
      if (this.$v.form.$anyError) {
        return
      }
      this.$emit(
        'submit',
        {
          ...this.form,
          koulutussuunnitelmaAsiakirja: null,
          motivaatiokirjeAsiakirja: null
        },
        this.params
      )
    }

    onCancel() {
      this.$emit('cancel')
    }

    async onViewAsiakirja(asiakirja: Asiakirja) {
      Vue.set(asiakirja, 'disablePreview', true)
      if (
        !asiakirja.id ||
        !(await fetchAndOpenBlob(asiakirja.id, asiakirja.nimi, 'erikoistuva-laakari/asiakirjat/'))
      ) {
        toastFail(this, this.$t('asiakirjan-sisallon-hakeminen-epaonnistui'))
      }
      Vue.set(asiakirja, 'disablePreview', false)
    }
  }
</script>

<style lang="scss" scoped>
  @import '~@/styles/variables';
  @import '~bootstrap/scss/mixins/breakpoints';

  ::v-deep table {
    border-bottom: 0;
  }

  ::v-deep .table-responsive.mb-0 {
    margin-bottom: 0;
  }
</style>
