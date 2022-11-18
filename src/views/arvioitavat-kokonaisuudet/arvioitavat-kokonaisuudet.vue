<template>
  <div class="arvioitavat-kokonaisuudet" v-if="!loading && arvioitavatKokonaisuudet">
    <b-breadcrumb :items="items" class="mb-0" />
    <b-container fluid>
      <b-row lg>
        <b-col>
          <h1>{{ $t('arvioitavat-kokonaisuudet') }}</h1>
        </b-col>
      </b-row>
      <div
        class="filter"
        v-if="arvioitavatKokonaisuudetErikoisaloittain.length > 1 && !$isErikoistuva()"
      >
        <elsa-form-group :label="$t('erikoisala')" class="mb-4">
          <template v-slot="{ uid }">
            <elsa-form-multiselect
              :id="uid"
              v-model="filtered.erikoisala"
              :options="erikoisalatSorted"
              label="nimi"
              @select="onErikoisalaSelect"
              @clearMultiselect="onErikoisalaReset"
            ></elsa-form-multiselect>
          </template>
        </elsa-form-group>
      </div>
      <div v-if="!$isKouluttaja() && !$isVastuuhenkilo()">
        <arvioitavat-kokonaisuudet-lista
          :arvioitavatKokonaisuudet="arvioitavatKokonaisuudet"
          :locale="$i18n.locale"
        />
      </div>
      <div v-else>
        <b-tabs content-class="mt-3" :no-fade="true" v-model="tabIndex">
          <b-tab :title="$t('voimassa-olevat-kokonaisuudet')">
            <arvioitavat-kokonaisuudet-lista
              :arvioitavatKokonaisuudet="arvioitavatKokonaisuudet"
              :locale="$i18n.locale"
            />
          </b-tab>
        </b-tabs>
      </div>
    </b-container>
  </div>
</template>

<script lang="ts">
  import axios from 'axios'
  import { Component, Vue } from 'vue-property-decorator'

  import ElsaAccordian from '@/components/accordian/accordian.vue'
  import ElsaFormGroup from '@/components/form-group/form-group.vue'
  import ElsaFormMultiselect from '@/components/multiselect/multiselect.vue'
  import store from '@/store'
  import { ArvioitavaKokonaisuus, ArvioitavatKokonaisuudetList } from '@/types'
  import { toastFail } from '@/utils/toast'
  import ArvioitavatKokonaisuudetLista from '@/views/arvioitavat-kokonaisuudet/arvioitavat-kokonaisuudet-lista.vue'

  type ErikoisalaSelectItem = {
    nimi: string
    id: number
  }

  @Component({
    components: {
      ElsaAccordian,
      ArvioitavatKokonaisuudetLista,
      ElsaFormMultiselect,
      ElsaFormGroup
    }
  })
  export default class ArvioitavatKokonaisuudet extends Vue {
    private endpointUrl = ''
    private arvioitavatKokonaisuudet: ArvioitavaKokonaisuus[] = []
    private arvioitavatKokonaisuudetErikoisaloittain: ArvioitavatKokonaisuudetList[] = []
    private arvioitavatKokonaisuudetFiltered: ArvioitavatKokonaisuudetList[] = []
    private loading = false
    private showErikoisalaDropdown = false
    private erikoisalat: ArvioitavatKokonaisuudetList[] = []
    private selectedErikoisala: number | null = null
    private tabIndex = 0
    private items = [
      {
        text: this.$t('etusivu'),
        to: { name: 'etusivu' }
      },
      {
        text: this.$t('arvioitavat-kokonaisuudet'),
        active: true
      }
    ]

    async mounted() {
      await this.fetch()
    }

    get account() {
      return store.getters['auth/account']
    }

    async fetch() {
      try {
        this.loading = true
        if (this.$isKouluttaja()) {
          this.endpointUrl = 'kouluttaja/arvioitavatkokonaisuudet'
        } else if (this.$isVastuuhenkilo()) {
          this.endpointUrl = 'vastuuhenkilo/arvioitavatkokonaisuudet'
        } else {
          this.endpointUrl = 'erikoistuva-laakari/arvioitavatkokonaisuudet'
        }
        if (this.$isKouluttaja() || this.$isVastuuhenkilo()) {
          this.arvioitavatKokonaisuudetErikoisaloittain = (await axios.get(this.endpointUrl)).data
        } else {
          this.arvioitavatKokonaisuudet = (await axios.get(this.endpointUrl)).data
        }
        this.loading = false
      } catch {
        toastFail(this, this.$t('arvioitavien-kokonaisuuksien-hakeminen-epaonnistui'))
        this.loading = false
      }
    }

    get erikoisalatSorted() {
      let erikoisalat: ErikoisalaSelectItem[] = []
      this.arvioitavatKokonaisuudetErikoisaloittain.forEach((e) => {
        erikoisalat.push({ nimi: e.erikoisalaNimi, id: e.erikoisalaId })
      })
      return erikoisalat
    }

    onErikoisalaSelect(erikoisala: ErikoisalaSelectItem) {
      this.filterResults(erikoisala.id)
    }

    onErikoisalaReset() {
      this.filterResults(null)
    }

    filterResults(id: number | null) {
      console.log('filter')
      if (id) {
        this.arvioitavatKokonaisuudetFiltered =
          this.arvioitavatKokonaisuudetErikoisaloittain.filter(
            (erikoisala) => erikoisala.erikoisalaId > id
          )
      } else {
        this.arvioitavatKokonaisuudetFiltered = this.arvioitavatKokonaisuudetErikoisaloittain
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '~@/styles/variables';
  .arvioitavat-kokonaisuudet {
    max-width: 1024px;
  }
</style>

<style lang="scss" scoped>
  @import '~@/styles/variables';

  .filter::v-deep .form-group {
    label {
      font-weight: 300;
      text-transform: uppercase;
      font-size: $font-size-sm;
      margin-bottom: 0;
    }
  }
</style>
