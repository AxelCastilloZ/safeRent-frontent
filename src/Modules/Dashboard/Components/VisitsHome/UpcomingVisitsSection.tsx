import { Link } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import i18n from '../../../../i18n/instance';
import VisitStatusBadge from '../../../Visits/components/VisitStatusBadge';
import { useMyVisits, useReceivedVisits } from '../../../Visits/hooks/visitHooks';
import type { Visit } from '../../../Visits/types/visit';
import { formatVisitDateTime } from '../../../Visits/utils/format';
import { isLiveVisit } from '../../../Visits/utils/groupVisits';
import { SectionEmpty, SectionError, SectionLoading } from '../ClientHome/SectionStates';
import HomeSection from '../HomeSection';

const SHOWN = 3;

interface ListProps {
  role: 'tenant' | 'owner';
  visits: Visit[];
  isPending: boolean;
  isError: boolean;
  onRetry: () => void;
}

/** Citas vivas por fecha. El propietario ve aquí las que ya respondió; las pendientes están en "Citas por responder". */
function UpcomingList({ role, visits, isPending, isError, onRetry }: ListProps) {
  useTranslation();
  const to = role === 'owner' ? '/dashboard/owner/visits' : '/dashboard/visits';
  const upcoming = visits
    .filter((visit) => isLiveVisit(visit) && !(role === 'owner' && visit.status === 'PENDING'))
    .sort((a, b) => a.scheduledAt.localeCompare(b.scheduledAt))
    .slice(0, SHOWN);

  return (
    <HomeSection title={i18n.t('visits:upcomingVisitsTitle')} to={to} linkLabel={i18n.t('visits:viewAllVisits')}>
      {isPending ? (
        <SectionLoading />
      ) : isError ? (
        <SectionError message={i18n.t('visits:loadError')} onRetry={onRetry} />
      ) : upcoming.length === 0 ? (
        <SectionEmpty
          title={i18n.t('visits:upcomingEmptyTitle')}
          description={i18n.t(role === 'owner' ? 'visits:upcomingEmptyOwnerDescription' : 'visits:upcomingEmptyTenantDescription')}
          actionLabel={role === 'tenant' ? i18n.t('visits:exploreProperties') : undefined}
          actionTo={role === 'tenant' ? '/explorar' : undefined}
        />
      ) : (
        <ul className="-mx-2">
          {upcoming.map((visit) => {
            const needsTenant = role === 'tenant' && visit.status === 'COUNTER_PROPOSED';
            return (
              <li key={visit.id}>
                <Link to={to} className="flex items-center justify-between gap-3 rounded-xl px-2 py-2.5 transition hover:bg-slate-50">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-primary">{visit.property.title}</p>
                    <p className="truncate text-xs text-muted-ink first-letter:uppercase">{formatVisitDateTime(visit.scheduledAt, visit.timezone)}</p>
                    <p className="truncate text-xs text-muted-ink">
                      {role === 'owner' ? `${visit.tenant.name} ${visit.tenant.surname1}` : `${visit.owner.name} ${visit.owner.surname1}`}
                      {needsTenant && <span className="font-semibold text-blue-700"> · {i18n.t('visits:needsYourAnswer')}</span>}
                      {role === 'tenant' && visit.status === 'PENDING' && ` · ${i18n.t('visits:waitingOwner')}`}
                      {role === 'owner' && visit.status === 'COUNTER_PROPOSED' && ` · ${i18n.t('visits:waitingTenant')}`}
                    </p>
                  </div>
                  <VisitStatusBadge status={visit.status} />
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </HomeSection>
  );
}

function TenantUpcoming() {
  const visits = useMyVisits();
  return <UpcomingList role="tenant" visits={visits.data ?? []} isPending={visits.isPending} isError={visits.isError} onRetry={() => void visits.refetch()} />;
}

function OwnerUpcoming() {
  const visits = useReceivedVisits();
  return <UpcomingList role="owner" visits={visits.data ?? []} isPending={visits.isPending} isError={visits.isError} onRetry={() => void visits.refetch()} />;
}

/** "Próximas citas" del inicio del inquilino o del propietario. */
export default function UpcomingVisitsSection({ role }: { role: 'tenant' | 'owner' }) {
  return role === 'owner' ? <OwnerUpcoming /> : <TenantUpcoming />;
}
