import { ELSA_ROLE } from './roles'

export function decorate(vue: Vue, kouluttajatAndVastuuhenkilot: any[]) {
  return kouluttajatAndVastuuhenkilot?.map((item: any) => {
    if (item.authorities.some((a: any) => a.name === ELSA_ROLE.Vastuuhenkilo)) {
      const newItem = Object.assign({}, item)
      newItem.nimi = `${item.nimi} (${vue.$t('vastuuhenkilo')})`
      return newItem
    } else {
      return item
    }
  })
}
