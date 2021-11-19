import { ELSA_ROLE } from './roles'

import { Kayttaja } from '@/types'

export function decorate(vue: Vue, kouluttajatAndVastuuhenkilot?: Kayttaja[]): Kayttaja[] {
  return kouluttajatAndVastuuhenkilot
    ? kouluttajatAndVastuuhenkilot?.map((kayttaja: Kayttaja) => {
        if (kayttaja.authorities.some((a: any) => a.name === ELSA_ROLE.Vastuuhenkilo)) {
          const newKayttaja = Object.assign({}, kayttaja)
          newKayttaja.nimi = `${kayttaja.nimi} (${vue.$t('vastuuhenkilo')})`
          return newKayttaja
        } else {
          return kayttaja
        }
      })
    : []
}
