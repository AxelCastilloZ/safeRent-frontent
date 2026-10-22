import { useTranslation } from 'react-i18next';
import i18n from '../../../../i18n/instance';
import StatusBadge from '../../../Property/Components/StatusBadge';
import { statusBadgeVariant } from '../../../Property/utils/propertyStatus';
import { useOwnerProperties } from '../../hooks/useOwnerProperties';
import { SectionEmpty, SectionError, SectionLoading } from '../ClientHome/SectionStates';
import HomeSection from '../HomeSection';
import PropertyThumbCard from '../PropertyThumbCard';

const SHOWN = 3;

/** "Tus propiedades recientes": las 3 últimas creadas, con su estado. */
export default function RecentOwnerPropertiesSection() {
  useTranslation();
  const properties = useOwnerProperties();
  const recent = [...(properties.data ?? [])]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt) || b.id - a.id)
    .slice(0, SHOWN);

  return (
    <HomeSection title={i18n.t("dashboard:recentownerpropertiessection_tus_propiedades_recientes")} to="/dashboard/owner/properties" linkLabel="Ver todas">
      {properties.isPending ? (
        <SectionLoading shape="cards" />
      ) : properties.isError ? (
        <SectionError message={i18n.t("dashboard:attentionsection_no_pudimos_cargar_tus_propiedades")} onRetry={() => void properties.refetch()} />
      ) : recent.length === 0 ? (
        <SectionEmpty
          title={i18n.t("dashboard:recentownerpropertiessection_aun_no_has_publicado_propiedades")}
          description={i18n.t("dashboard:recentownerpropertiessection_crea_tu_primera_publicacion_la_revisara_un_administrador_antes")}
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
