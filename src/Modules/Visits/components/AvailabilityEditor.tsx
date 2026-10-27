import { CheckCircle2, LoaderCircle } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import i18n from '../../../i18n/instance'
import { errorMessage } from '../../../i18n/messages'
import EmptyPanel from '../../Dashboard/Components/EmptyPanel'
import { SectionError, SectionLoading } from '../../Dashboard/Components/ClientHome/SectionStates'
import { useOwnerProperties } from '../../Dashboard/hooks/useOwnerProperties'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../Property/Components/Select'
import { CalendarClock } from 'lucide-react'
import { useAvailability, useSetAvailability } from '../hooks/visitHooks'
import type { Availability, AvailabilityRule } from '../types/visit'
import { formatLocalTime, zoneLabel } from '../utils/format'

/** Lunes primero: así se lee la semana. 0 = domingo. */
const WEEK_ORDER = [1, 2, 3, 4, 5, 6, 0]
const TIMES = Array.from({ length: 48 }, (_, index) => `${String(Math.floor(index / 2)).padStart(2, '0')}:${index % 2 ? '30' : '00'}`)
const ZONES = [
  'America/Costa_Rica', 'America/Panama', 'America/Mexico_City', 'America/Bogota', 'America/Lima', 'America/Santiago',
  'America/Argentina/Buenos_Aires', 'America/Sao_Paulo', 'America/New_York', 'America/Chicago', 'America/Denver',
  'America/Los_Angeles', 'Europe/Madrid', 'Europe/Paris', 'Europe/Lisbon', 'UTC',
]

interface DayRow { enabled: boolean; start: string; end: string }

function rowsFrom(rules: AvailabilityRule[]): Record<number, DayRow> {
  return Object.fromEntries(WEEK_ORDER.map((weekday) => {
    const windows = rules.filter((rule) => rule.weekday === weekday).sort((a, b) => a.start.localeCompare(b.start))
    // La pantalla maneja una ventana por día: si el backend tiene varias, se muestra de la primera a la última hora.
    return [weekday, windows.length
      ? { enabled: true, start: windows[0].start, end: windows[windows.length - 1].end }
      : { enabled: false, start: '09:00', end: '17:00' }]
  }))
}

function TimeSelect({ label, value, onChange, disabled }: { label: string; value: string; onChange: (value: string) => void; disabled: boolean }) {
  return (
    <Select value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger aria-label={label} className="!min-h-10 !py-1.5">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {TIMES.map((time) => <SelectItem key={time} value={time}>{formatLocalTime(time)}</SelectItem>)}
      </SelectContent>
    </Select>
  )
}

