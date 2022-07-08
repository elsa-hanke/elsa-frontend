<template>
  <div class="opintooppaat mb-4">
    <b-row>
      <b-col>
        <elsa-button
          :to="{
            name: 'lisaa-opintoopas'
          }"
          variant="primary"
          class="mb-2 mt-2"
        >
          {{ $t('lisaa-opintoopas') }}
        </elsa-button>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <b-table
          v-if="!loading && rows > 0"
          fixed
          :items="opintooppaatSorted"
          :fields="fields"
          class="opintooppaat-table"
          stacked="md"
        >
          <template #cell(nimi)="data">
            <b-link
              :to="{
                name: 'opintoopas',
                params: { opintoopasId: data.item.id }
              }"
              class="task-type"
            >
              {{ data.item.nimi }}
            </b-link>
          </template>

          <template #cell(voimassaolo)="data">
            {{ $date(data.item.voimassaoloAlkaa) }} -
            {{ data.item.voimassaoloPaattyy != null ? $date(data.item.voimassaoloPaattyy) : '' }}
          </template>
        </b-table>
        <div v-else class="text-center">
          <b-spinner variant="primary" :label="$t('ladataan')" />
        </div>
      </b-col>
    </b-row>
  </div>
</template>

<script lang="ts">
  import Avatar from 'vue-avatar'
  import { Component, Vue } from 'vue-property-decorator'
  import { required } from 'vuelidate/lib/validators'

  import { getOpintooppaat } from '@/api/tekninen-paakayttaja'
  import ElsaButton from '@/components/button/button.vue'
  import { Opintoopas } from '@/types'
  import { sortByDesc } from '@/utils/sort'
  import { toastFail } from '@/utils/toast'

  @Component({
    components: {
      Avatar,
      ElsaButton
    },
    validations: {
      form: {
        email: {
          required
        }
      }
    }
  })
  export default class Opintooppaat extends Vue {
    oppaat: Opintoopas[] = []

    loading = true

    fields = [
      {
        key: 'nimi',
        label: this.$t('nimi'),
        class: 'nimi',
        sortable: true
      },
      {
        key: 'voimassaolo',
        label: this.$t('voimassaolo'),
        class: 'voimassaolo',
        sortable: true
      }
    ]

    async mounted() {
      await this.fetchOppaat()
      this.loading = false
    }

    async fetchOppaat() {
      try {
        this.oppaat = (await getOpintooppaat(this.$route?.params?.erikoisalaId)).data
      } catch (err) {
        toastFail(this, this.$t('opintooppaiden-hakeminen-epaonnistui'))
        this.$router.replace({ name: 'opetussuunnitelmat' })
      }
    }

    get opintooppaatSorted() {
      return this.oppaat.sort((a, b) => sortByDesc(a.voimassaoloAlkaa, b.voimassaoloAlkaa))
    }

    get rows() {
      return this.oppaat?.length ?? 0
    }
  }
</script>
