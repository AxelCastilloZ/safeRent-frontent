import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import i18n from '../../../i18n/instance'
import { errorMessage } from '../../../i18n/messages'
import ConfirmDialog from '../../Dashboard/Components/ConfirmDialog'
import { useRateTenant } from '../hooks/tenantRatingHooks'
import type { MyReservationRating } from '../types/tenantRating'
import { StarInput } from './Stars'

const MAX_COMMENT = 500

interface RateTenantDialogProps {
  tenantName: string
  reservation: MyReservationRating
  onClose: () => void
}

/** Calificar al inquilino de una reserva (o editar la calificación que ya se dio). */
export default function RateTenantDialog({ tenantName, reservation, onClose }: RateTenantDialogProps) {
  useTranslation()
  const rate = useRateTenant()
  const [rating, setRating] = useState(reservation.myRating?.rating ?? 0)
  const [comment, setComment] = useState(reservation.myRating?.comment ?? '')

  return (
    <ConfirmDialog
      title={i18n.t('tenantRatings:rateTitle', { name: tenantName })}
      description={i18n.t('tenantRatings:rateDescription', { property: reservation.property.title })}
      confirmLabel={i18n.t('tenantRatings:save')}
      loading={rate.isPending}
      error={rate.isError ? errorMessage(rate.error) : null}
      confirmDisabled={rating === 0}
      onConfirm={() => rate.mutate({ reservationId: reservation.reservationId, rating, comment: comment.trim() || undefined }, { onSuccess: onClose })}
      onCancel={() => { if (!rate.isPending) onClose() }}
    >
      <div className="mb-4 space-y-4">
        <div>
          <p className="mb-1 text-sm font-semibold text-primary">{i18n.t('tenantRatings:ratingLabel')}</p>
          <StarInput value={rating} onChange={setRating} disabled={rate.isPending} />
          {rating === 0 && <p className="mt-1 text-xs text-muted-ink">{i18n.t('tenantRatings:pickStars')}</p>}
        </div>
        <label className="block text-sm font-semibold text-primary">
          {i18n.t('tenantRatings:commentLabel')}
          <textarea
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            maxLength={MAX_COMMENT}
            rows={3}
            disabled={rate.isPending}
            placeholder={i18n.t('tenantRatings:commentPlaceholder')}
            className="mt-2 block w-full rounded-lg border border-slate-300 p-2 text-sm font-normal"
          />
          <span className="mt-1 block text-right text-xs font-normal text-muted-ink">{comment.length}/{MAX_COMMENT}</span>
        </label>
      </div>
    </ConfirmDialog>
  )
}
