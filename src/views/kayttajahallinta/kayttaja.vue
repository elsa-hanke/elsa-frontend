<template>
  <div class="kayttaja">
    <b-breadcrumb :items="items" class="mb-0" />
    <b-container fluid>
      <b-row lg>
        <b-col>
          <h1>{{ $t('kayttaja') }}</h1>
          <hr />
          <elsa-form-group :label="$t('rooli')">
            <template v-slot="{ uid }">
              <span :id="uid">{{ kayttaja.rooli }}</span>
            </template>
          </elsa-form-group>
          <b-form-row>
            <elsa-form-group :label="$t('etunimi')" class="col-sm-12 col-md-6 pr-md-3">
              <template v-slot="{ uid }">
                <span :id="uid">{{ kayttaja.etunimi }}</span>
              </template>
            </elsa-form-group>
            <elsa-form-group :label="$t('sukunimi')" class="col-sm-12 col-md-6 pl-md-3">
              <template v-slot="{ uid }">
                <span :id="uid">{{ kayttaja.sukunimi }}</span>
              </template>
            </elsa-form-group>
          </b-form-row>
          <elsa-form-group :label="$t('yliopisto')">
            <template v-slot="{ uid }">
              <span :id="uid">{{ kayttaja.yliopisto }}</span>
            </template>
          </elsa-form-group>
          <elsa-form-group :label="$t('erikoisala')">
            <template v-slot="{ uid }">
              <span :id="uid">{{ kayttaja.erikoisala }}</span>
            </template>
          </elsa-form-group>
          <elsa-form-group :label="$t('opiskelijatunnus')">
            <template v-slot="{ uid }">
              <span :id="uid">{{ kayttaja.opiskelijatunnus }}</span>
            </template>
          </elsa-form-group>
          <elsa-form-group :label="$t('opiskeluoikeus')">
            <template v-slot="{ uid }">
              <span :id="uid">
                {{
                  `${$date(kayttaja.opiskeluoikeusAlkaa)}-${$date(kayttaja.opiskeluoikeusPaattyy)}`
                }}
              </span>
            </template>
          </elsa-form-group>
          <elsa-form-group :label="$t('kaytossa-olevan-opetussuunnitelman-paivamaara')">
            <template v-slot="{ uid }">
              <span :id="uid">
                {{ $date(kayttaja.opintosuunnitelmaKaytossaPvm) }}
              </span>
            </template>
          </elsa-form-group>
          <elsa-form-group :label="$t('sahkopostiosoite')">
            <template v-slot="{ uid }">
              <span :id="uid">
                {{ kayttaja.sahkopostiosoite }}
              </span>
            </template>
          </elsa-form-group>
          <hr />
          <div class="d-flex flex-row-reverse flex-wrap">
            <elsa-button
              :to="{ name: 'kayttajahallinta' }"
              variant="link"
              class="mb-3 mr-auto font-weight-500 kayttajahallinta-link"
            >
              {{ $t('palaa-teoriakoulutuksiin') }}
            </elsa-button>
          </div>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator'

  import ElsaButton from '@/components/button/button.vue'
  import ElsaFormGroup from '@/components/form-group/form-group.vue'

  @Component({
    components: {
      ElsaButton,
      ElsaFormGroup
    }
  })
  export default class Kayttaja extends Vue {
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
    loading = true
    kayttaja = {
      rooli: 'Erikoistuja',
      etunimi: 'Matti',
      sukunimi: 'Meikäläinen',
      yliopisto: 'Tampereen yliopisto',
      erikoisala: 'Lastentaudit',
      opiskelijatunnus: '123456',
      opiskeluoikeusAlkaa: '2021-10-14',
      opiskeluoikeusPaattyy: '2023-10-14',
      opintosuunnitelmaKaytossaPvm: '2021-10-14',
      sahkopostiosoite: 'matti.meikalainen@localhost.local'
    }

    async mounted() {
      this.loading = false
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
