<template>
  <div>
    <b-row lg>
      <b-col>
        <b-form v-if="editing" @submit.stop.prevent="onSubmit">
          <elsa-form-group
            :label="$t('kategorian-nimi')"
            :required="true"
            class="col-12 pr-md-3 pl-0"
          >
            <template v-slot="{ uid }">
              <elsa-form-multiselect
                v-if="kategoriaEditable"
                :id="uid"
                v-model="suorite.kategoria"
                :options="sortedKategoriat"
                label="nimi"
                track-by="nimi"
                :state="validateState('kategoria')"
              ></elsa-form-multiselect>
              <p v-else>{{ suorite.kategoria.nimi }}</p>
            </template>
          </elsa-form-group>
          <elsa-form-group
            :label="$t('suoritteen-nimi')"
            :required="true"
            class="col-12 pr-md-3 pl-0"
          >
            <template v-slot="{ uid }">
              <b-input-group class="mb-2">
                <b-input-group-prepend>
                  <b-input-group-text class="input-group-fi">{{ 'FI' }}</b-input-group-text>
                </b-input-group-prepend>
                <b-form-input
                  :id="uid"
                  v-model="suorite.nimi"
                  :state="validateState('nimi')"
                ></b-form-input>
                <b-form-invalid-feedback :id="`${uid}-feedback`" :state="validateState('nimi')">
                  {{ $t('pakollinen-tieto') }}
                </b-form-invalid-feedback>
              </b-input-group>
              <b-input-group prepend="SV">
                <b-form-input :id="uid" v-model="suorite.nimiSv"></b-form-input>
              </b-input-group>
            </template>
          </elsa-form-group>
          <b-form-row>
            <elsa-form-group
              :label="$t('voimassaolon-alkupaiva')"
              class="col-xs-12 col-sm-6 col-md-4 pr-sm-3"
              :required="true"
            >
              <template v-slot="{ uid }">
                <elsa-form-datepicker
                  ref="voimassaolonAlkamispaiva"
                  :id="uid"
                  v-model="suorite.voimassaolonAlkamispaiva"
                  :state="validateState('voimassaolonAlkamispaiva')"
                  @input="$emit('skipRouteExitConfirm', false)"
                ></elsa-form-datepicker>
              </template>
            </elsa-form-group>
            <elsa-form-group
              :label="$t('voimassaolon-paattymispaiva')"
              class="col-xs-12 col-sm-6 col-md-4 pl-sm-3"
            >
              <template v-slot="{ uid }">
                <elsa-form-datepicker
                  ref="voimassaolonPaattymispaiva"
                  :id="uid"
                  v-model="suorite.voimassaolonPaattymispaiva"
                  @input="$emit('skipRouteExitConfirm', false)"
                  :required="false"
                  class="datepicker-range"
                ></elsa-form-datepicker>
              </template>
            </elsa-form-group>
          </b-form-row>
          <elsa-form-group
            :label="$t('vaadittu-lukumaara')"
            class="col-12 pr-md-3 pl-0"
            :required="true"
          >
            <template v-slot="{ uid }">
              <b-form-input
                :id="uid"
                v-model="suorite.vaadittulkm"
                :state="validateState('vaadittulkm')"
              ></b-form-input>
              <b-form-invalid-feedback
                :id="`${uid}-feedback`"
                :state="validateState('vaadittulkm')"
              >
                {{ $t('pakollinen-tieto') }}
              </b-form-invalid-feedback>
            </template>
          </elsa-form-group>
          <hr class="mt-6" />
          <div class="text-right">
            <elsa-button
              variant="back"
              :to="{
                name: suorite.id == null ? 'erikoisala' : 'suorite',
                hash: suorite.id == null ? '#suoritteet' : ''
              }"
            >
              {{ $t('peruuta') }}
            </elsa-button>
            <elsa-button type="submit" variant="primary" class="ml-2">
              {{ $t('tallenna') }}
            </elsa-button>
          </div>
        </b-form>
        <div v-else>
          <h5>{{ $t('kategorian-nimi') }}</h5>
          <p>{{ suorite.kategoria.nimi }}</p>
          <hr />
          <h5>{{ $t('suoritteen-nimi') }}</h5>
          <p>{{ suorite.nimi }}</p>
          <h5>{{ $t('voimassaolo') }}</h5>
          <p>
            {{ $date(suorite.voimassaolonAlkamispaiva) }} -
            {{
              suorite.voimassaolonPaattymispaiva != null
                ? $date(suorite.voimassaolonPaattymispaiva)
                : ''
            }}
          </p>
          <h5>{{ $t('vaadittulkm') }}</h5>
          <p>{{ suorite.vaadittulkm }}</p>
          <hr />
        </div>
      </b-col>
    </b-row>
  </div>
</template>

<script lang="ts">
  import Editor from '@tinymce/tinymce-vue'
  import { Component, Mixins, Prop } from 'vue-property-decorator'
  import { validationMixin } from 'vuelidate'
  import { required } from 'vuelidate/lib/validators'

  import ElsaButton from '@/components/button/button.vue'
  import ElsaFormDatepicker from '@/components/datepicker/datepicker.vue'
  import ElsaFormGroup from '@/components/form-group/form-group.vue'
  import ElsaFormMultiselect from '@/components/multiselect/multiselect.vue'
  import ElsaTextEditor from '@/components/text-editor/text-editor.vue'
  import { SuoriteWithErikoisala, SuoritteenKategoria } from '@/types'
  import { sortByAsc } from '@/utils/sort'

  @Component({
    components: {
      Editor,
      ElsaButton,
      ElsaFormGroup,
      ElsaFormDatepicker,
      ElsaFormMultiselect,
      ElsaTextEditor
    }
  })
  export default class SuoriteForm extends Mixins(validationMixin) {
    $refs!: {
      voimassaolonAlkamispaiva: ElsaFormDatepicker
      voimassaolonPaattymispaiva: ElsaFormDatepicker
    }

    @Prop({ required: false, default: false })
    editing!: boolean

    @Prop({ required: false, default: true })
    kategoriaEditable!: boolean

    @Prop({ required: true, type: Object })
    suorite!: SuoriteWithErikoisala

    @Prop({ required: false, type: Array, default: () => [] })
    kategoriat!: SuoritteenKategoria[]

    params = {
      saving: false
    }

    get sortedKategoriat() {
      return this.kategoriat.sort((a, b) => sortByAsc(a.nimi, b.nimi))
    }

    validations() {
      return {
        suorite: {
          kategoria: {
            required
          },
          nimi: {
            required
          },
          voimassaolonAlkamispaiva: {
            required
          },
          vaadittulkm: {
            required
          }
        }
      }
    }

    validateState(name: string) {
      const { $dirty, $error } = this.$v.suorite[name] as any
      return $dirty ? ($error ? false : null) : null
    }

    validateForm(): boolean {
      this.$v.suorite.$touch()
      return !this.$v.$anyError
    }

    onSubmit() {
      const validations = [this.validateForm(), this.$refs.voimassaolonAlkamispaiva.validateForm()]

      if (validations.includes(false)) {
        return
      }

      this.$emit(
        'submit',
        {
          ...this.suorite
        },
        this.params
      )
    }
  }
</script>

<style lang="scss" scoped>
  .input-group-fi {
    padding-left: 0.95rem;
    padding-right: 0.95rem;
  }
</style>
