<template>
  <div id="app">
    <router-view />

    <footer class="pb-5">
      <b-container class="footer-links pt-4">
        <b-row align-h="center">
          <b-col lg="2">
            <b-link>{{ $t('tietosuoja') }}</b-link>
          </b-col>
          <b-col lg="2">
            <b-link>{{ $t('kayttoehdot') }}</b-link>
          </b-col>
          <b-col lg="2">
            <b-link>{{ $t('palaute') }}</b-link>
          </b-col>
        </b-row>

        <b-row align-h="center" class="pt-4 flex-nowrap justify-content-center">
          <b-col>
            <img :src="`${publicPath}img/elsa_oulun_yliopisto.svg`" alt="Oulun Yliopisto" />
          </b-col>
          <b-col>
            <img :src="`${publicPath}img/elsa_tampereen_yliopisto.svg`" alt="Tampereen Yliopisto" />
          </b-col>
          <b-col>
            <img :src="`${publicPath}img/elsa_turun_yliopisto.svg`" alt="Turun Yliopisto" />
          </b-col>
          <b-col>
            <img
              :src="`${publicPath}img/elsa_eastern_finland_yliopisto.svg`"
              alt="Itä-Suomen Yliopisto"
            />
          </b-col>
          <b-col>
            <img :src="`${publicPath}img/elsa_helsingin_yliopisto.svg`" alt="Helsingin Yliopisto" />
          </b-col>
        </b-row>
      </b-container>
    </footer>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import Component from 'vue-class-component'
  import { Meta } from '@/utils/decorators'

  @Component({})
  export default class App extends Vue {
    @Meta
    getMetaInfo() {
      if (this.$route && this.$route.name) {
        return {
          title: this.$t(this.$route.name),
          titleTemplate: `%s - ${this.$t('elsa-palvelu')}`
        }
      }
      return {
        title: this.$t('elsa-palvelu'),
        titleTemplate: null
      }
    }

    publicPath = process.env.BASE_URL
  }
</script>

<style lang="scss" scoped>
  @import '~@/styles/variables';

  footer {
    border-top: 2px solid rgba($border-color, 0.5);
  }
</style>
