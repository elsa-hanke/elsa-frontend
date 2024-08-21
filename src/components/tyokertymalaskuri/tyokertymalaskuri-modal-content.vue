<template>
  <div class="lisaa-tyoskentelyjakso">
    <b-container fluid>
      <b-row lg>
        <b-col>
          <tyokertymalaskuri-tyoskentelyjakso-form
            v-if="!loading"
            @submit="onSubmit"
            @cancel="onCancel"
            @skipRouteExitConfirm="skipRouteExitConfirm"
          />
          <div v-else class="text-center">
            <b-spinner variant="primary" :label="$t('ladataan')" />
          </div>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>
<script lang="ts">
  import { Vue, Component } from 'vue-property-decorator'

  import TyokertymalaskuriTyoskentelyjaksoForm from '@/forms/tyokertymalaskuri-tyoskentelyjakso-form.vue'
  import YekTyoskentelyjaksoForm from '@/forms/yek-tyoskentelyjakso-form.vue'
  import { Tyoskentelyjakso, TyoskentelyjaksoLomake } from '@/types'

  @Component({
    components: { TyokertymalaskuriTyoskentelyjaksoForm, YekTyoskentelyjaksoForm }
  })
  export default class TyokertymalaskuriModalContent extends Vue {
    loading = false
    tyoskentelyjaksoLomake: null | TyoskentelyjaksoLomake = null

    async mounted() {
      // await this.fetchLomake()
      this.loading = false
    }

    async onSubmit(
      value: {
        tyoskentelyjakso: Tyoskentelyjakso
      },
      params: { saving: boolean }
    ) {
      params.saving = true
      params.saving = false
    }

    onCancel() {
      this.$emit('closeModal')
    }

    skipRouteExitConfirm(value: boolean) {
      this.$emit('skipRouteExitConfirm', value)
    }
  }
</script>
