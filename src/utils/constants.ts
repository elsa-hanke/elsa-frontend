/* eslint-disable no-unused-vars */
import { Kouluttaja, Koulutuspaikka, Vaativuustaso, Vastuuhenkilo } from '@/types'

export const vaativuustasot: Vaativuustaso[] = [
  {
    arvo: 1,
    nimi: 'erittain-helppo',
    kuvaus: 'erittain-helppo-kuvaus'
  },
  {
    arvo: 2,
    nimi: 'melko-helppo',
    kuvaus: 'melko-helppo-kuvaus'
  },
  {
    arvo: 3,
    nimi: 'tavanomainen',
    kuvaus: 'tavanomainen-kuvaus'
  },
  {
    arvo: 4,
    nimi: 'melko-vaativa',
    kuvaus: 'melko-vaativa-kuvaus'
  },
  {
    arvo: 5,
    nimi: 'erittain-vaativa',
    kuvaus: 'erittain-vaativa-kuvaus'
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
  ODOTTAA_ESIMIEHEN_HYVAKSYNTAA = 'ODOTTAA_ESIMIEHEN_HYVAKSYNTAA',
  ODOTTAA_VASTUUHENKILON_HYVAKSYNTAA = 'ODOTTAA_VASTUUHENKILON_HYVAKSYNTAA',
  ODOTTAA_TOISEN_KOULUTTAJAN_HYVAKSYNTAA = 'ODOTTAA_TOISEN_KOULUTTAJAN_HYVAKSYNTAA',
  PALAUTETTU_KORJATTAVAKSI = 'PALAUTETTU_KORJATTAVAKSI',
  HYVAKSYTTY = 'HYVAKSYTTY',
  ALLEKIRJOITETTU = 'ALLEKIRJOITETTU',
  ODOTTAA_ALLEKIRJOITUKSIA = 'ODOTTAA_ALLEKIRJOITUKSIA'
}

export enum TerveyskeskuskoulutusjaksonTila {
  ODOTTAA_VIRKAILIJAN_TARKISTUSTA = 'ODOTTAA_VIRKAILIJAN_TARKISTUSTA',
  ODOTTAA_VASTUUHENKILON_HYVAKSYNTAA = 'ODOTTAA_VASTUUHENKILON_HYVAKSYNTAA',
  PALAUTETTU_KORJATTAVAKSI = 'PALAUTETTU_KORJATTAVAKSI',
  HYVAKSYTTY = 'HYVAKSYTTY'
}

export enum TaskStatus {
  AVOIN = 'AVOIN',
  AVOIN_PALAUTUNUT = 'AVOIN_PALAUTUNUT',
  PALAUTETTU = 'PALAUTETTU',
  HYVAKSYTTY = 'HYVAKSYTTY',
  ALLEKIRJOITETTU = 'ALLEKIRJOITETTU',
  ODOTTAA_ALLEKIRJOITUKSIA = 'ODOTTAA_ALLEKIRJOITUKSIA',
  VALMIS_ODOTTAA_ALLEKIRJOITUKSIA = 'VALMIS_ODOTTAA_ALLEKIRJOITUKSIA',
  ODOTTAA_ESIMIEHEN_HYVAKSYNTAA = 'ODOTTAA_ESIMIEHEN_HYVAKSYNTAA',
  ODOTTAA_VASTUUHENKILON_HYVAKSYNTAA = 'ODOTTAA_VASTUUHENKILON_HYVAKSYNTAA',
  ODOTTAA_TOISEN_KOULUTTAJAN_HYVAKSYNTAA = 'ODOTTAA_TOISEN_KOULUTTAJAN_HYVAKSYNTAA',
  ODOTTAA_YHTEISIA_MERKINTOJA = 'ODOTTAA_YHTEISIA_MERKINTOJA'
}

export const defaultKoulutuspaikka: Koulutuspaikka = {
  id: null,
  koulutussopimusOmanYliopistonKanssa: null,
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

export const defaultVastuuhenkilo: Vastuuhenkilo = {
  id: null,
  kuittausaika: '',
  nimi: '',
  nimike: '',
  sopimusHyvaksytty: false,
  puhelin: '',
  sahkoposti: ''
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

export enum ErikoistuvanSeurantaJarjestys {
  OPINTOOIKEUS_PAATTYMASSA,
  OPINTOOIKEUS_ALKAEN,
  TYOSKENTELYAIKAA_VAHITEN,
  TYOSKENTELYAIKAA_ENITEN,
  SUKUNIMI_ASC,
  SUKUNIMI_DESC
}

export enum OpintooikeusTila {
  AKTIIVINEN = 'AKTIIVINEN',
  AKTIIVINEN_EI_LASNA = 'AKTIIVINEN_EI_LASNA',
  PASSIIVINEN = 'PASSIIVINEN',
  VALMISTUNUT = 'VALMISTUNUT',
  PERUUTETTU = 'PERUUTETTU',
  VANHENTUNUT = 'VANHENTUNUT'
}

export enum OpintosuoritusTyyppiEnum {
  JOHTAMISOPINTO = 'JOHTAMISOPINTO',
  SATEILYSUOJAKOULUTUS = 'SATEILYSUOJAKOULUTUS',
  VALTAKUNNALLINEN_KUULUSTELU = 'VALTAKUNNALLINEN_KUULUSTELU',
  KOEJAKSO = 'KOEJAKSO',
  TERVEYSKESKUSKOULUTUSJAKSO = 'TERVEYSKESKUSKOULUTUSJAKSO',
  YLEISLAAKETIETEEN_ERITYISKOULUTUS = 'YLEISLAAKETIETEEN_ERITYISKOULUTUS'
}

export enum KayttajatiliTila {
  AKTIIVINEN = 'AKTIIVINEN',
  PASSIIVINEN = 'PASSIIVINEN',
  KUTSUTTU = 'KUTSUTTU'
}

export enum VastuuhenkilonTehtavatyyppiEnum {
  KOEJAKSOSOPIMUSTEN_JA_KOEJAKSOJEN_HYVAKSYMINEN = 'KOEJAKSOSOPIMUSTEN_JA_KOEJAKSOJEN_HYVAKSYMINEN',
  TERVEYSKESKUSKOULUTUSJAKSOJEN_HYVAKSYMINEN = 'TERVEYSKESKUSKOULUTUSJAKSOJEN_HYVAKSYMINEN',
  VALMISTUMISPYYNNON_OSAAMISEN_ARVIOINTI = 'VALMISTUMISPYYNNON_OSAAMISEN_ARVIOINTI',
  VALMISTUMISPYYNNON_HYVAKSYNTA = 'VALMISTUMISPYYNNON_HYVAKSYNTA'
}

export enum KayttajaJarjestys {
  SUKUNIMI_ASC,
  SUKUNIMI_DESC
}

export enum ReassignedVastuuhenkilonTehtavaTyyppi {
  ADD = 'ADD',
  REMOVE = 'REMOVE'
}

export enum AvoinAsiaTyyppi {
  KOULUTUSSOPIMUS = 'KOULUTUSSOPIMUS',
  ALOITUSKESKUSTELU = 'ALOITUSKESKUSTELU',
  VALIARVIOINTI = 'VALIARVIOINTI',
  KEHITTAMISTOIMENPITEET = 'KEHITTAMISTOIMENPITEET',
  LOPPUKESKUSTELU = 'LOPPUKESKUSTELU',
  VASTUUHENKILON_ARVIO = 'VASTUUHENKILON_ARVIO',
  SEURANTAJAKSO = 'SEURANTAJAKSO',
  TERVEYSKESKUSKOULUTUSJAKSO = 'TERVEYSKESKUSKOULUTUSJAKSO',
  VALMISTUMISPYYNTO = 'VALMISTUMISPYYNTO',
  KOULUTTAJAVALTUUTUS = 'KOULUTTAJAVALTUUTUS'
}

export enum ValmistumispyynnonTila {
  UUSI = 'UUSI',
  ODOTTAA_VASTUUHENKILON_TARKASTUSTA = 'ODOTTAA_VASTUUHENKILON_TARKASTUSTA',
  VASTUUHENKILON_TARKASTUS_PALAUTETTU = 'VASTUUHENKILON_TARKASTUS_PALAUTETTU',
  ODOTTAA_VIRKAILIJAN_TARKASTUSTA = 'ODOTTAA_VIRKAILIJAN_TARKASTUSTA',
  VIRKAILIJAN_TARKASTUS_PALAUTETTU = 'VIRKAILIJAN_TARKASTUS_PALAUTETTU',
  ODOTTAA_VASTUUHENKILON_HYVAKSYNTAA = 'ODOTTAA_VASTUUHENKILON_HYVAKSYNTAA',
  VASTUUHENKILON_HYVAKSYNTA_PALAUTETTU = 'VASTUUHENKILON_HYVAKSYNTA_PALAUTETTU',
  ODOTTAA_ALLEKIRJOITUKSIA = 'ODOTTAA_ALLEKIRJOITUKSIA',
  ALLEKIRJOITETTU = 'ALLEKIRJOITETTU'
}
