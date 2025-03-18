<template>
  <b-form @submit.stop.prevent="onSubmit">
    <p v-if="!valitutArviointityokalut.length">{{ $t('ei-valittuja-arviointityokaluja') }}</p>
    <div>
      <div class="accordion" role="tablist">
        <b-card
          v-for="(arviointityokalu, index) in valitutArviointityokalut"
          :key="arviointityokalu.id || index"
          no-body
          class="card"
        >
          <b-card-header
            header-tag="header"
            class="p-3 card-header-custom d-flex justify-content-between align-items-center"
            role="tab"
            @click="toggleCollapse(index)"
          >
            <h2 class="mb-0">
              {{ arviointityokalu.nimi }}
            </h2>
            <font-awesome-icon
              :icon="collapsedIndex === index ? ['fas', 'chevron-up'] : ['fas', 'chevron-down']"
              class="text-secondary"
            />
          </b-card-header>
          <b-collapse
            :id="'accordion-' + index"
            :visible="collapsedIndex === index"
            accordion="my-accordion"
            role="tabpanel"
          >
            <b-card-body class="p-3">
              <arviointityokalu-lomake-kysymys-form
                v-for="(kysymys, kysymysIndex) in arviointityokalu.kysymykset"
                :key="kysymysIndex"
                :kysymys="kysymys"
                :index="kysymysIndex"
                :answer-mode="true"
                :child-data-received="true"
                @update-answer="(vastaus) => updateAnswer(vastaus, arviointityokalu.id)"
              />
            </b-card-body>
          </b-collapse>
        </b-card>
      </div>
    </div>
    <div class="d-flex flex-row-reverse flex-wrap mt-4">
      <elsa-button :loading="params.saving" type="submit" variant="primary" class="ml-2 mb-2">
        {{
          editing
            ? $t('lisaa-vastaukset-ja-palaa-arviointiin')
            : $t('lisaa-vastaukset-ja-palaa-arviointiin')
        }}
      </elsa-button>
      <elsa-button variant="back" class="mb-2" @click.stop.prevent="onCancel">
        {{ $t('peruuta') }}
      </elsa-button>
    </div>
    <div class="row">
      <elsa-form-error :active="$v.$anyError" />
    </div>
  </b-form>
</template>

<script lang="ts">
  import Component from 'vue-class-component'
  import { Prop, Vue } from 'vue-property-decorator'

  import ElsaButton from '@/components/button/button.vue'
  import ElsaFormError from '@/components/form-error/form-error.vue'
  import ArviointityokaluLomakeKysymysForm from '@/forms/arviointityokalu-lomake-kysymys-form.vue'
  import { Arviointityokalu, SuoritusarviointiArviointityokaluVastaus } from '@/types'

  @Component({
    components: {
      ArviointityokaluLomakeKysymysForm,
      ElsaButton,
      ElsaFormError
    },
    validations: {
      form: {}
    }
  })
  export default class ArviointityokalutArvioijaForm extends Vue {
    @Prop({ required: true, type: Array, default: () => [] })
    valitutArviointityokalut!: Arviointityokalu[]

    @Prop({ required: true, type: Array, default: () => [] })
    arviointityokaluVastaukset!: SuoritusarviointiArviointityokaluVastaus[]

    collapsedIndex: number | null = null
    params = {
      saving: false,
      deleting: false
    }
    editing = false

    async mounted() {
      /* */
    }

    toggleCollapse(index: number) {
      this.collapsedIndex = this.collapsedIndex === index ? null : index
    }

    validateState(name: string) {
      const get = (obj: any, path: any, defaultValue = undefined) => {
        const travel = (regexp: any) =>
          String.prototype.split
            .call(path, regexp)
            .filter(Boolean)
            .reduce((res, key) => (res !== null && res !== undefined ? res[key] : res), obj)
        const result = travel(/[,[\]]+?/) || travel(/[,[\].]+?/)
        return result === undefined || result === obj ? defaultValue : result
      }
      const { $dirty, $error } = get(this.$v.form, name)
      return $dirty ? ($error ? false : null) : null
    }

    validateForm(): boolean {
      this.$v.form.$touch()
      return !this.$v.$anyError
    }

    async onSubmit() {
      const validations = [this.validateForm()]

      if (validations.includes(false)) {
        return
      }

      const submitData: SuoritusarviointiArviointityokaluVastaus[] = [
        ...this.arviointityokaluVastaukset
      ]
      this.$emit('skipRouteExitConfirm', true)
      this.$emit('submit', submitData, this.params)
    }

    onCancel() {
      this.$emit('skipRouteExitConfirm', true)
      this.$emit('cancel')
    }

    updateAnswer(
      vastaus: SuoritusarviointiArviointityokaluVastaus,
      arviointityokaluId: number | undefined
    ) {
      if (arviointityokaluId === undefined) {
        return
      }
      const index = this.arviointityokaluVastaukset.findIndex(
        (v) => v.arviointityokaluKysymysId === vastaus.arviointityokaluKysymysId
      )

      const updatedVastaus = {
        ...vastaus,
        arviointityokaluId: arviointityokaluId
      }

      if (index !== -1) {
        this.$set(this.arviointityokaluVastaukset, index, updatedVastaus)
      } else {
        this.arviointityokaluVastaukset.push(updatedVastaus)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .card-header-custom {
    color: #222222;
    background-color: white;
    cursor: pointer;
  }

  .card {
    border: 1px solid #e8e9ec;
    border-radius: 8px;
  }
</style>
