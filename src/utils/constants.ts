import { Kouluttaja, Koulutuspaikka, Vaativuustaso } from '@/types'

export const vaativuustasot: Vaativuustaso[] = [
  {
    arvo: 1,
    nimi: 'helppo',
    kuvaus: 'lorem-ipsum'
  },
  {
    arvo: 2,
    nimi: 'tavallista-helpompi',
    kuvaus: 'lorem-ipsum'
  },
  {
    arvo: 3,
    nimi: 'tavallinen',
    kuvaus: 'lorem-ipsum'
  },
  {
    arvo: 4,
    nimi: 'kohtalaisen-vaativa',
    kuvaus: 'lorem-ipsum'
  },
  {
    arvo: 5,
    nimi: 'erittain-vaativa',
    kuvaus: 'lorem-ipsum'
  }
]

export enum ArvioinninPerustuminen {
  LASNA = 'LASNA',
  KIRJALLINEN = 'KIRJALLINEN',
  ETA = 'ETA',
  MUU = 'MUU'
}

export enum LomakeTyypit {
  KOULUTUSSOPIMUS = 'KOULUTUSSOPIMUS',
  ALOITUSKESKUSTELU = 'ALOITUSKESKUSTELU',
  VALIARVIOINTI = 'VALIARVIOINTI',
  KEHITTAMISTOIMENPITEET = 'KEHITTAMISTOIMENPITEET',
  LOPPUKESKUSTELU = 'LOPPUKESKUSTELU',
  VASTUUHENKILON_ARVIO = 'VASTUUHENKILON_ARVIO'
}

export enum LomakeTilat {
  EI_AKTIIVINEN = 'EI_AKTIIVINEN',
  UUSI = 'UUSI',
  TALLENNETTU_KESKENERAISENA = 'TALLENNETTU_KESKENERAISENA',
  ODOTTAA_HYVAKSYNTAA = 'ODOTTAA_HYVAKSYNTAA',
  ODOTTAA_ERIKOISTUVAN_HYVAKSYNTAA = 'ODOTTAA_ERIKOISTUVAN_HYVAKSYNTAA',
  ODOTTAA_ESIMIEHEN_HYVAKSYNTAA = 'ODOTTAA_ESIMIEHEN_HYVAKSYNTAA',
  ODOTTAA_VASTUUHENKILON_HYVAKSYNTAA = 'ODOTTAA_VASTUUHENKILON_HYVAKSYNTAA',
  ODOTTAA_TOISEN_KOULUTTAJAN_HYVAKSYNTAA = 'ODOTTAA_TOISEN_KOULUTTAJAN_HYVAKSYNTAA',
  PALAUTETTU_KORJATTAVAKSI = 'PALAUTETTU_KORJATTAVAKSI',
  HYVAKSYTTY = 'HYVAKSYTTY'
}

export enum TaskStatus {
  AVOIN = 'AVOIN',
  AVOIN_PALAUTUNUT = 'AVOIN_PALAUTUNUT',
  PALAUTETTU = 'PALAUTETTU',
  HYVAKSYTTY = 'HYVAKSYTTY',
  ODOTTAA_ERIKOISTUVAN_HYVAKSYNTAA = 'ODOTTAA_ERIKOISTUVAN_HYVAKSYNTAA',
  ODOTTAA_ESIMIEHEN_HYVAKSYNTAA = 'ODOTTAA_ESIMIEHEN_HYVAKSYNTAA',
  ODOTTAA_VASTUUHENKILON_HYVAKSYNTAA = 'ODOTTAA_VASTUUHENKILON_HYVAKSYNTAA',
  ODOTTAA_TOISEN_KOULUTTAJAN_HYVAKSYNTAA = 'ODOTTAA_TOISEN_KOULUTTAJAN_HYVAKSYNTAA',
  ODOTTAA_YHTEISIA_MERKINTOJA = 'ODOTTAA_YHTEISIA_MERKINTOJA'
}

export const defaultKoulutuspaikka: Koulutuspaikka = {
  id: null,
  toimipaikallaKoulutussopimus: null,
  erikoisala: '',
  nimi: '',
  yliopisto: ''
}

export const defaultKouluttaja: Kouluttaja = {
  id: null,
  kayttajaId: null,
  kuittausaika: '',
  lahiosoite: '',
  nimi: '',
  nimike: '',
  postitoimipaikka: '',
  puhelin: '',
  sahkoposti: '',
  sopimusHyvaksytty: false,
  toimipaikka: ''
}

