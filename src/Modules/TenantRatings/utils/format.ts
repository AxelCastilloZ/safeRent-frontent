import { currentLocale } from '../../../i18n/formatters'

/** Puntaje con un decimal y la coma o el punto de la región (4,3 / 4.3). */
export function formatScore(value: number): string {
  return new Intl.NumberFormat(currentLocale(), { minimumFractionDigits: 0, maximumFractionDigits: 1 }).format(value)
}
