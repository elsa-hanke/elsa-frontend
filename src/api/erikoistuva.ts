import axios from 'axios'
import {
  AloituskeskusteluLomake,
  KehittamistoimenpiteetLomake,
  KoulutussopimusLomake,
  LoppukeskusteluLomake,
  ValiarviointiLomake,
  VastuuhenkilonArvioLomake
} from '@/types'

export async function putKayttooikeushakemus(value: any) {
  const path = 'erikoistuva-laakari/kayttooikeushakemus'
  return await axios.put(path, value)
}

export async function getKoejakso() {
  const path = '/erikoistuva-laakari/koejakso'
  return await axios.get(path)
}

export async function postKoulutussopimus(form: KoulutussopimusLomake) {
  const path = 'erikoistuva-laakari/koejakso/koulutussopimus'
  return await axios.post(path, form)
}

export async function putKoulutussopimus(form: KoulutussopimusLomake) {
  const path = 'erikoistuva-laakari/koejakso/koulutussopimus'
  return await axios.put(path, form)
}

export async function postAloituskeskustelu(form: AloituskeskusteluLomake) {
  const path = 'erikoistuva-laakari/koejakso/aloituskeskustelu'
  return await axios.post(path, form)
}

export async function putAloituskeskustelu(form: AloituskeskusteluLomake) {
  const path = 'erikoistuva-laakari/koejakso/aloituskeskustelu'
  return await axios.put(path, form)
}

export async function postValiarviointi(form: ValiarviointiLomake) {
  const path = 'erikoistuva-laakari/koejakso/valiarviointi'
  return await axios.post(path, form)
}

export async function putValiarviointi(form: ValiarviointiLomake) {
  const path = 'erikoistuva-laakari/koejakso/valiarviointi'
  return await axios.put(path, form)
}

export async function postKehittamistoimenpiteet(form: KehittamistoimenpiteetLomake) {
  const path = 'erikoistuva-laakari/koejakso/kehittamistoimenpiteet'
  return await axios.post(path, form)
}

export async function putKehittamistoimenpiteet(form: KehittamistoimenpiteetLomake) {
  const path = 'erikoistuva-laakari/koejakso/kehittamistoimenpiteet'
  return await axios.put(path, form)
}

export async function postLoppukeskustelu(form: LoppukeskusteluLomake) {
  const path = 'erikoistuva-laakari/koejakso/loppukeskustelu'
  return await axios.post(path, form)
}

export async function putLoppukeskustelu(form: LoppukeskusteluLomake) {
  const path = 'erikoistuva-laakari/koejakso/loppukeskustelu'
  return await axios.put(path, form)
}

export async function postVastuuhenkilonArvio(form: VastuuhenkilonArvioLomake) {
  const path = 'erikoistuva-laakari/koejakso/vastuuhenkilonarvio'
  return await axios.post(path, form)
}

export async function putVastuuhenkilonArvio(form: VastuuhenkilonArvioLomake) {
  const path = 'erikoistuva-laakari/koejakso/vastuuhenkilonarvio'
  return await axios.put(path, form)
}

export async function getKouluttajat() {
  const path = '/kouluttajat'
  return await axios.get(path)
}

export async function getTyoskentelyjakso(id: string) {
  const path = `erikoistuva-laakari/tyoskentelyjaksot/${id}`
  return await axios.get(path)
}

export async function getTyoskentelyjaksoLomake() {
  const path = 'erikoistuva-laakari/tyoskentelyjakso-lomake'
  return await axios.get(path)
}

export async function putTyoskentelyjakso(formData: FormData) {
  const path = 'erikoistuva-laakari/tyoskentelyjaksot'
  await axios.put(path, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    timeout: 120000
  })
}

export async function deleteTyoskentelyjakso(id: string) {
  const path = `erikoistuva-laakari/tyoskentelyjaksot/${id}`
  await axios.delete(path)
}

export async function getKoulutussopimusLomake() {
  const path = 'erikoistuva-laakari/koulutussopimus-lomake'
  return await axios.get(path)
}

export async function getYliopistot() {
  const path = '/yliopistot'
  return await axios.get(path)
}

export async function getVastuuhenkilonArvioLomake() {
  const path = '/erikoistuva-laakari/vastuuhenkilonarvio-lomake'
  return await axios.get(path)
}
