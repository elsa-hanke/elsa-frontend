/* eslint-disable @typescript-eslint/ban-types */
import Vue from 'vue'

import store from '@/store'
import { Opintooikeus } from '@/types'
import { ERIKOISALA_YEK_ID } from '@/utils/constants'
import { ELSA_ROLE } from '@/utils/roles'

export class RolesPlugin {
  public install(vue: typeof Vue) {
    vue.prototype.$isErikoistuva = (): boolean => {
      return store.getters['auth/account'].activeAuthority === ELSA_ROLE.ErikoistuvaLaakari
    }

    vue.prototype.$isYekKoulutettava = (): boolean => {
      // return store.getters['auth/account'].activeAuthority === ELSA_ROLE.YEKKoulutettava
      const data = store.getters['auth/account']
      if (!data.erikoistuvaLaakari) {
        return false
      }
      const { opintooikeudet, opintooikeusKaytossaId } = data.erikoistuvaLaakari
      const opintooikeus = opintooikeudet.filter(
        (oo: Opintooikeus) => oo.id === opintooikeusKaytossaId
      )
      if (opintooikeus.length === 0) {
        return false
      }
      return (
        store.getters['auth/account'].activeAuthority === ELSA_ROLE.YEKKoulutettava &&
        opintooikeus[0].erikoisalaId === ERIKOISALA_YEK_ID
      )
    }

    vue.prototype.$isKouluttaja = (): boolean => {
      return store.getters['auth/account'].activeAuthority === ELSA_ROLE.Kouluttaja
    }

    vue.prototype.$hasKouluttajaRole = (): boolean => {
      const authorities = store.getters['auth/account'].authorities
      return authorities.includes(ELSA_ROLE.Kouluttaja)
    }

    vue.prototype.$isVastuuhenkilo = (): boolean => {
      return store.getters['auth/account'].activeAuthority === ELSA_ROLE.Vastuuhenkilo
    }

    vue.prototype.$isTerveyskeskuskoulutusjaksoVastuuhenkilo = (): boolean => {
      const data = store.getters['auth/account']
      return (
        data.activeAuthority === ELSA_ROLE.Vastuuhenkilo &&
        data.terveyskeskuskoulutusjaksoVastuuhenkilo
      )
    }

    vue.prototype.$isTekninenPaakayttaja = (): boolean => {
      return store.getters['auth/account'].activeAuthority === ELSA_ROLE.TekninenPaakayttaja
    }

    vue.prototype.$isVirkailija = (): boolean => {
      return store.getters['auth/account'].activeAuthority === ELSA_ROLE.OpintohallinnonVirkailija
    }
  }
}

declare module 'vue/types/vue' {
  interface Vue {
    $isErikoistuva: Function
    $isYekKoulutettava: Function
    $isKouluttaja: Function
    $isVastuuhenkilo: Function
    $isTerveyskeskuskoulutusjaksoVastuuhenkilo: Function
    $isTekninenPaakayttaja: Function
    $isVirkailija: Function
    $hasKouluttajaRole: Function
  }
}

Vue.use(new RolesPlugin())
