import { OmatTiedotLomake } from '@/types'
import axios from 'axios'

export const ELSA_API_LOCATION =
  process.env.NODE_ENV === 'production'
    ? `${window.location.protocol}//api.${window.location.hostname}${
        window.location.port ? ':' + window.location.port : ''
      }`
    : ''
axios.defaults.baseURL = `${ELSA_API_LOCATION}/api/`
axios.defaults.withCredentials = true

export async function getKayttaja() {
  return await axios.get('kayttaja')
}

export async function putKayttaja(form: OmatTiedotLomake) {
  const path = 'kayttaja'
  return await axios.put(path, form)
}
