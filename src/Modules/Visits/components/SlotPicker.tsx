import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import i18n from '../../../i18n/instance'
import { errorMessage } from '../../../i18n/messages'
import { CALENDAR_DAYS } from '../constants'
import { useSlots } from '../hooks/visitHooks'
import type { Slot } from '../types/visit'
import { addDays, formatLocalTime, fromDayKey, toDayKey, zoneLabel } from '../utils/format'
import VisitCalendar from './VisitCalendar'

interface SlotPickerProps {
  propertyId: number
  /** Inicio (ISO) del horario elegido. */
  value: string | null
  /** Devuelve el horario elegido y la zona horaria de la propiedad (para mostrarlo bien), o null si se deshace la elección. */
  onChange: (slot: Slot | null, timezone?: string) => void
  /** Horario que no se puede volver a elegir (el actual, al proponer otro). */
  excludeStart?: string
}

/** Calendario + horas libres de una propiedad. Elige el primer día con horarios para que pedir una cita sea rápido. */
export default function SlotPicker({ propertyId, value, onChange, excludeStart }: SlotPickerProps) {
  useTranslation()
  const [today] = useState(() => new Date())
  const lastDay = useMemo(() => addDays(today, CALENDAR_DAYS), [today])
  const query = useSlots(propertyId, toDayKey(today), toDayKey(lastDay))
  const [pickedDay, setPickedDay] = useState<string | null>(null)

  const { byDay, freeDays } = useMemo(() => {
    const byDay = new Map<string, Slot[]>()
    for (const slot of query.data?.slots ?? []) byDay.set(slot.localDate, [...(byDay.get(slot.localDate) ?? []), slot])
    const isFree = (slot: Slot) => slot.available && slot.start !== excludeStart
    const freeDays = new Set([...byDay].filter(([, slots]) => slots.some(isFree)).map(([day]) => day))
    return { byDay, freeDays }
  }, [query.data, excludeStart])

  const firstFreeDay = [...freeDays].sort()[0]
  const activeDay = pickedDay && freeDays.has(pickedDay) ? pickedDay : firstFreeDay

  if (query.isPending) {
    return <div role="status" aria-label={i18n.t('visits:loadingTimes')} className="h-72 animate-pulse rounded-xl bg-slate-100" />
  }
  if (query.isError) {
    return (
      <div role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-700">
        {errorMessage(query.error, i18n.t('visits:loadError'))}
        <button type="button" onClick={() => void query.refetch()} className="ml-2 font-semibold underline">{i18n.t('visits:retry')}</button>
      </div>
    )
  }
  if (query.data.propertyReserved) {
    return <p role="status" className="rounded-xl bg-amber-50 p-4 text-sm font-semibold text-amber-900">{i18n.t('visits:propertyReservedNotice')}</p>
  }
  if (freeDays.size === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200 px-4 py-8 text-center">
        <p className="text-sm font-bold text-primary">{i18n.t('visits:noSlotsTitle')}</p>
        <p className="mx-auto mt-1 max-w-xs text-xs text-muted-ink">{i18n.t('visits:noSlotsDescription')}</p>
      </div>
    )
  }

  const daySlots = activeDay ? byDay.get(activeDay) ?? [] : []
  return (
    <div className="grid gap-5 sm:grid-cols-[minmax(0,1fr)_minmax(0,15rem)]">
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-ink">{i18n.t('visits:chooseDay')}</p>
        <VisitCalendar
          key={firstFreeDay}
          selected={activeDay ? fromDayKey(activeDay) : undefined}
          onSelect={(day) => { setPickedDay(toDayKey(day)); onChange(null) }}
          isDayFree={(day) => freeDays.has(toDayKey(day))}
          firstMonth={today}
          lastMonth={lastDay}
        />
      </div>
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-ink">{i18n.t('visits:chooseTime')}</p>
        {daySlots.length === 0 ? (
          <p className="text-sm text-muted-ink">{i18n.t('visits:noTimesThisDay')}</p>
        ) : (
          <ul className="grid max-h-72 grid-cols-3 gap-2 overflow-y-auto pr-1 sm:grid-cols-2">
            {daySlots.map((slot) => {
              const free = slot.available && slot.start !== excludeStart
              const selected = value === slot.start
              return (
                <li key={slot.start}>
                  <button
                    type="button"
                    disabled={!free}
                    aria-pressed={selected}
                    onClick={() => onChange(slot, query.data.timezone)}
                    className={`w-full whitespace-nowrap rounded-lg border px-2 py-2 text-sm font-semibold transition ${
                      selected
                        ? 'border-primary bg-primary text-white'
                        : free
                          ? 'border-slate-200 bg-white text-primary hover:border-secondary'
                          : 'cursor-not-allowed border-slate-100 bg-slate-50 text-slate-300 line-through'
                    }`}
                  >
                    {formatLocalTime(slot.localTime)}
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </div>
      <p className="text-xs text-muted-ink sm:col-span-2">{i18n.t('visits:timeZoneNote', { zone: zoneLabel(query.data.timezone) })}</p>
    </div>
  )
}
