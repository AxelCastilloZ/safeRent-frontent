import { useTranslation } from 'react-i18next'
import i18n from '../../../i18n/instance'
import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useQuery } from '@tanstack/react-query'
import { X } from 'lucide-react'
import StatusBadge from '../../Property/Components/StatusBadge'
import { statusBadgeVariant } from '../../Property/utils/propertyStatus'
import { propertyService } from '../../Property/services/propertyService'
import { ApiError } from '../../Property/services/api'
import ReservationHistoryList from '../../Reservations/Components/ReservationHistoryList'
import { useOwnerRentalCounts, useUserReservationHistory } from '../../Reservations/hooks/useReservationHistory'
import type { AdminUser } from '../types/user'

interface UserActivityModalProps {
  user: AdminUser
  onClose: () => void
}

/** Vista de administrador: propiedades registradas por un usuario y su historial de reservas como inquilino. */
export default function UserActivityModal({ user, onClose }: UserActivityModalProps) {
  useTranslation()
  const dialog = useRef<HTMLDialogElement>(null)
  const properties = useQuery({
    queryKey: ['admin-user-properties', user.id],
    queryFn: async () => {
      try {
        return await propertyService.getByOwner(user.id)
      } catch (error) {
        if (error instanceof ApiError && error.status === 404) return []
        throw error
      }
    },
  })
  const rentalCounts = useOwnerRentalCounts(user.id)
  const history = useUserReservationHistory(user.id)

  useEffect(() => {
    const element = dialog.current!
    const overflow = document.body.style.overflow
    element.showModal()
    document.body.style.overflow = 'hidden'
    return () => {
      element.close()
      document.body.style.overflow = overflow
    }
  }, [])

  const fullName = [user.name, user.surname1, user.surname2].filter(Boolean).join(' ')
  const loading = <p role="status" className="py-4 text-center text-sm text-muted-ink">{i18n.t('reservations:historyLoading')}</p>
  const failed = <p role="alert" className="py-4 text-center text-sm text-red-700">{i18n.t('reservations:historyLoadError')}</p>

  return createPortal(
    <dialog
      ref={dialog}
      className="m-auto w-[min(640px,92vw)] rounded-2xl border border-slate-200 bg-white p-0 shadow-xl backdrop:bg-slate-900/40"
      aria-labelledby="user-activity-title"
      onCancel={(event) => {
        event.preventDefault()
        onClose()
      }}
    >
      <div className="max-h-[85vh] overflow-y-auto p-6">
        <div className="mb-5 flex items-start justify-between gap-3">
          <h2 id="user-activity-title" className="text-base font-bold text-primary">{i18n.t('reservations:userActivityTitle', { name: fullName })}</h2>
          <button type="button" className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100" aria-label={i18n.t('users:managerolesmodal_cerrar')} onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <section aria-labelledby="user-properties-title" className="mb-6">
          <h3 id="user-properties-title" className="mb-3 text-sm font-bold text-primary">{i18n.t('reservations:userProperties')}</h3>
          {properties.isPending ? loading : properties.isError ? failed : properties.data.length === 0 ? (
            <p className="rounded-xl border border-dashed border-slate-200 px-4 py-6 text-center text-sm text-muted-ink">{i18n.t('reservations:userPropertiesEmpty')}</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {properties.data.map((property) => (
                <li key={property.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-200 px-4 py-3">
                  <div>
                    <p className="font-semibold text-primary">{property.title}</p>
                    <p className="text-sm text-muted-ink">{property.address}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusBadge variant={statusBadgeVariant(property.status)} />
                    {rentalCounts.isSuccess && (
                      <span className="text-xs text-muted-ink">{i18n.t('reservations:timesRented', { count: rentalCounts.data.get(property.id) ?? 0 })}</span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section aria-labelledby="user-reservations-title">
          <h3 id="user-reservations-title" className="mb-3 text-sm font-bold text-primary">{i18n.t('reservations:userReservations')}</h3>
          {history.isPending ? loading : history.isError ? failed : <ReservationHistoryList reservations={history.data} show="property" />}
        </section>

        <div className="mt-6 flex justify-end">
          <button type="button" className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-primary transition hover:bg-slate-50" onClick={onClose}>
            {i18n.t('users:managerolesmodal_cerrar')}
          </button>
        </div>
      </div>
    </dialog>,
    document.body,
  )
}
