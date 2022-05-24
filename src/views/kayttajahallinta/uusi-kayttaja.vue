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
  import VastuuhenkiloForm from '@/views/kayttajahallinta/uusi-vastuuhenkilo.vue'

  @Component({
    components: {
      ElsaFormGroup,
      ErikoistuvaLaakariForm,
      VastuuhenkiloForm,
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
        text: this.$t('erikoistuva-laakari'),
        value: ELSA_ROLE.ErikoistuvaLaakari
      },
      {
        text: this.$t('vastuuhenkilo'),
        value: ELSA_ROLE.Vastuuhenkilo
      }
    ]

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
  }
</script>

<style lang="scss" scoped>
  .uusi-kayttaja {
    max-width: 768px;
  }
</style>
