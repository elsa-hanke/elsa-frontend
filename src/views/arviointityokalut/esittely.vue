<template>
  <div class="esittely">
    <b-breadcrumb :items="items" class="mb-0" />
    <b-container fluid>
      <b-row lg>
        <b-col>
          <h1>{{ $t('arviointityokalut') }}</h1>
          <p>{{ $t('arviointityokalut-esittely') }}</p>
        </b-col>
      </b-row>
      <b-row v-if="loading">
        <b-col>
          <div class="text-center">
            <b-spinner variant="primary" :label="$t('ladataan')" />
          </div>
        </b-col>
      </b-row>
      <b-row v-for="(k, index) in kategoriat" :key="index" lg>
        <b-col>
          <h3 class="mt-6">{{ k.nimi }}</h3>
          <b-row v-for="(at, atIndex) in getArviontityokalutForKategoria(k.id)" :key="atIndex">
            <elsa-accordian :ref="k.nimi" :visible="false">
              <template #title>
                {{ at.nimi }}
              </template>
              <div class="mt-3 mb-3">
                <!-- eslint-disable-next-line vue/no-v-html -->
                <p v-html="at.ohjeteksti"></p>
              </div>
            </elsa-accordian>
          </b-row>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script lang="ts">
  import { Vue, Component } from 'vue-property-decorator'

  import { getArviointityokalut, getArviointityokaluKategoriat } from '@/api/kouluttaja'
  import ElsaAccordian from '@/components/accordian/accordian.vue'
  import { Arviointityokalu, ArviointityokaluKategoria } from '@/types'
  import { sortByAsc } from '@/utils/sort'
  import { toastFail } from '@/utils/toast'

  @Component({
    components: {
      ElsaAccordian
    }
  })
  export default class ArviointityokalutEsittely extends Vue {
    items = [
      {
        text: this.$t('etusivu'),
        to: { name: 'etusivu' }
      },
      {
        text: this.$t('arviointityokalut'),
        active: true
      }
    ]

    arviointityokalut: Arviointityokalu[] = []
    kategoriat: ArviointityokaluKategoria[] = []
    loading = false

    async mounted() {
      this.loading = true
      try {
        this.arviointityokalut = (await getArviointityokalut()).data.sort((a, b) =>
          sortByAsc(a.nimi, b.nimi)
        )
        this.kategoriat = (await getArviointityokaluKategoriat()).data.sort((a, b) =>
          sortByAsc(a.nimi, b.nimi)
        )
      } catch {
        toastFail(this, this.$t('arviointityokalujen-kategorioiden-hakeminen-epaonnistui'))
        this.arviointityokalut = []
      }
      this.loading = false
    }

    getArviontityokalutForKategoria(id: number) {
      return this.arviointityokalut.filter((a) => a.kategoria?.id === id)
    }
  }
</script>

<style scoped lang="scss">
  @import '~@/styles/variables';
  @import '~bootstrap/scss/mixins/breakpoints';
</style>
