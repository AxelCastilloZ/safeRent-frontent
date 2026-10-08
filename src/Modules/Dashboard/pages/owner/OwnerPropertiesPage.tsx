import { Link } from '@tanstack/react-router';
import { AlertTriangle, Building2, EyeOff, MapPin, Plus } from 'lucide-react';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import StatusBadge from '../../../Property/Components/StatusBadge';
import { statusBadgeVariant } from '../../../Property/utils/propertyStatus';
import { propertyService } from '../../../Property/services/propertyService';
import type { Property } from '../../../Property/types/property';
import ConfirmDialog from '../../Components/ConfirmDialog';
import EmptyPanel from '../../Components/EmptyPanel';
import FilterTabs from '../../Components/FilterTabs';
import PageContainer from '../../Components/PageContainer';
import PageHeader from '../../Components/PageHeader';
import { useOwnerProperties } from '../../hooks/useOwnerProperties';

const filters = [
  { value: 'all', label: 'Todas' },
  { value: 'ACTIVE', label: 'Activas' },
  { value: 'PENDING', label: 'En revisión' },
  { value: 'INACTIVE', label: 'Inactivas' },
] as const;

type PropertyFilter = (typeof filters)[number]['value'];

const publishLinkClass = 'inline-flex items-center gap-2 rounded-xl bg-secondary px-4 py-2.5 text-sm font-bold text-white transition hover:bg-secondary-dark';

/** Mis propiedades: lista real del propietario con el estado de revisión de cada una. */
export default function OwnerPropertiesPage() {
  const properties = useOwnerProperties();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<PropertyFilter>('all');
  const [deactivating, setDeactivating] = useState<Property | null>(null);
  const [deactivateError, setDeactivateError] = useState<string | null>(null);

  const deactivate = useMutation({
    mutationFn: (id: number) => propertyService.remove(id),
    onSuccess: () => {
      setDeactivating(null);
      setDeactivateError(null);
      queryClient.invalidateQueries({ queryKey: ['owner-properties'] });
    },
    onError: (err) => {
      setDeactivateError(err instanceof Error ? err.message : 'No se pudo desactivar la propiedad.');
    },
  });

  const visible = (properties.data ?? []).filter((property) =>
    filter === 'all' ? true : property.status === filter,
  );

  return (
    <PageContainer>
      <PageHeader
        title="Mis propiedades"
        description="Gestiona las propiedades que publicas en SafeRent."
        actions={
          <Link to="/dashboard/owner/properties/new" className={publishLinkClass}>
            <Plus size={18} aria-hidden="true" />
            Publicar propiedad
          </Link>
        }
      />
      <FilterTabs label="Estado de la propiedad" options={[...filters]} value={filter} onChange={setFilter} />

      {properties.isPending ? (
        <p role="status" className="py-12 text-center text-sm text-muted-ink">
          Cargando tus propiedades…
        </p>
      ) : properties.isError ? (
        <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-700">
          No pudimos cargar tus propiedades.{' '}
          <button type="button" onClick={() => void properties.refetch()} className="font-semibold underline">
            Reintentar
          </button>
        </div>
      ) : visible.length === 0 ? (
        <EmptyPanel
          icon={Building2}
          title={filter === 'all' ? 'Aún no tienes propiedades' : 'No hay propiedades en este estado'}
          description="Publica tu primera propiedad para empezar a recibir consultas."
          action={
            <Link to="/dashboard/owner/properties/new" className={publishLinkClass}>
              <Plus size={18} aria-hidden="true" />
              Publicar propiedad
            </Link>
          }
        />
      ) : (
        <ul className="space-y-3">
          {visible.map((property) => (
            <li key={property.id} className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="truncate font-bold text-primary">{property.title}</h2>
                  <StatusBadge variant={statusBadgeVariant(property.status)} />
                </div>
                <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-ink">
                  <MapPin size={15} className="shrink-0" aria-hidden="true" />
                  <span className="truncate">{property.address}</span>
                </p>
                {property.reviewNote && (property.status === 'CHANGES_REQUESTED' || property.status === 'INACTIVE') && (
                  <p className="mt-2 flex items-start gap-1.5 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">
                    <AlertTriangle size={14} className="mt-0.5 shrink-0" aria-hidden="true" />
                    <span>{property.reviewNote}</span>
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <Link
                  to="/dashboard/owner/properties/detail/$propertyId"
                  params={{ propertyId: String(property.id) }}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-primary transition hover:border-secondary"
                >
                  Ver
                </Link>
                <Link
                  to="/dashboard/owner/properties/new"
                  search={{ editId: property.id }}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-primary transition hover:border-secondary"
                >
                  Editar
                </Link>
                {property.status !== 'INACTIVE' && property.status !== 'DRAFT' && (
                  <button
                    type="button"
                    onClick={() => { setDeactivating(property); setDeactivateError(null); }}
                    className="rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                  >
                    <EyeOff size={16} className="inline-block mr-1" aria-hidden="true" />
                    Desactivar
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
      {deactivating && (
        <ConfirmDialog
          title={`Desactivar: ${deactivating.title}`}
          description="La propiedad dejará de ser visible para los inquilinos. Podrás volver a publicarla después."
          confirmLabel="Desactivar propiedad"
          danger
          loading={deactivate.isPending}
          error={deactivateError}
          onConfirm={() => deactivate.mutate(deactivating.id)}
          onCancel={() => setDeactivating(null)}
        />
      )}
    </PageContainer>
  );
}
