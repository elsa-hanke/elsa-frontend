import { LocaleMessages } from 'vue-i18n'

import {
  ArvioinninPerustuminen,
  ArviointiasteikkoTyyppi,
  ArviointiasteikonTasoTyyppi,
  ErikoisalaTyyppi,
  KaytannonKoulutusTyyppi,
  KehittamistoimenpideKategoria,
  TyoskentelyjaksoTyyppi
} from '@/utils/constants'

export type ErikoistuvaLaakari = {
  id: number | null
  kayttajaId: number
  erikoisalaId: number
  erikoisalaNimi: string
  opiskelijatunnus: string
  puhelinnumero: string
  sahkoposti: string
  syntymaaika: string
  opintosuunnitelmaKaytossaPvm: string
  opintooikeudenMyontamispaiva: string
  opintooikeudenPaattymispaiva: string
  yliopisto: string
}

export interface UserAccount {
  activated: boolean
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  authorities: string[]
  erikoistuvaLaakari: ErikoistuvaLaakari
  id: string
  login: string
  langKey: string
  createdBy: string
  createdDate: string
  lastModifiedBy: string
  lastModifiedDate: string
}

export interface ArviointipyyntoLomake {
  tyoskentelyjaksot: Tyoskentelyjakso[]
  kunnat: Kunta[]
  erikoisalat: Erikoisala[]
  arvioitavanKokonaisuudenKategoriat: ArvioitavanKokonaisuudenKategoria[]
  kouluttajatAndVastuuhenkilot: Kayttaja[]
}

export interface SuoritemerkintaLomake {
  tyoskentelyjaksot: Tyoskentelyjakso[]
  kunnat: Kunta[]
  erikoisalat: Erikoisala[]
  oppimistavoitteenKategoriat: OppimistavoitteenKategoria[]
}

export interface TyoskentelyjaksoLomake {
  kunnat: Kunta[]
  erikoisalat: Erikoisala[]
}

export interface Tyoskentelyjakso {
  id?: number | null
  alkamispaiva: string | null
  paattymispaiva: string | null
  osaaikaprosentti: number | null
  kaytannonKoulutus: KaytannonKoulutusTyyppi | null
  hyvaksyttyAiempaanErikoisalaan: boolean | null
  tyoskentelypaikka: Tyoskentelypaikka
  omaaErikoisalaaTukevaId?: number
  omaaErikoisalaaTukeva: Erikoisala | null
  erikoistuvaLaakariId?: number
  suoritusarvioinnit?: boolean
  liitettyKoejaksoon?: boolean
  asiakirjat?: Asiakirja[]
  label?: string
}

export interface Tyoskentelypaikka {
  id?: number | null
  nimi: string | null
  tyyppi: TyoskentelyjaksoTyyppi | null
  muuTyyppi: string | null
  kuntaId?: string
  kunta: Kunta | null
}

export interface Kunta {
  id?: number | null
  abbreviation: string | null
  shortName?: string
  longName?: string
  description?: string
  kortnamn?: string
  korvaavaKoodi?: string
  langtNamn?: string
  maakunta?: string
  sairaanhoitopiiri?: string
}

export interface Erikoisala {
  id?: number | null
  nimi: string | null
  voimassaoloAlkaa: string
  voimassaoloPaattyy: string | null
  tyyppi: ErikoisalaTyyppi | null
  kaytannonKoulutuksenVahimmaispituus: number
  terveyskeskuskoulutusjaksonVahimmaispituus: number
  yliopistosairaalajaksonVahimmaispituus: number
  yliopistosairaalanUlkopuolisenTyoskentelynVahimmaispituus: number
}

