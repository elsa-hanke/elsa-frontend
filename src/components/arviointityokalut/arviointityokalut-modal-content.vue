<template>
  <div class="arviointityokalut">
    <b-container fluid>
      <b-row lg>
        <b-col>
          <arviointityokalut-arvioija-form
            v-if="!loading"
            :valitut-arviointityokalut="valitutArviointityokalut"
            @submit="onSubmit"
            @delete="onDelete"
            @cancel="onCancel"
            @skipRouteExitConfirm="skipRouteExitConfirm"
          />
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>
<script lang="ts">
  import { Vue, Component, Prop } from 'vue-property-decorator'

  import ArviointityokalutArvioijaForm from '@/forms/arviointityokalut-arvioija-form.vue'
  import { Arviointityokalu } from '@/types'

  @Component({
    components: { ArviointityokalutArvioijaForm }
  })
  export default class TyokertymalaskuriModalContent extends Vue {
    @Prop({ required: true, type: Array, default: () => [] })
    valitutArviointityokalut!: Arviointityokalu[]

    loading = false

    async mounted() {
      this.loading = false
    }

    onSubmit(formData: any, params: any) {
      this.$emit('submit', formData, params)
    }

    onDelete(id: number) {
      this.$emit('delete', id)
    }

    onCancel() {
      this.$emit('closeModal')
    }

    skipRouteExitConfirm(value: boolean) {
      this.$emit('skipRouteExitConfirm', value)
    }
  }
</script>
