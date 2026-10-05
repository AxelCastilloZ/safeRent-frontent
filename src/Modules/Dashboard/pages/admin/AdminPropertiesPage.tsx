import { useState } from 'react';
import { Building2, Check, MapPin, MessageSquareWarning, XCircle } from 'lucide-react';
import StatusBadge from '../../../Property/Components/StatusBadge';
import { statusBadgeVariant } from '../../../Property/utils/propertyStatus';
import { useAdminProperties, useReviewProperty } from '../../../Property/hooks/useAdminProperties';
import type { Property, PropertyStatus } from '../../../Property/types/property';
import NoteDialog from '../../Components/NoteDialog';
import EmptyPanel from '../../Components/EmptyPanel';
import FilterTabs from '../../Components/FilterTabs';
import PageContainer from '../../Components/PageContainer';
import PageHeader from '../../Components/PageHeader';

const filters = [
  { value: 'active', label: 'Activas' },
  { value: 'review', label: 'En revisión' },
  { value: 'inactive', label: 'Inactivas' },
] as const;

type PropertyFilter = (typeof filters)[number]['value'];

const STATUS_BY_FILTER: Record<PropertyFilter, PropertyStatus> = {
  active: 'ACTIVE',
  review: 'PENDING',
  inactive: 'INACTIVE',
};

function formatDate(value: string): string {
  try {
    return new Date(value).toLocaleDateString('es-CR', { year: 'numeric', month: 'short', day: 'numeric' });
  } catch {
    return value;
  }
}

/** Propiedades (admin): revisión real — aprobar, pedir cambios o rechazar lo que envían los propietarios. */
export default function AdminPropertiesPage() {
  const [filter, setFilter] = useState<PropertyFilter>('active');
  const [requestingChanges, setRequestingChanges] = useState<Property | null>(null);
  const [rejecting, setRejecting] = useState<Property | null>(null);
  const [actionError, setActionError] = useState<Record<number, string>>({});

  const status = STATUS_BY_FILTER[filter];
  const properties = useAdminProperties(status);
  const review = useReviewProperty();

  const list = properties.data?.data ?? [];

  async function approve(property: Property) {
    setActionError((prev) => ({ ...prev, [property.id]: '' }));
    try {
      await review.mutateAsync({ id: property.id, data: { status: 'ACTIVE' } });
    } catch (err) {
      setActionError((prev) => ({ ...prev, [property.id]: err instanceof Error ? err.message : 'No se pudo aprobar la propiedad.' }));
    }
  }

  async function submitNote(property: Property, status: 'CHANGES_REQUESTED' | 'INACTIVE', note: string) {
    try {
      await review.mutateAsync({ id: property.id, data: { status, note } });
      setRequestingChanges(null);
      setRejecting(null);
    } catch (err) {
      setActionError((prev) => ({ ...prev, [property.id]: err instanceof Error ? err.message : 'No se pudo completar la acción.' }));
    }
  }

  return (
    <PageContainer>
      <PageHeader title="Propiedades" description="Revisa las propiedades enviadas por los propietarios y aplica el cambio de estado." />
      <FilterTabs label="Estado de la propiedad" options={[...filters]} value={filter} onChange={setFilter} />

      {properties.isPending ? (
        <p role="status" className="py-12 text-center text-sm text-muted-ink">
          Cargando propiedades…
        </p>
      ) : properties.isError ? (
        <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-700">
          No pudimos cargar las propiedades.{' '}
          <button type="button" onClick={() => void properties.refetch()} className="font-semibold underline">
            Reintentar
          </button>
        </div>
      ) : list.length === 0 ? (
        <EmptyPanel icon={Building2} title={`No hay propiedades «${filters.find((f) => f.value === filter)?.label.toLowerCase()}»`} description="Las propiedades que envíen los propietarios aparecerán aquí." />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full min-w-[820px] text-left text-sm">
            <caption className="sr-only">Propiedades: {filters.find((f) => f.value === filter)?.label}</caption>
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-muted-ink">
              <tr>
                {['Propiedad', 'Propietario', 'Ubicación', 'Fecha', 'Estado', 'Acciones'].map((column) => (
                  <th key={column} scope="col" className="px-4 py-3 font-semibold">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {list.map((property) => (
                <tr key={property.id}>
                  <td className="px-4 py-3 font-semibold text-primary">{property.title}</td>
                  <td className="px-4 py-3 text-muted-ink">
                    {property.owner.name} {property.owner.surname1}
                  </td>
                  <td className="px-4 py-3 text-muted-ink">
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin size={14} className="shrink-0" aria-hidden="true" />
                      <span className="max-w-[220px] truncate">{property.address || '—'}</span>
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-ink">{formatDate(property.createdAt)}</td>
                  <td className="px-4 py-3">
                    <StatusBadge variant={statusBadgeVariant(property.status)} />
                  </td>
                  <td className="px-4 py-3">
                    {property.status === 'PENDING' ? (
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          title="Aprobar"
                          aria-label={`Aprobar ${property.title}`}
                          disabled={review.isPending}
                          className="rounded-lg p-1.5 text-slate-500 transition hover:bg-green-50 hover:text-green-700 disabled:opacity-50"
                          onClick={() => void approve(property)}
                        >
                          <Check size={17} />
                        </button>
                        <button
                          type="button"
                          title="Solicitar cambios"
                          aria-label={`Solicitar cambios a ${property.title}`}
                          className="rounded-lg p-1.5 text-slate-500 transition hover:bg-amber-50 hover:text-amber-700"
                          onClick={() => setRequestingChanges(property)}
                        >
                          <MessageSquareWarning size={17} />
                        </button>
                        <button
                          type="button"
                          title="Rechazar"
                          aria-label={`Rechazar ${property.title}`}
                          className="rounded-lg p-1.5 text-slate-500 transition hover:bg-red-50 hover:text-red-600"
                          onClick={() => setRejecting(property)}
                        >
                          <XCircle size={17} />
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400">
                        {property.reviewedAt ? `Revisada el ${formatDate(property.reviewedAt)}` : '—'}
                      </span>
                    )}
                    {actionError[property.id] && <p role="alert" className="mt-1 text-xs text-red-600">{actionError[property.id]}</p>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {requestingChanges && (
        <NoteDialog
          title={`Solicitar cambios: ${requestingChanges.title}`}
          description="El propietario verá esta nota y podrá corregir y volver a enviar la propiedad."
          confirmLabel="Solicitar cambios"
          placeholder="Ej. Falta confirmar la ubicación exacta en el mapa."
          loading={review.isPending}
          error={actionError[requestingChanges.id] || null}
          onConfirm={(note) => void submitNote(requestingChanges, 'CHANGES_REQUESTED', note)}
          onCancel={() => setRequestingChanges(null)}
        />
      )}

      {rejecting && (
        <NoteDialog
          title={`Rechazar: ${rejecting.title}`}
          description="La propiedad queda inactiva y no será visible para inquilinos. El propietario verá el motivo."
          confirmLabel="Rechazar propiedad"
          placeholder="Ej. Las imágenes no corresponden a la dirección indicada."
          loading={review.isPending}
          error={actionError[rejecting.id] || null}
          onConfirm={(note) => void submitNote(rejecting, 'INACTIVE', note)}
          onCancel={() => setRejecting(null)}
        />
      )}
    </PageContainer>
  );
}