export enum KehittamistoimenpideKategoria {
  TYOSSASUORIUTUMINEN = 'TYOSSASUORIUTUMINEN',
  TYOKAYTTAYTYMINEN = 'TYOKAYTTAYTYMINEN',
  POTILASPALAUTE = 'POTILASPALAUTE',
  MUU = 'MUU'
}

export enum KaytannonKoulutusTyyppi {
  OMAN_ERIKOISALAN_KOULUTUS = 'OMAN_ERIKOISALAN_KOULUTUS',
  OMAA_ERIKOISALAA_TUKEVA_KOULUTUS = 'OMAA_ERIKOISALAA_TUKEVA_KOULUTUS',
  TUTKIMUSTYO = 'TUTKIMUSTYO',
  TERVEYSKESKUSTYO = 'TERVEYSKESKUSTYO'
}

export enum ErikoisalaTyyppi {
  LAAKETIEDE = 'LAAKETIEDE',
  HAMMASLAAKETIEDE = 'HAMMASLAAKETIEDE'
}

export enum TyoskentelyjaksoTyyppi {
  TERVEYSKESKUS = 'TERVEYSKESKUS',
  KESKUSSAIRAALA = 'KESKUSSAIRAALA',
  YLIOPISTOLLINEN_SAIRAALA = 'YLIOPISTOLLINEN_SAIRAALA',
  YKSITYINEN = 'YKSITYINEN',
  MUU = 'MUU'
}

export enum ArviointiasteikkoTyyppi {
  EPA = 'EPA',
  ETAPPI = 'ETAPPI'
}

export enum ArviointiasteikonTasoTyyppi {
  // EPA
  OHJAAJAN_TOIMINNAN_SEURAAMINEN = 'OHJAAJAN_TOIMINNAN_SEURAAMINEN',
  TOIMINTA_SUORAN_OHJAUKSEN_ALAISENA = 'TOIMINTA_SUORAN_OHJAUKSEN_ALAISENA',
  TOIMINTA_EPASUORAN_OHJAUKSEN_ALAISENA = 'TOIMINTA_EPASUORAN_OHJAUKSEN_ALAISENA',
  TOIMINTA_ILMAN_OHJAUSTA = 'TOIMINTA_ILMAN_OHJAUSTA',
  TOIMINTA_OHJAAJANA = 'TOIMINTA_OHJAAJANA',

  // ETAPPI
  TULOKAS = 'TULOKAS',
  ALKUVAIHEEN_ERIKOISTUJA = 'ALKUVAIHEEN_ERIKOISTUJA',
  EDISTYNYT_ERIKOISTUJA = 'EDISTYNYT_ERIKOISTUJA',
  ERIKOISLAAKARI = 'ERIKOISLAAKARI',
  ERITYINEN_OSAAMINEN = 'ERITYINEN_OSAAMINEN'
}

export enum PoissaolonSyyTyyppi {
  VAHENNETAAN_YLIMENEVA_AIKA = 'VAHENNETAAN_YLIMENEVA_AIKA',
  VAHENNETAAN_YLIMENEVA_AIKA_PER_VUOSI = 'VAHENNETAAN_YLIMENEVA_AIKA_PER_VUOSI',
  VAHENNETAAN_SUORAAN = 'VAHENNETAAN_SUORAAN'
}

export enum SeurantajaksoTila {
  ODOTTAA_ARVIOINTIA = 'ODOTTAA_ARVIOINTIA',
  ODOTTAA_YHTEISIA_MERKINTOJA = 'ODOTTAA_YHTEISIA_MERKINTOJA',
  ODOTTAA_ARVIOINTIA_JA_YHTEISIA_MERKINTOJA = 'ODOTTAA_ARVIOINTIA_JA_YHTEISIA_MERKINTOJA',
  ODOTTAA_HYVAKSYNTAA = 'ODOTTAA_HYVAKSYNTAA',
  PALAUTETTU_KORJATTAVAKSI = 'PALAUTETTU_KORJATTAVAKSI',
  HYVAKSYTTY = 'HYVAKSYTTY'
}

export const paivakirjamerkintaKoulutuksetId = 1
export const paivakirjamerkintaMuuAiheId = 6

export const vanhatAsetukset = ['678/1998', '1343/2002', '401/2007', '56/2015']
