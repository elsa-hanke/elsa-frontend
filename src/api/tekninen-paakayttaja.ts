import axios from 'axios'

import {
  Page,
  KayttajahallintaKayttajaListItem,
  Erikoisala,
  Opintoopas,
  Arviointiasteikko
} from '@/types'

export async function getErikoistuvatLaakarit(params: {
  page?: number
  size?: number
  sort: string | null
}) {
  const path = 'tekninen-paakayttaja/erikoistuvat-laakarit'
  return await axios.get<Page<KayttajahallintaKayttajaListItem>>(path, {
    params: {
      ...params
    }
  })
}

export async function getErikoisalat() {
  const path = `/tekninen-paakayttaja/erikoisalat`
  return await axios.get<Erikoisala[]>(path)
}

export async function getErikoisala(id: string) {
  const path = `/tekninen-paakayttaja/erikoisalat/${id}`
  return await axios.get<Erikoisala>(path)
}

export async function getOpintooppaat(erikoisalaId: string) {
  const path = `/tekninen-paakayttaja/erikoisalat/${erikoisalaId}/oppaat`
  return await axios.get<Opintoopas[]>(path)
}

export async function getUusinOpas(erikoisalaId: string) {
  const path = `/tekninen-paakayttaja/erikoisalat/${erikoisalaId}/uusinopas`
  return await axios.get<Opintoopas>(path)
}

export async function getOpinoopas(id: string) {
  const path = `/tekninen-paakayttaja/opintoopas/${id}`
  return await axios.get<Opintoopas>(path)
}

export async function postOpinoopas(form: Opintoopas) {
  const path = `/tekninen-paakayttaja/opintoopas`
  return await axios.post<Opintoopas>(path, form)
}

export async function putOpinoopas(form: Opintoopas) {
  const path = `/tekninen-paakayttaja/opintoopas`
  return await axios.put<Opintoopas>(path, form)
}

export async function getArviointiasteikot() {
  const path = `/tekninen-paakayttaja/arviointiasteikot`
  return await axios.get<Arviointiasteikko[]>(path)
}
