import { useTranslation } from 'react-i18next'
import i18n from '../../../i18n/instance'
import type { VisitStatus } from '../types/visit'

const STYLES: Record<VisitStatus, string> = {
  PENDING: 'bg-amber-100 text-amber-800',
  COUNTER_PROPOSED: 'bg-blue-100 text-blue-700',
  CONFIRMED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-slate-100 text-slate-600',
  EXPIRED: 'bg-slate-100 text-slate-500',
}

export default function VisitStatusBadge({ status }: { status: VisitStatus }) {
  useTranslation()
  return <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${STYLES[status]}`}>{i18n.t(`visits:status_${status}`)}</span>
}
