import axios from 'axios'

import {
  ErikoistuvaLaakari,
  Page,
  KayttajahallintaKayttaja,
  KayttajaLomake,
  UusiErikoistuvaLaakari,
  KayttajahallintaKayttajaListItem
} from '@/types'
import { resolveRolePath } from '@/utils/kayttajahallintaRolePathResolver'

export async function getErikoistuvatLaakarit(params: {
  page?: number
  size?: number
  sort: string | null
}) {
  const path = `${resolveRolePath()}/erikoistuvat-laakarit`
  return await axios.get<Page<KayttajahallintaKayttajaListItem>>(path, {
    params: {
      ...params
    }
  })
}

export async function getKayttaja(kayttajaId: number | string) {
  const path = `${resolveRolePath()}/kayttajat/${kayttajaId}`
  return await axios.get<KayttajahallintaKayttaja>(path)
}

export async function getKayttajaLomake() {
  const path = `${resolveRolePath()}/kayttaja-lomake`
  return await axios.get<KayttajaLomake>(path)
}

export async function postErikoistuvaLaakari(form: UusiErikoistuvaLaakari) {
  const path = `${resolveRolePath()}/erikoistuvat-laakarit`
  return await axios.post<ErikoistuvaLaakari>(path, form)
}

export async function putErikoistuvaLaakariInvitation(erikoistuvaLaakariId: number | string) {
  const path = `${resolveRolePath()}/erikoistuvat-laakarit/${erikoistuvaLaakariId}/kutsu`
  return await axios.put(path)
}
