import Vue from 'vue'

import {
  KoejaksonVaiheAllekirjoitus,
  Kouluttaja,
  KoejaksonVaiheHyvaksyja,
  Vastuuhenkilo
} from '@/types'

export function mapAllekirjoitusErikoistuva(
  vue: Vue,
  erikoistuvanNimi?: string | null,
  allekirjoitusPvm?: string | null
): KoejaksonVaiheAllekirjoitus | null {
  return allekirjoitusPvm
    ? {
        nimiAndNimike: `${erikoistuvanNimi}, ${(vue.$t('erikoistuja') as string).toLowerCase()}`,
        pvm: allekirjoitusPvm
      }
    : null
}

export function mapAllekirjoituksetSopimuksenKouluttajat(
  kouluttajat: Kouluttaja[]
): KoejaksonVaiheAllekirjoitus[] | null {
  return kouluttajat
    .filter((k) => k.sopimusHyvaksytty)
    .map((k) => ({
      nimiAndNimike: `${k.nimi}${k.nimike ? ', ' + k.nimike : ''}`,
      pvm: k.kuittausaika
    }))
}

export function mapAllekirjoitusLahikouluttaja(
  vue: Vue,
  kouluttaja?: KoejaksonVaiheHyvaksyja
): KoejaksonVaiheAllekirjoitus | null {
  return kouluttaja?.sopimusHyvaksytty
    ? {
        nimiAndNimike: `${kouluttaja.nimi}, ${(vue.$t('lahikouluttaja') as string).toLowerCase()}`,
        pvm: kouluttaja.kuittausaika
      }
    : null
}

export function mapAllekirjoitusLahiesimies(
  vue: Vue,
  esimies?: KoejaksonVaiheHyvaksyja
): KoejaksonVaiheAllekirjoitus | null {
  return esimies?.sopimusHyvaksytty
    ? {
        nimiAndNimike: `${esimies.nimi}, ${(vue.$t('lahiesimies') as string).toLowerCase()}`,
        pvm: esimies.kuittausaika
      }
    : null
}

export function mapAllekirjoitusVastuuhenkilo(
  vastuuhenkilo: Vastuuhenkilo | null
): KoejaksonVaiheAllekirjoitus | null {
  return vastuuhenkilo && vastuuhenkilo.sopimusHyvaksytty
    ? {
        nimiAndNimike: `${vastuuhenkilo.nimi}${
          vastuuhenkilo.nimike ? ', ' + vastuuhenkilo.nimike : ''
        }`,
        pvm: vastuuhenkilo.kuittausaika
      }
    : null
}
