import { CalendarCheck } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from '../../../../i18n/instance';
import AvailabilityEditor from '../../../Visits/components/AvailabilityEditor';
import VisitCard from '../../../Visits/components/VisitCard';
import { useReceivedVisits } from '../../../Visits/hooks/visitHooks';
import { splitVisits } from '../../../Visits/utils/groupVisits';
import { SectionLoading } from '../../Components/ClientHome/SectionStates';
import EmptyPanel from '../../Components/EmptyPanel';
import FilterTabs from '../../Components/FilterTabs';
import PageContainer from '../../Components/PageContainer';
import PageHeader from '../../Components/PageHeader';

type Tab = 'visits' | 'availability';

/**
 * "Citas" del propietario. Las solicitudes sin responder van primero y en el orden en que llegaron (la más antigua arriba),
 * numeradas, para atender primero a quien pidió primero. La otra pestaña define cuándo atiende visitas.
 */
export default function OwnerVisitsPage() {
  useTranslation();
  const [tab, setTab] = useState<Tab>('visits');
  const visits = useReceivedVisits();
  const { queue, upcoming, history } = splitVisits(visits.data ?? []);

  return (
    <PageContainer>
      <PageHeader title={i18n.t('visits:receivedTitle')} description={i18n.t('visits:receivedDescription')} />
      <FilterTabs
        label={i18n.t('visits:receivedTitle')}
        options={[{ value: 'visits', label: i18n.t('visits:tabVisits') }, { value: 'availability', label: i18n.t('visits:tabAvailability') }]}
        value={tab}
        onChange={setTab}
      />

      {tab === 'availability' ? (
        <AvailabilityEditor />
      ) : visits.isPending ? (
        <SectionLoading shape="cards" />
      ) : visits.isError ? (
        <div role="alert" className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
          <p className="font-bold text-primary">{i18n.t('visits:loadError')}</p>
          <button type="button" onClick={() => void visits.refetch()} className="mt-3 text-sm font-bold text-secondary hover:underline">{i18n.t('visits:retry')}</button>
        </div>
      ) : visits.data.length === 0 ? (
        <EmptyPanel icon={CalendarCheck} title={i18n.t('visits:emptyReceivedTitle')} description={i18n.t('visits:emptyReceivedDescription')} />
      ) : (
        <div className="space-y-8">
          {queue.length > 0 && (
            <section aria-label={i18n.t('visits:sectionQueue')}>
              <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-muted-ink">{i18n.t('visits:sectionQueue')} ({queue.length})</h2>
              <ul className="grid gap-4 lg:grid-cols-2">
                {queue.map((visit, index) => <li key={visit.id}><VisitCard visit={visit} role="owner" position={index + 1} total={queue.length} /></li>)}
              </ul>
            </section>
          )}
          {upcoming.length > 0 && (
            <section aria-label={i18n.t('visits:sectionUpcoming')}>
              <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-muted-ink">{i18n.t('visits:sectionUpcoming')}</h2>
              <ul className="grid gap-4 lg:grid-cols-2">
                {upcoming.map((visit) => <li key={visit.id}><VisitCard visit={visit} role="owner" /></li>)}
              </ul>
            </section>
          )}
          {history.length > 0 && (
            <section aria-label={i18n.t('visits:sectionHistory')}>
              <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-muted-ink">{i18n.t('visits:sectionHistory')}</h2>
              <ul className="grid gap-4 lg:grid-cols-2">
                {history.map((visit) => <li key={visit.id}><VisitCard visit={visit} role="owner" /></li>)}
              </ul>
            </section>
          )}
        </div>
      )}
    </PageContainer>
  );
}
