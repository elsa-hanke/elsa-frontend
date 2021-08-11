<template>
  <div class="suoritemerkinta">
    <b-breadcrumb :items="items" class="mb-0"></b-breadcrumb>
    <b-container fluid>
      <b-row lg>
        <b-col>
          <h1>{{ $t('suoritemerkinta') }}</h1>
          <hr />
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
            <elsa-form-group :label="$t('luottamuksen-taso')">
              <template #label-help>
                <elsa-popover>
                  <template>
                    <h3>{{ $t('luottamuksen-taso') }}</h3>
                    <div v-for="(taso, index) in luottamuksenTasot" :key="index">
                      <h4>{{ taso.arvo }} {{ $t(taso.nimi) }}</h4>
                      <p>{{ $t(taso.kuvaus) }}</p>
                    </div>
                  </template>
                </elsa-popover>
              </template>
              <template v-slot="{ uid }">
                <span :id="uid">
                  <elsa-luottamuksen-taso :value="suoritemerkintaWrapper.luottamuksenTaso" />
                </span>
              </template>
            </elsa-form-group>
            <elsa-form-group :label="$t('suorituspaiva')">
              <template v-slot="{ uid }">
                <span :id="uid">{{ $date(suoritemerkintaWrapper.suorituspaiva) }}</span>
              </template>
            </elsa-form-group>
            <elsa-form-group v-if="suoritemerkintaWrapper.lisatiedot" :label="$t('lisatiedot')">
              <template v-slot="{ uid }">
                <span :id="uid" class="text-prewrap">{{ suoritemerkintaWrapper.lisatiedot }}</span>
              </template>
            </elsa-form-group>
            <div class="text-right">
              <elsa-button
                :loading="deleting"
                variant="outline-danger"
                @click="onSuoritemerkintaDelete"
              >
                {{ $t('poista-merkinta') }}
              </elsa-button>
              <elsa-button
                :to="{ name: 'muokkaa-suoritemerkintaa' }"
                variant="primary"
                class="ml-2"
              >
                {{ $t('muokkaa-merkintaa') }}
              </elsa-button>
            </div>
          </div>
          <div v-else class="text-center">
            <b-spinner variant="primary" :label="$t('ladataan')" />
          </div>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import axios from 'axios'
  import { Component } from 'vue-property-decorator'
  import ElsaFormGroup from '@/components/form-group/form-group.vue'
  import ElsaPopover from '@/components/popover/popover.vue'
  import ElsaBadge from '@/components/badge/badge.vue'
  import ElsaLuottamuksenTaso from '@/components/luottamuksen-taso/luottamuksen-taso.vue'
  import ElsaButton from '@/components/button/button.vue'
  import { vaativuustasot, luottamuksenTasot } from '@/utils/constants'
  import { tyoskentelyjaksoLabel } from '@/utils/tyoskentelyjakso'
  import { confirmDelete } from '@/utils/confirm'
  import { toastFail, toastSuccess } from '@/utils/toast'

  @Component({
    components: {
      ElsaFormGroup,
      ElsaPopover,
      ElsaBadge,
      ElsaLuottamuksenTaso,
      ElsaButton
    }
  })
  export default class Suoritemerkinta extends Vue {
    items = [
      {
        text: this.$t('etusivu'),
        to: { name: 'etusivu' }
      },
      {
        text: this.$t('suoritemerkinnat'),
        to: { name: 'suoritemerkinnat' }
      },
      {
        text: this.$t('suoritemerkinta'),
        active: true
      }
    ]
    suoritemerkinta: any = null
    vaativuustasot = vaativuustasot
    luottamuksenTasot = luottamuksenTasot
    deleting = false

    async mounted() {
      const suoritemerkintaId = this.$route?.params?.suoritemerkintaId
      if (suoritemerkintaId) {
        try {
          this.suoritemerkinta = (
            await axios.get(`erikoistuva-laakari/suoritemerkinnat/${suoritemerkintaId}`)
          ).data
        } catch (err) {
          this.$router.replace({ name: 'suoritemerkinnat' })
        }
      }
    }

    async onSuoritemerkintaDelete() {
      if (
        await confirmDelete(
          this,
          this.$t('poista-suoritemerkinta') as string,
          (this.$t('suoritemerkinnan') as string).toLowerCase()
        )
      ) {
        this.deleting = true
        try {
          await axios.delete(`erikoistuva-laakari/suoritemerkinnat/${this.suoritemerkinta.id}`)
          toastSuccess(this, this.$t('suoritemerkinta-poistettu-onnistuneesti'))
          this.$router.push({
            name: 'suoritemerkinnat'
          })
        } catch (err) {
          toastFail(this, this.$t('suoritemerkinnan-poistaminen-epaonnistui'))
        }
        this.deleting = false
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
  }
</script>

<style lang="scss" scoped>
  .suoritemerkinta {
    max-width: 970px;
  }
</style>
