import { Link } from '@tanstack/react-router';
import StatusBadge from '../../../Property/Components/StatusBadge';
import { statusBadgeVariant } from '../../../Property/utils/propertyStatus';
import { useOwnerProperties } from '../../hooks/useOwnerProperties';
import { SectionEmpty, SectionError, SectionLoading } from '../ClientHome/SectionStates';
import HomeSection from '../HomeSection';

const SHOWN = 4;

/** "Requieren tu atención": borradores sin enviar y propiedades a las que el administrador pidió cambios. */
export default function AttentionSection() {
  const properties = useOwnerProperties();
  const pending = (properties.data ?? [])
    .filter((property) => property.status === 'CHANGES_REQUESTED' || property.status === 'DRAFT')
    // Primero las que el administrador ya revisó y espera respuesta.
    .sort((a, b) => Number(b.status === 'CHANGES_REQUESTED') - Number(a.status === 'CHANGES_REQUESTED'));

  return (
    <HomeSection title="Requieren tu atención" to="/dashboard/owner/properties" linkLabel="Mis propiedades">
      {properties.isPending ? (
        <SectionLoading />
      ) : properties.isError ? (
        <SectionError message="No pudimos cargar tus propiedades." onRetry={() => void properties.refetch()} />
      ) : pending.length === 0 ? (
        <SectionEmpty title="Todo en orden" description="Ninguna de tus propiedades tiene cambios pendientes ni borradores sin enviar." />
      ) : (
        <>
          <ul className="space-y-3">
            {pending.slice(0, SHOWN).map((property) => (
              <li key={property.id} className="flex items-start justify-between gap-3 rounded-xl border border-slate-100 p-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-primary">{property.title}</p>
                  <div className="mt-1">
                    <StatusBadge variant={statusBadgeVariant(property.status)} />
                  </div>
                  {property.status === 'CHANGES_REQUESTED' && property.reviewNote && (
                    <p className="mt-2 line-clamp-2 text-xs text-muted-ink">{property.reviewNote}</p>
                  )}
                </div>
                <Link
                  to="/dashboard/owner/properties/new"
                  search={{ editId: property.id }}
                  className="shrink-0 rounded-lg bg-secondary px-3 py-1.5 text-xs font-bold text-white transition hover:bg-secondary-dark"
                >
                  {property.status === 'DRAFT' ? 'Continuar' : 'Corregir'}
                </Link>
              </li>
            ))}
          </ul>
          {pending.length > SHOWN && <p className="mt-3 text-xs text-muted-ink">y {pending.length - SHOWN} más en Mis propiedades</p>}
        </>
      )}
    </HomeSection>
  );
}
