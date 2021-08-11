<template>
  <div class="itsearviointi">
    <b-breadcrumb :items="items" class="mb-0" />
    <b-container fluid>
      <b-row lg>
        <b-col>
          <h1>{{ $t('tee-itsearviointi') }}</h1>
          <hr />
          <arviointi-form
            v-if="value"
            :value="value"
            :editing="true"
            :itsearviointi="true"
            @submit="onSubmit"
          />
          <div v-else class="text-center">
            <b-spinner variant="primary" :label="$t('ladataan')" />
          </div>
        </b-col>
        <b-col class="pl-3 pr-0" lg="2"></b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script lang="ts">
  import { Component, Mixins } from 'vue-property-decorator'
  import axios from 'axios'
  import { toastFail, toastSuccess } from '@/utils/toast'
  import ArviointiForm from '@/forms/arviointi-form.vue'
  import ConfirmRouteExit from '@/mixins/confirm-route-exit'

  @Component({
    components: {
      ArviointiForm
    }
  })
  export default class Itsearviointi extends Mixins(ConfirmRouteExit) {
    value = null
    items = [
      {
        text: this.$t('etusivu'),
        to: { name: 'etusivu' }
      },
      {
        text: this.$t('arvioinnit'),
        to: { name: 'arvioinnit' }
      },
      {
        text: this.$t('tee-itsearviointi'),
        active: true
      }
    ]

    async mounted() {
      if (this.$route && this.$route.params && this.$route.params.arviointiId) {
        this.value = (
          await axios.get(
            `erikoistuva-laakari/suoritusarvioinnit/${this.$route.params.arviointiId}`
          )
        ).data
      }
    }

    async onSubmit(value: any, params: any) {
      params.saving = true
      try {
        await axios.put('erikoistuva-laakari/suoritusarvioinnit', value)
        toastSuccess(this, this.$t('itsearvioinnin-tallentaminen-onnistui'))
        this.skipRouteExitConfirm = true
        this.$router.push({
          name: 'arviointi',
          params: { arviointiId: this.$route.params.arviointiId }
        })
      } catch (err) {
        toastFail(this, this.$t('itsearvioinnin-tallentaminen-epaonnistui'))
      }
      params.saving = false
    }
  }
</script>

<style lang="scss" scoped>
  .itsearviointi {
    max-width: 970px;
  }
</style>
