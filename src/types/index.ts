import { LocaleMessages } from 'vue-i18n'

import {
  ArvioinninPerustuminen,
  ArviointiasteikkoTyyppi,
  ArviointiasteikonTasoTyyppi,
  ErikoisalaTyyppi,
  KaytannonKoulutusTyyppi,
  KehittamistoimenpideKategoria,
  TyoskentelyjaksoTyyppi,
  PoissaolonSyyTyyppi,
  SeurantajaksoTila
} from '@/utils/constants'
import { ELSA_ROLE } from '@/utils/roles'

export type Opintooikeus = {
  id: number | null
  opintooikeudenMyontamispaiva: string
  opintooikeudenPaattymispaiva: string
  opiskelijatunnus: string
  osaamisenArvioinninOppaanPvm: string
  yliopistoNimi: string
  erikoisalaId: number
  erikoisalaNimi: string
  asetus: Asetus
}

export type ErikoistuvaLaakari = {
  id: number | null
  nimi: string
  sahkoposti: string
  puhelinnumero: string | null
  syntymaaika: string
  kayttajaId: number
  yliopisto: string
  opintooikeudet: Opintooikeus[]
  opintooikeusKaytossaId: number
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
  suoritteenKategoriat: SuoritteenKategoria[]
}

export interface TyoskentelyjaksoLomake {
  kunnat: Kunta[]
  erikoisalat: Erikoisala[]
}

export interface Koulutussuunnitelma {
  id: number | null
  motivaatiokirje: string | null
  motivaatiokirjeYksityinen: boolean
  opiskeluJaTyohistoria: string | null
  opiskeluJaTyohistoriaYksityinen: boolean
  vahvuudet: string | null
  vahvuudetYksityinen: boolean
  tulevaisuudenVisiointi: string | null
  tulevaisuudenVisiointiYksityinen: boolean
  osaamisenKartuttaminen: string | null
  osaamisenKartuttaminenYksityinen: boolean
  elamankentta: string | null
  elamankenttaYksityinen: boolean
  koulutussuunnitelmaAsiakirja?: Asiakirja | null
  motivaatiokirjeAsiakirja?: Asiakirja | null
  koulutussuunnitelmaFile?: File | null
  koulutussuunnitelmaAsiakirjaUpdated: boolean
  motivaatiokirjeFile?: File | null
  motivaatiokirjeAsiakirjaUpdated: boolean
}

export interface Koulutusjakso {
  id: number | null
  nimi: string | null
  muutOsaamistavoitteet: string | null
  luotu: string | null
  tallennettu: string | null
  lukittu: boolean | null
  tyoskentelyjaksot: Tyoskentelyjakso[]
  osaamistavoitteet: ArvioitavaKokonaisuus[]
  koulutussuunnitelma: Koulutussuunnitelma | null
}

export interface KoulutusjaksoLomake {
  tyoskentelyjaksot: Tyoskentelyjakso[]
  kunnat: Kunta[]
  arvioitavanKokonaisuudenKategoriat: ArvioitavanKokonaisuudenKategoria[]
}

export interface Tyoskentelyjakso {
  id?: number | null
  alkamispaiva: string | null
  paattymispaiva: string | null
  minPaattymispaiva: string | null
  osaaikaprosentti: number | null
  kaytannonKoulutus: KaytannonKoulutusTyyppi | null
  hyvaksyttyAiempaanErikoisalaan: boolean | null
  tyoskentelypaikka: Tyoskentelypaikka
  omaaErikoisalaaTukevaId?: number
  omaaErikoisalaaTukeva: Erikoisala | null
  tapahtumia?: boolean
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
  tyyppi: ErikoisalaTyyppi | null
}

