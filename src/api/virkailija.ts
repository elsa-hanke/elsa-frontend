import axios from 'axios'

import {
  ErikoistujanEteneminenVirkailija,
  ErikoistujienSeurantaVirkailijaRajaimet,
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
