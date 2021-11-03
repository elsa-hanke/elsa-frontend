<template>
  <div v-if="suoritemerkintaWrapper">
    <elsa-form-group :label="$t('tyoskentelyjakso')">
      <template v-slot="{ uid }">
        <span :id="uid">{{ suoritemerkintaWrapper.tyoskentelyjakso.label }}</span>
      </template>
    </elsa-form-group>
    <elsa-form-group :label="$t('oppimistavoite')">
      <template v-slot="{ uid }">
        <span :id="uid">{{ suoritemerkintaWrapper.oppimistavoite.nimi }}</span>
      </template>
    </elsa-form-group>
    <elsa-form-group :label="$t('vaativuustaso')">
      <template v-slot="{ uid }">
        <span :id="uid">
          <elsa-badge :value="suoritemerkintaWrapper.vaativuustaso" />
        </span>
      </template>
    </elsa-form-group>
    <elsa-form-group :label="arviointiAsteikonNimi">
      <template #label-help>
        <elsa-popover>
          <template>
            <h3>{{ arviointiAsteikonNimi }}</h3>
            <div
              v-for="(asteikonTaso, index) in suoritemerkintaWrapper.arviointiasteikko.tasot"
              :key="index"
            >
              <h4>
                {{ asteikonTaso.taso }}
                {{ $t('arviointiasteikon-taso-' + asteikonTaso.nimi) }}
              </h4>
              <p>{{ $t('arviointiasteikon-tason-kuvaus-' + asteikonTaso.nimi) }}</p>
            </div>
          </template>
        </elsa-popover>
      </template>
      <template v-slot="{ uid }">
        <span :id="uid">
          <elsa-arviointiasteikon-taso
            :value="suoritemerkintaWrapper.arviointiasteikonTaso"
            :tasot="suoritemerkintaWrapper.arviointiasteikko.tasot"
          />
        </span>
      </template>
    </elsa-form-group>
    <elsa-form-group :label="$t('suorituspaiva')">
      <template v-slot="{ uid }">
        <span :id="uid">
          {{
            suoritemerkintaWrapper.suorituspaiva ? $date(suoritemerkintaWrapper.suorituspaiva) : ''
          }}
        </span>
      </template>
    </elsa-form-group>
    <elsa-form-group v-if="suoritemerkintaWrapper.lisatiedot" :label="$t('lisatiedot')">
      <template v-slot="{ uid }">
        <span :id="uid" class="text-preline">{{ suoritemerkintaWrapper.lisatiedot }}</span>
      </template>
    </elsa-form-group>
  </div>
  <div v-else class="text-center">
    <b-spinner variant="primary" :label="$t('ladataan')" />
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import { Component, Prop } from 'vue-property-decorator'

  import ElsaArviointiasteikonTaso from '@/components/arviointiasteikon-taso/arviointiasteikon-taso.vue'
  import ElsaBadge from '@/components/badge/badge.vue'
  import ElsaButton from '@/components/button/button.vue'
  import ElsaFormGroup from '@/components/form-group/form-group.vue'
  import ElsaPopover from '@/components/popover/popover.vue'
  import { Suoritemerkinta } from '@/types'
  import { ArviointiasteikkoTyyppi, vaativuustasot } from '@/utils/constants'
  import { tyoskentelyjaksoLabel } from '@/utils/tyoskentelyjakso'

  @Component({
    components: {
      ElsaFormGroup,
      ElsaPopover,
      ElsaBadge,
      ElsaArviointiasteikonTaso,
      ElsaButton
    }
  })
  export default class SuoritemerkintaDetails extends Vue {
    @Prop({ required: true, default: () => [] })
    value!: Suoritemerkinta

    suoritemerkinta: Suoritemerkinta | null = null

    vaativuustasot = vaativuustasot

    mounted() {
      this.suoritemerkinta = {
        ...this.value
      }
    }

    get suoritemerkintaWrapper() {
      if (this.suoritemerkinta) {
        return {
          ...this.suoritemerkinta,
          tyoskentelyjakso: {
            ...this.suoritemerkinta.tyoskentelyjakso,
            label: tyoskentelyjaksoLabel(this, this.suoritemerkinta.tyoskentelyjakso)
          }
        }
      } else {
        return undefined
      }
    }

    get arviointiAsteikonNimi() {
      return this.suoritemerkinta?.arviointiasteikko?.nimi === ArviointiasteikkoTyyppi.EPA
        ? this.$t('luottamuksen-taso')
        : this.$t('etappi')
    }
  }
</script>

<style lang="scss" scoped></style>
