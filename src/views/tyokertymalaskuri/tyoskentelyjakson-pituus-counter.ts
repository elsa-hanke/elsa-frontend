/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { endOfYear, parseISO, startOfYear } from 'date-fns'
import { differenceInDays } from 'date-fns/fp'

import {
  HyvaksiluettavatCounterData,
  TyokertymaLaskuriPoissaolo,
  TyokertymaLaskuriTyoskentelyjakso
} from '@/types'
import { PoissaolonSyyTyyppi } from '@/utils/constants'

const HYVAKSILUETTAVAT_DAYS = 30.0

export function calculateHyvaksiluettavatDaysLeft(
  tyoskentelyjaksot: TyokertymaLaskuriTyoskentelyjakso[],
  calculateUntilDate: Date | null
): HyvaksiluettavatCounterData {
  const hyvaksiluettavatCounterData: HyvaksiluettavatCounterData = {
    hyvaksiluettavatDays: new Map(),
    hyvaksiluettavatPerYearMap: getHyvaksiluettavatPerYearMap(tyoskentelyjaksot)
  }

  const keskeytykset = tyoskentelyjaksot
    .flatMap((jakso: TyokertymaLaskuriTyoskentelyjakso) =>
      jakso.poissaolot.map((poissaolo: TyokertymaLaskuriPoissaolo) => {
        poissaolo.tyoskentelyjakso = jakso
        return poissaolo
      })
    )
    .sort((a: TyokertymaLaskuriPoissaolo, b: TyokertymaLaskuriPoissaolo) => {
      if (!a.alkamispaiva && !b.alkamispaiva) return 0
      if (!a.alkamispaiva) return 1
      if (!b.alkamispaiva) return -1
      const dateA = parseISO(a.alkamispaiva)
      const dateB = parseISO(b.alkamispaiva)
      return dateA.getTime() - dateB.getTime()
    })

  keskeytykset.forEach((keskeytys: TyokertymaLaskuriPoissaolo) => {
    const tyoskentelyjaksoFactor = keskeytys.tyoskentelyjakso?.osaaikaprosentti || 100 / 100.0

    calculateAmountOfReducedDaysAndUpdateHyvaksiluettavatCounter(
      keskeytys,
      tyoskentelyjaksoFactor,
      hyvaksiluettavatCounterData,
      calculateUntilDate
    )
  })

  return hyvaksiluettavatCounterData
}

function getHyvaksiluettavatPerYearMap(
  tyoskentelyjaksot: TyokertymaLaskuriTyoskentelyjakso[]
): Map<number, number> {
  const hyvaksiluettavatPerYearMap = new Map<number, number>()

  if (tyoskentelyjaksot.length === 0) {
    return hyvaksiluettavatPerYearMap
  }

  const minDate = new Date(
    Math.min(...tyoskentelyjaksot.map((j) => parseISO(j.alkamispaiva).getTime()))
  )
  const maxDate = tyoskentelyjaksot.some((j) => j.paattymispaiva === null)
    ? new Date()
    : new Date(Math.max(...tyoskentelyjaksot.map((j) => parseISO(j.paattymispaiva)?.getTime())))

  for (let year = minDate.getFullYear(); year <= maxDate.getFullYear(); year++) {
    hyvaksiluettavatPerYearMap.set(year, HYVAKSILUETTAVAT_DAYS)
  }

  return hyvaksiluettavatPerYearMap
}

