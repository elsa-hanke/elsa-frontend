import axios from 'axios'

import {
  KoulutussopimusLomake,
  VastuuhenkilonArvioLomake,
  AloituskeskusteluLomake,
  ValiarviointiLomake,
  KehittamistoimenpiteetLomake,
  LoppukeskusteluLomake,
  Suoritusarviointi,
  ErikoistujienSeuranta,
  KoejaksonVaihe,
  Arviointipyynto,
  Page,
  TerveyskeskuskoulutusjaksonVaihe,
  TerveyskeskuskoulutusjaksonHyvaksyminen,
  ValmistumispyyntoListItem,
  Valmistumispyynto,
  ValmistumispyyntoArviointienTila,
  ValmistumispyyntoLomakeOsaamisenArviointi,
  ValmistumispyyntoVirkailijanTarkistus,
  ValmistumispyyntoHyvaksynta
} from '@/types'
import { ValmistumispyynnonHyvaksyjaRole } from '@/utils/roles'

export async function getKoejaksot() {
  const path = 'vastuuhenkilo/koejaksot'
  return await axios.get(path)
}

export async function getKoulutussopimus(id: number) {
  const path = `/vastuuhenkilo/koejakso/koulutussopimus/${id}`
  return await axios.get<KoulutussopimusLomake>(path)
}

export async function getAloituskeskustelu(id: number) {
  const path = `/vastuuhenkilo/koejakso/aloituskeskustelu/${id}`
  return await axios.get<AloituskeskusteluLomake>(path)
}

export async function getValiarviointi(id: number) {
  const path = `/vastuuhenkilo/koejakso/valiarviointi/${id}`
  return await axios.get<ValiarviointiLomake>(path)
}

export async function getKehittamistoimenpiteet(id: number) {
  const path = `/vastuuhenkilo/koejakso/kehittamistoimenpiteet/${id}`
  return await axios.get<KehittamistoimenpiteetLomake>(path)
}

export async function getLoppukeskustelu(id: number) {
  const path = `/vastuuhenkilo/koejakso/loppukeskustelu/${id}`
  return await axios.get<LoppukeskusteluLomake>(path)
}

export async function putKoulutussopimus(form: KoulutussopimusLomake) {
  const path = 'vastuuhenkilo/koejakso/koulutussopimus'
  return await axios.put<KoulutussopimusLomake>(path, form)
}

export async function getVastuuhenkilonArvio(id: number) {
  const path = `/vastuuhenkilo/koejakso/vastuuhenkilonarvio/${id}`
  return await axios.get<VastuuhenkilonArvioLomake>(path)
}

export async function putVastuuhenkilonArvio(form: VastuuhenkilonArvioLomake) {
  const path = 'vastuuhenkilo/koejakso/vastuuhenkilonarvio'
  return await axios.put<VastuuhenkilonArvioLomake>(path, form)
}

export async function putSuoritusarviointi(formData: FormData) {
  const path = 'vastuuhenkilo/suoritusarvioinnit'
  return await axios.put<Suoritusarviointi>(path, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 120000
  })
}

export async function getErikoistujienSeuranta() {
  const path = `/vastuuhenkilo/etusivu/erikoistujien-seuranta`
  return await axios.get<ErikoistujienSeuranta>(path)
}

export async function getEtusivuKoejaksot() {
  const path = `/vastuuhenkilo/etusivu/koejaksot`
  return await axios.get<KoejaksonVaihe[]>(path)
}

export async function getEtusivuArviointipyynnot() {
  const path = `/vastuuhenkilo/arviointipyynnot`
  return await axios.get<Arviointipyynto[]>(path)
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
    '/vastuuhenkilo/terveyskeskuskoulutusjaksot',
    {
      params: {
        ...params
      }
    }
  )
}

export async function getTerveyskeskuskoulutusjakso(id: string) {
  const path = `vastuuhenkilo/terveyskeskuskoulutusjakso/${id}`
  return await axios.get<TerveyskeskuskoulutusjaksonHyvaksyminen>(path)
}

export async function putTerveyskeskuskoulutusjakso(id: string, korjausehdotus: string) {
  const path = `vastuuhenkilo/terveyskeskuskoulutusjakson-hyvaksynta/${id}`
  return await axios.put<TerveyskeskuskoulutusjaksonHyvaksyminen>(path, {
    korjausehdotus: korjausehdotus
  })
}

export async function getOnkoTerveyskeskuskoulutusjaksoVastuuhenkilo() {
  const path = 'vastuuhenkilo/onko-terveyskeskuskoulutusjakso-vastuuhenkilo'
  return await axios.get<boolean>(path)
}

export async function getValmistumispyynnot(params: {
  page?: number
  size?: number
  sort?: string
  'erikoistujanNimi.contains'?: string
  'tila.equals'?: string
}) {
  return await axios.get<Page<ValmistumispyyntoListItem>>('vastuuhenkilo/valmistumispyynnot', {
    params: {
      ...params
    }
  })
}

export async function getValmistumispyynnonHyvaksyjaRole() {
  const path = '/vastuuhenkilo/valmistumispyynnon-hyvaksyja-role'
  return await axios.get<ValmistumispyynnonHyvaksyjaRole>(path)
}

export async function getValmistumispyyntoOsaamisenArviointi(id: number) {
  const path = `/vastuuhenkilo/valmistumispyynnon-arviointi/${id}`
  return await axios.get<Valmistumispyynto>(path)
}

export async function getValmistumispyyntoArviointienTila(id: number) {
  const path = `/vastuuhenkilo/valmistumispyynto-arviointien-tila/${id}`
  return await axios.get<ValmistumispyyntoArviointienTila>(path)
}

export async function getValmistumispyyntoHyvaksynta(id: number) {
  const path = `/vastuuhenkilo/valmistumispyynnon-hyvaksynta/${id}`
  return await axios.get<ValmistumispyyntoVirkailijanTarkistus>(path)
}

export async function putValmistumispyyntoHyvaksynta(form: ValmistumispyyntoHyvaksynta) {
  const path = `/vastuuhenkilo/valmistumispyynnon-hyvaksynta/${form.id}`
  return await axios.put<ValmistumispyyntoHyvaksynta>(path, form)
}

export async function putValmistumispyynto(form: ValmistumispyyntoLomakeOsaamisenArviointi) {
  const path = `/vastuuhenkilo/valmistumispyynnon-arviointi/${form.id}`
  return await axios.put<Valmistumispyynto>(path, form)
}
