import { parseISO } from 'date-fns'

import { OpintooikeusTila } from './constants'

import { ErikoistuvaLaakari, Opintooikeus } from '@/types'

export function resolveOpintooikeusKaytossa(
  erikoistuvaLaakari: ErikoistuvaLaakari
): Opintooikeus | undefined {
  return erikoistuvaLaakari.opintooikeudet.find(
    (o) => o.id === erikoistuvaLaakari.opintooikeusKaytossaId
  )
}

export function filterOpintooikeudetByAllowedStates(
  erikoistuvaLaakari: ErikoistuvaLaakari
): Opintooikeus[] {
  const now = new Date()
  return erikoistuvaLaakari.opintooikeudet.filter(
    (o) =>
      parseISO(o.opintooikeudenMyontamispaiva) <= now &&
      parseISO(o.opintooikeudenPaattymispaiva) >= now &&
      o.erikoisalaLiittynytElsaan === true &&
      (o.tila === OpintooikeusTila.AKTIIVINEN ||
        o.tila === OpintooikeusTila.AKTIIVINEN_EI_LASNA ||
        o.tila === OpintooikeusTila.PASSIIVINEN ||
        o.tila === OpintooikeusTila.VALMISTUNUT)
  )
}