function calculateAmountOfReducedDaysAndUpdateHyvaksiluettavatCounter(
  keskeytysaika: TyokertymaLaskuriPoissaolo,
  tyoskentelyjaksoFactor: number,
  hyvaksiluettavatCounterData: HyvaksiluettavatCounterData,
  calculateUntilDate: Date | null
): number {
  const endDate = getEndDate(parseISO(keskeytysaika.paattymispaiva!), calculateUntilDate)
  const keskeytysaikaDaysBetween = differenceInDays(endDate, parseISO(keskeytysaika.alkamispaiva!))

  if (keskeytysaikaDaysBetween < 1) return 0.0

  const keskeytysaikaFactor = keskeytysaika.poissaoloprosentti || 100 / 100.0
  const keskeytysaikaLength =
    keskeytysaikaFactor * tyoskentelyjaksoFactor * keskeytysaikaDaysBetween
  const vahennetaanKerran = keskeytysaika.poissaolonSyy!.vahennetaanKerran

  switch (keskeytysaika.poissaolonSyy?.vahennystyyppi) {
    case PoissaolonSyyTyyppi.VAHENNETAAN_SUORAAN: {
      return keskeytysaikaLength
    }
    case PoissaolonSyyTyyppi.VAHENNETAAN_YLIMENEVA_AIKA_PER_VUOSI: {
      if (vahennetaanKerran) {
        hyvaksiluettavatCounterData.hyvaksiluettavatDays.set(
          keskeytysaika.poissaolonSyy.nimi,
          hyvaksiluettavatCounterData.hyvaksiluettavatDays.get(keskeytysaika.poissaolonSyy.nimi) ||
            30.0
        )
      }
      const keskeytysaikaMap = getKeskeytysaikaMap(
        parseISO(keskeytysaika.alkamispaiva!),
        endDate,
        keskeytysaikaFactor,
        tyoskentelyjaksoFactor
      )
      let reducedDaysTotal = 0.0
      keskeytysaikaMap.forEach((days, year) => {
        const hyvaksiLuettavatLeft = vahennetaanKerran
          ? Math.min(
              hyvaksiluettavatCounterData.hyvaksiluettavatPerYearMap.get(year)!,
              hyvaksiluettavatCounterData.hyvaksiluettavatDays.get(
                keskeytysaika.poissaolonSyy.nimi
              )!
            )
          : hyvaksiluettavatCounterData.hyvaksiluettavatPerYearMap.get(year)!

        const { amountOfReducedDays, hyvaksiluettavatUsed } =
          getAmountOfReducedDaysAndHyvaksiluettavatUsed(days, hyvaksiLuettavatLeft)
        if (vahennetaanKerran) {
          hyvaksiluettavatCounterData.hyvaksiluettavatDays.set(
            keskeytysaika.poissaolonSyy.nimi,
            Math.max(
              0.0,
              hyvaksiluettavatCounterData.hyvaksiluettavatDays.get(
                keskeytysaika.poissaolonSyy.nimi
              )! - hyvaksiluettavatUsed
            )
          )
        }
        hyvaksiluettavatCounterData.hyvaksiluettavatPerYearMap.set(
          year,
          Math.max(
            0.0,
            hyvaksiluettavatCounterData.hyvaksiluettavatPerYearMap.get(year)! - hyvaksiluettavatUsed
          )
        )
        reducedDaysTotal += amountOfReducedDays
      })
      return reducedDaysTotal
    }
  }
  return 0.0
}

function getAmountOfReducedDaysAndHyvaksiluettavatUsed(
  keskeytysaikaLength: number,
  hyvaksiluettavatLeft: number
): { amountOfReducedDays: number; hyvaksiluettavatUsed: number } {
  let amountOfReducedDays = 0.0
  let hyvaksiluettavatUsed = 0.0

  if (hyvaksiluettavatLeft === 0.0) {
    amountOfReducedDays = keskeytysaikaLength
  } else if (keskeytysaikaLength >= hyvaksiluettavatLeft) {
    amountOfReducedDays = keskeytysaikaLength - hyvaksiluettavatLeft
    hyvaksiluettavatUsed = hyvaksiluettavatLeft
  } else {
    hyvaksiluettavatUsed = keskeytysaikaLength
  }

  return { amountOfReducedDays, hyvaksiluettavatUsed }
}

function getKeskeytysaikaMap(
  startDate: Date,
  endDate: Date,
  keskeytysaikaFactor: number,
  tyoskentelyjaksoFactor: number
): Map<number, number> {
  const keskeytysaikaMap = new Map<number, number>()

  let currentYear = startDate.getFullYear()
  const lastYear = endDate.getFullYear()

  if (currentYear === lastYear) {
    const days = differenceInDays(endDate, startDate)
    keskeytysaikaMap.set(currentYear, days * keskeytysaikaFactor * tyoskentelyjaksoFactor)
  } else {
    const daysInFirstYear = differenceInDays(endOfYear(startDate), startDate) + 1
    keskeytysaikaMap.set(
      currentYear,
      daysInFirstYear * keskeytysaikaFactor * tyoskentelyjaksoFactor
    )

    currentYear++

    while (currentYear < lastYear) {
      const fullYearDays =
        differenceInDays(
          endOfYear(startOfYear(new Date(currentYear, 0, 1))),
          startOfYear(new Date(currentYear, 0, 1))
        ) + 1
      keskeytysaikaMap.set(currentYear, fullYearDays * keskeytysaikaFactor * tyoskentelyjaksoFactor)
      currentYear++
    }

    const daysInLastYear = differenceInDays(endDate, startOfYear(new Date(lastYear, 0, 1)))
    keskeytysaikaMap.set(currentYear, daysInLastYear * keskeytysaikaFactor * tyoskentelyjaksoFactor)
  }

  return keskeytysaikaMap
}

function getEndDate(endDate: Date, calculateUntilDate: Date | null): Date {
  if (calculateUntilDate) {
    return endDate > calculateUntilDate ? calculateUntilDate : endDate
  } else {
    return endDate
  }
}
