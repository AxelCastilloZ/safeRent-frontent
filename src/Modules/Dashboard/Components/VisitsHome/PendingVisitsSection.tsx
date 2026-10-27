import { Link } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import i18n from '../../../../i18n/instance';
import { useReceivedVisits } from '../../../Visits/hooks/visitHooks';
import { formatShortDateTime, formatVisitDateTime } from '../../../Visits/utils/format';
import { SectionEmpty, SectionError, SectionLoading } from '../ClientHome/SectionStates';
import HomeSection from '../HomeSection';

const SHOWN = 3;

/** "Citas por responder": las solicitudes sin responder, de la más antigua a la más reciente (quién pidió primero). */
export default function PendingVisitsSection() {
  useTranslation();
  const visits = useReceivedVisits();
  // El backend ya entrega las pendientes primero y en orden de llegada.
  const pending = (visits.data ?? []).filter((visit) => visit.status === 'PENDING');

  return (
    <HomeSection title={i18n.t('visits:pendingVisitsTitle')} to="/dashboard/owner/visits" linkLabel={i18n.t('visits:viewAllVisits')}>
      {visits.isPending ? (
        <SectionLoading />
      ) : visits.isError ? (
        <SectionError message={i18n.t('visits:loadError')} onRetry={() => void visits.refetch()} />
      ) : pending.length === 0 ? (
        <SectionEmpty title={i18n.t('visits:pendingVisitsEmptyTitle')} description={i18n.t('visits:pendingVisitsEmptyDescription')} />
      ) : (
        <ul className="-mx-2">
          {pending.slice(0, SHOWN).map((visit, index) => (
            <li key={visit.id} className="flex items-center justify-between gap-3 rounded-xl px-2 py-2.5">
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-primary">{visit.tenant.name} {visit.tenant.surname1} · {visit.property.title}</p>
                <p className="truncate text-xs text-muted-ink first-letter:uppercase">{formatVisitDateTime(visit.scheduledAt, visit.timezone)}</p>
                <p className="mt-0.5 text-xs text-muted-ink">
                  <span className="font-semibold text-amber-800">{i18n.t('visits:queuePosition', { position: index + 1, total: pending.length })}</span>
                  {' · '}{i18n.t('visits:requestedOn', { date: formatShortDateTime(visit.createdAt) })}
                </p>
              </div>
              <Link to="/dashboard/owner/visits" className="shrink-0 rounded-lg bg-secondary px-3 py-1.5 text-xs font-bold text-white transition hover:bg-secondary-dark">{i18n.t('visits:review')}</Link>
            </li>
          ))}
        </ul>
      )}
      {pending.length > SHOWN && <p className="mt-2 text-xs text-muted-ink">+{pending.length - SHOWN}</p>}
    </HomeSection>
  );
}
