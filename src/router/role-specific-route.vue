<template>
  <div v-if="!loading">
    <component :is="routeComponent" v-if="isAllowedRoute" />
    <b-container v-else class="mt-4 mt-md-5 mb-6 ml-2 ml-sm-5 ml-md-4">
      <page-not-found-content />
    </b-container>
  </div>
  <div v-else class="text-center mt-5">
    <b-spinner variant="primary" :label="$t('ladataan')" />
  </div>
</template>

<script lang="ts">
  import { Component, Vue, Prop } from 'vue-property-decorator'

  import store from '@/store'
  import PageNotFoundContent from '@/views/404/page-not-found-content.vue'

  @Component({
    components: {
      PageNotFoundContent
    }
  })
  export default class ErikoistuvaRoute extends Vue {
    @Prop({ required: true })
    routeComponent!: any

    @Prop({ required: true, default: [] })
    allowedRoles!: string[]

    loading = true

    get isAllowedRoute() {
      const authorities = store.getters['auth/account'].authorities
      return this.allowedRoles.some((r) => authorities.includes(r))
    }

    async mounted() {
      await store.dispatch('auth/authorize')
      this.loading = false
    }
  }
</script>
