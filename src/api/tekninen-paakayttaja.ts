import axios from 'axios'

import { Page, KayttajahallintaKayttajaListItem } from '@/types'

export async function getErikoistuvatLaakarit(params: {
  page?: number
  size?: number
  sort: string | null
}) {
  const path = 'tekninen-paakayttaja/erikoistuvat-laakarit'
  return await axios.get<Page<KayttajahallintaKayttajaListItem>>(path, {
    params: {
      ...params
    }
  })
}
