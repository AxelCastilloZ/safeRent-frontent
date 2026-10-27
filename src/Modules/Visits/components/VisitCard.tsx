import { Link } from '@tanstack/react-router'
import { CalendarCheck, Check, Clock, LoaderCircle, MapPin, MessageCircle } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import i18n from '../../../i18n/instance'
import { errorMessage } from '../../../i18n/messages'
import ReservedChip from '../../Reservations/Components/ReservedChip'
import { useAcceptVisit, useConfirmVisit, useOpenVisitConversation, useReserveFromVisit } from '../hooks/visitHooks'
import type { Visit } from '../types/visit'
import { formatShortDateTime, formatVisitDateTime, zoneLabel } from '../utils/format'
import { isUpcomingVisit } from '../utils/groupVisits'
import CancelVisitDialog from './CancelVisitDialog'
import ProposeTimeDialog from './ProposeTimeDialog'
import VisitStatusBadge from './VisitStatusBadge'

interface VisitCardProps {
  visit: Visit
  /** Desde qué lado se ve la cita: define qué acciones tiene. */
  role: 'tenant' | 'owner'
  /** Lugar en la cola de solicitudes pendientes del propietario (1 = la más antigua). */
  position?: number
  total?: number
}

const primary = 'inline-flex items-center gap-1.5 rounded-lg bg-secondary px-3.5 py-2 text-xs font-bold text-white transition hover:bg-secondary-dark disabled:cursor-not-allowed disabled:opacity-60'
const outline = 'inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3.5 py-2 text-xs font-semibold text-primary transition hover:border-secondary disabled:opacity-60'
const danger = 'inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-50 disabled:opacity-60'

function Spinner({ busy }: { busy: boolean }) {
  return busy ? <LoaderCircle size={14} className="animate-spin" aria-hidden="true" /> : null
}

