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
  }
}

declare module 'vue/types/vue' {
  interface Vue {
    $isErikoistuva: Function
    $isKouluttaja: Function
    $isVastuuhenkilo: Function
  }
}

Vue.use(new RolesPlugin())
