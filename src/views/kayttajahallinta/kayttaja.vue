<template>
  <div class="kayttaja">
    <b-breadcrumb :items="items" class="mb-0" />
    <b-container fluid>
      <b-row lg>
        <b-col>
          <h1>{{ $t('kayttaja') }}</h1>
          <hr />
          <div v-if="kayttaja">
            <elsa-form-group v-if="rooli" :label="$t('rooli')">
              <template v-slot="{ uid }">
                <span :id="uid">{{ $t(rooli) }}</span>
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
            <elsa-form-group :label="$t('sahkopostiosoite')">
              <template v-slot="{ uid }">
                <span :id="uid">
                  {{ sahkopostiosoite }}
                </span>
              </template>
            </elsa-form-group>
            <hr />
            <h2>{{ $t('opintooikeudet') }}</h2>
            <div
              class="border rounded p-3 mb-4"
              v-for="(opintooikeus, index) in opintooikeudet"
              :key="index"
            >
              <h3>{{ `${opintooikeus.yliopistoNimi}, ${opintooikeus.erikoisalaNimi}` }}</h3>
              <elsa-form-group :label="$t('opiskelijatunnus')" v-if="opintooikeus.opiskelijatunnus">
                <template v-slot="{ uid }">
                  <span :id="uid">{{ opintooikeus.opiskelijatunnus }}</span>
                </template>
              </elsa-form-group>
              <elsa-form-group :label="$t('opintooikeus')">
                <template v-slot="{ uid }">
                  <span :id="uid">
                    {{
                      `${$date(opintooikeus.opintooikeudenMyontamispaiva)}-${$date(
                        opintooikeus.opintooikeudenPaattymispaiva
                      )}`
                    }}
                  </span>
                </template>
              </elsa-form-group>
              <elsa-form-group :label="$t('asetus')">
                <template v-slot="{ uid }">
                  <span :id="uid">{{ opintooikeus.asetus.nimi }}</span>
                </template>
              </elsa-form-group>
              <elsa-form-group :label="$t('kaytossa-oleva-opintoopas')">
                <template v-slot="{ uid }">
                  <span :id="uid">{{ opintooikeus.opintoopasNimi }}</span>
                </template>
              </elsa-form-group>
              <elsa-form-group :label="$t('osaamisen-arvioinnin-oppaan-paivamaara')">
                <template v-slot="{ uid }">
                  <span :id="uid">
                    {{ $date(opintooikeus.osaamisenArvioinninOppaanPvm) }}
                  </span>
                </template>
              </elsa-form-group>
            </div>
            <div class="d-flex flex-row-reverse flex-wrap">
              <elsa-button variant="primary" @click="onInvitationResend" class="mb-3">
                {{ $t('laheta-kutsu-uudelleen') }}
              </elsa-button>
              <elsa-button
                :to="{ name: 'kayttajahallinta' }"
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
  import { Component, Vue } from 'vue-property-decorator'

  import { getKayttaja, putErikoistuvaLaakariInvitation } from '@/api/tekninen-paakayttaja'
  import ElsaButton from '@/components/button/button.vue'
  import ElsaFormGroup from '@/components/form-group/form-group.vue'
  import { KayttajahallintaKayttaja } from '@/types'
  import { getTitleFromAuthorities } from '@/utils/functions'
  import { toastFail, toastSuccess } from '@/utils/toast'

  @Component({
    components: {
      ElsaButton,
      ElsaFormGroup
    }
  })
  export default class KayttajaView extends Vue {
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
    resending = false
    kayttaja: KayttajahallintaKayttaja | null = null

    async mounted() {
      await this.fetchKayttaja()
      this.loading = false
    }

    async fetchKayttaja() {
      try {
        this.kayttaja = (await getKayttaja(this.$route?.params?.kayttajaId)).data
      } catch (err) {
        toastFail(this, this.$t('kayttajan-hakeminen-epaonnistui'))
        this.$router.replace({ name: 'kayttajahallinta' })
      }
    }

    async onInvitationResend() {
      if (
        this.kayttaja?.erikoistuvaLaakari?.id &&
        (await this.$bvModal.msgBoxConfirm(this.$t('laheta-kutsu-viesti') as string, {
          title: this.$t('laheta-kutsu-uudelleen') as string,
          okVariant: 'primary',
          okTitle: this.$t('laheta-kutsu') as string,
          cancelTitle: this.$t('peruuta') as string,
          cancelVariant: 'back',
          hideHeaderClose: false,
          centered: true
        }))
      ) {
        this.resending = true
        try {
          await putErikoistuvaLaakariInvitation(this.kayttaja?.erikoistuvaLaakari?.id)
          toastSuccess(this, this.$t('kutsulinkki-lahetetty-uudestaan'))
        } catch (err) {
          toastFail(this, this.$t('kutsulinkin-lahettaminen-epaonnistui'))
        }
        this.resending = false
      }
    }

    get rooli() {
      return getTitleFromAuthorities(this.kayttaja?.user?.authorities ?? [])
    }

    get etunimi() {
      return this.kayttaja?.kayttaja?.etunimi
    }

    get sukunimi() {
      return this.kayttaja?.kayttaja?.sukunimi
    }

    get sahkopostiosoite() {
      return this.kayttaja?.kayttaja?.sahkoposti
    }

    get opintooikeudet() {
      return this.kayttaja?.erikoistuvaLaakari?.opintooikeudet ?? []
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
