export type ErikoistuvaLaakari = {
  id: number | null
  kayttajaId: number
  erikoisalaId: number
  erikoisalaNimi: string
  opintojenAloitusvuosi: string
  opiskelijatunnus: string
  puhelinnumero: string
  sahkoposti: string
  syntymaaika: string
  opintooikeudenMyontamispaiva: string
  opintooikeudenPaattymispaiva: string
  yliopisto: string
}

export interface UserAccount {
  activated: boolean
  firstName: string
  lastName: string
  email: string
  authorities: string[]
  erikoistuvaLaakari: ErikoistuvaLaakari
  id: string
  login: string
  langKey: string
  createdBy: string
  createdDate: string
  lastModifiedBy: string
  lastModifiedDate: string
  profilePicture: {
    src: string
  }
}

export interface ArviointipyyntoLomake {
  tyoskentelyjaksot: any[]
  kunnat: any[]
  erikoisalat: any[]
  epaOsaamisalueenKategoriat: any[]
  kouluttajatAndVastuuhenkilot: any[]
}

export interface SuoritemerkintaLomake {
  tyoskentelyjaksot: any[]
  kunnat: any[]
  erikoisalat: any[]
  oppimistavoitteenKategoriat: any[]
}

export interface TyoskentelyjaksoLomake {
  kunnat: any[]
  erikoisalat: any[]
}

export type Koulutuspaikka = {
  erikoisala: string
  nimi: string
  id: number | null
  yliopisto: string
}

export type Kouluttaja = {
  id: number | null
  kayttajaId: number | null
  kuittausaika: string
  lahiosoite: string
  nimi: string
  nimike: string
  postitoimipaikka: string
  puhelin: string
  sahkoposti: string
  sopimusHyvaksytty: boolean
  toimipaikka: string
}

export type Vastuuhenkilo = {
  id: number | null
  kuittausaika: string
  nimi: string
  nimike: string
  sopimusHyvaksytty: boolean
}

export interface KoulutussopimusLomake {
  erikoistuvanNimi: string
  erikoistuvanOpiskelijatunnus: string
  erikoistuvanPuhelinnumero: string
  erikoistuvanSahkoposti: string
  erikoistuvanSyntymaaika: string
  erikoistuvanYliopisto: string
  id: number | null
  koejaksonAlkamispaiva: string
  korjausehdotus: string
  kouluttajat: Kouluttaja[]
  koulutuspaikat: Koulutuspaikka[]
  lahetetty: boolean
  muokkauspaiva: string
  opintooikeudenMyontamispaiva: string
  opintooikeudenPaattymispaiva: string
  vastuuhenkilo: Vastuuhenkilo | undefined
  erikoistuvanAllekirjoitusaika?: string
}

export type KoejaksonVaiheHyvaksyja = {
  id: number | null
  kayttajaUserId: string | null
  kuittausaika: string
  nimi: string
  sopimusHyvaksytty: boolean
}

export type BlobDataResult = {
  data?: any
  contentType?: string
  error?: boolean
}

export interface AloituskeskusteluLomake {
  erikoistuvanErikoisala: string
  erikoistuvanNimi: string
  erikoistuvanOpiskelijatunnus: string
  erikoistuvanSahkoposti: string
  erikoistuvanYliopisto: string
  id: number | null
  koejaksonAlkamispaiva: string
  koejaksonOsaamistavoitteet: string
  koejaksonPaattymispaiva: string
  koejaksonSuorituspaikka: string
  koejaksonToinenSuorituspaikka: string
  korjausehdotus: string
  lahetetty: boolean
  lahiesimies: KoejaksonVaiheHyvaksyja
  lahikouluttaja: KoejaksonVaiheHyvaksyja
  muokkauspaiva: string
  suoritettuKokoaikatyossa: boolean | null
  tyotunnitViikossa: number | null
  erikoistuvanAllekirjoitusaika?: string
}

export interface ValiarviointiLomake {
  edistyminenTavoitteidenMukaista: boolean | null
  erikoistuvaAllekirjoittanut: boolean
  erikoistuvanErikoisala: string
  erikoistuvanNimi: string
  erikoistuvanOpiskelijatunnus: string
  erikoistuvanYliopisto: string
  id: number | null
  kehittamistoimenpiteet: string
  korjausehdotus: string
  lahiesimies: KoejaksonVaiheHyvaksyja
  lahikouluttaja: KoejaksonVaiheHyvaksyja
  muokkauspaiva: string
  vahvuudet: string
}

export interface KehittamistoimenpiteetLomake {
  erikoistuvaAllekirjoittanut: boolean
  erikoistuvanErikoisala: string
  erikoistuvanNimi: string
  erikoistuvanOpiskelijatunnus: string
  erikoistuvanYliopisto: string
  id: number | null
  kehittamistoimenpiteetRiittavat: boolean
  korjausehdotus: string
  lahiesimies: KoejaksonVaiheHyvaksyja
  lahikouluttaja: KoejaksonVaiheHyvaksyja
  muokkauspaiva: string
}

export interface LoppukeskusteluLomake {
  erikoistuvaAllekirjoittanut: boolean
  erikoistuvanErikoisala: string
  erikoistuvanNimi: string
  erikoistuvanOpiskelijatunnus: string
  erikoistuvanYliopisto: string
  esitetaanKoejaksonHyvaksymista: boolean
  id: number | null
  korjausehdotus: string
  lahiesimies: KoejaksonVaiheHyvaksyja
  lahikouluttaja: KoejaksonVaiheHyvaksyja
  muokkauspaiva: string
}

export interface VastuuhenkilonArvioLomake {
  erikoistuvaAllekirjoittanut: boolean
  erikoistuvanErikoisala: string
  erikoistuvanNimi: string
  erikoistuvanOpiskelijatunnus: string
  erikoistuvanYliopisto: string
  id: number | null
  muokkauspaiva: string
  vastuuhenkilo: KoejaksonVaiheHyvaksyja
}

export interface PoissaoloLomake {
  tyoskentelyjaksot: any[]
  poissaolonSyyt: any[]
}

export interface Koejakso {
  koulutusSopimuksenTila: string | null
  koulutussopimus: KoulutussopimusLomake
  aloituskeskustelunTila: string | null
  aloituskeskustelu: AloituskeskusteluLomake
  valiarvioinninTila: string | null
  valiarviointi: ValiarviointiLomake
  kehittamistoimenpiteidenTila: string | null
  kehittamistoimenpiteet: KehittamistoimenpiteetLomake
  loppukeskustelunTila: string | null
  loppukeskustelu: LoppukeskusteluLomake
  vastuuhenkilonArvionTila: string | null
  vastuuhenkilonArvio: VastuuhenkilonArvioLomake
}

export interface Asiakirja {
  id?: number
  nimi: string
  lisattypvm?: string
  contentType?: string
  data?: Promise<ArrayBuffer>
  disablePreview?: boolean
  disableDownload?: boolean
  disableDelete?: boolean
}

export interface KoejaksonTyoskentelyjakso {
  id: number
  formattedNimi: string
  paattymispaiva: string
  disableDelete: boolean
}

export interface KoejaksonVaiheAllekirjoitus {
  nimiAndNimike: string
  pvm: string
}
