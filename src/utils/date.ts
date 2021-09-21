import { parseISO } from 'date-fns'
import isAfter from 'date-fns/isAfter'
import isBefore from 'date-fns/isBefore'

export function dateBetween(
  date: string | undefined,
  startDate: string | undefined,
  endDate: string | undefined
) {
  if (date) {
    if (
      (startDate && isBefore(parseISO(date), parseISO(startDate))) ||
      (endDate && isAfter(parseISO(date), parseISO(endDate)))
    ) {
      return false
    }
  }
  return true
}
