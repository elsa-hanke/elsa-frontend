/* eslint-disable */

import { HyvaksiluettavatCounterData, Poissaolo, TyokertymaLaskuriTyoskentelyjakso } from '@/types'
import { PoissaolonSyyTyyppi } from '@/utils/constants'
import { parseISO } from 'date-fns';
// import { calculateHyvaksiluettavatDaysLeft } from '@/views/tyokertymalaskuri/tyoskentelyjakson-pituus-counter'

const HYVAKSILUETTAVAT_DAYS = 365

export function validateTyoskentelyaika(
  existingTyoskentelyjaksoId: number | null,
  tyoskentelyjaksoStartDate: Date,
  tyoskentelyjaksoEndDate: Date,
  tyoskentelyjaksot: TyokertymaLaskuriTyoskentelyjakso[],
  osaaikaProsentti: number | null = null
): boolean {
  // let hyvaksiluettavatCounterData: HyvaksiluettavatCounterData | null = null
  // function getHyvaksiluettavatCounterData(
  //   tyoskentelyjaksot: TyokertymaLaskuriTyoskentelyjakso[],
  //   calculateUntilDate: Date
  // ): HyvaksiluettavatCounterData {
  //   if (!hyvaksiluettavatCounterData) {
  //     hyvaksiluettavatCounterData = calculateHyvaksiluettavatDaysLeft(
  //       tyoskentelyjaksot,
  //       calculateUntilDate
  //     )
  //   }
  //   return hyvaksiluettavatCounterData
  // }

  if (tyoskentelyjaksoEndDate < tyoskentelyjaksoStartDate) return true

  const date = new Date(tyoskentelyjaksoStartDate)
  while (date <= tyoskentelyjaksoEndDate) {
    const overlappingTyoskentelyjaksotForCurrentDate = tyoskentelyjaksot.filter(
      (tyoskentelyjakso: TyokertymaLaskuriTyoskentelyjakso) => {
        return (
          tyoskentelyjakso.id !== existingTyoskentelyjaksoId &&
          parseISO(tyoskentelyjakso.alkamispaiva) <= date &&
          parseISO(tyoskentelyjakso.paattymispaiva) >= date
        )
      }
    )

    if (overlappingTyoskentelyjaksotForCurrentDate.length === 0) {
      date.setDate(date.getDate() + 1)
      continue
    }

    let overallTyoskentelyaikaFactorForCurrentDate =
      overlappingTyoskentelyjaksotForCurrentDate.reduce(
        (sum, tyoskentelyjakso) => sum + tyoskentelyjakso.osaaikaprosentti / 100.0,
        0
      )

    if (overallTyoskentelyaikaFactorForCurrentDate >= 1) {
      return false
    }

    if (existingTyoskentelyjaksoId === null && osaaikaProsentti !== null) {
      overallTyoskentelyaikaFactorForCurrentDate += osaaikaProsentti / 100.0
    }

    if (overallTyoskentelyaikaFactorForCurrentDate <= 1) {
      date.setDate(date.getDate() + 1)
      continue
    }

    for (const tyoskentelyjakso of overlappingTyoskentelyjaksotForCurrentDate) {
      const keskeytyksetForCurrentDate = tyoskentelyjakso.poissaolot.filter(
        (keskeytys: Poissaolo) => {
          return (
            parseISO(keskeytys.alkamispaiva!) <= date && parseISO(keskeytys.paattymispaiva!) >= date
          )
        }
      )

      // for (const keskeytys of keskeytyksetForCurrentDate) {
      //   const keskeytysaikaFactor =
      //     (keskeytys.poissaoloprosentti! / 100.0) * (tyoskentelyjakso.osaaikaprosentti / 100.0)
      //   const vahennetaanKerran = keskeytys.poissaolonSyy!.vahennetaanKerran
//
      //   switch (keskeytys.poissaolonSyy?.vahennystyyppi) {
      //     case PoissaolonSyyTyyppi.VAHENNETAAN_SUORAAN:
      //       overallTyoskentelyaikaFactorForCurrentDate -= keskeytysaikaFactor
      //       break
//
      //     case PoissaolonSyyTyyppi.VAHENNETAAN_YLIMENEVA_AIKA_PER_VUOSI: {
      //       const counterData = getHyvaksiluettavatCounterData(
      //         tyoskentelyjaksot,
      //         new Date(date.getTime() - 86400000)
      //       )
      //       if (vahennetaanKerran) {
      //         counterData.hyvaksiluettavatDays[keskeytys.poissaolonSyy!.toString()] =
      //           HYVAKSILUETTAVAT_DAYS
      //       }
      //       if (!counterData.hyvaksiluettavatPerYearMap[date.getFullYear()]) {
      //         counterData.hyvaksiluettavatPerYearMap[date.getFullYear()] = HYVAKSILUETTAVAT_DAYS
      //       }
      //       const hyvaksiluettavaFactor = vahennetaanKerran
      //         ? Math.min(
      //             counterData.hyvaksiluettavatPerYearMap[date.getFullYear()]!,
      //             counterData.hyvaksiluettavatDays[keskeytys.poissaolonSyy!.toString()]!
      //           )
      //         : counterData.hyvaksiluettavatPerYearMap[date.getFullYear()]!
      //       const reducedFactor = hyvaksiluettavaFactor - keskeytysaikaFactor
      //       if (reducedFactor < 0) {
      //         overallTyoskentelyaikaFactorForCurrentDate -= Math.abs(reducedFactor)
      //       }
      //       counterData.hyvaksiluettavatPerYearMap[date.getFullYear()] = Math.max(
      //         0,
      //         counterData.hyvaksiluettavatPerYearMap[date.getFullYear()]! - keskeytysaikaFactor
      //       )
      //       if (vahennetaanKerran) {
      //         counterData.hyvaksiluettavatDays[keskeytys.poissaolonSyy!.toString()] = Math.max(
      //           0,
      //           counterData.hyvaksiluettavatDays[keskeytys.poissaolonSyy!.toString()]! -
      //             keskeytysaikaFactor
      //         )
      //       }
      //       break
      //     }
      //     default:
      //       break
      //   }
      // }
    }

    if (overallTyoskentelyaikaFactorForCurrentDate > 1) {
      return false
    }

    date.setDate(date.getDate() + 1)
  }

  return true
}
