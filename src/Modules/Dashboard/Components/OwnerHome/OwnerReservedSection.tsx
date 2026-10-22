import { currentLocale } from '../../../../i18n/formatters';
import { useTranslation } from 'react-i18next';
import i18n from '../../../../i18n/instance';
import { useOwnerProperties } from '../../hooks/useOwnerProperties';
import { SectionEmpty, SectionError, SectionLoading } from '../ClientHome/SectionStates';
import HomeSection from '../HomeSection';
import PropertyThumbCard from '../PropertyThumbCard';

/** "Propiedades reservadas": las que ya tienen inquilino, con su nombre y la fecha. */
export default function OwnerReservedSection() {
  useTranslation();
  const properties = useOwnerProperties();
  const reserved = (properties.data ?? [])
    .filter((property) => property.reservedTenantId)
    .sort((a, b) => (b.reservedAt ?? '').localeCompare(a.reservedAt ?? ''));

  return (
    <HomeSection title={i18n.t("dashboard:ownerreservedsection_propiedades_reservadas")} to="/dashboard/owner/properties" linkLabel="Mis propiedades">
      {properties.isPending ? (
        <SectionLoading shape="cards" />
      ) : properties.isError ? (
        <SectionError message={i18n.t("dashboard:ownerreservedsection_no_pudimos_cargar_tus_reservadas")} onRetry={() => void properties.refetch()} />
      ) : reserved.length === 0 ? (
        <SectionEmpty title={i18n.t("dashboard:ownerreservedsection_aun_no_tienes_propiedades_reservadas")} description={i18n.t("dashboard:ownerreservedsection_cuando_un_inquilino_reserve_una_de_tus_propiedades_la")} />
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {reserved.map((property) => (
            <li key={property.id} className="flex">
              <PropertyThumbCard
                property={property}
                to={`/dashboard/owner/properties/detail/${property.id}`}
                footer={
                  <>{i18n.t("dashboard:ownerreservedsection_inquilino")}{' '}{property.reservedTenantName ?? i18n.t("dashboard:recentsavedsection_no_disponible")}
                    {property.reservedAt && <span className="block">{i18n.t("dashboard:ownerreservedsection_reservada_el")}{' '}{new Date(property.reservedAt).toLocaleDateString(currentLocale())}</span>}
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
