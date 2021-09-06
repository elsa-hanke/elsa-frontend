import { ELSA_ROLE } from './roles'

export const clamp = (num: number, clamp: number, higher: number) =>
  higher ? Math.min(Math.max(num, clamp), higher) : Math.min(num, clamp)

export function checkCurrentRouteAndRedirect(router: any, path: any) {
  const {
    currentRoute: { path: curPath }
  } = router
  if (curPath !== path) router.push({ path })
}

export function getTitleFromAuthorities(authorities: string[]) {
  if (authorities.includes(ELSA_ROLE.ErikoistuvaLaakari)) {
    return 'erikoistuva-laakari'
  } else if (authorities.includes(ELSA_ROLE.Kouluttaja)) {
    return 'kouluttaja'
  } else if (authorities.includes(ELSA_ROLE.Lahikouluttaja)) {
    return 'lahikouluttaja'
  } else if (authorities.includes(ELSA_ROLE.Vastuuhenkilo)) {
    return 'vastuuhenkilo'
  }

  return undefined
}
