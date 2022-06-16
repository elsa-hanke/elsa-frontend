import axios from 'axios'

import {
  ErikoistujanEteneminenVirkailija,
  ErikoistujienSeurantaVirkailijaRajaimet,
  KoejaksonVaihe,
  VastuuhenkilonArvioLomake,
  Page
} from '@/types'

export async function getErikoistujienSeurantaRajaimet() {
  const path = '/virkailija/etusivu/erikoistujien-seuranta-rajaimet'
  return await axios.get<ErikoistujienSeurantaVirkailijaRajaimet>(path)
}

export async function getYliopisto() {
  const path = '/virkailija/etusivu/yliopisto'
  return await axios.get<string>(path)
}

export async function getKoejaksot() {
  const path = '/virkailija/koejaksot'
  return await axios.get(path)
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
  const path = 'vastuuhenkilo/koejakso/vastuuhenkilonarvio'
  return await axios.put<VastuuhenkilonArvioLomake>(path, form)
}