function AvailabilityForm({ propertyId, availability }: { propertyId: number; availability: Availability }) {
  useTranslation()
  const save = useSetAvailability(propertyId)
  const [timezone, setTimezone] = useState(availability.timezone)
  const [rows, setRows] = useState(() => rowsFrom(availability.rules))
  const [invalid, setInvalid] = useState(false)

  const change = (weekday: number, patch: Partial<DayRow>) => {
    save.reset()
    setInvalid(false)
    setRows((previous) => ({ ...previous, [weekday]: { ...previous[weekday], ...patch } }))
  }

  function submit() {
    const rules = WEEK_ORDER.filter((weekday) => rows[weekday].enabled).map((weekday) => ({ weekday, start: rows[weekday].start, end: rows[weekday].end }))
    if (rules.some((rule) => rule.start >= rule.end)) { setInvalid(true); return }
    save.mutate({ timezone, rules })
  }

  const zones = ZONES.includes(timezone) ? ZONES : [timezone, ...ZONES]
  return (
    <div className="space-y-5">
      {availability.isDefault && !save.isSuccess && <p role="status" className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-900">{i18n.t('visits:defaultNotice')}</p>}

      <div className="max-w-sm">
        <label className="mb-1.5 block text-sm font-medium text-primary">{i18n.t('visits:timezoneLabel')}</label>
        <Select value={timezone} onValueChange={(zone) => { save.reset(); setTimezone(zone) }}>
          <SelectTrigger aria-label={i18n.t('visits:timezoneLabel')}><SelectValue /></SelectTrigger>
          <SelectContent>{zones.map((zone) => <SelectItem key={zone} value={zone}>{zoneLabel(zone)}</SelectItem>)}</SelectContent>
        </Select>
      </div>

      <ul className="divide-y divide-slate-100 rounded-2xl border border-slate-200 bg-white">
        {WEEK_ORDER.map((weekday) => {
          const row = rows[weekday]
          return (
            <li key={weekday} className="grid items-center gap-3 px-4 py-3 sm:grid-cols-[10rem_1fr]">
              <label className="flex items-center gap-3 text-sm font-semibold text-primary">
                <input type="checkbox" checked={row.enabled} onChange={(event) => change(weekday, { enabled: event.target.checked })} className="size-4 accent-[#0f766e]" />
                {i18n.t(`visits:weekday_${weekday}`)}
              </label>
              {row.enabled ? (
                <div className="grid grid-cols-2 gap-3 sm:max-w-md">
                  <TimeSelect label={`${i18n.t(`visits:weekday_${weekday}`)} · ${i18n.t('visits:fromLabel')}`} value={row.start} disabled={false} onChange={(start) => change(weekday, { start })} />
                  <TimeSelect label={`${i18n.t(`visits:weekday_${weekday}`)} · ${i18n.t('visits:toLabel')}`} value={row.end} disabled={false} onChange={(end) => change(weekday, { end })} />
                </div>
              ) : (
                <span className="text-sm text-muted-ink">{i18n.t('visits:closedDay')}</span>
              )}
            </li>
          )
        })}
      </ul>

      {invalid && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{i18n.t('visits:invalidWindow')}</p>}
      {save.isError && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{errorMessage(save.error)}</p>}
      {save.isSuccess && <p role="status" className="flex items-center gap-2 text-sm font-semibold text-green-700"><CheckCircle2 size={16} aria-hidden="true" />{i18n.t('visits:availabilitySaved')}</p>}

      <button
        type="button"
        disabled={save.isPending}
        aria-busy={save.isPending}
        onClick={submit}
        className="inline-flex items-center gap-2 rounded-xl bg-secondary px-5 py-2.5 text-sm font-bold text-white transition hover:bg-secondary-dark disabled:opacity-60"
      >
        {i18n.t('visits:saveAvailability')}
        {save.isPending && <LoaderCircle size={16} className="animate-spin" aria-hidden="true" />}
      </button>
    </div>
  )
}

/** Días y horas en que el propietario atiende visitas de cada propiedad activa. */
export default function AvailabilityEditor() {
  useTranslation()
  const properties = useOwnerProperties()
  const active = (properties.data ?? []).filter((property) => property.status === 'ACTIVE')
  const [chosen, setChosen] = useState<number | null>(null)
  const propertyId = chosen !== null && active.some((property) => property.id === chosen) ? chosen : active[0]?.id
  const availability = useAvailability(propertyId)

  if (properties.isPending) return <SectionLoading />
  if (properties.isError) return <SectionError message={i18n.t('visits:loadError')} onRetry={() => void properties.refetch()} />
  if (active.length === 0) {
    return <EmptyPanel icon={CalendarClock} title={i18n.t('visits:noActiveProperties')} description={i18n.t('visits:noActivePropertiesDescription')} />
  }

  return (
    <section aria-label={i18n.t('visits:availabilityTitle')} className="space-y-5">
      <p className="max-w-2xl text-sm text-muted-ink">{i18n.t('visits:availabilityDescription', { minutes: availability.data?.slotMinutes ?? 30 })}</p>
      <div className="max-w-sm">
        <label className="mb-1.5 block text-sm font-medium text-primary">{i18n.t('visits:selectProperty')}</label>
        <Select value={String(propertyId)} onValueChange={(value) => setChosen(Number(value))}>
          <SelectTrigger aria-label={i18n.t('visits:selectProperty')}><SelectValue /></SelectTrigger>
          <SelectContent>{active.map((property) => <SelectItem key={property.id} value={String(property.id)}>{property.title}</SelectItem>)}</SelectContent>
        </Select>
      </div>
      {availability.isPending ? (
        <SectionLoading />
      ) : availability.isError ? (
        <SectionError message={errorMessage(availability.error, i18n.t('visits:loadError'))} onRetry={() => void availability.refetch()} />
      ) : (
        // Se reinicia solo al cambiar de propiedad: si se reiniciara al refrescar los datos tras guardar, se perdería el aviso de "guardado".
        <AvailabilityForm key={propertyId} propertyId={propertyId!} availability={availability.data} />
      )}
    </section>
  )
}
