import { useTranslation } from 'react-i18next'
import i18n from '../../../i18n/instance'
import { formatDate } from '../../../i18n/formatters'
import type { ReservationHistoryEntry } from '../models/reservation'

interface ReservationHistoryListProps {
  reservations: ReservationHistoryEntry[]
  /** 'property': lista del inquilino (muestra la propiedad); 'tenant': lista de una propiedad (muestra al inquilino). */
  show: 'property' | 'tenant'
}

/** Lista de reservas del historial: vigente o finalizada, fechas y motivo de cierre. */
export default function ReservationHistoryList({ reservations, show }: ReservationHistoryListProps) {
  useTranslation()
  if (reservations.length === 0) {
    return <p className="rounded-xl border border-dashed border-slate-200 px-4 py-6 text-center text-sm text-muted-ink">{i18n.t('reservations:historyEmpty')}</p>
  }
  return (
    <ol className="flex flex-col gap-3">
      {reservations.map((reservation) => (
        <li key={reservation.id} className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <p className="font-semibold text-primary">
                {show === 'property' ? reservation.property.title : i18n.t('reservations:historyTenant', { name: reservation.tenant.name })}
              </p>
              {show === 'property' && (
                <p className="text-sm text-muted-ink">{i18n.t('reservations:historyOwner', { name: reservation.owner.name })}</p>
              )}
            </div>
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${reservation.active ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
              {reservation.active ? i18n.t('reservations:historyActive') : i18n.t('reservations:historyEnded')}
            </span>
          </div>
          <p className="mt-2 text-sm text-muted-ink">
            {reservation.endedAt
              ? i18n.t('reservations:historyRange', { start: formatDate(reservation.startedAt), end: formatDate(reservation.endedAt) })
              : i18n.t('reservations:historyFrom', { date: formatDate(reservation.startedAt) })}
          </p>
          {reservation.endReason && (
            <p className="mt-2 rounded-lg bg-slate-50 px-3 py-2 text-sm text-primary">{i18n.t('reservations:historyReason', { reason: reservation.endReason })}</p>
          )}
        </li>
      ))}
    </ol>
  )
}
