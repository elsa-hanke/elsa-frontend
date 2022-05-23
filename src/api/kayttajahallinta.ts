import axios from 'axios'

import {
  ErikoistuvaLaakari,
  Page,
  KayttajahallintaKayttaja,
  KayttajaLomake,
  UusiErikoistuvaLaakari,
  KayttajahallintaKayttajaListItem,
  KayttajahallintaRajaimet,
  KayttajahallintaUpdateKayttaja
} from '@/types'
import { resolveRolePath } from '@/utils/kayttajahallintaRolePathResolver'

export async function getErikoistuvatLaakarit(params: {
  page?: number
  size?: number
  sort: string | null
  'nimi.contains'?: string
  'erikoisalaId.equals'?: number
  'useaOpintooikeus.equals'?: boolean
}) {
  const path = `${resolveRolePath()}/erikoistuvat-laakarit`
  return await axios.get<Page<KayttajahallintaKayttajaListItem>>(path, {
    params: {
      ...params
    }
  })
}

export async function getVastuuhenkilot(params: {
  page?: number
  size?: number
  sort: string | null
  'nimi.contains'?: string
  'erikoisalaId.equals'?: number
}) {
  const path = `${resolveRolePath()}/vastuuhenkilot`
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

export async function activateKayttaja(kayttajaId: number) {
  const path = `${resolveRolePath()}/kayttajat/${kayttajaId}/aktivoi`
  return await axios.patch(path)
}

export async function passivateKayttaja(kayttajaId: number) {
  const path = `${resolveRolePath()}/kayttajat/${kayttajaId}/passivoi`
  return await axios.patch(path)
}

export async function getKayttajahallintaRajaimet() {
  const path = `${resolveRolePath()}/kayttajat/rajaimet`
  return await axios.get<KayttajahallintaRajaimet>(path)
}

export async function patchSahkopostiosoite(userId: string, form: KayttajahallintaUpdateKayttaja) {
  const path = `${resolveRolePath()}/kayttajat/${userId}`
  return await axios.patch(path, form)
}
