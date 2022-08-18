import axios from 'axios'

import {
  Page,
  KayttajahallintaKayttajaListItem,
  Erikoisala,
  Opintoopas,
  Arviointiasteikko,
  ArvioitavanKokonaisuudenKategoria,
  ArvioitavanKokonaisuudenKategoriaWithErikoisala,
  ArvioitavaKokonaisuusWithErikoisala,
  SuoritteenKategoria,
  SuoritteenKategoriaWithErikoisala,
  SuoriteWithErikoisala
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

export async function getArvioitavanKokonaisuudenKategoriat(erikoisalaId: string) {
  const path = `/tekninen-paakayttaja/erikoisalat/${erikoisalaId}/arvioitavankokonaisuudenkategoriat`
  return await axios.get<ArvioitavanKokonaisuudenKategoria[]>(path)
}

export async function getArvioitavatKokonaisuudet(erikoisalaId: string) {
  const path = `/tekninen-paakayttaja/erikoisalat/${erikoisalaId}/arvioitavatkokonaisuudet`
  return await axios.get<ArvioitavanKokonaisuudenKategoria[]>(path)
}

export async function getArvioitavanKokonaisuudenKategoria(id: string) {
  const path = `/tekninen-paakayttaja/arvioitavankokonaisuudenkategoria/${id}`
  return await axios.get<ArvioitavanKokonaisuudenKategoriaWithErikoisala>(path)
}

export async function postArvioitavanKokonaisuudenKategoria(
  form: ArvioitavanKokonaisuudenKategoriaWithErikoisala
) {
  const path = `/tekninen-paakayttaja/arvioitavankokonaisuudenkategoria`
  return await axios.post<ArvioitavanKokonaisuudenKategoriaWithErikoisala>(path, form)
}

export async function putArvioitavanKokonaisuudenKategoria(
  form: ArvioitavanKokonaisuudenKategoriaWithErikoisala
) {
  const path = `/tekninen-paakayttaja/arvioitavankokonaisuudenkategoria`
  return await axios.put<ArvioitavanKokonaisuudenKategoriaWithErikoisala>(path, form)
}

export async function getArvioitavaKokonaisuus(id: string) {
  const path = `/tekninen-paakayttaja/arvioitavakokonaisuus/${id}`
  return await axios.get<ArvioitavaKokonaisuusWithErikoisala>(path)
}

export async function postArvioitavaKokonaisuus(form: ArvioitavaKokonaisuusWithErikoisala) {
  const path = `/tekninen-paakayttaja/arvioitavakokonaisuus`
  return await axios.post<ArvioitavaKokonaisuusWithErikoisala>(path, form)
}

export async function putArvioitavaKokonaisuus(form: ArvioitavaKokonaisuusWithErikoisala) {
  const path = `/tekninen-paakayttaja/arvioitavakokonaisuus`
  return await axios.put<ArvioitavaKokonaisuusWithErikoisala>(path, form)
}

export async function getSuoritteenKategoriat(erikoisalaId: string) {
  const path = `/tekninen-paakayttaja/erikoisalat/${erikoisalaId}/suoritteenkategoriat`
  return await axios.get<SuoritteenKategoria[]>(path)
}

export async function getSuoritteet(erikoisalaId: string) {
  const path = `/tekninen-paakayttaja/erikoisalat/${erikoisalaId}/suoritteet`
  return await axios.get<SuoritteenKategoria[]>(path)
}

export async function getSuoritteenKategoria(id: string) {
  const path = `/tekninen-paakayttaja/suoritteenkategoria/${id}`
  return await axios.get<SuoritteenKategoriaWithErikoisala>(path)
}

export async function postSuoritteenKategoria(form: SuoritteenKategoriaWithErikoisala) {
  const path = `/tekninen-paakayttaja/suoritteenkategoria`
  return await axios.post<SuoritteenKategoriaWithErikoisala>(path, form)
}

export async function putSuoritteenKategoria(form: SuoritteenKategoriaWithErikoisala) {
  const path = `/tekninen-paakayttaja/suoritteenkategoria`
  return await axios.put<SuoritteenKategoriaWithErikoisala>(path, form)
}

export async function getSuorite(id: string) {
  const path = `/tekninen-paakayttaja/suorite/${id}`
  return await axios.get<SuoriteWithErikoisala>(path)
}

export async function postSuorite(form: SuoriteWithErikoisala) {
  const path = `/tekninen-paakayttaja/suorite`
  return await axios.post<SuoriteWithErikoisala>(path, form)
}

export async function putSuorite(form: SuoriteWithErikoisala) {
  const path = `/tekninen-paakayttaja/suorite`
  return await axios.put<SuoriteWithErikoisala>(path, form)
}
