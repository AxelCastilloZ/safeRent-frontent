import { LoaderCircle } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import i18n from '../../../i18n/instance'
import { errorMessage } from '../../../i18n/messages'
import { useProposeVisit } from '../hooks/visitHooks'
import type { Visit } from '../types/visit'
import SlotPicker from './SlotPicker'
import VisitDialog from './VisitDialog'

/** El propietario elige otro horario libre; el inquilino deberá aceptarlo. */
export default function ProposeTimeDialog({ visit, onClose }: { visit: Visit; onClose: () => void }) {
  useTranslation()
  const propose = useProposeVisit()
  const [start, setStart] = useState<string | null>(null)

  async function send() {
    if (!start) return
    try {
      await propose.mutateAsync({ id: visit.id, scheduledAt: start })
      onClose()
    } catch {
      // El error se muestra debajo y el calendario se actualiza solo (otra persona pudo tomar ese horario).
    }
  }

  return (
    <VisitDialog title={i18n.t('visits:proposeTitle')} description={i18n.t('visits:proposeDescription', { name: visit.tenant.name })} onClose={onClose}>
      <SlotPicker propertyId={visit.property.id} value={start} excludeStart={visit.scheduledAt} onChange={(slot) => { propose.reset(); setStart(slot?.start ?? null) }} />
      {propose.isError && <p role="alert" className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{errorMessage(propose.error)}</p>}
      <div className="mt-5 flex justify-end">
        <button
          type="button"
          disabled={!start || propose.isPending}
          aria-busy={propose.isPending}
          onClick={() => void send()}
          className="inline-flex items-center gap-2 rounded-xl bg-secondary px-5 py-2.5 text-sm font-bold text-white transition hover:bg-secondary-dark disabled:cursor-not-allowed disabled:opacity-60"
        >
          {i18n.t('visits:sendProposal')}
          {propose.isPending && <LoaderCircle size={16} className="animate-spin" aria-hidden="true" />}
        </button>
      </div>
    </VisitDialog>
  )
}
