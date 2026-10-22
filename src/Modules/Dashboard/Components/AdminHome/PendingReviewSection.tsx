import { currentLocale } from '../../../../i18n/formatters';
import { useTranslation } from 'react-i18next';
import i18n from '../../../../i18n/instance';
import { Link } from '@tanstack/react-router';
import { useAdminReviewQueue } from '../../hooks/useAdminReviewQueue';
import { SectionEmpty, SectionError, SectionLoading } from '../ClientHome/SectionStates';
import HomeSection from '../HomeSection';

const SHOWN = 5;

/** "Pendientes de revisión": las 5 que llevan más tiempo esperando, para atenderlas en orden. */
export default function PendingReviewSection() {
  useTranslation();
  const review = useAdminReviewQueue();
  const next = review.data?.queue.slice(0, SHOWN) ?? [];

  return (
    <HomeSection title={i18n.t("dashboard:pendingreviewsection_pendientes_de_revision")} to="/dashboard/admin/properties" linkLabel={i18n.t("dashboard:viewProperties")}>
      {review.isPending ? (
        <SectionLoading />
      ) : review.isError ? (
        <SectionError message={i18n.t("dashboard:pendingreviewsection_no_pudimos_cargar_la_cola_de_revision")} onRetry={() => void review.refetch()} />
      ) : next.length === 0 ? (
        <SectionEmpty title={i18n.t("dashboard:pendingreviewsection_no_hay_propiedades_por_revisar")} description={i18n.t("dashboard:pendingreviewsection_cuando_un_propietario_envie_una_propiedad_aparecera_aqui")} />
      ) : (
        <>
          <ul className="-mx-2">
            {next.map((property) => (
              <li key={property.id} className="flex items-center justify-between gap-3 rounded-xl px-2 py-2.5">
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-primary">{property.title}</p>
                  <p className="truncate text-xs text-muted-ink">
                    {property.owner.name} {property.owner.surname1}{' '}{i18n.t("dashboard:pendingreviewsection_creada_el")}{' '}{new Date(property.createdAt).toLocaleDateString(currentLocale())}
                  </p>
                </div>
                <Link to="/dashboard/admin/properties" className="shrink-0 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-primary transition hover:border-secondary">{i18n.t("dashboard:pendingreviewsection_revisar")}</Link>
              </li>
            ))}
          </ul>
          {(review.data?.total ?? 0) > next.length && (
            <p className="mt-2 text-xs text-muted-ink">{i18n.t("dashboard:pendingreviewsection_y")}{' '}{(review.data?.total ?? 0) - next.length}{' '}{i18n.t("dashboard:pendingreviewsection_mas_en_espera")}</p>
          )}
        </>
      )}
    </HomeSection>
  );
}
