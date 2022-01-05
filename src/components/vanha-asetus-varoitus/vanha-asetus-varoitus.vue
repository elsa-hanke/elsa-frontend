<template>
  <p v-if="vanhanAsetuksenMukainen" class="d-flex">
    <font-awesome-icon icon="info-circle" class="text-muted mr-2 mt-1" />
    <span v-html="$t('vanhan-asetuksen-mukaisesti', { opintooppaastasiLinkki })" />
  </p>
</template>

<script lang="ts">
  import Vue from 'vue'
  import Component from 'vue-class-component'

  import ElsaBadge from '@/components/badge/badge.vue'
  import store from '@/store'
  import { vanhatAsetukset } from '@/utils/constants'

  @Component({
    components: {
      ElsaBadge
    }
  })
  export default class ElsaVanhaAsetusVaroitus extends Vue {
    get opintooppaastasiLinkki() {
      return `<a href="https://www.laaketieteelliset.fi/ammatillinen-jatkokoulutus/opinto-oppaat/" target="_blank" rel="noopener noreferrer">${(this.$t(
        'opintooppaastasi'
      ) as string).toLowerCase()}</a>`
    }

    get asetus() {
      const opintooikeudet = store.getters['auth/account']?.erikoistuvaLaakari?.opintooikeudet
      return opintooikeudet?.length > 0 ? opintooikeudet[0].asetus : null
    }

    get vanhanAsetuksenMukainen() {
      return vanhatAsetukset.includes(this.asetus)
    }
  }
</script>
