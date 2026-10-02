import { Link } from '@tanstack/react-router';
import { Heart, MapPin } from 'lucide-react';
import { priceLabel } from '../../Explore/utils/property.utils';
import EmptyPanel from '../Components/EmptyPanel';
import PageContainer from '../Components/PageContainer';
import PageHeader from '../Components/PageHeader';
import PendingNotice from '../Components/PendingNotice';
import { useSavedProperties } from '../hooks/useSavedProperties';

/** Propiedades guardadas con el botón "Guardar" de la propiedad (por ahora solo en este dispositivo). */
export default function SavedPropertiesPage() {
  const { ids, properties, isLoading, unavailableCount } = useSavedProperties();

  return (
    <PageContainer>
      <PageHeader title="Propiedades guardadas" description="Las propiedades que guardaste para revisar después." />

      {ids.length === 0 ? (
        <EmptyPanel
          icon={Heart}
          title="Aún no has guardado propiedades"
          description="Pulsa «Guardar» en una propiedad y aparecerá aquí."
          action={
            <Link to="/explorar" className="rounded-xl bg-secondary px-5 py-2.5 text-sm font-bold text-white transition hover:bg-secondary-dark">
              Explorar propiedades
            </Link>
          }
        />
      ) : isLoading ? (
        <p role="status" className="py-12 text-center text-sm text-muted-ink">
          Cargando tus propiedades guardadas…
        </p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {properties.map((property) => (
            <li key={property.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="font-bold text-primary">{property.title}</h2>
              <p className="mt-2 flex items-start gap-1.5 text-sm text-muted-ink">
                <MapPin size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
                {property.address}
              </p>
              <p className="mt-3 text-lg font-extrabold text-primary">
                {priceLabel(property)} <span className="text-xs font-normal text-muted-ink">/ mes</span>
              </p>
              <Link
                to="/property_detail/$propertyId"
                params={{ propertyId: String(property.id) }}
                className="mt-4 inline-block rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-primary transition hover:border-secondary"
              >
                Ver propiedad
              </Link>
            </li>
          ))}
        </ul>
      )}

      {unavailableCount > 0 && (
        <p role="status" className="mt-4 text-xs text-muted-ink">
          {unavailableCount === 1 ? '1 propiedad guardada ya no está disponible.' : `${unavailableCount} propiedades guardadas ya no están disponibles.`}
        </p>
      )}
      <div className="mt-6">
        <PendingNotice>las guardadas se almacenan solo en este navegador; no hay endpoint para guardarlas en la cuenta.</PendingNotice>
      </div>
    </PageContainer>
  );
}
