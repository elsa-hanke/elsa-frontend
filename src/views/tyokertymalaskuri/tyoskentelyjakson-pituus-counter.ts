// import { endOfYear, startOfYear } from 'date-fns'
// import { differenceInDays } from 'date-fns/fp'
//
// import { HyvaksiluettavatCounterData, Poissaolo, TyokertymaLaskuriTyoskentelyjakso } from '@/types'
// import { PoissaolonSyyTyyppi } from '@/utils/constants'
//
// const HYVAKSILUETTAVAT_DAYS = 30.0
//
// export function calculateHyvaksiluettavatDaysLeft(
//   tyoskentelyjaksot: TyokertymaLaskuriTyoskentelyjakso[],
//   calculateUntilDate: Date | null
// ): HyvaksiluettavatCounterData {
//   const hyvaksiluettavatCounterData: HyvaksiluettavatCounterData = {
//     hyvaksiluettavatDays: new Map(),
//     hyvaksiluettavatPerYearMap: getHyvaksiluettavatPerYearMap(tyoskentelyjaksot)
//   }
//
//   const keskeytykset = tyoskentelyjaksot
//     .flatMap((jakso) => jakso.poissaolot)
//     .sort((a, b) => a.alkamispaiva.getTime() - b.alkamispaiva.getTime())
//
//   keskeytykset.forEach((keskeytys) => {
//     const tyoskentelyjaksoFactor = keskeytys.tyoskentelyjakso.osaaikaprosentti / 100.0
//
//     calculateAmountOfReducedDaysAndUpdateHyvaksiluettavatCounter(
//       keskeytys,
//       tyoskentelyjaksoFactor,
//       hyvaksiluettavatCounterData,
//       calculateUntilDate
//     )
//   })
//
//   return hyvaksiluettavatCounterData
// }

/*
function getHyvaksiluettavatPerYearMap(
  tyoskentelyjaksot: TyokertymaLaskuriTyoskentelyjakso[]
): Map<number, number> {
  const hyvaksiluettavatPerYearMap = new Map<number, number>()

  if (tyoskentelyjaksot.length === 0) {
    return hyvaksiluettavatPerYearMap
  }

  const minDate = new Date(Math.min(...tyoskentelyjaksot.map((j) => j.alkamispaiva.getTime())))
  const maxDate = tyoskentelyjaksot.some((j) => j.paattymispaiva === null)
    ? new Date()
    : new Date(Math.max(...tyoskentelyjaksot.map((j) => j.paattymispaiva!.getTime())))

  for (let year = minDate.getFullYear(); year <= maxDate.getFullYear(); year++) {
    hyvaksiluettavatPerYearMap.set(year, HYVAKSILUETTAVAT_DAYS)
  }

  return hyvaksiluettavatPerYearMap
}

function calculateAmountOfReducedDaysAndUpdateHyvaksiluettavatCounter(
  keskeytysaika: Poissaolo,
  tyoskentelyjaksoFactor: number,
  hyvaksiluettavatCounterData: HyvaksiluettavatCounterData,
  calculateUntilDate: Date | null
): number {
  const endDate = getEndDate(keskeytysaika.paattymispaiva!, calculateUntilDate)
  const keskeytysaikaDaysBetween = differenceInDays(endDate, keskeytysaika.alkamispaiva)

  if (keskeytysaikaDaysBetween < 1) return 0.0

  const keskeytysaikaFactor = keskeytysaika.poissaoloprosentti / 100.0
  const keskeytysaikaLength =
    keskeytysaikaFactor * tyoskentelyjaksoFactor * keskeytysaikaDaysBetween
  const vahennetaanKerran = keskeytysaika.poissaolonSyy.vahennetaanKerran

  switch (keskeytysaika.poissaolonSyy?.vahennystyyppi) {
    case PoissaolonSyyTyyppi.VAHENNETAAN_SUORAAN:
      return keskeytysaikaLength

    case PoissaolonSyyTyyppi.VAHENNETAAN_YLIMENEVA_AIKA_PER_VUOSI:
      if (vahennetaanKerran) {
        hyvaksiluettavatCounterData.hyvaksiluettavatDays.set(
          keskeytysaika.poissaolonSyy,
          hyvaksiluettavatCounterData.hyvaksiluettavatDays.get(keskeytysaika.poissaolonSyy) || 30.0
        )
      }

      const keskeytysaikaMap = getKeskeytysaikaMap(
        keskeytysaika.alkamispaiva,
        endDate,
        keskeytysaikaFactor,
        tyoskentelyjaksoFactor
      )

      let reducedDaysTotal = 0.0

      keskeytysaikaMap.forEach((days, year) => {
        const hyvaksiLuettavatLeft = vahennetaanKerran
          ? Math.min(
              hyvaksiluettavatCounterData.hyvaksiluettavatPerYearMap.get(year)!,
              hyvaksiluettavatCounterData.hyvaksiluettavatDays.get(keskeytysaika.poissaolonSyy)!
            )
          : hyvaksiluettavatCounterData.hyvaksiluettavatPerYearMap.get(year)!

        const { amountOfReducedDays, hyvaksiluettavatUsed } =
          getAmountOfReducedDaysAndHyvaksiluettavatUsed(days, hyvaksiLuettavatLeft)

        if (vahennetaanKerran) {
          hyvaksiluettavatCounterData.hyvaksiluettavatDays.set(
            keskeytysaika.poissaolonSyy,
            Math.max(
              0.0,
              hyvaksiluettavatCounterData.hyvaksiluettavatDays.get(keskeytysaika.poissaolonSyy)! -
                hyvaksiluettavatUsed
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

function getAmountOfReducedDaysAndHyvaksiluettavatUsed(
  keskeytysaikaLength: number,
  hyvaksiluettavatLeft: number
): { amountOfReducedDays: number; hyvaksiluettavatUsed: number } {
  let amountOfReducedDays = 0.0
  let hyvaksiLuettavatUsed = 0.0

  if (hyvaksiluettavatLeft === 0.0) {
    amountOfReducedDays = keskeytysaikaLength
  } else if (keskeytysaikaLength >= hyvaksiluettavatLeft) {
    amountOfReducedDays = keskeytysaikaLength - hyvaksiluettavatLeft
    hyvaksiLuettavatUsed = hyvaksiluettavatLeft
  } else {
    hyvaksiLuettavatUsed = keskeytysaikaLength
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
*/
