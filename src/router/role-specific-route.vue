<template>
  <component :is="routeComponent" v-if="isAllowedRoute" />
  <page-not-found v-else />
</template>

<script lang="ts">
  import { Component, Vue, Prop } from 'vue-property-decorator'

  import store from '@/store'
  import PageNotFound from '@/views/404/page-not-found-content.vue'

  @Component({
    components: {
      PageNotFound
    }
  })
  export default class ErikoistuvaRoute extends Vue {
    @Prop({ required: true })
    routeComponent!: any

    @Prop({ required: true, default: [] })
    allowedRoles!: string[]

    get isAllowedRoute() {
      const authorities = store.getters['auth/account'].authorities
      return this.allowedRoles.some((r) => authorities.includes(r))
    }
  }
</script>
