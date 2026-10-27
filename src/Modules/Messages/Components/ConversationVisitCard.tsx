import { Link } from '@tanstack/react-router';
import { CalendarClock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../Auth/hooks/authHooks';
import { useMyVisits, useReceivedVisits } from '../../Visits/hooks/visitHooks';
import { isLiveVisit } from '../../Visits/utils/groupVisits';
import { formatVisitDateTime } from '../../Visits/utils/format';
import VisitStatusBadge from '../../Visits/components/VisitStatusBadge';
import type { Conversation } from '../types/message';

/** Only visits shared by the participants in this property's conversation. */
export default function ConversationVisitCard({ conversation }: { conversation: Conversation | undefined }) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const property = conversation?.property;
  const owner = Boolean(user && property?.owner.id === user.id);
  const tenant = Boolean(user?.roles.includes('CLIENT') && property && !owner);
  const mine = useMyVisits(tenant);
  const received = useReceivedVisits(owner);
  const query = owner ? received : mine;
  const visit = query.data?.filter(item => item.property.id === property?.id &&
    conversation?.participants.some(participant => participant.id === (owner ? item.tenant.id : item.owner.id)) && isLiveVisit(item))
    .sort((a, b) => Date.parse(a.scheduledAt) - Date.parse(b.scheduledAt))[0];
  if (!visit || (!owner && !tenant)) return null;
  return <div className="shrink-0 border-b border-slate-200 bg-slate-50 px-4 py-3">
    <Link to={owner ? '/dashboard/owner/visits' : '/dashboard/visits'} className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 text-sm transition hover:border-secondary">
      <CalendarClock size={20} className="shrink-0 text-secondary" aria-hidden="true" />
      <div className="min-w-0 flex-1 [overflow-wrap:anywhere]">
        <p className="font-semibold">{t('navigation:myVisits')}</p>
        <p className="text-xs text-muted-ink">{formatVisitDateTime(visit.scheduledAt, visit.timezone)}</p>
      </div>
      <VisitStatusBadge status={visit.status} />
    </Link>
  </div>;
}
