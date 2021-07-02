import Vue from '*.vue'
import {
  KoejaksonVaiheAllekirjoitus,
  Kouluttaja,
  KoejaksonVaiheHyvaksyja,
  Vastuuhenkilo
} from '@/types'

export function mapAllekirjoitusErikoistuva(
  vue: Vue,
  erikoistuvanNimi?: string,
  allekirjoitusPvm?: string
): KoejaksonVaiheAllekirjoitus {
  return allekirjoitusPvm
    ? ({
        nimiAndNimike: `${erikoistuvanNimi}, ${(vue.$t(
          'erikoistuva-laakari'
        ) as string).toLowerCase()}`,
        pvm: allekirjoitusPvm
      } as KoejaksonVaiheAllekirjoitus)
    : (null as any)
}

export function mapAllekirjoituksetSopimuksenKouluttajat(
  kouluttajat: Kouluttaja[]
): KoejaksonVaiheAllekirjoitus[] {
  return kouluttajat
    .filter((k) => k.sopimusHyvaksytty)
    .map(
      (k) =>
        ({
          nimiAndNimike: `${k.nimi}, ${k.nimike}`,
          pvm: k.kuittausaika
        } as KoejaksonVaiheAllekirjoitus)
    )
}

export function mapAllekirjoitusLahikouluttaja(
  vue: Vue,
  kouluttaja?: KoejaksonVaiheHyvaksyja
): KoejaksonVaiheAllekirjoitus {
  return kouluttaja?.sopimusHyvaksytty
    ? ({
        nimiAndNimike: `${kouluttaja.nimi}, ${(vue.$t('lahikouluttaja') as string).toLowerCase()}`,
        pvm: kouluttaja.kuittausaika
      } as KoejaksonVaiheAllekirjoitus)
    : (null as any)
}

export function mapAllekirjoitusLahiesimies(
  vue: Vue,
  esimies?: KoejaksonVaiheHyvaksyja
): KoejaksonVaiheAllekirjoitus {
  return esimies?.sopimusHyvaksytty
    ? ({
        nimiAndNimike: `${esimies.nimi}, ${(vue.$t('lahiesimies') as string).toLowerCase()}`,
        pvm: esimies.kuittausaika
      } as KoejaksonVaiheAllekirjoitus)
    : (null as any)
}

export function mapAllekirjoitusVastuuhenkilo(
  vastuuhenkilo?: Vastuuhenkilo
): KoejaksonVaiheAllekirjoitus {
  return vastuuhenkilo && vastuuhenkilo.sopimusHyvaksytty
    ? ({
        nimiAndNimike: `${vastuuhenkilo.nimi}, ${vastuuhenkilo.nimike}`,
        pvm: vastuuhenkilo.kuittausaika
      } as KoejaksonVaiheAllekirjoitus)
    : (null as any)
}
