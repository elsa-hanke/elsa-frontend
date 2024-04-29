<template>
  <div>
    <p class="mt-1 mb-3">{{ $t('valmistumispyynnot-ingressi-vastuuhenkilo') }}</p>
    <div v-if="!initializing">
      <div v-if="$isYekVastuuhenkilo()">
        <b-tabs v-model="tabIndex" content-class="mt-3" :no-fade="true">
          <b-tab :title="$t('erikoislaakarikoulutus')" href="#erikoislaakarikoulutus">
            <valmistumispyynnot-vastuuhenkilo-erikoistuva-laakari
              :valmistumispyynnon-hyvaksyja-role="valmistumispyynnonHyvaksyjaRole"
            />
          </b-tab>
          <b-tab :title="$t('yleislaaketieteen-erikoiskoulutus')" href="#yek">
            <valmistumispyynnot-vastuuhenkilo-yek
              :valmistumispyynnon-hyvaksyja-role="valmistumispyynnonHyvaksyjaRole"
            />
          </b-tab>
        </b-tabs>
      </div>
      <div v-else>
        <valmistumispyynnot-vastuuhenkilo-erikoistuva-laakari
          :valmistumispyynnon-hyvaksyja-role="valmistumispyynnonHyvaksyjaRole"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator'

  import ValmistumispyynnotVastuuhenkiloErikoistuvaLaakari from './valmistumispyynnot-vastuuhenkilo-erikoistuva-laakari.vue'
  import ValmistumispyynnotVastuuhenkiloYek from './valmistumispyynnot-vastuuhenkilo-yek.vue'

  import { getValmistumispyynnonHyvaksyjaRole } from '@/api/vastuuhenkilo'
  import { ValmistumispyynnonHyvaksyjaRole } from '@/utils/roles'

  @Component({
    components: {
      ValmistumispyynnotVastuuhenkiloErikoistuvaLaakari,
      ValmistumispyynnotVastuuhenkiloYek
    }
  })
  export default class ValmistumispyynnotVastuuhenkilo extends Vue {
    initializing = true
    valmistumispyynnonHyvaksyjaRole: ValmistumispyynnonHyvaksyjaRole | null = null

    tabIndex = 0
    tabs = ['#erikoislaakarikoulutus', '#yek']

    beforeMount() {
      this.tabIndex = this.tabs.findIndex((tab) => tab === this.$route.hash)
    }

    async mounted() {
      this.valmistumispyynnonHyvaksyjaRole = (await getValmistumispyynnonHyvaksyjaRole()).data
      this.initializing = false
    }
  }
</script>
