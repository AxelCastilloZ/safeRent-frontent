import { useQuery } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { CheckCircle2, MapPin } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import i18n from '../../../i18n/instance'
import { formatDate } from '../../../i18n/formatters'
import OwnerLink from '../../Property/Components/OwnerLink'
import { WithNameLink } from '../../TenantRatings/components/TenantLink'
import { getMyReservationHistory } from '../services/reservationService'
import { hasSeenReservation, markReservationsSeen } from '../utils/seenReservations'

/**
 * Aviso al entrar al panel: si un propietario le reservó una propiedad al usuario y todavía no lo había visto,
 * sale una sola vez en una ventana. Al volver a la pestaña se vuelve a consultar, así que también aparece si la reserva llegó mientras tanto.
 */
export default function NewReservationNotice({ userId }: { userId: number }) {
  useTranslation()
  const router = useRouter()
  const dialog = useRef<HTMLDialogElement>(null)
  // Reservas cerradas en esta sesión: hace que el aviso se esconda al instante sin esperar otra consulta.
  const [closed, setClosed] = useState<number[]>([])
  const history = useQuery({
    queryKey: ['reservation-notice', userId],
    queryFn: () => getMyReservationHistory(),
    retry: false,
  })

  const fresh = (history.data ?? []).filter((reservation) => reservation.active && !closed.includes(reservation.id) && !hasSeenReservation(userId, reservation.id))
  const open = fresh.length > 0

  useEffect(() => {
    const element = dialog.current
    if (!open || !element) return
    const overflow = document.body.style.overflow
    element.showModal()
    document.body.style.overflow = 'hidden'
    return () => {
      element.close()
      document.body.style.overflow = overflow
    }
  }, [open])

  if (!open) return null

  function dismiss(goToReservations: boolean) {
    const ids = fresh.map((reservation) => reservation.id)
    markReservationsSeen(userId, ids)
    setClosed((previous) => [...previous, ...ids])
    if (goToReservations) void router.navigate({ to: '/dashboard/reservations' })
  }

  return createPortal(
    <dialog
      ref={dialog}
      aria-labelledby="new-reservation-title"
      className="m-auto w-[min(460px,92vw)] rounded-2xl border border-slate-200 bg-white p-0 shadow-xl backdrop:bg-slate-900/50"
      onCancel={(event) => { event.preventDefault(); dismiss(false) }}
    >
      <div className="p-6">
        <div className="flex flex-col items-center gap-3 text-center">
          <span className="grid size-14 place-items-center rounded-full bg-green-50 text-green-700"><CheckCircle2 size={32} aria-hidden="true" /></span>
          <h2 id="new-reservation-title" className="text-xl font-extrabold text-primary">{i18n.t('reservations:newReservationTitle', { count: fresh.length })}</h2>
          <p className="text-sm text-muted-ink">{i18n.t('reservations:newReservationDescription', { count: fresh.length })}</p>
        </div>

        <ul className="mt-5 max-h-56 space-y-2.5 overflow-y-auto">
          {fresh.map((reservation) => (
            <li key={reservation.id} className="rounded-xl border border-green-200 bg-green-50/60 p-3.5">
              <p className="font-bold text-primary">{reservation.property.title}</p>
              {reservation.property.address && <p className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-ink"><MapPin size={13} className="shrink-0" aria-hidden="true" /><span className="truncate">{reservation.property.address}</span></p>}
              <p className="mt-1.5 text-xs text-primary">
                <WithNameLink phrase={(owner) => i18n.t('reservations:newReservationBy', { owner, date: formatDate(reservation.startedAt) })}>
                  {/* La ventana vive en el marco del panel y no se cierra sola al navegar: se cierra (y se da por vista) al abrir al propietario. */}
                  <OwnerLink ownerId={reservation.owner.id} name={reservation.owner.name} onNavigate={() => dismiss(false)} />
                </WithNameLink>
              </p>
            </li>
          ))}
        </ul>

        <div className="mt-6 flex flex-wrap items-center justify-end gap-2">
          <button type="button" onClick={() => dismiss(false)} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-primary transition hover:bg-slate-50">{i18n.t('reservations:newReservationClose')}</button>
          <button type="button" onClick={() => dismiss(true)} className="rounded-lg bg-secondary px-4 py-2 text-sm font-bold text-white transition hover:bg-secondary-dark">{i18n.t('reservations:newReservationView')}</button>
        </div>
      </div>
    </dialog>,
    document.body,
  )
}
