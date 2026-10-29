import { Link } from '@tanstack/react-router';
import { CalendarCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import i18n from '../../../i18n/instance';
import { useMyVisits } from '../../Visits/hooks/visitHooks';
import VisitCard from '../../Visits/components/VisitCard';
import { splitVisits } from '../../Visits/utils/groupVisits';
import { SectionLoading } from '../Components/ClientHome/SectionStates';
import EmptyPanel from '../Components/EmptyPanel';
import PageContainer from '../Components/PageContainer';
import PageHeader from '../Components/PageHeader';

/** "Mis citas": las visitas que pidió el inquilino y su estado. */
export default function VisitsPage() {
  useTranslation();
  const visits = useMyVisits();
  const { queue, upcoming, history } = splitVisits(visits.data ?? []);
  const live = [...queue, ...upcoming].sort((a, b) => a.scheduledAt.localeCompare(b.scheduledAt));

  return (
    <PageContainer>
      <PageHeader title={i18n.t('visits:myVisitsTitle')} description={i18n.t('visits:myVisitsDescription')} />

      {visits.isPending ? (
        <SectionLoading shape="cards" />
      ) : visits.isError ? (
        <div role="alert" className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
          <p className="font-bold text-primary">{i18n.t('visits:loadError')}</p>
          <button type="button" onClick={() => void visits.refetch()} className="mt-3 text-sm font-bold text-secondary hover:underline">{i18n.t('visits:retry')}</button>
        </div>
      ) : visits.data.length === 0 ? (
        <EmptyPanel
          icon={CalendarCheck}
          title={i18n.t('visits:emptyMineTitle')}
          description={i18n.t('visits:emptyMineDescription')}
          action={<Link to="/explorar" className="rounded-xl bg-secondary px-5 py-2.5 text-sm font-bold text-white transition hover:bg-secondary-dark">{i18n.t('visits:exploreProperties')}</Link>}
        />
      ) : (
        <div className="space-y-8">
          {live.length > 0 && (
            <section aria-label={i18n.t('visits:sectionUpcoming')}>
              <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-muted-ink">{i18n.t('visits:sectionUpcoming')}</h2>
              <ul className="grid gap-4 lg:grid-cols-2">
                {live.map((visit) => <li key={visit.id}><VisitCard visit={visit} role="tenant" /></li>)}
              </ul>
            </section>
          )}
          {history.length > 0 && (
            <section aria-label={i18n.t('visits:sectionHistory')}>
              <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-muted-ink">{i18n.t('visits:sectionHistory')}</h2>
              <ul className="grid gap-4 lg:grid-cols-2">
                {history.map((visit) => <li key={visit.id}><VisitCard visit={visit} role="tenant" /></li>)}
              </ul>
            </section>
          )}
        </div>
      )}
    </PageContainer>
  );
}
