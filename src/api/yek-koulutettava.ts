import axios from 'axios'

import {
  LaillistamistiedotLomakeKoulutettava,
  Tyoskentelyjakso,
  TyoskentelyjaksoLomake
} from '@/types'
import { wrapToFormData } from '@/utils/functions'

export async function getTyoskentelyjakso(id: number | string) {
  const path = `yek-koulutettava/tyoskentelyjaksot/${id}`
  return await axios.get<Tyoskentelyjakso>(path)
}

export async function getTyoskentelyjaksoLomake() {
  const path = 'yek-koulutettava/tyoskentelyjakso-lomake'
  return await axios.get<TyoskentelyjaksoLomake>(path)
}

export async function putTyoskentelyjakso(formData: FormData) {
  const path = 'yek-koulutettava/tyoskentelyjaksot'
  await axios.put(path, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 120000
  })
}

export async function putKoulutettavaLaillistamispaiva(form: LaillistamistiedotLomakeKoulutettava) {
  return await axios.put('yek-koulutettava/laillistamispaiva', wrapToFormData(form), {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}
