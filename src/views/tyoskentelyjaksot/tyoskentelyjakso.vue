<template>
  <div class="tyoskentelyjakso">
    <b-breadcrumb :items="items" class="mb-0" />
    <b-container fluid>
      <b-row lg>
        <b-col>
          <h1>{{ $t('tyoskentelyjakso') }}</h1>
          <hr />
          <div v-if="tyoskentelyjakso">
            <elsa-form-group :label="$t('kunta')">
              <template v-slot="{ uid }">
                <span :id="uid">
                  {{ tyoskentelyjakso.tyoskentelypaikka.kunta.abbreviation }}
                </span>
              </template>
            </elsa-form-group>
            <elsa-form-group :label="$t('tyoskentelypaikka')">
              <template v-slot="{ uid }">
                <span :id="uid">{{ tyoskentelyjakso.tyoskentelypaikka.nimi }}</span>
              </template>
            </elsa-form-group>
            <elsa-form-group :label="$t('tyyppi')">
              <template v-slot="{ uid }">
                <span :id="uid">{{ tyyppiLabel }}</span>
                <span v-if="tyoskentelyjakso.tyoskentelypaikka.muuTyyppi">
                  : {{ tyoskentelyjakso.tyoskentelypaikka.muuTyyppi }}
                </span>
              </template>
            </elsa-form-group>
            <elsa-form-group :label="$t('tyoaika-taydesta-tyopaivasta') + ' (50–100 %)'">
              <template v-slot="{ uid }">
                <span :id="uid">{{ tyoskentelyjakso.osaaikaprosentti }} %</span>
              </template>
            </elsa-form-group>
            <b-form-row>
              <elsa-form-group :label="$t('alkamispaiva')" class="col-sm-12 col-md-6 pr-md-3">
                <template v-slot="{ uid }">
                  <span :id="uid">{{ $date(tyoskentelyjakso.alkamispaiva) }}</span>
                </template>
              </elsa-form-group>
              <elsa-form-group
                v-if="tyoskentelyjakso.paattymispaiva"
                :label="$t('paattymispaiva')"
                class="col-sm-12 col-md-6 pl-md-3"
              >
                <template v-slot="{ uid }">
                  <span :id="uid" class="datepicker-range">
                    {{ $date(tyoskentelyjakso.paattymispaiva) }}
                  </span>
                </template>
              </elsa-form-group>
            </b-form-row>
            <elsa-form-group :label="$t('kaytannon-koulutus')">
              <template v-slot="{ uid }">
                <span :id="uid">{{ kaytannonKoulutusLabel }}</span>
                <span v-if="tyoskentelyjakso.omaaErikoisalaaTukeva">
                  : {{ tyoskentelyjakso.omaaErikoisalaaTukeva.nimi | lowercase }}
                </span>
                <span
                  v-if="
                    tyoskentelyjakso.kaytannonKoulutus === omaaErikoisalaaTukeva &&
                    !tyoskentelyjakso.omaaErikoisalaaTukeva
                  "
                >
                  : {{ $t('muu') | lowercase }}
                </span>
              </template>
            </elsa-form-group>
            <elsa-form-group
              v-if="tyoskentelyjakso.hyvaksyttyAiempaanErikoisalaan"
              :label="$t('lisatiedot')"
            >
              <template v-slot="{ uid }">
                <span :id="uid">
                  {{ $t('tyoskentelyjakso-on-aiemmin-hyvaksytty-toiselle-erikoisalalle') }}
                </span>
              </template>
            </elsa-form-group>
            <elsa-form-group :label="$t('liitetiedostot')">
              <template v-slot="{ uid }">
                <asiakirjat-content
                  :id="uid"
                  :asiakirjat="tyoskentelyjakso.asiakirjat"
                  :sorting-enabled="false"
                  :pagination-enabled="false"
                  :enable-search="false"
                  :enable-delete="false"
                  :no-results-info-text="$t('ei-liitetiedostoja')"
                  :loading="loading"
                />
              </template>
            </elsa-form-group>
            <hr />
            <div class="d-flex flex-row-reverse flex-wrap">
              <elsa-button
                :to="{ name: 'muokkaa-tyoskentelyjaksoa' }"
                variant="primary"
                class="ml-2 mb-2"
              >
                {{ $t('muokkaa-jaksoa') }}
              </elsa-button>
              <elsa-button
                v-if="!tyoskentelyjakso.suoritusarvioinnit"
                :loading="deleting"
                variant="outline-danger"
                @click="onTyoskentelyjaksoDelete"
                class="mb-2"
              >
                {{ $t('poista-jakso') }}
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
  import axios from 'axios'
  import { Vue, Component } from 'vue-property-decorator'

  import AsiakirjatContent from '@/components/asiakirjat/asiakirjat-content.vue'
  import ElsaButton from '@/components/button/button.vue'
  import ElsaFormGroup from '@/components/form-group/form-group.vue'
  import TyoskentelyjaksoForm from '@/forms/tyoskentelyjakso-form.vue'
  import { Tyoskentelyjakso } from '@/types'
  import { confirmDelete } from '@/utils/confirm'
  import { KaytannonKoulutusTyyppi } from '@/utils/constants'
  import { toastFail, toastSuccess } from '@/utils/toast'
  import {
    tyoskentelyjaksoKaytannonKoulutusLabel,
    tyoskentelypaikkaTyyppiLabel
  } from '@/utils/tyoskentelyjakso'

  @Component({
    components: {
      TyoskentelyjaksoForm,
      ElsaFormGroup,
      ElsaButton,
      AsiakirjatContent
    }
  })
  export default class TyoskentelyjaksoView extends Vue {
    items = [
      {
        text: this.$t('etusivu'),
        to: { name: 'etusivu' }
      },
      {
        text: this.$t('tyoskentelyjaksot'),
        to: { name: 'tyoskentelyjaksot' }
      },
      {
        text: this.$t('tyoskentelyjakso'),
        active: true
      }
    ]
    tyoskentelyjakso: Tyoskentelyjakso | null = null
    loading = false
    deleting = false

    async mounted() {
      const tyoskentelyjaksoId = this.$route?.params?.tyoskentelyjaksoId
      if (tyoskentelyjaksoId) {
        this.loading = true
        try {
          this.tyoskentelyjakso = (
            await axios.get(`erikoistuva-laakari/tyoskentelyjaksot/${tyoskentelyjaksoId}`)
          ).data
        } catch (err) {
          this.$router.replace({ name: 'tyoskentelyjaksot' })
        }
        this.loading = false
      }
    }

    async onTyoskentelyjaksoDelete() {
      if (!this.tyoskentelyjakso?.id) return
      if (
        await confirmDelete(
          this,
          this.$t('poista-tyoskentelyjakso') as string,
          (this.$t('tyoskentelyjakson') as string).toLowerCase()
        )
      ) {
        this.deleting = true
        try {
          await axios.delete(`erikoistuva-laakari/tyoskentelyjaksot/${this.tyoskentelyjakso.id}`)
          toastSuccess(this, this.$t('tyoskentelyjakso-poistettu-onnistuneesti'))
          this.$router.push({
            name: 'tyoskentelyjaksot'
          })
        } catch (err) {
          toastFail(this, this.$t('tyoskentelyjakson-poistaminen-epaonnistui'))
        }
        this.deleting = false
      }
    }

    get omaaErikoisalaaTukeva() {
      return KaytannonKoulutusTyyppi.OMAA_ERIKOISALAA_TUKEVA_KOULUTUS
    }

    get kaytannonKoulutusLabel() {
      if (this.tyoskentelyjakso?.kaytannonKoulutus) {
        return tyoskentelyjaksoKaytannonKoulutusLabel(
          this,
          this.tyoskentelyjakso?.kaytannonKoulutus
        )
      }
      return undefined
    }

    get tyyppiLabel() {
      if (this.tyoskentelyjakso?.tyoskentelypaikka?.tyyppi) {
        return tyoskentelypaikkaTyyppiLabel(this, this.tyoskentelyjakso?.tyoskentelypaikka?.tyyppi)
      }
      return undefined
    }
  }
</script>

<style lang="scss" scoped>
  @import '~@/styles/variables';
  @import '~bootstrap/scss/mixins/breakpoints';

  .tyoskentelyjakso {
    max-width: 768px;
  }

  .datepicker-range::before {
    content: '–';
    position: absolute;
    left: -1rem;
    padding: 0 0.75rem;
    @include media-breakpoint-down(sm) {
      display: none;
    }
  }
</style>
