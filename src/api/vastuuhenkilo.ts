import axios from 'axios'

import {
  KoulutussopimusLomake,
  VastuuhenkilonArvioLomake,
  AloituskeskusteluLomake,
  ValiarviointiLomake,
  KehittamistoimenpiteetLomake,
  LoppukeskusteluLomake,
  Suoritusarviointi
} from '@/types'

export async function getKoejaksot() {
  const path = 'vastuuhenkilo/koejaksot'
  return await axios.get(path)
}

export async function getKoulutussopimus(id: number) {
  const path = `/vastuuhenkilo/koejakso/koulutussopimus/${id}`
  return await axios.get<KoulutussopimusLomake>(path)
}

export async function getAloituskeskustelu(id: number) {
  const path = `/vastuuhenkilo/koejakso/aloituskeskustelu/${id}`
  return await axios.get<AloituskeskusteluLomake>(path)
}

export async function getValiarviointi(id: number) {
  const path = `/vastuuhenkilo/koejakso/valiarviointi/${id}`
  return await axios.get<ValiarviointiLomake>(path)
}

export async function getKehittamistoimenpiteet(id: number) {
  const path = `/vastuuhenkilo/koejakso/kehittamistoimenpiteet/${id}`
  return await axios.get<KehittamistoimenpiteetLomake>(path)
}

export async function getLoppukeskustelu(id: number) {
  const path = `/vastuuhenkilo/koejakso/loppukeskustelu/${id}`
  return await axios.get<LoppukeskusteluLomake>(path)
}

export async function putKoulutussopimus(form: KoulutussopimusLomake) {
  const path = 'vastuuhenkilo/koejakso/koulutussopimus'
  return await axios.put<KoulutussopimusLomake>(path, form)
}

export async function getVastuuhenkilonArvio(id: number) {
  const path = `/vastuuhenkilo/koejakso/vastuuhenkilonarvio/${id}`
  return await axios.get<VastuuhenkilonArvioLomake>(path)
}

export async function putVastuuhenkilonArvio(form: VastuuhenkilonArvioLomake) {
  const path = 'vastuuhenkilo/koejakso/vastuuhenkilonarvio'
  return await axios.put<VastuuhenkilonArvioLomake>(path, form)
}

export async function putSuoritusarviointi(formData: FormData) {
  const path = 'vastuuhenkilo/suoritusarvioinnit'
  return await axios.put<Suoritusarviointi>(path, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 120000
  })
}
