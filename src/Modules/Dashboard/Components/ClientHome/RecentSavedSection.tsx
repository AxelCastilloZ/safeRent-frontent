import { useTranslation } from 'react-i18next';
import i18n from '../../../../i18n/instance';
import { useQueryClient } from '@tanstack/react-query';
import { savedPropertyKeys, useSavedProperties } from '../../../SavedProperties/hooks/savedPropertyHooks';
import HomeSection from '../HomeSection';
import PropertyThumbCard from '../PropertyThumbCard';
import { SectionEmpty, SectionError, SectionLoading } from './SectionStates';

const SHOWN = 3;

/** "Guardadas recientemente": las 3 más nuevas de GET /saved-properties. */
export default function RecentSavedSection() {
  useTranslation();
  const saved = useSavedProperties();
  const queryClient = useQueryClient();
  const recent = saved.data?.slice(0, SHOWN) ?? [];

  return (
    <HomeSection title={i18n.t("dashboard:recentsavedsection_guardadas_recientemente")} to="/dashboard/saved" linkLabel={i18n.t("dashboard:viewAll")}>
      {saved.isPending ? (
        <SectionLoading shape="cards" />
      ) : saved.isError ? (
        <SectionError message={i18n.t("dashboard:recentsavedsection_no_pudimos_cargar_tus_guardadas")} onRetry={() => void queryClient.invalidateQueries({ queryKey: savedPropertyKeys.all })} />
      ) : recent.length === 0 ? (
        <SectionEmpty
          title={i18n.t("dashboard:recentsavedsection_todavia_no_guardaste_propiedades")}
          description={i18n.t("dashboard:recentsavedsection_pulsa_guardar_en_las_que_te_interesen_para_compararlas")}
          actionLabel={i18n.t("dashboard:exploreProperties")}
          actionTo="/explorar"
        />
      ) : (
        <ul className="grid grid-cols-[repeat(auto-fill,minmax(11rem,1fr))] gap-4">
          {recent.map((property) => (
            <li key={property.id} className="flex">
              {/* Una guardada que ya no está activa no tiene página pública: se quita desde "Ver todas". */}
              <PropertyThumbCard
                property={property}
                unavailable={!property.available}
                badge={property.available ? (property.reserved ? i18n.t("dashboard:recentsavedsection_reservada") : undefined) : i18n.t("dashboard:recentsavedsection_no_disponible")}
                className="w-full"
              />
            </li>
          ))}
        </ul>
      )}
    </HomeSection>
  );
}
