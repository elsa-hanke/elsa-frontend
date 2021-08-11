<template>
  <div class="tyoskentelyjakso">
    <b-breadcrumb :items="items" class="mb-0" />
    <b-container fluid>
      <b-row lg>
        <b-col>
          <h1>{{ $t('tyoskentelyjakso') }}</h1>
          <hr />
          <div v-if="tyoskentelyjaksoWrapper">
            <elsa-form-group :label="$t('kunta')">
              <template v-slot="{ uid }">
                <span :id="uid">
                  {{ tyoskentelyjaksoWrapper.tyoskentelypaikka.kunta.abbreviation }}
                </span>
              </template>
            </elsa-form-group>
            <elsa-form-group :label="$t('tyoskentelypaikka')">
              <template v-slot="{ uid }">
                <span :id="uid">{{ tyoskentelyjaksoWrapper.tyoskentelypaikka.nimi }}</span>
              </template>
            </elsa-form-group>
            <elsa-form-group :label="$t('tyyppi')">
              <template v-slot="{ uid }">
                <span :id="uid">{{ tyoskentelyjaksoWrapper.tyoskentelypaikka.tyyppiLabel }}</span>
                <span v-if="tyoskentelyjaksoWrapper.tyoskentelypaikka.muuTyyppi">
                  : {{ tyoskentelyjaksoWrapper.tyoskentelypaikka.muuTyyppi }}
                </span>
              </template>
            </elsa-form-group>
            <elsa-form-group :label="$t('tyoaika-taydesta-tyopaivasta') + ' (50–100 %)'">
              <template v-slot="{ uid }">
                <span :id="uid">{{ tyoskentelyjaksoWrapper.osaaikaprosentti }} %</span>
              </template>
            </elsa-form-group>
            <b-form-row>
              <elsa-form-group :label="$t('alkamispaiva')" class="col-sm-12 col-md-6 pr-md-3">
                <template v-slot="{ uid }">
                  <span :id="uid">{{ $date(tyoskentelyjaksoWrapper.alkamispaiva) }}</span>
                </template>
              </elsa-form-group>
              <elsa-form-group
                v-if="tyoskentelyjaksoWrapper.paattymispaiva"
                :label="$t('paattymispaiva')"
                class="col-sm-12 col-md-6 pl-md-3"
              >
                <template v-slot="{ uid }">
                  <span :id="uid" class="datepicker-range">
                    {{ $date(tyoskentelyjaksoWrapper.paattymispaiva) }}
                  </span>
                </template>
              </elsa-form-group>
            </b-form-row>
            <elsa-form-group :label="$t('kaytannon-koulutus')">
              <template v-slot="{ uid }">
                <span :id="uid">{{ tyoskentelyjaksoWrapper.kaytannonKoulutusLabel }}</span>
                <span v-if="tyoskentelyjaksoWrapper.omaaErikoisalaaTukeva">
                  : {{ tyoskentelyjaksoWrapper.omaaErikoisalaaTukeva.nimi | lowercase }}
                </span>
                <span
                  v-if="
                    tyoskentelyjaksoWrapper.kaytannonKoulutus ===
                      'OMAA_ERIKOISALAA_TUKEVA_KOULUTUS' &&
                    !tyoskentelyjaksoWrapper.omaaErikoisalaaTukeva
                  "
                >
                  : {{ $t('muu') | lowercase }}
                </span>
              </template>
            </elsa-form-group>
            <elsa-form-group
              v-if="tyoskentelyjaksoWrapper.hyvaksyttyAiempaanErikoisalaan"
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
                  class="mb-5"
                  :id="uid"
                  :asiakirjat="tyoskentelyjakso.asiakirjat"
                  :sortingEnabled="false"
                  :paginationEnabled="false"
                  :enableSearch="false"
                  :enableDelete="false"
                  :noContentInfoText="$t('ei-liitetiedostoja')"
                  :loading="loading"
                />
              </template>
            </elsa-form-group>
            <div class="text-right">
              <elsa-button
                v-if="!tyoskentelyjaksoWrapper.suoritusarvioinnit"
                :loading="deleting"
                variant="outline-danger"
                @click="onTyoskentelyjaksoDelete"
              >
                {{ $t('poista-tyoskentelyjakso') }}
              </elsa-button>
              <elsa-button
                :to="{ name: 'muokkaa-tyoskentelyjaksoa' }"
                variant="primary"
                class="ml-2"
              >
                {{ $t('muokkaa-tyoskentelyjaksoa') }}
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
  import ElsaFormGroup from '@/components/form-group/form-group.vue'
  import ElsaButton from '@/components/button/button.vue'
  import TyoskentelyjaksoForm from '@/forms/tyoskentelyjakso-form.vue'
  import {
    tyoskentelypaikkaTyyppiLabel,
    tyoskentelyjaksoKaytannonKoulutusLabel
  } from '@/utils/tyoskentelyjakso'
  import AsiakirjatContent from '@/components/asiakirjat/asiakirjat-content.vue'
  import { confirmDelete } from '@/utils/confirm'
  import { toastFail, toastSuccess } from '@/utils/toast'

  @Component({
    components: {
      TyoskentelyjaksoForm,
      ElsaFormGroup,
      ElsaButton,
      AsiakirjatContent
    }
  })
  export default class Tyoskentelyjakso extends Vue {
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
    tyoskentelyjakso: any = null
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

    get tyoskentelyjaksoWrapper() {
      if (this.tyoskentelyjakso) {
        return {
          ...this.tyoskentelyjakso,
          tyoskentelypaikka: {
            ...this.tyoskentelyjakso.tyoskentelypaikka,
            tyyppiLabel: tyoskentelypaikkaTyyppiLabel(
              this,
              this.tyoskentelyjakso.tyoskentelypaikka.tyyppi
            )
          },
          kaytannonKoulutusLabel: tyoskentelyjaksoKaytannonKoulutusLabel(
            this,
            this.tyoskentelyjakso.kaytannonKoulutus
          )
        }
      } else {
        return undefined
      }
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
