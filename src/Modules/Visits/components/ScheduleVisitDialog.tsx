import { CalendarCheck, CheckCircle2, LoaderCircle, MessageCircle } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from '@tanstack/react-router'
import i18n from '../../../i18n/instance'
import { errorMessage } from '../../../i18n/messages'
import { useAuth } from '../../Auth/hooks/authHooks'
import { useStartConversation } from '../../Messages/hooks/messageHooks'
import { HOLD_HOURS } from '../constants'
import { useRequestVisit } from '../hooks/visitHooks'
import type { Slot } from '../types/visit'
import { formatVisitDateTime } from '../utils/format'
import SlotPicker from './SlotPicker'
import VisitDialog from './VisitDialog'

interface ScheduleVisitDialogProps {
  propertyId: number
  /** Propietario de la propiedad: con quien se abre el chat desde la esquina del modal. */
  ownerId: number
  onClose: () => void
}

/** Chatear con el propietario sin salir del flujo de agendar: crea (o retoma) la conversación y entra a ella. */
function ChatWithOwnerButton({ propertyId, ownerId }: { propertyId: number; ownerId: number }) {
  useTranslation()
  const { user } = useAuth()
  const startConversation = useStartConversation()
  return (
    <div className="relative">
      <button
        type="button"
        disabled={!user || startConversation.isPending}
        aria-busy={startConversation.isPending}
        onClick={() => user && startConversation.mutate({ participantIds: [user.id, ownerId], propertyId })}
        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-primary transition hover:border-secondary disabled:cursor-not-allowed disabled:opacity-60"
      >
        {startConversation.isPending ? <LoaderCircle size={14} className="animate-spin" aria-hidden="true" /> : <MessageCircle size={14} aria-hidden="true" />}
        {startConversation.isPending ? i18n.t('visits:chatOpening') : i18n.t('visits:chatWithOwner')}
      </button>
      {startConversation.isError && <p role="alert" className="absolute right-0 top-full z-10 mt-1 w-56 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700 shadow">{i18n.t('visits:chatError')}</p>}
    </div>
  )
}

/** "Agendar cita": el inquilino elige día y hora, deja un mensaje opcional y envía la solicitud. */
export default function ScheduleVisitDialog({ propertyId, ownerId, onClose }: ScheduleVisitDialogProps) {
  useTranslation()
  const request = useRequestVisit()
  const chat = <ChatWithOwnerButton propertyId={propertyId} ownerId={ownerId} />
  const [picked, setPicked] = useState<{ slot: Slot; timezone: string } | null>(null)
  const [note, setNote] = useState('')

  if (request.isSuccess) {
    // Con la confirmación automática la cita ya queda confirmada: no hay nada que esperar.
    const confirmed = request.data.status === 'CONFIRMED'
    return (
      <VisitDialog title={i18n.t(confirmed ? 'visits:requestConfirmedTitle' : 'visits:requestSentTitle')} onClose={onClose} headerAction={chat}>
        <div className="flex flex-col items-center gap-3 py-4 text-center">
          <span className="grid size-14 place-items-center rounded-full bg-green-50 text-green-700"><CheckCircle2 size={30} aria-hidden="true" /></span>
          <p className="font-bold text-primary">{formatVisitDateTime(request.data.scheduledAt, request.data.timezone)}</p>
          <p className="max-w-sm text-sm text-muted-ink">{confirmed ? i18n.t('visits:requestConfirmedDescription') : i18n.t('visits:requestSentDescription', { hours: HOLD_HOURS })}</p>
          <div className="mt-2 flex flex-wrap justify-center gap-2">
            <Link to="/dashboard/visits" className="rounded-xl bg-secondary px-5 py-2.5 text-sm font-bold text-white transition hover:bg-secondary-dark">{i18n.t('visits:viewMyVisits')}</Link>
            <button type="button" onClick={onClose} className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-primary transition hover:border-secondary">{i18n.t('visits:close')}</button>
          </div>
        </div>
      </VisitDialog>
    )
  }

  return (
    <VisitDialog title={i18n.t('visits:scheduleTitle')} description={i18n.t('visits:scheduleHint')} onClose={onClose} headerAction={chat}>
      <SlotPicker propertyId={propertyId} showAutoConfirm value={picked?.slot.start ?? null} onChange={(slot, timezone) => { request.reset(); setPicked(slot && timezone ? { slot, timezone } : null) }} />

      {picked && (
        <div className="mt-5 space-y-3 border-t border-slate-100 pt-4">
          <p role="status" className="flex items-center gap-2 text-sm font-bold text-primary">
            <CalendarCheck size={18} className="text-secondary" aria-hidden="true" />
            {i18n.t('visits:selectedSlot', { date: formatVisitDateTime(picked.slot.start, picked.timezone) })}
          </p>
          <label className="block text-sm font-medium text-primary">
            {i18n.t('visits:noteLabel')}
            <textarea
              value={note}
              onChange={(event) => setNote(event.target.value)}
              maxLength={500}
              rows={2}
              placeholder={i18n.t('visits:notePlaceholder')}
              className="mt-1 w-full resize-y rounded-xl border border-slate-300 px-3 py-2 text-sm text-primary"
            />
          </label>
        </div>
      )}

      {request.isError && <p role="alert" className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{errorMessage(request.error)}</p>}

      <div className="mt-5 flex justify-end">
        <button
          type="button"
          disabled={!picked || request.isPending}
          aria-busy={request.isPending}
          onClick={() => picked && request.mutate({ propertyId, scheduledAt: picked.slot.start, note: note.trim() || undefined })}
          className="inline-flex items-center gap-2 rounded-xl bg-secondary px-5 py-2.5 text-sm font-bold text-white transition hover:bg-secondary-dark disabled:cursor-not-allowed disabled:opacity-60"
        >
          {i18n.t('visits:sendRequest')}
          {request.isPending && <LoaderCircle size={16} className="animate-spin" aria-hidden="true" />}
        </button>
      </div>
    </VisitDialog>
  )
}
