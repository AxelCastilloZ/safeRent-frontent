import { currentLocale } from '../../../i18n/formatters'

/** "martes, 17 de noviembre, 10:00" en la zona de la propiedad (no en la del navegador). */
export function formatVisitDateTime(iso: string, timezone: string): string {
  try {
    return new Intl.DateTimeFormat(currentLocale(), {
      weekday: 'long', day: 'numeric', month: 'long', hour: 'numeric', minute: '2-digit', timeZone: timezone,
    }).format(new Date(iso))
  } catch {
    return iso
  }
}

/** Fecha y hora cortas para cuándo se pidió o hasta cuándo se espera respuesta (en la zona del navegador). */
export function formatShortDateTime(iso: string): string {
  return new Intl.DateTimeFormat(currentLocale(), { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' }).format(new Date(iso))
}

/** "Costa Rica (GMT-6)": la zona de la propiedad, para que nadie dude de a qué hora es la cita. */
export function zoneLabel(timezone: string): string {
  try {
    const offset = new Intl.DateTimeFormat(currentLocale(), { timeZone: timezone, timeZoneName: 'shortOffset' })
      .formatToParts(new Date()).find((part) => part.type === 'timeZoneName')?.value
    const city = timezone.split('/').pop()?.replace(/_/g, ' ') ?? timezone
    return offset ? `${city} (${offset})` : city
  } catch {
    return timezone
  }
}

/** "10:00" → "10:00 a. m." / "10:00 AM" según el idioma. */
export function formatLocalTime(time: string): string {
  const [hour, minute] = time.split(':').map(Number)
  return new Intl.DateTimeFormat(currentLocale(), { hour: 'numeric', minute: '2-digit' }).format(new Date(2000, 0, 1, hour, minute))
}

const pad = (value: number) => String(value).padStart(2, '0')

/** Día del calendario ("2026-11-17") ↔ fecha local a medianoche. Las claves vienen ya en la zona de la propiedad. */
export const toDayKey = (date: Date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
export function fromDayKey(key: string): Date {
  const [year, month, day] = key.split('-').map(Number)
  return new Date(year, month - 1, day)
}

export function addDays(date: Date, days: number): Date {
  const moved = new Date(date)
  moved.setDate(moved.getDate() + days)
  return moved
}
