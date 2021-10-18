<template>
  <div class="lisaa-teoriakoulutus">
    <b-breadcrumb :items="items" class="mb-0" />
    <b-container fluid>
      <b-row lg>
        <b-col>
          <h1>{{ $t('lisaa-teoriakoulutus') }}</h1>
          <hr />
          <teoriakoulutus-form v-if="!loading" @submit="onSubmit" @cancel="onCancel" />
          <div v-else class="text-center">
            <b-spinner variant="primary" :label="$t('ladataan')" />
          </div>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script lang="ts">
  import axios from 'axios'
  import { Component, Vue } from 'vue-property-decorator'

  import TeoriakoulutusForm from '@/forms/teoriakoulutus-form.vue'
  import { Teoriakoulutus } from '@/types'
  import { toastFail, toastSuccess } from '@/utils/toast'

  @Component({
    components: {
      TeoriakoulutusForm
    }
  })
  export default class UusiTeoriakoulutus extends Vue {
    items = [
      {
        text: this.$t('etusivu'),
        to: { name: 'etusivu' }
      },
      {
        text: this.$t('teoriakoulutukset'),
        to: { name: 'teoriakoulutukset' }
      },
      {
        text: this.$t('lisaa-teoriakoulutus'),
        active: true
      }
    ]
    teoriakoulutus: Teoriakoulutus | null = null
    loading = false

    async onSubmit(value: Teoriakoulutus, params: any) {
      params.saving = true
      try {
        this.teoriakoulutus = (
          await axios.post('erikoistuva-laakari/teoriakoulutukset', value)
        ).data
        toastSuccess(this, this.$t('teoriakoulutus-lisatty-onnistuneesti'))
        this.$emit('skipRouteExitConfirm', true)
        this.$router.push({
          name: 'teoriakoulutus-tallennettu'
        })
      } catch (err) {
        toastFail(this, this.$t('uuden-teoriakoulutuksen-lisaaminen-epaonnistui'))
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
  .lisaa-teoriakoulutus {
    max-width: 768px;
  }
</style>
