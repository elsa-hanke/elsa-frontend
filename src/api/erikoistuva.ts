import axios from 'axios'
import { AloituskeskusteluLomake, KoulutussopimusLomake, ValiarviointiLomake } from '@/types'

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

export async function getKouluttajat() {
  const path = '/kouluttajat'
  return await axios.get(path)
}

export async function getTyoskentelyjakso(id: string) {
  return await axios.get(`erikoistuva-laakari/tyoskentelyjaksot/${id}`)
}

export async function getTyoskentelyjaksoLomake() {
  return await axios.get(`erikoistuva-laakari/tyoskentelyjakso-lomake`)
}

export async function putTyoskentelyjakso(formData: FormData) {
  await axios.put('erikoistuva-laakari/tyoskentelyjaksot', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    timeout: 120000
  })
}

export async function deleteTyoskentelyjakso(id: string) {
  await axios.delete(`erikoistuva-laakari/tyoskentelyjaksot/${id}`)
}

export async function getKoulutussopimusLomake() {
  const path = 'erikoistuva-laakari/koulutussopimus-lomake'
  return await axios.get(path)
}

export async function getYliopistot() {
  const path = '/yliopistot'
  return await axios.get(path)
}
