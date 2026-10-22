import StatusBadge from '../../../Property/Components/StatusBadge';
import { statusBadgeVariant } from '../../../Property/utils/propertyStatus';
import { useOwnerProperties } from '../../hooks/useOwnerProperties';
import { SectionEmpty, SectionError, SectionLoading } from '../ClientHome/SectionStates';
import HomeSection from '../HomeSection';
import PropertyThumbCard from '../PropertyThumbCard';

const SHOWN = 3;

/** "Tus propiedades recientes": las 3 últimas creadas, con su estado. */
export default function RecentOwnerPropertiesSection() {
  const properties = useOwnerProperties();
  const recent = [...(properties.data ?? [])]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt) || b.id - a.id)
    .slice(0, SHOWN);

  return (
    <HomeSection title="Tus propiedades recientes" to="/dashboard/owner/properties" linkLabel="Ver todas">
      {properties.isPending ? (
        <SectionLoading shape="cards" />
      ) : properties.isError ? (
        <SectionError message="No pudimos cargar tus propiedades." onRetry={() => void properties.refetch()} />
      ) : recent.length === 0 ? (
        <SectionEmpty
          title="Aún no has publicado propiedades"
          description="Crea tu primera publicación; la revisará un administrador antes de mostrarse."
          actionLabel="Publicar propiedad"
          actionTo="/dashboard/owner/properties/new"
        />
      ) : (
        <ul className="grid gap-4 sm:grid-cols-3">
          {recent.map((property) => (
            <li key={property.id} className="flex">
              <PropertyThumbCard
                property={property}
                to={`/dashboard/owner/properties/detail/${property.id}`}
                footer={<StatusBadge variant={statusBadgeVariant(property.status)} />}
                className="w-full"
              />
            </li>
          ))}
        </ul>
      )}
    </HomeSection>
  );
}
