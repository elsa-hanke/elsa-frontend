import axios from 'axios'

import store from '@/store'
import { OmatTiedotLomake } from '@/types'
import { setCookie, getCookie } from '@/utils/cookies'
import { wrapToFormData } from '@/utils/functions'

export const ELSA_API_LOCATION =
  process.env.NODE_ENV === 'production'
    ? `${window.location.protocol}//api.${window.location.hostname}${
        window.location.port ? ':' + window.location.port : ''
      }`
    : ''
axios.defaults.baseURL = `${ELSA_API_LOCATION}/api/`
axios.defaults.withCredentials = true
axios.interceptors.request.use((req) => {
  if (window.location.hostname !== 'testi.elsapalvelu.fi') {
    return req
  }
  let accessKey
  const queryString = window.location.search
  const urlParams = new URLSearchParams(queryString)
  accessKey = urlParams.get('accessKey')
  if (accessKey) {
    setCookie('ACCESS-KEY', accessKey, 60 * 60 * 24 * 3650)
  } else {
    accessKey = getCookie('ACCESS-KEY')
  }

  if (accessKey) {
    req.headers.common['X-Access-Key'] = accessKey
  }

  return req
})
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
          window.location.href = '/kirjautuminen'
        }
        break
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
