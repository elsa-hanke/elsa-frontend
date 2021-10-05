import axios from 'axios'

import router from '@/router'
import store from '@/store'
import { OmatTiedotLomake } from '@/types'
import { wrapToFormData } from '@/utils/functions'

export const ELSA_API_LOCATION =
  process.env.NODE_ENV === 'production'
    ? `${window.location.protocol}//api.${window.location.hostname}${
        window.location.port ? ':' + window.location.port : ''
      }`
    : ''
axios.defaults.baseURL = `${ELSA_API_LOCATION}/api/`
axios.defaults.withCredentials = true
axios.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    switch (error.response.status) {
      case 401:
      case 403:
        if (window.location.pathname !== '/kirjautuminen' && store.getters['auth/isLoggedIn']) {
          store.dispatch('auth/logout')
        }
        break
      case 404:
        router.replace({ path: '/sivua-ei-loytynyt' })
    }
    return Promise.reject(error)
  }
)

export async function getKayttaja() {
  return await axios.get('kayttaja')
}

export async function putKayttaja(form: OmatTiedotLomake) {
  return await axios.put('kayttaja', wrapToFormData(form), {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}
