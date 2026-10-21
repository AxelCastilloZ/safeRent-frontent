import { useOwnerProperties } from '../../hooks/useOwnerProperties';
import { SectionEmpty, SectionError, SectionLoading } from '../ClientHome/SectionStates';
import HomeSection from '../HomeSection';
import PropertyThumbCard from '../PropertyThumbCard';

/** "Propiedades reservadas": las que ya tienen inquilino, con su nombre y la fecha. */
export default function OwnerReservedSection() {
  const properties = useOwnerProperties();
  const reserved = (properties.data ?? [])
    .filter((property) => property.reservedTenantId)
    .sort((a, b) => (b.reservedAt ?? '').localeCompare(a.reservedAt ?? ''));

  return (
    <HomeSection title="Propiedades reservadas" to="/dashboard/owner/properties" linkLabel="Mis propiedades">
      {properties.isPending ? (
        <SectionLoading shape="cards" />
      ) : properties.isError ? (
        <SectionError message="No pudimos cargar tus reservadas." onRetry={() => void properties.refetch()} />
      ) : reserved.length === 0 ? (
        <SectionEmpty title="Aún no tienes propiedades reservadas" description="Cuando un inquilino reserve una de tus propiedades, la verás aquí." />
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {reserved.map((property) => (
            <li key={property.id} className="flex">
              <PropertyThumbCard
                property={property}
                to={`/dashboard/owner/properties/detail/${property.id}`}
                footer={
                  <>
                    Inquilino: {property.reservedTenantName ?? 'No disponible'}
                    {property.reservedAt && <span className="block">Reservada el {new Date(property.reservedAt).toLocaleDateString('es-CR')}</span>}
                  </>
                }
                className="w-full"
              />
            </li>
          ))}
        </ul>
      )}
    </HomeSection>
  );
}
