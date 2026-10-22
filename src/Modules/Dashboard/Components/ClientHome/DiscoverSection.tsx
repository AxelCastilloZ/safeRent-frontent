import { useTranslation } from 'react-i18next';
import i18n from '../../../../i18n/instance';
import { useDiscoverProperties } from '../../hooks/useDiscoverProperties';
import HomeSection from '../HomeSection';
import PropertyThumbCard from '../PropertyThumbCard';
import { SectionEmpty, SectionError, SectionLoading } from './SectionStates';

/** "Descubre": las propiedades activas más recientes, en una fila que se desplaza. */
export default function DiscoverSection() {
  useTranslation();
  const discover = useDiscoverProperties();

  return (
    <HomeSection title={i18n.t("dashboard:discoversection_descubre")} to="/explorar" linkLabel="Explorar todas">
      {discover.isPending ? (
        <SectionLoading shape="cards" />
      ) : discover.isError ? (
        <SectionError message={i18n.t("dashboard:discoversection_no_pudimos_cargar_las_propiedades")} onRetry={() => void discover.refetch()} />
      ) : discover.data.length === 0 ? (
        <SectionEmpty title={i18n.t("dashboard:discoversection_no_hay_propiedades_nuevas_por_ahora")} description={i18n.t("dashboard:discoversection_vuelve_pronto_o_explora_todo_el_catalogo")} actionLabel="Explorar propiedades" actionTo="/explorar" />
      ) : (
        <ul className="-mx-1 flex snap-x gap-4 overflow-x-auto px-1 pb-2">
          {discover.data.map((property) => (
            <li key={property.id} className="flex w-60 shrink-0 snap-start">
              <PropertyThumbCard property={property} className="w-full" />
            </li>
          ))}
        </ul>
      )}
    </HomeSection>
  );
}
