<template>
  <div class="poissaolo">
    <b-breadcrumb :items="items" class="mb-0" />
    <b-container fluid>
      <b-row lg>
        <b-col>
          <h1>{{ $t('poissaolo') }}</h1>
          <hr />
          <div v-if="poissaoloWrapper">
            <elsa-form-group :label="$t('poissaolon-syy')">
              <template v-slot="{ uid }">
                <span :id="uid">{{ poissaoloWrapper.poissaolonSyy.nimi }}</span>
              </template>
            </elsa-form-group>
            <elsa-form-group :label="$t('tyoskentelyjakso')">
              <template v-slot="{ uid }">
                <span :id="uid">{{ poissaoloWrapper.tyoskentelyjakso.label }}</span>
              </template>
            </elsa-form-group>
            <b-form-row>
              <elsa-form-group :label="$t('alkamispaiva')" class="col-sm-12 col-md-6 pr-md-3">
                <template v-slot="{ uid }">
                  <span :id="uid">
                    {{ poissaoloWrapper.alkamispaiva ? $date(poissaoloWrapper.alkamispaiva) : '' }}
                  </span>
                </template>
              </elsa-form-group>
              <elsa-form-group
                v-if="poissaoloWrapper.paattymispaiva"
                :label="$t('paattymispaiva')"
                class="col-sm-12 col-md-6 pl-md-3"
              >
                <template v-slot="{ uid }">
                  <span :id="uid" class="datepicker-range">
                    {{ $date(poissaoloWrapper.paattymispaiva) }}
                  </span>
                </template>
              </elsa-form-group>
            </b-form-row>
            <elsa-form-group :label="$t('poissaolo-nykyisesta-taydesta-tyoajasta') + ' (%)'">
              <template v-slot="{ uid }">
                <span :id="uid">{{ poissaoloWrapper.poissaoloprosentti }} %</span>
              </template>
            </elsa-form-group>
            <hr />
            <div class="text-right">
              <elsa-button :loading="deleting" variant="outline-danger" @click="onPoissaoloDelete">
                {{ $t('poista-poissaolo') }}
              </elsa-button>
              <elsa-button :to="{ name: 'muokkaa-poissaoloa' }" variant="primary" class="ml-2">
                {{ $t('muokkaa-poissaoloa') }}
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
  import axios, { AxiosError } from 'axios'
  import { Vue, Component } from 'vue-property-decorator'

  import ElsaBadge from '@/components/badge/badge.vue'
  import ElsaButton from '@/components/button/button.vue'
  import ElsaFormGroup from '@/components/form-group/form-group.vue'
  import ElsaPopover from '@/components/popover/popover.vue'
  import { Poissaolo, ElsaError } from '@/types'
  import { confirmDelete } from '@/utils/confirm'
  import { toastFail, toastSuccess } from '@/utils/toast'
  import { tyoskentelyjaksoLabel } from '@/utils/tyoskentelyjakso'

  @Component({
    components: {
      ElsaFormGroup,
      ElsaPopover,
      ElsaBadge,
      ElsaButton
    }
  })
  export default class PoissaoloView extends Vue {
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
        text: this.$t('poissaolo'),
        active: true
      }
    ]
    poissaolo: null | Poissaolo = null
    deleting = false

    async mounted() {
      const poissaoloId = this.$route?.params?.poissaoloId
      if (poissaoloId) {
        try {
          this.poissaolo = (
            await axios.get(`erikoistuva-laakari/tyoskentelyjaksot/poissaolot/${poissaoloId}`)
          ).data
        } catch {
          toastFail(this, this.$t('poissaolon-hakeminen-epaonnistui'))
          this.$router.replace({ name: 'tyoskentelyjaksot' })
        }
      }
    }

    async onPoissaoloDelete() {
      if (
        await confirmDelete(
          this,
          this.$t('poista-poissaolo') as string,
          (this.$t('poissaolon') as string).toLowerCase()
        )
      ) {
        this.deleting = true
        try {
          await axios.delete(
            `erikoistuva-laakari/tyoskentelyjaksot/poissaolot/${this.poissaolo?.id}`
          )
          toastSuccess(this, this.$t('poissaolo-poistettu-onnistuneesti'))
          this.$router.push({
            name: 'tyoskentelyjaksot'
          })
        } catch (err) {
          const axiosError = err as AxiosError<ElsaError>
          const message = axiosError?.response?.data?.message
          toastFail(
            this,
            message
              ? `${this.$t('poissaolon-poistaminen-epaonnistui')}: ${this.$t(message)}`
              : this.$t('poissaolon-poistaminen-epaonnistui')
          )
        }
        this.deleting = false
      }
    }

    get poissaoloWrapper() {
      if (this.poissaolo) {
        return {
          ...this.poissaolo,
          tyoskentelyjakso: {
            ...this.poissaolo.tyoskentelyjakso,
            label: tyoskentelyjaksoLabel(this, this.poissaolo.tyoskentelyjakso)
          }
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

  .poissaolo {
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
