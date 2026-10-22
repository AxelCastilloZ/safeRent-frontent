import { currentLocale } from '../../../../i18n/formatters';
import { useTranslation } from 'react-i18next';
import i18n from '../../../../i18n/instance';
import { Link } from '@tanstack/react-router';
import { ImageOff, MessageCircle } from 'lucide-react';
import PriceDetails from '../../../Explore/PriceDetails';
import { photoUrl, priceLabel } from '../../../Explore/utils/property.utils';
import { useStartConversation } from '../../../Messages/hooks/messageHooks';
import { useDashboardUser } from '../../hooks/useDashboardUser';
import { useTenantProperties } from '../../hooks/useTenantProperties';
import HomeSection from '../HomeSection';
import { SectionEmpty, SectionError, SectionLoading } from './SectionStates';

/** "Tu propiedad reservada": la reservación más reciente del inquilino (GET /properties/me/reserved). */
export default function ReservedPropertySection() {
  useTranslation();
  const { userId } = useDashboardUser();
  const reserved = useTenantProperties();
  const startConversation = useStartConversation();
  const [property, ...others] = reserved.data ?? [];
  const photo = property ? photoUrl(property) : undefined;

  return (
    <HomeSection title={i18n.t("dashboard:reservedpropertysection_tu_propiedad_reservada")} to="/dashboard/reservations" linkLabel="Mis reservaciones">
      {reserved.isPending ? (
        <SectionLoading shape="media" />
      ) : reserved.isError ? (
        <SectionError message={i18n.t("dashboard:reservedpropertysection_no_pudimos_cargar_tu_reservacion")} onRetry={() => void reserved.refetch()} />
      ) : !property ? (
        <SectionEmpty
          title={i18n.t("dashboard:reservedpropertysection_aun_no_tienes_una_propiedad_reservada")}
          description={i18n.t("dashboard:reservedpropertysection_cuando_un_propietario_confirme_tu_reserva_la_veras_aqui")}
          actionLabel="Explorar propiedades"
          actionTo="/explorar"
        />
      ) : (
        <div className="flex gap-4">
          <div className="size-24 shrink-0 overflow-hidden rounded-xl bg-slate-100 sm:size-28">
            {photo ? <img src={photo} alt="" className="size-full object-cover" /> : <span className="grid size-full place-items-center text-slate-300"><ImageOff size={26} aria-hidden="true" /></span>}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="truncate font-bold text-primary">{property.title}</h3>
            <p className="truncate text-xs text-muted-ink">{property.address}</p>
            <p className="mt-1 text-sm font-extrabold text-primary">
              {priceLabel(property)} <span className="text-[11px] font-normal text-muted-ink">{i18n.t("common:perMonth")}</span>
            </p>
            <PriceDetails price={property.displayPrice} />
            <p className="mt-1 text-xs text-muted-ink">{i18n.t("dashboard:reservedpropertysection_propietario")}{' '}{property.owner.name}
              {property.reservedAt && i18n.t("dashboard:reservedpropertysection_reservada_el", { v0: new Date(property.reservedAt).toLocaleDateString(currentLocale()) })}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {property.status === 'ACTIVE' && (
                <Link to="/property_detail/$propertyId" params={{ propertyId: String(property.id) }} className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-primary transition hover:border-secondary">{i18n.t("dashboard:reservedpropertysection_ver_detalles")}</Link>
              )}
              {userId !== undefined && (
                <button
                  type="button"
                  onClick={() => startConversation.mutate({ participantIds: [userId, property.owner.id], propertyId: property.id })}
                  disabled={startConversation.isPending}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-secondary px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-secondary-dark disabled:opacity-60"
                >
                  <MessageCircle size={14} aria-hidden="true" />
                  {startConversation.isPending ? i18n.t("dashboard:reservedpropertysection_abriendo") : i18n.t("dashboard:reservedpropertysection_escribir_al_propietario")}
                </button>
              )}
            </div>
            {startConversation.isError && <p role="alert" className="mt-2 text-xs text-red-700">{i18n.t("dashboard:reservedpropertysection_no_pudimos_abrir_el_chat_intenta_de_nuevo")}</p>}
            {others.length > 0 && <p className="mt-2 text-xs text-muted-ink">{i18n.t("dashboard:pendingreviewsection_y")}{' '}{others.length} {others.length === 1 ? i18n.t("dashboard:reservedpropertysection_reservacion_mas") : i18n.t("dashboard:reservedpropertysection_reservaciones_mas")}</p>}
          </div>
        </div>
      )}
    </HomeSection>
  );
}
