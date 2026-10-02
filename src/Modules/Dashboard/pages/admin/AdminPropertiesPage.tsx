import { useState } from 'react';
import EmptyTable from '../../Components/EmptyTable';
import FilterTabs from '../../Components/FilterTabs';
import PageContainer from '../../Components/PageContainer';
import PageHeader from '../../Components/PageHeader';
import PendingNotice from '../../Components/PendingNotice';

const filters = [
  { value: 'review', label: 'En revisión' },
  { value: 'active', label: 'Activas' },
  { value: 'changes', label: 'Requieren cambios' },
  { value: 'inactive', label: 'Inactivas' },
] as const;

type PropertyFilter = (typeof filters)[number]['value'];

const columns = ['Propiedad', 'Propietario', 'Ubicación', 'Fecha', 'Estado', 'Acciones'];

/** Propiedades (admin): tabla y filtros listos; falta el flujo de revisión en el backend. */
export default function AdminPropertiesPage() {
  const [filter, setFilter] = useState<PropertyFilter>('review');
  const current = filters.find((option) => option.value === filter);

  return (
    <PageContainer>
      <PageHeader title="Propiedades" description="Revisa las propiedades publicadas y las que esperan aprobación." />
      <FilterTabs label="Estado de la propiedad" options={[...filters]} value={filter} onChange={setFilter} />
      <EmptyTable
        caption={`Propiedades: ${current?.label}`}
        columns={columns}
        emptyMessage={`No hay propiedades «${current?.label.toLowerCase()}».`}
      />
      <div className="mt-4 space-y-3">
        <PendingNotice>
          revisión de propiedades — el backend solo tiene isActive; faltan los estados (en revisión, requiere cambios, inactiva) y las acciones Aprobar, Solicitar cambios y Rechazar.
        </PendingNotice>
        <PendingNotice>listar todas las propiedades con su propietario requiere un endpoint para administradores.</PendingNotice>
      </div>
    </PageContainer>
  );
}
