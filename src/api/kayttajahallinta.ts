import axios from 'axios'

import {
  ErikoistuvaLaakari,
  Page,
  KayttajahallintaKayttajaWrapper,
  ErikoistuvaLaakariLomake,
  UusiErikoistuvaLaakari,
  KayttajahallintaKayttajaListItem,
  KayttajahallintaRajaimet,
  KayttajahallintaUpdateKayttaja,
  KayttajahallintaVastuuhenkilonTehtavatLomake,
  KayttajahallintaNewKayttaja,
  VastuuhenkiloLomake
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

export async function getKouluttajat(params: {
  page?: number
  size?: number
  sort: string | null
  'nimi.contains'?: string
  'erikoisalaId.equals'?: number
}) {
  const path = `${resolveRolePath()}/kouluttajat`
  return await axios.get<Page<KayttajahallintaKayttajaListItem>>(path, {
    params: {
      ...params
    }
  })
}

export async function getVirkailijat(params: {
  page?: number
  size?: number
  sort: string | null
  'nimi.contains'?: string
}) {
  const path = `${resolveRolePath()}/virkailijat`
  return await axios.get<Page<KayttajahallintaKayttajaListItem>>(path, {
    params: {
      ...params
    }
  })
}

export async function getErikoistuvaLaakari(kayttajaId: number | string) {
  const path = `${resolveRolePath()}/erikoistuvat-laakarit/${kayttajaId}`
  return await axios.get<KayttajahallintaKayttajaWrapper>(path)
}

export async function getKayttaja(kayttajaId: number | string) {
  const path = `${resolveRolePath()}/kayttajat/${kayttajaId}`
  return await axios.get<KayttajahallintaKayttajaWrapper>(path)
}

export async function getErikoistuvaLaakariLomake() {
  const path = `${resolveRolePath()}/erikoistuva-laakari-lomake`
  return await axios.get<ErikoistuvaLaakariLomake>(path)
}

export async function getVastuuhenkiloLomake() {
  const path = `${resolveRolePath()}/vastuuhenkilo-lomake`
  return await axios.get<VastuuhenkiloLomake>(path)
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

export async function patchErikoistuvaLaakari(
  userId: string,
  form: KayttajahallintaUpdateKayttaja
) {
  const path = `${resolveRolePath()}/erikoistuvat-laakarit/${userId}`
  return await axios.patch(path, form)
}

export async function getVastuuhenkilonTehtavatForm(yliopistoId: number) {
  const path = `${resolveRolePath()}/vastuuhenkilon-tehtavat-lomake/${yliopistoId}`
  return await axios.get<KayttajahallintaVastuuhenkilonTehtavatLomake>(path)
}

export async function putVastuuhenkilo(kayttajaId: number, form: KayttajahallintaUpdateKayttaja) {
  const path = `${resolveRolePath()}/vastuuhenkilot/${kayttajaId}`
  return await axios.put<KayttajahallintaKayttajaWrapper>(path, form)
}

export async function postVastuuhenkilo(form: KayttajahallintaNewKayttaja) {
  const path = `${resolveRolePath()}/vastuuhenkilot`
  return await axios.post<KayttajahallintaKayttajaWrapper>(path, form)
}