export type Koulutuspaikka = {
  erikoisala: string
  nimi: string
  id: number | null
  toimipaikallaKoulutussopimus: boolean | null
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
  erikoistuvanErikoisala: string
  erikoistuvanOpiskelijatunnus: string
  erikoistuvanPuhelinnumero: string
  erikoistuvanSahkoposti: string
  erikoistuvanSyntymaaika: string
  erikoistuvanYliopisto: string
  erikoistuvanAvatar?: string
  id: number | null
  koejaksonAlkamispaiva: string
  korjausehdotus: string
  kouluttajat: Kouluttaja[]
  koulutuspaikat: Koulutuspaikka[]
  lahetetty: boolean
  muokkauspaiva: string
  opintooikeudenMyontamispaiva: string
  opintooikeudenPaattymispaiva: string
  vastuuhenkilo?: Vastuuhenkilo
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
  erikoistuvanAvatar?: string
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
  erikoistuvanAllekirjoitusaika?: string
  erikoistuvanErikoisala: string
  erikoistuvanNimi: string
  erikoistuvanOpiskelijatunnus: string
  erikoistuvanYliopisto: string
  erikoistuvanAvatar?: string
  id: number | null
  kehittamistoimenpideKategoriat: KehittamistoimenpideKategoria[] | null
  kehittamistoimenpiteet: string
  korjausehdotus: string
  lahiesimies: KoejaksonVaiheHyvaksyja
  lahikouluttaja: KoejaksonVaiheHyvaksyja
  muokkauspaiva: string
  muuKategoria: string | null
  vahvuudet: string
}

export interface KehittamistoimenpiteetLomake {
  erikoistuvaAllekirjoittanut: boolean
  erikoistuvanAllekirjoitusaika?: string
  erikoistuvanErikoisala: string
  erikoistuvanNimi: string
  erikoistuvanOpiskelijatunnus: string
  erikoistuvanYliopisto: string
  erikoistuvanAvatar?: string
  id: number | null
  kehittamistoimenpiteetRiittavat: boolean | null
  korjausehdotus: string
  lahiesimies: KoejaksonVaiheHyvaksyja
  lahikouluttaja: KoejaksonVaiheHyvaksyja
  muokkauspaiva: string
}

export interface LoppukeskusteluLomake {
  erikoistuvaAllekirjoittanut: boolean
  erikoistuvanAllekirjoitusaika?: string
  erikoistuvanErikoisala: string
  erikoistuvanNimi: string
  erikoistuvanOpiskelijatunnus: string
  erikoistuvanYliopisto: string
  erikoistuvanAvatar?: string
  esitetaanKoejaksonHyvaksymista: boolean | null
  id: number | null
  jatkotoimenpiteet: string | null
  korjausehdotus: string
  lahiesimies: KoejaksonVaiheHyvaksyja
  lahikouluttaja: KoejaksonVaiheHyvaksyja
  muokkauspaiva: string
}

export interface VastuuhenkilonArvioLomake {
  erikoistuvaAllekirjoittanut: boolean
  erikoistuvanAllekirjoitusaika?: string
  erikoistuvanErikoisala: string
  erikoistuvanNimi: string
  erikoistuvanOpiskelijatunnus: string
  erikoistuvanYliopisto: string
  erikoistuvanAvatar?: string
  koejaksoHyvaksytty: boolean | null
  id: number | null
  muokkauspaiva: string
  vastuuhenkilo?: Vastuuhenkilo
  vastuuhenkiloAllekirjoittanut: boolean | null
  perusteluHylkaamiselle: string | null
  hylattyArviointiKaytyLapiKeskustellen: boolean | null
  vastuuhenkilonKuittausaika?: string
}

