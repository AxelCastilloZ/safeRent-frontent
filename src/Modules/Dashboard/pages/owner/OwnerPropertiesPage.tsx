import { Link } from '@tanstack/react-router';
import { Building2, MapPin, Plus } from 'lucide-react';
import { useState } from 'react';
import StatusBadge from '../../../Property/Components/StatusBadge';
import EmptyPanel from '../../Components/EmptyPanel';
import FilterTabs from '../../Components/FilterTabs';
import PageContainer from '../../Components/PageContainer';
import PageHeader from '../../Components/PageHeader';
import PendingNotice from '../../Components/PendingNotice';
import { useOwnerProperties } from '../../hooks/useOwnerProperties';

const filters = [
  { value: 'all', label: 'Todas' },
  { value: 'published', label: 'Publicadas' },
  { value: 'unpublished', label: 'Sin publicar' },
] as const;

type PropertyFilter = (typeof filters)[number]['value'];

const publishLinkClass = 'inline-flex items-center gap-2 rounded-xl bg-secondary px-4 py-2.5 text-sm font-bold text-white transition hover:bg-secondary-dark';

/** Mis propiedades: lista real del propietario con los estados que hoy distingue el backend (isActive). */
export default function OwnerPropertiesPage() {
  const properties = useOwnerProperties();
  const [filter, setFilter] = useState<PropertyFilter>('all');

  const visible = (properties.data ?? []).filter((property) =>
    filter === 'all' ? true : filter === 'published' ? property.isActive : !property.isActive,
  );

  return (
    <PageContainer>
      <PageHeader
        title="Mis propiedades"
        description="Gestiona las propiedades que publicas en SafeRent."
        actions={
          <Link to="/properties/new" className={publishLinkClass}>
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
            <Link to="/properties/new" className={publishLinkClass}>
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
                  <StatusBadge variant={property.isActive ? 'active' : 'draft'} label={property.isActive ? 'Publicada' : 'Sin publicar'} />
                </div>
                <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-ink">
                  <MapPin size={15} className="shrink-0" aria-hidden="true" />
                  <span className="truncate">{property.address}</span>
                </p>
              </div>
              <div className="flex gap-2">
                <Link
                  to="/properties/detail/$propertyId"
                  params={{ propertyId: String(property.id) }}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-primary transition hover:border-secondary"
                >
                  Ver
                </Link>
                <Link
                  to="/properties/new"
                  search={{ editId: property.id }}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-primary transition hover:border-secondary"
                >
                  Editar
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-6">
        <PendingNotice>
          los estados «En revisión», «Requiere cambios» e «Inactiva» no existen en el backend; hoy solo se distingue publicada (isActive) y sin publicar.
        </PendingNotice>
      </div>
    </PageContainer>
  );
}
