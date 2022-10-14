import axios from 'axios'

import {
  ErikoistujanEteneminenVirkailija,
  ErikoistujienSeurantaVirkailijaRajaimet,
  KoejaksonVaihe,
  VastuuhenkilonArvioLomake,
  Page,
  Erikoisala,
  TerveyskeskuskoulutusjaksonHyvaksyminen,
  TerveyskeskuskoulutusjaksonVaihe,
  ValmistumispyyntoListItem,
  ValmistumispyyntoVirkailijanTarkistus,
  ValmistumispyynnonVirkailijanTarkistusLomake
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

export async function getValmistumispyynnot(params: {
  page?: number
  size?: number
  sort?: string
  'erikoistujanNimi.contains'?: string
  'tila.equals'?: string
}) {
  return await axios.get<Page<ValmistumispyyntoListItem>>('virkailija/valmistumispyynnot', {
    params: {
      ...params
    }
  })
}

export async function putVastuuhenkilonArvio(form: VastuuhenkilonArvioLomake) {
  const path = '/virkailija/koejakso/vastuuhenkilonarvio'
  return await axios.put<VastuuhenkilonArvioLomake>(path, form)
}

export async function getErikoisalat() {
  const path = `/virkailija/erikoisalat`
  return await axios.get<Erikoisala[]>(path)
}

export async function getTerveyskeskuskoulutusjaksot(params: {
  page?: number
  size?: number
  sort: string | null
  'erikoistujanNimi.contains'?: string
  'erikoisalaId.equals'?: number
  avoin?: boolean
}) {
  return await axios.get<Page<TerveyskeskuskoulutusjaksonVaihe>>(
    '/virkailija/terveyskeskuskoulutusjaksot',
    {
      params: {
        ...params
      }
    }
  )
}

export async function getTerveyskeskuskoulutusjakso(id: string) {
  const path = `virkailija/terveyskeskuskoulutusjakso/${id}`
  return await axios.get<TerveyskeskuskoulutusjaksonHyvaksyminen>(path)
}

export async function putTerveyskeskuskoulutusjakso(
  id: string,
  korjausehdotus: string,
  lisatiedotVirkailijalta: string
) {
  const path = `virkailija/terveyskeskuskoulutusjakson-hyvaksynta/${id}`
  return await axios.put<TerveyskeskuskoulutusjaksonHyvaksyminen>(path, {
    korjausehdotus: korjausehdotus,
    lisatiedotVirkailijalta: lisatiedotVirkailijalta
  })
}

export async function getValmistumispyyntoTarkistus(id: number) {
  const path = `/virkailija/valmistumispyynnon-tarkistus/${id}`
  return await axios.get<ValmistumispyyntoVirkailijanTarkistus>(path)
}

export async function putValmistumispyynto(form: ValmistumispyynnonVirkailijanTarkistusLomake) {
  const path = `/virkailija/valmistumispyynnon-tarkistus/${form.id}`
  return await axios.put<ValmistumispyynnonVirkailijanTarkistusLomake>(path, form)
}
