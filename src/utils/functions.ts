import Vue from 'vue'

import { ELSA_ROLE } from './roles'

export const clamp = (num: number, clamp: number, higher: number) =>
  higher ? Math.min(Math.max(num, clamp), higher) : Math.min(num, clamp)

export function checkCurrentRouteAndRedirect(router: any, path: any) {
  const {
    currentRoute: { path: curPath }
  } = router
  if (curPath !== path) router.push({ path })
}

export function getTitleFromAuthorities(vue: Vue, authorities: string[]) {
  if (authorities.includes(ELSA_ROLE.ErikoistuvaLaakari)) {
    return vue.$t('erikoistuja')
  } else if (authorities.includes(ELSA_ROLE.Kouluttaja)) {
    return vue.$t('kouluttaja')
  } else if (authorities.includes(ELSA_ROLE.Vastuuhenkilo)) {
    return vue.$t('vastuuhenkilo')
  } else if (authorities.includes(ELSA_ROLE.TekninenPaakayttaja)) {
    return vue.$t('tekninen-paakayttaja')
  } else if (authorities.includes(ELSA_ROLE.OpintohallinnonVirkailija)) {
    return vue.$t('virkailija')
  }

  return undefined
}

export function wrapToFormData(form: { [key: string]: any }): FormData {
  const formData = new FormData()
  for (const [key, value] of Object.entries(form)) {
    if (value !== null) {
      formData.append(key, value)
    }
  }
  return formData
}
