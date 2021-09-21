import { parseISO } from 'date-fns'
import isAfter from 'date-fns/isAfter'
import isBefore from 'date-fns/isBefore'
import isDate from 'date-fns/isDate'

export function dateBetween(
  date: string | Date | undefined,
  startDate: string | Date | undefined,
  endDate: string | Date | undefined
) {
  if (date) {
    if (
      (startDate &&
        isBefore(
          isDate(date) ? (date as Date) : parseISO(date as string),
          isDate(startDate) ? (startDate as Date) : parseISO(startDate as string)
        )) ||
      (endDate &&
        isAfter(
          isDate(date) ? (date as Date) : parseISO(date as string),
          isDate(endDate) ? (endDate as Date) : parseISO(endDate as string)
        ))
    ) {
      return false
    }
  }
  return true
}
