import axios from 'axios'

import {
  ErikoistuvaLaakari,
  KayttajahallintaKayttaja,
  KayttajaLomake,
  UusiErikoistuvaLaakari
} from '@/types'

export async function getErikoistuvatLaakarit() {
  const path = 'tekninen-paakayttaja/erikoistuvat-laakarit'
  return await axios.get<ErikoistuvaLaakari[]>(path)
}

export async function getKayttaja(kayttajaId: number | string) {
  const path = `tekninen-paakayttaja/kayttajat/${kayttajaId}`
  return await axios.get<KayttajahallintaKayttaja>(path)
}

export async function getKayttajaLomake() {
  const path = `tekninen-paakayttaja/kayttaja-lomake`
  return await axios.get<KayttajaLomake>(path)
}

export async function postErikoistuvaLaakari(form: UusiErikoistuvaLaakari) {
  const path = 'tekninen-paakayttaja/erikoistuvat-laakarit'
  return await axios.post<ErikoistuvaLaakari>(path, form)
}

export async function putErikoistuvaLaakariInvitation(erikoistuvaLaakariId: number | string) {
  const path = `tekninen-paakayttaja/erikoistuvat-laakarit/${erikoistuvaLaakariId}/invite`
  return await axios.put(path)
}
