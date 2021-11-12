import axios from 'axios'

import {
  AloituskeskusteluLomake,
  KehittamistoimenpiteetLomake,
  KoulutussopimusLomake,
  LoppukeskusteluLomake,
  Suoritusarviointi,
  ValiarviointiLomake
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