export interface Opintoopas {
  id?: number | null
  nimi: string | null
  voimassaoloAlkaa: string
  voimassaoloPaattyy: string | null
  kaytannonKoulutuksenVahimmaispituus: number
  terveyskeskuskoulutusjaksonVahimmaispituus: number
  yliopistosairaalajaksonVahimmaispituus: number
  yliopistosairaalanUlkopuolisenTyoskentelynVahimmaispituus: number
  erikoisalanVaatimaTeoriakoulutustenVahimmaismaara: number
  erikoisalanVaatimaSateilysuojakoulutustenVahimmaismaara: number
  erikoisalanVaatimaJohtamisopintojenVahimmaismaara: number
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
  erikoistuvanErikoisala?: string
  erikoistuvanOpiskelijatunnus?: string
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
  opintooikeudenMyontamispaiva?: string
  opintooikeudenPaattymispaiva?: string
  vastuuhenkilo?: Vastuuhenkilo
  erikoistuvanAllekirjoitusaika?: string
  yliopistot: Yliopisto[]
  vastuuhenkilot: Vastuuhenkilo[]
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
  erikoistuvanErikoisala?: string
  erikoistuvanNimi: string
  erikoistuvanOpiskelijatunnus?: string
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

export interface VastuuhenkilonArvioLomakeErikoistuva {
  vastuuhenkilot: Vastuuhenkilo[]
  tyoskentelyjaksoLiitetty: boolean
  tyoskentelyjaksonPituusRiittava: boolean
  tyotodistusLiitetty: boolean
}

export interface PoissaoloLomake {
  tyoskentelyjaksot: any[]
  poissaolonSyyt: any[]
}

export interface Poissaolo {
  id?: number
  alkamispaiva?: string
  paattymispaiva?: string
  poissaoloprosentti?: number
  poissaolonSyyId: number
  tyoskentelyjaksoId: number
  poissaolonSyy?: PoissaolonSyy
  tyoskentelyjakso?: Tyoskentelyjakso
  kokoTyoajanPoissaolo?: boolean
}

export interface PoissaolonSyy {
  id?: number | null
  nimi: string
  vahennystyyppi: PoissaolonSyyTyyppi
  voimassaolonAlkamispaiva: string
  voimassaolonPaattymispaiva?: string | null
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
  id?: number | null
  nimi: string
  lisattypvm?: string
  contentType?: string
  data?: Promise<ArrayBuffer>
  disablePreview?: boolean
  disableDownload?: boolean
  disableDelete?: boolean
  isDirty: boolean
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

export interface KayttajaAuthority {
  name: string
}

export interface Kayttaja {
  id?: number
  nimi: string
  etunimi: string
  sukunimi: string
  sahkoposti: string
  avatar: string
  userId: string
  authorities: KayttajaAuthority[]
  nimike: string
  yliopisto: Yliopisto
}

export interface Yliopisto {
  id?: number
  nimi: string
  erikoisalat: Erikoisala[]
}
export interface Asetus {
  id?: number
  nimi: string
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
  tapahtumanAjankohta: string | null | Date
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
  arvioitavaKokonaisuusId: number
  arviointiasteikko: Arviointiasteikko
  tyoskentelyjaksoId: number
  arvioinninSaaja: Kayttaja
  arvioinninAntaja: Kayttaja | null
  arvioitavaKokonaisuus: ArvioitavaKokonaisuus | null
  tyoskentelyjakso: Tyoskentelyjakso | null
  arviointityokalut: Arviointityokalu[]
  arviointiPerustuu: ArvioinninPerustuminen
  muuPeruste: string
  arviointiAsiakirja: Asiakirja
  arviointiAsiakirjaUpdated: boolean
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
  arvioinnit: Suoritusarviointi[]
  visible: boolean
}

export type ArvioitavanKokonaisuudenKategoria = {
  id?: number
  nimi: string
  jarjestysnumero: number
  voimassaoloAlkaa: string
  voimassaoloLoppuu: string
  arvioitavatKokonaisuudet: ArvioitavaKokonaisuus[]
  visible: boolean
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
  arviointiAsiakirja?: Asiakirja | null
  arviointiAsiakirjaUpdated: boolean
  arviointiFile?: File | null
}

export type SuoritusarviointiFilter = {
  tyoskentelyjakso?: Tyoskentelyjakso | null
  arvioitavaKokonaisuus?: ArvioitavaKokonaisuus | null
  kouluttajaOrVastuuhenkilo?: Kayttaja | null
}

export type SuoritusarvioinnitOptions = {
  tyoskentelyjaksot: Tyoskentelyjakso[]
  arvioitavatKokonaisuudet: ArvioitavaKokonaisuus[]
  kouluttajatAndVastuuhenkilot: Kayttaja[]
}

export type Vaativuustaso = {
  arvo: number
  nimi: string
  kuvaus: string
}

export type SuoritteenKategoria = {
  id?: number
  nimi: string
  voimassaolonAlkamispaiva: string
  voimassaolonPaattymispaiva: string
  erikoisalaId: number
  suoritteet: Suorite[]
  jarjestysnumero: number
}

export type Suorite = {
  id: number
  nimi: string
  voimassaolonAlkamispaiva: string
  voimassaolonPaattymispaiva: string
  kategoriaId: number
  vaadittulkm?: number
  suoritettulkm?: number
}

export type Suoritemerkinta = {
  id?: number
  suorituspaiva: string
  arviointiasteikonTaso?: number | ArviointiasteikonTaso
  vaativuustaso?: number | Vaativuustaso
  lisatiedot: string
  lukittu?: boolean
  suoriteId?: number
  tyoskentelyjaksoId?: number
  suorite: Suorite
  tyoskentelyjakso: Tyoskentelyjakso
  arviointiasteikko?: Arviointiasteikko
}

export interface ToggleableSuoritemerkinta extends Suoritemerkinta {
  showDetails: boolean
}

export type SuoritteetTable = {
  suoritteenKategoriat: SuoritteenKategoria[]
  suoritemerkinnat: ToggleableSuoritemerkinta[]
  arviointiasteikko: Arviointiasteikko
}

export type SuoritemerkintaRow = {
  suoritemerkinta?: ToggleableSuoritemerkinta
  details: boolean
  suorite?: Suorite
  hasDetails?: boolean
}

export type SuoritemerkintaWithDetails = {
  suoritemerkinta: ToggleableSuoritemerkinta
  details: boolean
  lastDetails?: boolean
}

export interface BarChartRow {
  text: string | LocaleMessages
  color: string
  backgroundColor: string
  value: number
  minRequired: number
  highlight: boolean
}

export interface Palaute {
  palautteenAihe: string | null
  palaute: string | null
}

export interface Teoriakoulutukset {
  teoriakoulutukset: Teoriakoulutus[]
  erikoisalanVaatimaTeoriakoulutustenVahimmaismaara: number
}

export interface Teoriakoulutus {
  id?: number
  koulutuksenNimi: string | null
  koulutuksenPaikka: string | null
  alkamispaiva: string | null
  paattymispaiva: string | null
  erikoistumiseenHyvaksyttavaTuntimaara: number | null
  todistukset: Asiakirja[]
}

export interface PaivakirjaAihekategoria {
  id?: number
  nimi: string
  jarjestysnumero: number | null
  kuvaus: string | null
  teoriakoulutus: boolean
  muunAiheenNimi: boolean
}

export interface Paivakirjamerkinta {
  id?: number
  paivamaara: string | null
  oppimistapahtumanNimi: string | null
  muunAiheenNimi: string | null
  reflektio: string | null
  yksityinen: boolean
  aihekategoriat: PaivakirjaAihekategoria[]
  teoriakoulutus: Teoriakoulutus | null
}

export interface PaivakirjamerkintaRajaimet {
  aihekategoriat: PaivakirjaAihekategoria[]
}

export interface PaivakirjamerkintaLomake {
  aihekategoriat: PaivakirjaAihekategoria[]
  teoriakoulutukset: Teoriakoulutus[]
}

export interface ElsaError {
  errorKey: string
  message: string
}

export type HakaYliopisto = {
  nimi: string
  hakaId: string
}

export interface KayttajahallintaKayttaja {
  user?: UserAccount
  kayttaja?: Kayttaja
  erikoistuvaLaakari?: ErikoistuvaLaakari
}

export interface UusiKayttaja {
  rooli: ELSA_ROLE
  erikoistuvaLaakari: UusiErikoistuvaLaakari
}

export interface UusiErikoistuvaLaakari {
  etunimi: string | null
  sukunimi: string | null
  sahkopostiosoite: string | null
  sahkopostiosoiteUudelleen: string | null
  yliopisto: Yliopisto | null
  yliopistoId?: number
  erikoisala: Erikoisala | null
  erikoisalaId?: number | null
  opiskelijatunnus: string | null
  opintooikeusAlkaa: string | null
  opintooikeusPaattyy: string | null
  asetusId: number | null
  opintoopas: Opintoopas | null
  opintoopasId?: number | null
  osaamisenArvioinninOppaanPvm: string | null
}

export interface KayttajaLomake {
  yliopistot: Yliopisto[]
  erikoisalat: Erikoisala[]
  asetukset: Asetus[]
  opintooppaat: Opintoopas[]
}

export type Seurantajakso = {
  id?: number
  alkamispaiva: string | null
  paattymispaiva: string | null
  koulutusjaksot: Koulutusjakso[]
  omaArviointi?: string | null
  lisahuomioita?: string | null
  seuraavanJaksonTavoitteet?: string | null
  kouluttaja?: Kayttaja | null
  seurantakeskustelunYhteisetMerkinnat?: string | null
  seuraavanKeskustelunAjankohta?: string | null
  edistyminenTavoitteidenMukaista?: boolean | null
  huolenaiheet?: string | null
  kouluttajanArvio?: string | null
  erikoisalanTyoskentelyvalmiudet?: string | null
  jatkotoimetJaRaportointi?: string | null
  hyvaksytty?: boolean | null
  korjausehdotus?: string | null
  erikoistuvanNimi: string | null
  erikoistuvanErikoisalaNimi: string | null
  erikoistuvanOpiskelijatunnus: string | null
  erikoistuvanYliopistoNimi: string | null
  erikoistuvanAvatar?: string
  tallennettu?: string | null
  tila?: SeurantajaksoTila | null
  aiemmatJaksot?: Seurantajakso[]
}

export type SeurantajaksonArviointiKategoria = {
  nimi: string
  jarjestysnumero: number
  arvioitavatKokonaisuudet: SeurantajaksonArviointiKokonaisuus[]
}

export type SeurantajaksonArviointiKokonaisuus = {
  nimi: string
  arvioinnit: Suoritusarviointi[]
}

export type SeurantajaksonTiedot = {
  osaamistavoitteet: string[]
  muutOsaamistavoitteet: string[]
  arvioinnit: SeurantajaksonArviointiKategoria[]
  arviointienMaara: number
  suoritemerkinnat: SeurantajaksonSuoritemerkinta[]
  suoritemerkinnatMaara: number
  teoriakoulutukset: Teoriakoulutus[]
}

export type SeurantajaksonSuoritemerkinta = {
  suorite: string
  suoritemerkinnat: Suoritusarviointi[]
}

export interface PageSort {
  empty: boolean
  unsorted: boolean
  sorted: boolean
}
export interface Page<T> {
  content: T[]
  pageable: {
    sort: PageSort
    offset: number
    pageSize: number
    pageNumber: number
    unpaged: boolean
    paged: boolean
  }
  last: boolean
  totalPages: number
  totalElements: number
  first: boolean
  number: number
  sort: PageSort
  size: number
  numberOfElements: number
  empty: boolean
}

export type Keskeytysaika = {
  id?: number
  alkamispaiva: string
  paattymispaiva: string
  poissaoloprosentti: number
  poissaolonSyyId?: number
  tyoskentelyjaksoId?: number
  poissaolonSyy?: PoissaolonSyy | null
  tyoskentelyjakso?: Tyoskentelyjakso | null
}

export type TyoskentelyjaksotTilastotKoulutustyypit = {
  terveyskeskusVaadittuVahintaan: number
  terveyskeskusSuoritettu: number
  yliopistosairaalaVaadittuVahintaan: number
  yliopistosairaalaSuoritettu: number
  yliopistosairaaloidenUlkopuolinenVaadittuVahintaan: number
  yliopistosairaaloidenUlkopuolinenSuoritettu: number
  yhteensaVaadittuVahintaan: number
  yhteensaSuoritettu: number
}

export interface TyoskentelyjaksotTilastotKaytannonKoulutus {
  kaytannonKoulutus: KaytannonKoulutusTyyppi
  suoritettu: number
}

export interface TyoskentelyjaksotTilastotTyoskentelyjaksot {
  id: number
  suoritettu: number
}

export interface TyoskentelyjaksotTilastot {
  tyoskentelyaikaYhteensa: number
  arvioErikoistumiseenHyvaksyttavista: number
  arvioPuuttuvastaKoulutuksesta: number
  koulutustyypit: TyoskentelyjaksotTilastotKoulutustyypit
  kaytannonKoulutus: TyoskentelyjaksotTilastotKaytannonKoulutus[]
  tyoskentelyjaksot: TyoskentelyjaksotTilastotTyoskentelyjaksot[]
}

export interface TyoskentelyjaksotTable {
  poissaolonSyyt: PoissaolonSyy[]
  tyoskentelyjaksot: Tyoskentelyjakso[]
  keskeytykset: Keskeytysaika[]
  tilastot: TyoskentelyjaksotTilastot
}
