<template>
  <div class="uusi-kayttaja">
    <b-breadcrumb :items="items" class="mb-0" />
    <b-container fluid>
      <b-row lg>
        <b-col>
          <h1>{{ $t('lisaa-uusi-kayttaja') }}</h1>
          <hr />
          <kayttaja-form v-if="!loading" @submit="onSubmit" @cancel="onCancel" />
          <div v-else class="text-center">
            <b-spinner variant="primary" :label="$t('ladataan')" />
          </div>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator'

  import KayttajaForm from '@/forms/kayttaja-form.vue'
  import { toastFail, toastSuccess } from '@/utils/toast'

  @Component({
    components: {
      KayttajaForm
    }
  })
  export default class UusiKayttaja extends Vue {
    items = [
      {
        text: this.$t('kayttajahallinta'),
        to: { name: 'kayttajahallinta' }
      },
      {
        text: this.$t('uusi-kayttaja'),
        active: true
      }
    ]
    loading = true

    async mounted() {
      this.loading = false
    }

    async onSubmit(
      value: any,
      params: {
        saving: boolean
      }
    ) {
      params.saving = true
      try {
        console.log(value)
        // this.teoriakoulutus = (
        //   await postTeoriakoulutus(value.teoriakoulutus, value.addedFiles)
        // ).data
        toastSuccess(this, this.$t('uusi-kayttaja-lisatty-onnistuneesti'))
        // this.$emit('skipRouteExitConfirm', true)
        // this.$router.push({
        //   name: 'teoriakoulutus-tallennettu'
        // })
      } catch (err) {
        toastFail(this, this.$t('uuden-kayttajan-lisaaminen-epaonnistui'))
      }
      params.saving = false
    }

    onCancel() {
      this.$router.push({
        name: 'teoriakoulutukset'
      })
    }
  }
</script>

<style lang="scss" scoped>
  .uusi-kayttaja {
    max-width: 768px;
  }
</style>
