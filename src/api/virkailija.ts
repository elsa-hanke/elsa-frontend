import axios from 'axios'

import {
  ErikoistujanEteneminenVirkailija,
  ErikoistujienSeurantaVirkailijaRajaimet,
  KoejaksonVaihe,
  VastuuhenkilonArvioLomake,
  Page,
  Erikoisala
} from '@/types'

export async function getErikoistujienSeurantaRajaimet() {
  const path = '/virkailija/etusivu/erikoistujien-seuranta-rajaimet'
  return await axios.get<ErikoistujienSeurantaVirkailijaRajaimet>(path)
}

export async function getYliopisto() {
  const path = '/virkailija/etusivu/yliopisto'
  return await axios.get<string>(path)
}

export async function getKoejaksot(params: {
  page?: number
  size?: number
  sort: string | null
  'erikoistujanNimi.contains'?: string
  'erikoisalaId.equals'?: number
  avoin?: boolean
}) {
  return await axios.get<Page<KoejaksonVaihe>>('/virkailija/koejaksot', {
    params: {
      ...params
    }
  })
}

export async function getVastuuhenkilonArvio(id: number) {
  const path = `/virkailija/koejakso/vastuuhenkilonarvio/${id}`
  return await axios.get<VastuuhenkilonArvioLomake>(path)
}

export async function getErikoistujienSeurantaList(params: {
  page?: number
  size?: number
  sort: string | null
  'nimi.contains'?: string
  'erikoisalaId.equals'?: number
  'asetusId.equals'?: number
}) {
  return await axios.get<Page<ErikoistujanEteneminenVirkailija>>(
    '/virkailija/etusivu/erikoistujien-seuranta',
    {
      params: {
        ...params
      }
    }
  )
}

export async function getEtusivuKoejaksot() {
  const path = '/virkailija/etusivu/koejaksot'
  return await axios.get<KoejaksonVaihe[]>(path)
}

export async function putVastuuhenkilonArvio(form: VastuuhenkilonArvioLomake) {
  const path = '/virkailija/koejakso/vastuuhenkilonarvio'
  return await axios.put<VastuuhenkilonArvioLomake>(path, form)
}

export async function getErikoisalat() {
  const path = `/virkailija/erikoisalat`
  return await axios.get<Erikoisala[]>(path)
}
