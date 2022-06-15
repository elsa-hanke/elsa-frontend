<template>
  <div class="kayttaja">
    <b-breadcrumb :items="items" class="mb-0" />
    <b-container fluid>
      <b-row lg>
        <b-col>
          <h1>{{ $t('kayttaja') }}</h1>
          <hr />
          <div v-if="kayttajaWrapper">
            <elsa-form-group :label="$t('tilin-tila')">
              <template v-slot="{ uid }">
                <span :id="uid" :class="tilaColor">{{ tilinTilaText }}</span>
              </template>
            </elsa-form-group>
            <elsa-form-group v-if="rooli" :label="$t('rooli')">
              <template v-slot="{ uid }">
                <span :id="uid">{{ rooli }}</span>
              </template>
            </elsa-form-group>
            <b-form-row>
              <elsa-form-group :label="$t('etunimi')" class="col-sm-12 col-md-6 pr-md-3">
                <template v-slot="{ uid }">
                  <span :id="uid">{{ etunimi }}</span>
                </template>
              </elsa-form-group>
              <elsa-form-group :label="$t('sukunimi')" class="col-sm-12 col-md-6 pl-md-3">
                <template v-slot="{ uid }">
                  <span :id="uid">{{ sukunimi }}</span>
                </template>
              </elsa-form-group>
            </b-form-row>
            <div>
              <elsa-form-group :label="$t('sahkopostiosoite')">
                <template v-slot="{ uid }">
                  <span :id="uid">
                    {{ sahkoposti }}
                  </span>
                </template>
              </elsa-form-group>
            </div>
            <div>
              <elsa-form-group :label="$t('puhelinnumero')">
                <template v-slot="{ uid }">
                  <span :id="uid">
                    {{ puhelin ? puhelin : '-' }}
                  </span>
                </template>
              </elsa-form-group>
            </div>
            <div>
              <elsa-form-group :label="$t('yliopisto-ja-erikoisala')">
                <div
                  v-for="yliopistoAndErikoisala in yliopistotAndErikoisalat"
                  :key="yliopistoAndErikoisala.id"
                >
                  <span>
                    {{
                      `${$t(`yliopisto-nimi.${yliopisto.nimi}`)}: ${
                        yliopistoAndErikoisala.erikoisala.nimi
                      }`
                    }}
                  </span>
                </div>
              </elsa-form-group>
            </div>
            <hr />
            <div class="d-flex flex-row-reverse flex-wrap">
              <elsa-button
                v-if="isPassiivinen"
                variant="outline-success"
                :loading="updatingTila"
                :disabled="updatingKayttaja"
                @click="onActivateKayttaja"
                class="mb-3"
              >
                {{ $t('aktivoi-kayttaja') }}
              </elsa-button>
              <elsa-button
                v-else-if="isAktiivinen || isKutsuttu"
                variant="outline-danger"
                :loading="updatingTila"
                :disabled="updatingKayttaja"
                @click="onPassivateKayttaja"
                class="mb-3"
              >
                {{ $t('passivoi-kayttaja') }}
              </elsa-button>
              <elsa-button
                v-if="!editing"
                :disabled="updatingTila"
                :to="{ name: 'kayttajahallinta', hash: '#kouluttajat' }"
                variant="link"
                class="mb-3 mr-auto font-weight-500 kayttajahallinta-link"
              >
                {{ $t('palaa-kayttajahallintaan') }}
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
  import { Component, Mixins } from 'vue-property-decorator'

  import { getKayttaja } from '@/api/kayttajahallinta'
  import ElsaButton from '@/components/button/button.vue'
  import ElsaFormGroup from '@/components/form-group/form-group.vue'
  import KayttajahallintaKayttajaMixin from '@/mixins/kayttajahallinta-kayttaja'
  import { toastFail } from '@/utils/toast'

  @Component({
    components: {
      ElsaButton,
      ElsaFormGroup
    }
  })
  export default class KouluttajaView extends Mixins(KayttajahallintaKayttajaMixin) {
    $refs!: {
      vastuuhenkilonTehtavat: any
    }

    items = [
      {
        text: this.$t('kayttajahallinta'),
        to: { name: 'kayttajahallinta' }
      },
      {
        text: this.$t('kayttaja'),
        active: true
      }
    ]

    async mounted() {
      try {
        this.kayttajaWrapper = (await getKayttaja(this.$route?.params?.kayttajaId)).data
      } catch (err) {
        toastFail(this, this.$t('kayttajan-hakeminen-epaonnistui'))
        this.$router.replace({ name: 'kayttajahallinta' })

        this.loading = false
      }
    }
  }
</script>
<style lang="scss" scoped>
  .kayttaja {
    max-width: 768px;
  }

  .kayttajahallinta-link::before {
    content: '<';
    position: absolute;
    left: 1rem;
  }
</style>
