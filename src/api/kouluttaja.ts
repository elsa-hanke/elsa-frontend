import axios from 'axios'

import {
  AloituskeskusteluLomake,
  KehittamistoimenpiteetLomake,
  KoulutussopimusLomake,
  LoppukeskusteluLomake,
  ValiarviointiLomake
} from '@/types'

export async function getKoejaksot() {
  const path = 'kouluttaja/koejaksot'
  return await axios.get(path)
}

export async function getKoulutussopimus(id: number) {
  const path = `/kouluttaja/koejakso/koulutussopimus/${id}`
  return await axios.get(path)
}

export async function putKoulutussopimus(form: KoulutussopimusLomake) {
  const path = 'kouluttaja/koejakso/koulutussopimus'
  return await axios.put(path, form)
}

export async function getAloituskeskustelu(id: number) {
  const path = `/kouluttaja/koejakso/aloituskeskustelu/${id}`
  return await axios.get(path)
}

export async function putAloituskeskustelu(form: AloituskeskusteluLomake) {
  const path = 'kouluttaja/koejakso/aloituskeskustelu'
  return await axios.put(path, form)
}

export async function getValiarviointi(id: number) {
  const path = `/kouluttaja/koejakso/valiarviointi/${id}`
  return await axios.get(path)
}

export async function putValiarviointi(form: ValiarviointiLomake) {
  const path = 'kouluttaja/koejakso/valiarviointi'
  return await axios.put(path, form)
}

export async function getKehittamistoimenpiteet(id: number) {
  const path = `/kouluttaja/koejakso/kehittamistoimenpiteet/${id}`
  return await axios.get(path)
}

export async function putKehittamistoimenpiteet(form: KehittamistoimenpiteetLomake) {
  const path = 'kouluttaja/koejakso/kehittamistoimenpiteet'
  return await axios.put(path, form)
}

export async function getLoppukeskustelu(id: number) {
  const path = `/kouluttaja/koejakso/loppukeskustelu/${id}`
  return await axios.get(path)
}

export async function putLoppukeskustelu(form: LoppukeskusteluLomake) {
  const path = 'kouluttaja/koejakso/loppukeskustelu'
  return await axios.put(path, form)
}
