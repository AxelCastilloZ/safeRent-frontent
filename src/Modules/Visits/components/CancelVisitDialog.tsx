import { LoaderCircle } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import i18n from '../../../i18n/instance'
import { errorMessage } from '../../../i18n/messages'
import { useCancelVisit } from '../hooks/visitHooks'
import VisitDialog from './VisitDialog'

/** Cancelar una cita, con un motivo opcional que verá la otra persona. */
export default function CancelVisitDialog({ visitId, onClose }: { visitId: number; onClose: () => void }) {
  useTranslation()
  const cancel = useCancelVisit()
  const [reason, setReason] = useState('')

  async function confirm() {
    try {
      await cancel.mutateAsync({ id: visitId, reason })
      onClose()
    } catch {
      // El error se muestra debajo.
    }
  }

  return (
    <VisitDialog title={i18n.t('visits:cancelTitle')} description={i18n.t('visits:cancelDescription')} onClose={onClose}>
      <textarea
        value={reason}
        onChange={(event) => setReason(event.target.value)}
        maxLength={500}
        rows={3}
        aria-label={i18n.t('visits:cancelReasonPlaceholder')}
        placeholder={i18n.t('visits:cancelReasonPlaceholder')}
        className="w-full resize-y rounded-xl border border-slate-300 px-3 py-2 text-sm text-primary"
      />
      {cancel.isError && <p role="alert" className="mt-3 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{errorMessage(cancel.error)}</p>}
      <div className="mt-5 flex flex-wrap justify-end gap-2">
        <button type="button" onClick={onClose} className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-primary transition hover:border-secondary">{i18n.t('visits:keepVisit')}</button>
        <button
          type="button"
          disabled={cancel.isPending}
          aria-busy={cancel.isPending}
          onClick={() => void confirm()}
          className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-red-700 disabled:opacity-60"
        >
          {i18n.t('visits:confirmCancel')}
          {cancel.isPending && <LoaderCircle size={16} className="animate-spin" aria-hidden="true" />}
        </button>
      </div>
    </VisitDialog>
  )
}
