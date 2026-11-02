import { Star } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import i18n from '../../../i18n/instance'
import { formatDate } from '../../../i18n/formatters'
import type { MyReservationRating, TenantProfile } from '../types/tenantRating'
import { formatScore } from '../utils/format'
import { Stars } from './Stars'

interface TenantRatingsViewProps {
  profile: TenantProfile
  /** Quien consulta es propietario: puede calificar sus reservas con este inquilino. */
  onRate?: (reservation: MyReservationRating) => void
  /** Texto cuando no hay calificaciones (cambia si el inquilino ve las suyas). */
  emptyTitle: string
  emptyDescription: string
}

const card = 'rounded-2xl border border-slate-200 bg-white p-5 shadow-sm'

function SummaryCard({ profile }: { profile: TenantProfile }) {
  const { average, count, distribution } = profile.summary
  return (
    <section aria-label={i18n.t('tenantRatings:summaryLabel')} className={`${card} grid gap-6 sm:grid-cols-[14rem_1fr] sm:items-center`}>
      <div className="flex flex-col items-center gap-1 text-center">
        {average === null ? (
          <p className="text-lg font-bold text-primary">{i18n.t('tenantRatings:noRatings')}</p>
        ) : (
          <>
            <p className="text-5xl font-extrabold text-primary">{formatScore(average)}</p>
            <p className="text-xs text-muted-ink">{i18n.t('tenantRatings:outOf')}</p>
            <Stars value={average} size={22} className="mt-1" />
          </>
        )}
        <p className="mt-1 text-sm text-muted-ink">{i18n.t('tenantRatings:count', { count })}</p>
      </div>
      <ul className="space-y-1.5">
        {[5, 4, 3, 2, 1].map((star) => (
          <li key={star} className="flex items-center gap-3 text-sm">
            <span className="flex w-10 shrink-0 items-center justify-end gap-1 font-semibold text-primary">{star}<Star size={13} aria-hidden="true" className="fill-amber-400 text-amber-500" /></span>
            <span className="h-2.5 flex-1 overflow-hidden rounded-full bg-slate-100" aria-hidden="true">
              <span className="block h-full rounded-full bg-amber-400" style={{ width: count ? `${(distribution[star] / count) * 100}%` : '0%' }} />
            </span>
            <span className="w-8 shrink-0 text-right text-muted-ink">{distribution[star]}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}

function MyReservations({ reservations, onRate }: { reservations: MyReservationRating[]; onRate: (reservation: MyReservationRating) => void }) {
  return (
    <section aria-labelledby="my-reservations-title" className={card}>
      <h2 id="my-reservations-title" className="text-base font-bold text-primary">{i18n.t('tenantRatings:yourReservations')}</h2>
      <p className="mt-1 text-sm text-muted-ink">{i18n.t('tenantRatings:yourReservationsHint')}</p>
      <ul className="mt-4 space-y-3">
        {reservations.map((reservation) => (
          <li key={reservation.reservationId} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 p-3.5">
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-primary">{reservation.property.title}</p>
              <p className="text-xs text-muted-ink">
                <span className={`mr-2 rounded-full px-2 py-0.5 font-semibold ${reservation.active ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                  {reservation.active ? i18n.t('tenantRatings:reservationActive') : i18n.t('tenantRatings:reservationEnded')}
                </span>
                {reservation.endedAt
                  ? i18n.t('tenantRatings:range', { start: formatDate(reservation.startedAt), end: formatDate(reservation.endedAt) })
                  : i18n.t('tenantRatings:since', { date: formatDate(reservation.startedAt) })}
              </p>
              <div className="mt-1.5 text-xs text-muted-ink">
                {reservation.myRating ? <Stars value={reservation.myRating.rating} size={14} /> : i18n.t('tenantRatings:notRatedYet')}
              </div>
            </div>
            <button
              type="button"
              onClick={() => onRate(reservation)}
              className={reservation.myRating
                ? 'rounded-lg border border-slate-200 px-3.5 py-2 text-xs font-semibold text-primary transition hover:border-secondary'
                : 'rounded-lg bg-secondary px-3.5 py-2 text-xs font-bold text-white transition hover:bg-secondary-dark'}
            >
              {reservation.myRating ? i18n.t('tenantRatings:editRating') : i18n.t('tenantRatings:rate')}
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}

/** Puntaje de un inquilino, lo que dijeron los propietarios y (para un propietario) sus reservas con él para calificar. */
export default function TenantRatingsView({ profile, onRate, emptyTitle, emptyDescription }: TenantRatingsViewProps) {
  useTranslation()
  return (
    <div className="space-y-6">
      <SummaryCard profile={profile} />
      {onRate && profile.myReservations.length > 0 && <MyReservations reservations={profile.myReservations} onRate={onRate} />}

      <section aria-labelledby="ratings-title" className="space-y-3">
        <h2 id="ratings-title" className="text-base font-bold text-primary">{i18n.t('tenantRatings:ownersSay')}</h2>
        {profile.ratings.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-10 text-center">
            <p className="text-sm font-bold text-primary">{emptyTitle}</p>
            <p className="mx-auto mt-1 max-w-sm text-xs text-muted-ink">{emptyDescription}</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {profile.ratings.map((entry) => (
              <li key={entry.id} className={entry.mine ? `${card} border-secondary/40` : card}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <Stars value={entry.rating} size={18} />
                  <span className="text-xs text-muted-ink">{formatDate(entry.createdAt)}</span>
                </div>
                {entry.comment && <p className="mt-2 whitespace-pre-wrap break-words text-sm text-primary">{entry.comment}</p>}
                <p className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-ink">
                  {i18n.t('tenantRatings:byOwner', { owner: entry.owner.name, property: entry.property.title })}
                  {entry.mine && <span className="rounded-full bg-secondary/10 px-2 py-0.5 font-semibold text-secondary">{i18n.t('tenantRatings:yours')}</span>}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
