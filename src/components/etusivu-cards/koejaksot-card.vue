<template>
  <b-card-skeleton
    :header="$t('koejaksot')"
    v-if="vaiheet != null && vaiheet.length > 0"
    class="mb-3"
  >
    <b-table
      v-if="rows > 0"
      fixed
      :items="vaiheet"
      :fields="fields"
      class="koejakson-vaiheet-table"
      tbody-tr-class="outer-table"
      stacked="md"
    >
      <template #cell(pvm)="data">
        <span class="text-nowrap">
          {{ data.item.pvm ? $date(data.item.pvm) : '' }}
        </span>
      </template>

      <template #cell(tyyppi)="data">
        {{ $t('lomake-tyyppi-' + data.item.tyyppi) }}
      </template>

      <template #cell(erikoistuvanNimi)="data">
        <b-link
          :to="{
            name: linkComponent(data.item.tyyppi),
            params: { id: data.item.id }
          }"
          class="task-type"
        >
          {{ data.item.erikoistuvanNimi }}
        </b-link>
      </template>

      <template #cell(actions)="data">
        <elsa-button
          variant="primary"
          :to="{
            name: linkComponent(data.item.tyyppi),
            params: { id: data.item.id }
          }"
        >
          {{ $t(buttonText(data.item.tyyppi)) }}
        </elsa-button>
      </template>
    </b-table>
  </b-card-skeleton>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator'

  import ElsaButton from '@/components/button/button.vue'
  import BCardSkeleton from '@/components/card/card.vue'
  import { KoejaksonVaihe } from '@/types'
  import { LomakeTyypit } from '@/utils/constants'

  @Component({
    components: {
      BCardSkeleton,
      ElsaButton
    }
  })
  export default class KoejaksotCard extends Vue {
    @Prop({ required: true, default: undefined })
    vaiheet!: KoejaksonVaihe[]

    @Prop({ required: false, default: true })
    showVaihe!: boolean

    get fields() {
      return [
        {
          key: 'erikoistuvanNimi',
          label: this.$t('erikoistuja'),
          class: 'nimi',
          sortable: true
        },
        {
          key: 'pvm',
          label: this.$t('pvm'),
          class: 'pvm',
          sortable: true
        },
        {
          key: 'tyyppi',
          label: this.$t('vaihe'),
          class: 'tyyppi',
          sortable: true,
          thClass: this.showVaihe ? '' : 'd-none',
          tdClass: this.showVaihe ? '' : 'd-none'
        },
        {
          key: 'actions',
          label: '',
          sortable: false,
          class: 'actions'
        }
      ]
    }

    private componentLinks = new Map([
      [LomakeTyypit.KOULUTUSSOPIMUS, 'koulutussopimus'],
      [LomakeTyypit.ALOITUSKESKUSTELU, 'aloituskeskustelu-kouluttaja'],
      [LomakeTyypit.VALIARVIOINTI, 'valiarviointi-kouluttaja'],
      [LomakeTyypit.KEHITTAMISTOIMENPITEET, 'kehittamistoimenpiteet-kouluttaja'],
      [LomakeTyypit.LOPPUKESKUSTELU, 'loppukeskustelu-kouluttaja'],
      [LomakeTyypit.VASTUUHENKILON_ARVIO, 'vastuuhenkilon-arvio-vastuuhenkilo']
    ])

    get rows() {
      return this.vaiheet?.length ?? 0
    }

    linkComponent(type: LomakeTyypit) {
      return this.componentLinks.get(type)
    }

    buttonText(type: LomakeTyypit) {
      switch (type) {
        case LomakeTyypit.KOULUTUSSOPIMUS:
          return 'hyvaksy'
        case LomakeTyypit.ALOITUSKESKUSTELU:
          return 'hyvaksy'
        case LomakeTyypit.VALIARVIOINTI:
          return 'tee-arviointi'
        case LomakeTyypit.KEHITTAMISTOIMENPITEET:
          return 'tee-arviointi'
        case LomakeTyypit.LOPPUKESKUSTELU:
          return 'tee-arviointi'
        case LomakeTyypit.VASTUUHENKILON_ARVIO:
          return 'tee-arviointi'
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '~@/styles/variables';
  @import '~bootstrap/scss/mixins/breakpoints';

  ::v-deep table {
    td {
      vertical-align: middle;
    }

    .actions {
      text-align: right;
      padding-right: 2rem;
    }
  }
</style>
