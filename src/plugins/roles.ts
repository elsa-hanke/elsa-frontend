/* eslint-disable @typescript-eslint/ban-types */
import Vue from 'vue'

import store from '@/store'
import { Opintooikeus } from '@/types'
import { ERIKOISALA_YEK_ID } from '@/utils/constants'
import { ELSA_ROLE } from '@/utils/roles'

export class RolesPlugin {
  public install(vue: typeof Vue) {
    vue.prototype.$isErikoistuva = (): boolean => {
      const data = store.getters['auth/account']
      const { opintooikeudet, opintooikeusKaytossaId } = data.erikoistuvaLaakari
      const opintooikeus = opintooikeudet.filter(
        (oo: Opintooikeus) => oo.id === opintooikeusKaytossaId
      )
      if (opintooikeus.length === 0) {
        return store.getters['auth/account'].activeAuthority === ELSA_ROLE.ErikoistuvaLaakari
      }
      return (
        store.getters['auth/account'].activeAuthority === ELSA_ROLE.ErikoistuvaLaakari &&
        opintooikeus[0].erikoisalaId !== ERIKOISALA_YEK_ID
      )
    }

    vue.prototype.$isYekErikoistuva = (): boolean => {
      const data = store.getters['auth/account']
      const { opintooikeudet, opintooikeusKaytossaId } = data.erikoistuvaLaakari
      const opintooikeus = opintooikeudet.filter(
        (oo: Opintooikeus) => oo.id === opintooikeusKaytossaId
      )
      if (opintooikeus.length === 0) {
        return false
      }
      return (
        store.getters['auth/account'].activeAuthority === ELSA_ROLE.ErikoistuvaLaakari &&
        opintooikeus[0].erikoisalaId === ERIKOISALA_YEK_ID
      )
    }

    vue.prototype.$isKouluttaja = (): boolean => {
      return store.getters['auth/account'].activeAuthority === ELSA_ROLE.Kouluttaja
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
    $isYekErikoistuva: Function
    $isKouluttaja: Function
    $isVastuuhenkilo: Function
    $isTerveyskeskuskoulutusjaksoVastuuhenkilo: Function
    $isTekninenPaakayttaja: Function
    $isVirkailija: Function
  }
}

Vue.use(new RolesPlugin())
