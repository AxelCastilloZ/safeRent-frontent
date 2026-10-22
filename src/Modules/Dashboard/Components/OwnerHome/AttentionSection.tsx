import { useTranslation } from 'react-i18next';
import i18n from '../../../../i18n/instance';
import { Link } from '@tanstack/react-router';
import StatusBadge from '../../../Property/Components/StatusBadge';
import { statusBadgeVariant } from '../../../Property/utils/propertyStatus';
import { useOwnerProperties } from '../../hooks/useOwnerProperties';
import { SectionEmpty, SectionError, SectionLoading } from '../ClientHome/SectionStates';
import HomeSection from '../HomeSection';

const SHOWN = 4;

/** "Requieren tu atención": borradores sin enviar y propiedades a las que el administrador pidió cambios. */
export default function AttentionSection() {
  useTranslation();
  const properties = useOwnerProperties();
  const pending = (properties.data ?? [])
    .filter((property) => property.status === 'CHANGES_REQUESTED' || property.status === 'DRAFT')
    // Primero las que el administrador ya revisó y espera respuesta.
    .sort((a, b) => Number(b.status === 'CHANGES_REQUESTED') - Number(a.status === 'CHANGES_REQUESTED'));

  return (
    <HomeSection title={i18n.t("dashboard:attentionsection_requieren_tu_atencion")} to="/dashboard/owner/properties" linkLabel="Mis propiedades">
      {properties.isPending ? (
        <SectionLoading />
      ) : properties.isError ? (
        <SectionError message={i18n.t("dashboard:attentionsection_no_pudimos_cargar_tus_propiedades")} onRetry={() => void properties.refetch()} />
      ) : pending.length === 0 ? (
        <SectionEmpty title={i18n.t("dashboard:attentionsection_todo_en_orden")} description={i18n.t("dashboard:attentionsection_ninguna_de_tus_propiedades_tiene_cambios_pendientes_ni_borradores")} />
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
                  {property.status === 'DRAFT' ? i18n.t("dashboard:attentionsection_continuar") : i18n.t("dashboard:attentionsection_corregir")}
                </Link>
              </li>
            ))}
          </ul>
          {pending.length > SHOWN && <p className="mt-3 text-xs text-muted-ink">{i18n.t("dashboard:pendingreviewsection_y")}{' '}{pending.length - SHOWN}{' '}{i18n.t("dashboard:attentionsection_mas_en_mis_propiedades")}</p>}
        </>
      )}
    </HomeSection>
  );
}
