import { ClipboardList } from 'lucide-react';
import { useState } from 'react';
import EmptyPanel from '../../Components/EmptyPanel';
import FilterTabs from '../../Components/FilterTabs';
import PageContainer from '../../Components/PageContainer';
import PageHeader from '../../Components/PageHeader';
import PendingNotice from '../../Components/PendingNotice';

const filters = [
  { value: 'pending', label: 'Pendientes' },
  { value: 'approved', label: 'Aprobadas' },
  { value: 'rejected', label: 'Rechazadas' },
] as const;

type RequestFilter = (typeof filters)[number]['value'];

const emptyTitles: Record<RequestFilter, string> = {
  pending: 'No hay solicitudes pendientes',
  approved: 'No hay solicitudes aprobadas',
  rejected: 'No hay solicitudes rechazadas',
};

/** Reservaciones / Solicitudes (propietario): filtros e interfaz listos; faltan las reservaciones en el backend. */
export default function OwnerRequestsPage() {
  const [filter, setFilter] = useState<RequestFilter>('pending');

  return (
    <PageContainer>
      <PageHeader title="Reservaciones / Solicitudes" description="Revisa y responde las solicitudes de reservación de tus propiedades." />
      <FilterTabs label="Estado de la solicitud" options={[...filters]} value={filter} onChange={setFilter} />
      <EmptyPanel
        icon={ClipboardList}
        title={emptyTitles[filter]}
        description="Cuando un inquilino solicite una de tus propiedades, la solicitud aparecerá aquí."
      />
      <div className="mt-3">
        <PendingNotice>solicitudes de reservación (listar, aprobar, rechazar) — no hay entidad ni endpoints en el backend.</PendingNotice>
      </div>
    </PageContainer>
  );
}
