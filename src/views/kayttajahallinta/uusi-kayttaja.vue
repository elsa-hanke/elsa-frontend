<template>
  <div class="uusi-kayttaja">
    <b-breadcrumb :items="items" class="mb-0" />
    <b-container fluid>
      <b-row lg>
        <b-col>
          <h1>{{ $t('lisaa-uusi-kayttaja') }}</h1>
          <hr />
          <elsa-form-group :label="$t('rooli')" :required="true">
            <template v-slot="{ uid }">
              <b-form-radio-group :id="uid" v-model="form.rooli" :options="roolit" stacked />
            </template>
          </elsa-form-group>
          <erikoistuva-laakari-form
            v-if="form.rooli === erikoistuvaLaakariRole"
            @skipRouteExitConfirm="(value) => $emit('skipRouteExitConfirm', value)"
          />
          <vastuuhenkilo-form
            v-if="form.rooli === vastuuhenkiloRole"
            @skipRouteExitConfirm="(value) => $emit('skipRouteExitConfirm', value)"
          />
          <virkailija-form
            v-if="form.rooli === virkailijaRole"
            @skipRouteExitConfirm="(value) => $emit('skipRouteExitConfirm', value)"
          />
          <paakayttaja-form
            v-if="form.rooli === paakayttajaRole"
            @skipRouteExitConfirm="(value) => $emit('skipRouteExitConfirm', value)"
          />
        </b-col>
      </b-row>
      <div v-if="!form.rooli" class="d-flex flex-row-reverse flex-wrap">
        <elsa-button :disabled="true" variant="primary" class="ml-2 mb-2">
          {{ $t('tallenna') }}
        </elsa-button>
        <elsa-button variant="back" @click.stop.prevent="onCancel" class="mb-2">
          {{ $t('peruuta') }}
        </elsa-button>
      </div>
    </b-container>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator'

  import ElsaButton from '@/components/button/button.vue'
  import ElsaFormGroup from '@/components/form-group/form-group.vue'
  import { ELSA_ROLE } from '@/utils/roles'
  import ErikoistuvaLaakariForm from '@/views/kayttajahallinta/uusi-erikoistuva-laakari.vue'
  import PaakayttajaForm from '@/views/kayttajahallinta/uusi-paakayttaja.vue'
  import VastuuhenkiloForm from '@/views/kayttajahallinta/uusi-vastuuhenkilo.vue'
  import VirkailijaForm from '@/views/kayttajahallinta/uusi-virkailija.vue'

  @Component({
    components: {
      ElsaFormGroup,
      ErikoistuvaLaakariForm,
      VastuuhenkiloForm,
      VirkailijaForm,
      PaakayttajaForm,
      ElsaButton
    }
  })
  export default class UusiKayttajaView extends Vue {
    items = [
      {
        text: this.$t('kayttajahallinta'),
        to: { name: 'kayttajahallinta' }
      },
      {
        text: this.$t('uusi-kayttaja'),
        active: true
      }
    ]
    form = {
      rooli: null
    }

    roolit = [
      {
        text: this.$t('erikoistuja'),
        value: this.erikoistuvaLaakariRole
      },
      {
        text: this.$t('vastuuhenkilo'),
        value: this.vastuuhenkiloRole
      },
      {
        text: this.$t('virkailija'),
        value: this.virkailijaRole
      }
    ]

    mounted() {
      if (this.$isTekninenPaakayttaja()) {
        this.roolit.push({
          text: this.$t('paakayttaja'),
          value: this.paakayttajaRole
        })
      }
    }

    onCancel() {
      this.$router.push({
        name: 'kayttajahallinta'
      })
    }

    get erikoistuvaLaakariRole() {
      return ELSA_ROLE.ErikoistuvaLaakari
    }

    get vastuuhenkiloRole() {
      return ELSA_ROLE.Vastuuhenkilo
    }

    get virkailijaRole() {
      return ELSA_ROLE.OpintohallinnonVirkailija
    }

    get paakayttajaRole() {
      return ELSA_ROLE.TekninenPaakayttaja
    }
  }
</script>

<style lang="scss" scoped>
  .uusi-kayttaja {
    max-width: 768px;
  }
</style>
