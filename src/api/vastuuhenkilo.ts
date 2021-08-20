import axios from 'axios'
import { KoulutussopimusLomake } from '@/types'

export async function getKoejaksot() {
  const path = 'vastuuhenkilo/koejaksot'
  return await axios.get(path)
}

export async function getKoulutussopimus(id: number) {
  const path = `/vastuuhenkilo/koejakso/koulutussopimus/${id}`
  return await axios.get(path)
}

export async function putKoulutussopimus(form: KoulutussopimusLomake) {
  const path = 'vastuuhenkilo/koejakso/koulutussopimus'
  return await axios.put(path, form)
}
