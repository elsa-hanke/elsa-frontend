<template>
  <div class="kayttaja">
    <b-breadcrumb :items="items" class="mb-0" />
    <b-container fluid>
      <b-row lg>
        <b-col>
          <h1>{{ $t('lisaa-uusi-kayttaja') }}</h1>
          <hr />
          <!-- <kayttaja-form v-if="!loading" @submit="onSubmit" @cancel="onCancel" /> -->
          <pre v-if="!loading">TODO: kayttaja-form</pre>
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

  @Component({
    components: {}
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
  }
</script>
<style lang="scss" scoped>
  .uusi-kayttaja {
    max-width: 768px;
  }
</style>
