/* eslint-disable @typescript-eslint/ban-types */
import Vue from 'vue'

import store from '@/store'
import { ELSA_ROLE } from '@/utils/roles'

export class RolesPlugin {
  public install(vue: typeof Vue) {
    vue.prototype.$isErikoistuva = (): boolean => {
      return store.getters['auth/account'].authorities.includes(ELSA_ROLE.ErikoistuvaLaakari)
    }

    vue.prototype.$isKouluttaja = (): boolean => {
      return store.getters['auth/account'].authorities.includes(ELSA_ROLE.Kouluttaja)
    }

    vue.prototype.$isVastuuhenkilo = (): boolean => {
      return store.getters['auth/account'].authorities.includes(ELSA_ROLE.Vastuuhenkilo)
    }

    vue.prototype.$isTerveyskeskuskoulutusjaksoVastuuhenkilo = (): boolean => {
      const data = store.getters['auth/account']
      return (
        data.authorities.includes(ELSA_ROLE.Vastuuhenkilo) &&
        data.terveyskeskuskoulutusjaksoVastuuhenkilo
      )
    }

    vue.prototype.$isTekninenPaakayttaja = (): boolean => {
      return store.getters['auth/account'].authorities.includes(ELSA_ROLE.TekninenPaakayttaja)
    }

    vue.prototype.$isVirkailija = (): boolean => {
      return store.getters['auth/account'].authorities.includes(ELSA_ROLE.OpintohallinnonVirkailija)
    }
  }
}

declare module 'vue/types/vue' {
  interface Vue {
    $isErikoistuva: Function
    $isKouluttaja: Function
    $isVastuuhenkilo: Function
    $isTerveyskeskuskoulutusjaksoVastuuhenkilo: Function
    $isTekninenPaakayttaja: Function
    $isVirkailija: Function
  }
}

Vue.use(new RolesPlugin())