/** Tarjeta de una cita, con las acciones que le tocan a quien la ve (propietario o inquilino). */
export default function VisitCard({ visit, role, position, total }: VisitCardProps) {
  useTranslation()
  const confirm = useConfirmVisit()
  const accept = useAcceptVisit()
  const reserve = useReserveFromVisit()
  // El chat vive en el área de cada rol: el propietario en su panel y el inquilino en el suyo.
  const startConversation = useOpenVisitConversation(role === 'owner' ? '/dashboard/owner/messages' : '/dashboard/messages')
  const [dialog, setDialog] = useState<'propose' | 'cancel' | null>(null)

  const status = visit.status
  const upcoming = isUpcomingVisit(visit)
  const waiting = status === 'PENDING' || status === 'COUNTER_PROPOSED'
  const cancellable = waiting || (status === 'CONFIRMED' && upcoming)
  const failure = [confirm, accept, reserve, startConversation].find((mutation) => mutation.isError)?.error
  const person = role === 'owner'
    ? i18n.t('visits:requestedBy', { name: `${visit.tenant.name} ${visit.tenant.surname1}` })
    : i18n.t('visits:ownerName', { name: `${visit.owner.name} ${visit.owner.surname1}` })
  const tenantName = visit.tenant.name

  return (
    <article className={`rounded-2xl border bg-white p-5 shadow-sm ${status === 'PENDING' && role === 'owner' ? 'border-amber-200' : 'border-slate-200'}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          {visit.property.status === 'ACTIVE' ? (
            <Link to="/property_detail/$propertyId" params={{ propertyId: String(visit.property.id) }} className="font-bold text-primary hover:underline">{visit.property.title}</Link>
          ) : (
            <p className="font-bold text-primary">{visit.property.title}</p>
          )}
          <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-ink"><MapPin size={13} className="shrink-0" aria-hidden="true" /><span className="truncate">{visit.property.address}</span></p>
        </div>
        <VisitStatusBadge status={status} />
      </div>

      <p className="mt-4 flex items-start gap-2 text-sm font-extrabold text-primary">
        <CalendarCheck size={18} className="mt-0.5 shrink-0 text-secondary" aria-hidden="true" />
        <span>
          <span className="block first-letter:uppercase">{formatVisitDateTime(visit.scheduledAt, visit.timezone)}</span>
          <span className="block text-xs font-normal text-muted-ink">{zoneLabel(visit.timezone)}</span>
        </span>
      </p>

      <p className="mt-3 text-sm text-primary">{person}</p>
      {role === 'owner' && status === 'PENDING' && position && total && (
        <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-ink">
          <span className="rounded-full bg-amber-100 px-2.5 py-0.5 font-bold text-amber-800">{i18n.t('visits:queuePosition', { position, total })}</span>
          <span>{i18n.t('visits:requestedOn', { date: formatShortDateTime(visit.createdAt) })}</span>
        </p>
      )}
      {visit.note && <p className="mt-2 rounded-lg bg-slate-50 px-3 py-2 text-xs text-neutral">{i18n.t('visits:messageLabel', { note: visit.note })}</p>}

      {status === 'COUNTER_PROPOSED' && visit.previousScheduledAt && (
        <p className="mt-2 text-xs text-muted-ink">
          {role === 'tenant'
            ? i18n.t('visits:youAskedFor', { date: formatVisitDateTime(visit.previousScheduledAt, visit.timezone) })
            : i18n.t('visits:tenantAskedFor', { date: formatVisitDateTime(visit.previousScheduledAt, visit.timezone) })}
        </p>
      )}
      {waiting && visit.expiresAt && (
        <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-ink">
          <Clock size={13} aria-hidden="true" />
          {role === 'owner' && status === 'PENDING'
            ? i18n.t('visits:answerBefore', { date: formatShortDateTime(visit.expiresAt) })
            : i18n.t('visits:waitingUntil', { date: formatShortDateTime(visit.expiresAt) })}
        </p>
      )}
      {status === 'CANCELLED' && (
        <p className="mt-2 text-xs text-muted-ink">
          {visit.cancelledBy === 'SYSTEM'
            ? i18n.t('visits:cancelledBySystem')
            : visit.cancelledBy === 'TENANT' ? i18n.t('visits:cancelledByTenant') : i18n.t('visits:cancelledByOwner')}
          {visit.cancelledBy !== 'SYSTEM' && visit.cancelReason && ` · ${i18n.t('visits:cancelReasonShown', { reason: visit.cancelReason })}`}
        </p>
      )}
      {status === 'EXPIRED' && <p className="mt-2 text-xs text-muted-ink">{i18n.t('visits:expiredNote')}</p>}

      {(waiting || status === 'CONFIRMED') && (
        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4">
          {role === 'owner' && status === 'PENDING' && (
            <>
              <button type="button" className={primary} disabled={confirm.isPending} aria-busy={confirm.isPending} onClick={() => confirm.mutate(visit.id)}>
                <Check size={14} aria-hidden="true" />{i18n.t('visits:confirm')}<Spinner busy={confirm.isPending} />
              </button>
              <button type="button" className={outline} onClick={() => setDialog('propose')}>{i18n.t('visits:proposeAnother')}</button>
            </>
          )}
          {role === 'tenant' && status === 'COUNTER_PROPOSED' && (
            <button type="button" className={primary} disabled={accept.isPending} aria-busy={accept.isPending} onClick={() => accept.mutate(visit.id)}>
              <Check size={14} aria-hidden="true" />{i18n.t('visits:acceptProposal')}<Spinner busy={accept.isPending} />
            </button>
          )}
          {role === 'owner' && status === 'CONFIRMED' && (
            visit.property.reserved
              ? <ReservedChip highlight={visit.property.reservedForTenant} label={visit.property.reservedForTenant ? i18n.t('visits:reservedForTenant', { name: tenantName }) : i18n.t('visits:reservedOther')} />
              : (
                <button type="button" className={primary} disabled={reserve.isPending} aria-busy={reserve.isPending} onClick={() => reserve.mutate(visit.id)}>
                  {i18n.t('visits:reserveForTenant', { name: tenantName })}<Spinner busy={reserve.isPending} />
                </button>
              )
          )}
          {status === 'CONFIRMED' && (
            <button type="button" className={outline} disabled={startConversation.isPending} onClick={() => startConversation.mutate(visit.id)}>
              <MessageCircle size={14} aria-hidden="true" />{i18n.t('visits:write')}<Spinner busy={startConversation.isPending} />
            </button>
          )}
          {cancellable && <button type="button" className={`${danger} ml-auto`} onClick={() => setDialog('cancel')}>{i18n.t('visits:cancelVisit')}</button>}
        </div>
      )}
      {failure !== undefined && <p role="alert" className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">{errorMessage(failure)}</p>}

      {dialog === 'propose' && <ProposeTimeDialog visit={visit} onClose={() => setDialog(null)} />}
      {dialog === 'cancel' && <CancelVisitDialog visitId={visit.id} onClose={() => setDialog(null)} />}
    </article>
  )
}
