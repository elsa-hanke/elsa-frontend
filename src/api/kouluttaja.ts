import axios from 'axios'

import {
  AloituskeskusteluLomake,
  KehittamistoimenpiteetLomake,
  KoulutussopimusLomake,
  LoppukeskusteluLomake,
  Suoritusarviointi,
  Seurantajakso,
  SeurantajaksonTiedot,
  ValiarviointiLomake,
  ErikoistujienSeuranta,
  KoejaksonVaihe,
  Arviointipyynto
} from '@/types'

export async function getKoejaksot() {
  const path = 'kouluttaja/koejaksot'
  return await axios.get(path)
}

export async function getKoulutussopimus(id: number) {
  const path = `/kouluttaja/koejakso/koulutussopimus/${id}`
  return await axios.get<KoulutussopimusLomake>(path)
}

export async function putKoulutussopimus(form: KoulutussopimusLomake) {
  const path = 'kouluttaja/koejakso/koulutussopimus'
  return await axios.put<KoulutussopimusLomake>(path, form)
}

export async function getAloituskeskustelu(id: number) {
  const path = `/kouluttaja/koejakso/aloituskeskustelu/${id}`
  return await axios.get<AloituskeskusteluLomake>(path)
}

export async function putAloituskeskustelu(form: AloituskeskusteluLomake) {
  const path = 'kouluttaja/koejakso/aloituskeskustelu'
  return await axios.put<AloituskeskusteluLomake>(path, form)
}

export async function getValiarviointi(id: number) {
  const path = `/kouluttaja/koejakso/valiarviointi/${id}`
  return await axios.get<ValiarviointiLomake>(path)
}

export async function putValiarviointi(form: ValiarviointiLomake) {
  const path = 'kouluttaja/koejakso/valiarviointi'
  return await axios.put<ValiarviointiLomake>(path, form)
}

export async function getKehittamistoimenpiteet(id: number) {
  const path = `/kouluttaja/koejakso/kehittamistoimenpiteet/${id}`
  return await axios.get<KehittamistoimenpiteetLomake>(path)
}

export async function putKehittamistoimenpiteet(form: KehittamistoimenpiteetLomake) {
  const path = 'kouluttaja/koejakso/kehittamistoimenpiteet'
  return await axios.put<KehittamistoimenpiteetLomake>(path, form)
}

export async function getLoppukeskustelu(id: number) {
  const path = `/kouluttaja/koejakso/loppukeskustelu/${id}`
  return await axios.get<LoppukeskusteluLomake>(path)
}

export async function putLoppukeskustelu(form: LoppukeskusteluLomake) {
  const path = 'kouluttaja/koejakso/loppukeskustelu'
  return await axios.put<LoppukeskusteluLomake>(path, form)
}

export async function putSuoritusarviointi(formData: FormData) {
  const path = 'kouluttaja/suoritusarvioinnit'
  return await axios.put<Suoritusarviointi>(path, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 120000
  })
}

export async function getSeurantajaksot() {
  const path = 'kouluttaja/seurantakeskustelut/seurantajaksot'
  return await axios.get(path)
}

export async function getSeurantajakso(seurantajaksoId: string) {
  const path = `kouluttaja/seurantakeskustelut/seurantajakso/${seurantajaksoId}`
  return await axios.get<Seurantajakso>(path)
}

export async function getSeurantajaksonTiedot(id: number) {
  const path = `kouluttaja/seurantakeskustelut/seurantajaksontiedot?id=${id}`
  return await axios.get<SeurantajaksonTiedot>(path)
}

export async function putSeurantajakso(form: Seurantajakso) {
  const path = `kouluttaja/seurantakeskustelut/seurantajakso/${form.id}`
  return await axios.put<Seurantajakso>(path, form)
}

export async function getErikoistujienSeuranta() {
  const path = `/kouluttaja/etusivu/erikoistujien-seuranta`
  return await axios.get<ErikoistujienSeuranta>(path)
}

export async function getEtusivuKoejaksot() {
  const path = `/kouluttaja/etusivu/koejaksot`
  return await axios.get<KoejaksonVaihe[]>(path)
}

export async function getEtusivuArviointipyynnot() {
  const path = `/kouluttaja/arviointipyynnot`
  return await axios.get<Arviointipyynto[]>(path)
}

export async function getEtusivuSeurantajaksot() {
  const path = `/kouluttaja/etusivu/seurantajaksot`
  return await axios.get<Seurantajakso[]>(path)
}