export interface VastuuhenkilonArvioLomakeData {
  vastuuhenkilot: Vastuuhenkilo[]
  tyoskentelyjaksoLiitetty: boolean
  tyoskentelyjaksonPituusRiittava: boolean
  tyotodistusLiitetty: boolean
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

export type KoejaksonVaiheButtonStates = {
  primaryButtonLoading: boolean
  secondaryButtonLoading: boolean
}

export interface Kayttaja {
  id?: number
  nimi: string
  userId: string
  nimike: string
  yliopisto: Yliopisto
}

export interface Yliopisto {
  id?: number
  nimi: string
  erikoisalat: Erikoisala[]
}

export interface KouluttajaValtuutus {
  id?: number
  alkamispaiva: string
  paattymispaiva: string
  valtuutettu: Kayttaja
}

export type OmatTiedotLomake = {
  email: string | null
  phoneNumber: string | null
  avatar: any
  avatarUpdated: boolean
}

export type Suoritusarviointi = {
  id?: number
  tapahtumanAjankohta: string | null
  arvioitavaTapahtuma: string | null
  pyynnonAika: string
  lisatiedot: string | null
  itsearviointiVaativuustaso: number
  itsearviointiArviointiasteikonTaso: number
  sanallinenItsearviointi: string
  itsearviointiAika: string
  vaativuustaso: number
  arviointiasteikonTaso: number
  sanallinenArviointi: string
  arviointiAika: string
  lukittu: boolean
  kommentit: SuoritusarvioinninKommentti[]
  arvioinninAntajaId: number
  arvioitavaOsaalueId: number
  tyoskentelyjaksoId: number
  arvioinninSaaja: Kayttaja
  arvioinninAntaja: Kayttaja | null
  arvioitavaOsaalue: ArvioitavaKokonaisuus | null
  tyoskentelyjakso: Tyoskentelyjakso | null
  arviointityokalut: Arviointityokalu[]
  arviointiPerustuu: ArvioinninPerustuminen
  muuPeruste: string
}

export type SuoritusarvioinninKommentti = {
  id?: number
  teksti: string
  luontiaika: string
  muokkausaika: string
  kommentoija: Kayttaja
  suoritusarviointiId: number
}

export type ArvioitavaKokonaisuus = {
  id?: number
  nimi: string
  kuvaus: string
  voimassaoloAlkaa: string
  voimassaoloLoppuu: string
  erikoisalaId: number
  kategoria: ArvioitavanKokonaisuudenKategoria
  arviointiasteikko: Arviointiasteikko
}

export type ArvioitavanKokonaisuudenKategoria = {
  id?: number
  nimi: string
  jarjestysnumero: number
  voimassaoloAlkaa: string
  voimassaoloLoppuu: string
  arvioitavatKokonaisuudet: ArvioitavaKokonaisuus[]
}

export type Arviointiasteikko = {
  id?: number
  nimi: ArviointiasteikkoTyyppi
  tasot: ArviointiasteikonTaso[]
}

export type ArviointiasteikonTaso = {
  nimi: ArviointiasteikonTasoTyyppi
  taso: number
}

export type Arviointityokalu = {
  id?: number
  nimi: string
}

export type SuoritusarviointiForm = {
  vaativuustaso: Vaativuustaso | null | undefined
  arviointiasteikonTaso: ArviointiasteikonTaso | null | undefined
  sanallinenArviointi: string | null
  arviointityokalut?: Arviointityokalu[]
  arviointiPerustuu?: ArvioinninPerustuminen | null
  muuPeruste?: string | null
  perustuuMuuhun?: boolean
}

export type Vaativuustaso = {
  arvo: number
  nimi: string
  kuvaus: string
}

export type OppimistavoitteenKategoria = {
  id?: number
  nimi: string
  voimassaolonAlkamispaiva: string
  voimassaolonPaattymispaiva: string
  erikoisalaId: number
  oppimistavoitteet: Oppimistavoite[]
  arviointiasteikko: Arviointiasteikko
}

export type Oppimistavoite = {
  id: number
  nimi: string
  voimassaolonAlkamispaiva: string
  voimassaolonPaattymispaiva: string
  kategoriaId: number
}

export type Suoritemerkinta = {
  id?: number
  suorituspaiva: string
  arviointiasteikonTaso: number | ArviointiasteikonTaso | undefined
  vaativuustaso: number | Vaativuustaso | undefined
  lisatiedot: string
  lukittu?: boolean
  oppimistavoiteId?: number
  tyoskentelyjaksoId?: number
  oppimistavoite: Oppimistavoite
  tyoskentelyjakso: Tyoskentelyjakso
  arviointiasteikko?: Arviointiasteikko
}

export interface ToggleableSuoritemerkinta extends Suoritemerkinta {
  showDetails: boolean
}

export type OppimistavoitteetTable = {
  oppimistavoitteenKategoriat: OppimistavoitteenKategoria[]
  suoritemerkinnat: ToggleableSuoritemerkinta[]
}

export type SuoritemerkintaRow = {
  suoritemerkinta?: ToggleableSuoritemerkinta
  details: boolean
  oppimistavoite?: Oppimistavoite
  hasDetails?: boolean
}

export type SuoritemerkintaWithDetails = {
  suoritemerkinta: ToggleableSuoritemerkinta
  details: boolean
}

export interface BarChartRow {
  text: string | LocaleMessages
  color: string
  backgroundColor: string
  value: number
  minRequired: number
  highlight: boolean
}
