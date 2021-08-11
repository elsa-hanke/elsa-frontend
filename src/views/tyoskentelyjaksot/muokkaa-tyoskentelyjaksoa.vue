<template>
  <div class="muokkaa-tyoskentelyjaksoa">
    <b-breadcrumb :items="items" class="mb-0" />
    <b-container fluid>
      <b-row lg>
        <b-col>
          <h1>{{ $t('muokkaa-tyoskentelyjaksoa') }}</h1>
          <hr />
          <tyoskentelyjakso-form
            v-if="!loading && tyoskentelyjakso"
            :value="tyoskentelyjakso"
            :editing="true"
            :kunnat="tyoskentelyjaksoLomake.kunnat"
            :erikoisalat="tyoskentelyjaksoLomake.erikoisalat"
            :asiakirjat="tyoskentelyjakso.asiakirjat"
            @submit="onSubmit"
            @delete="onDelete"
            @cancel="onCancel"
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
  import { Component, Mixins } from 'vue-property-decorator'
  import ConfirmRouteExit from '@/mixins/confirm-route-exit'
  import TyoskentelyjaksoForm from '@/forms/tyoskentelyjakso-form.vue'
  import { toastFail, toastSuccess } from '@/utils/toast'
  import { confirmDelete } from '@/utils/confirm'
  import { TyoskentelyjaksoLomake } from '@/types'
  import {
    getTyoskentelyjakso,
    getTyoskentelyjaksoLomake,
    putTyoskentelyjakso,
    deleteTyoskentelyjakso
  } from '@/api/erikoistuva'

  @Component({
    components: {
      TyoskentelyjaksoForm
    }
  })
  export default class MuokkaaTyoskentelyjaksoa extends Mixins(ConfirmRouteExit) {
    items = [
      {
        text: this.$t('etusivu'),
        to: { name: 'etusivu' }
      },
      {
        text: this.$t('tyoskentelyjaksot'),
        to: { name: 'tyoskentelyjaksot' }
      },
      {
        text: this.$t('muokkaa-tyoskentelyjaksoa'),
        active: true
      }
    ]
    tyoskentelyjaksoLomake: null | TyoskentelyjaksoLomake = null
    tyoskentelyjakso: any = null
    loading = true

    async mounted() {
      await this.fetchTyoskentelyjakso()
      await this.fetchLomake()
      this.loading = false
    }

    async fetchLomake() {
      try {
        this.tyoskentelyjaksoLomake = (await getTyoskentelyjaksoLomake()).data
      } catch (err) {
        toastFail(this, this.$t('tyoskentelyjakson-lomakkeen-hakeminen-epaonnistui'))
      }
    }

    async fetchTyoskentelyjakso() {
      const tyoskentelyjaksoId = this.$route?.params?.tyoskentelyjaksoId
      if (tyoskentelyjaksoId) {
        try {
          this.tyoskentelyjakso = (await getTyoskentelyjakso(tyoskentelyjaksoId)).data
        } catch (err) {
          this.$router.replace({ name: 'tyoskentelyjaksot' })
        }
      }
    }

    async onSubmit(data: any, params: any) {
      params.saving = true
      try {
        const formData = new FormData()

        formData.append('tyoskentelyjaksoJson', JSON.stringify(data.tyoskentelyjakso))
        data.addedFiles.forEach((file: File) => formData.append('files', file, file.name))
        formData.append('deletedAsiakirjaIdsJson', JSON.stringify(data.deletedAsiakirjaIds))

        await putTyoskentelyjakso(formData)

        toastSuccess(this, this.$t('tyoskentelyjakson-tallentaminen-onnistui'))
        this.skipRouteExitConfirm = true
        this.$router.push({
          name: 'tyoskentelyjakso',
          params: {
            tyoskentelyjaksoId: `${this.tyoskentelyjakso.id}`
          }
        })
      } catch (err) {
        toastFail(this, this.$t('tyoskentelyjakson-tallentaminen-epaonnistui'))
      }
      params.saving = false
    }

    async onDelete(params: any) {
      if (
        await confirmDelete(
          this,
          this.$t('poista-tyoskentelyjakso') as string,
          (this.$t('tyoskentelyjakson') as string).toLowerCase()
        )
      ) {
        params.deleting = true
        try {
          deleteTyoskentelyjakso(this.tyoskentelyjakso.id)
          toastSuccess(this, this.$t('tyoskentelyjakso-poistettu-onnistuneesti'))
          this.skipRouteExitConfirm = true
          this.$router.push({
            name: 'tyoskentelyjaksot'
          })
        } catch (err) {
          toastFail(this, this.$t('tyoskentelyjakson-poistaminen-epaonnistui'))
        }
        params.deleting = false
      }
    }

    onCancel() {
      this.$router.push({
        name: 'tyoskentelyjaksot'
      })
    }
  }
</script>

<style lang="scss" scoped>
  .muokkaa-tyoskentelyjaksoa {
    max-width: 768px;
  }
</style>
