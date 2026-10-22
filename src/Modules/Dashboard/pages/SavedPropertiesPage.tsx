import { useTranslation } from 'react-i18next';
import i18n from '../../../i18n/instance';
import { Link } from '@tanstack/react-router';
import { BedDouble, Heart, ImageOff, MapPin, MessageCircle, Users } from 'lucide-react';
import PriceDetails from '../../Explore/PriceDetails';
import { photoUrl, priceLabel } from '../../Explore/utils/property.utils';
import { useStartConversation } from '../../Messages/hooks/messageHooks';
import { useSavedProperties, useToggleSavedProperty } from '../../SavedProperties/hooks/savedPropertyHooks';
import type { SavedProperty } from '../../SavedProperties/types/savedProperty';
import { SectionLoading } from '../Components/ClientHome/SectionStates';
import EmptyPanel from '../Components/EmptyPanel';
import PageContainer from '../Components/PageContainer';
import PageHeader from '../Components/PageHeader';
import { useDashboardUser } from '../hooks/useDashboardUser';

function SavedPropertyCard({ property, userId }: { property: SavedProperty; userId: number | undefined }) {
  useTranslation();
  const toggle = useToggleSavedProperty();
  const startConversation = useStartConversation();
  const photo = photoUrl(property);

  return (
    <li className={`flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm ${property.available ? '' : 'opacity-90'}`}>
      <div className="relative aspect-[16/10] bg-slate-100">
        {photo ? (
          <img src={photo} alt="" loading="lazy" className={`size-full object-cover ${property.available ? '' : 'grayscale'}`} />
        ) : (
          <span className="grid size-full place-items-center text-slate-300">
            <ImageOff size={32} aria-hidden="true" />
          </span>
        )}
        {!property.available && (
          <span className="absolute left-3 top-3 rounded-full bg-primary px-3 py-1 text-xs font-bold text-white">{i18n.t("dashboard:recentsavedsection_no_disponible")}</span>
        )}
        {property.available && property.reserved && (
          <span className="absolute left-3 top-3 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">{i18n.t("dashboard:recentsavedsection_reservada")}</span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h2 className="font-bold text-primary">{property.title}</h2>
        <p className="mt-2 flex items-start gap-1.5 text-sm text-muted-ink">
          <MapPin size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
          {property.address}
        </p>
        <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-ink">
          <span className="inline-flex items-center gap-1.5"><BedDouble size={14} aria-hidden="true" />{property.rooms} {property.rooms === 1 ? i18n.t("dashboard:savedpropertiespage_habitacion") : 'habitaciones'}</span>
          <span className="inline-flex items-center gap-1.5"><Users size={14} aria-hidden="true" />{property.guest} {property.guest === 1 ? i18n.t("dashboard:savedpropertiespage_huesped") : i18n.t("dashboard:savedpropertiespage_huespedes")}</span>
        </p>
        <p className="mt-3 text-lg font-extrabold text-primary">
          {priceLabel(property)} <span className="text-xs font-normal text-muted-ink">{i18n.t("common:perMonth")}</span>
        </p>
        <PriceDetails price={property.displayPrice} />
        {!property.available && (
          <p className="mt-3 text-xs text-muted-ink">{i18n.t("dashboard:savedpropertiespage_esta_propiedad_ya_no_esta_publicada_puedes_quitarla_de")}</p>
        )}

        <div className="mt-auto flex flex-wrap gap-2 pt-4">
          {property.available && (
            <>
              <Link
                to="/property_detail/$propertyId"
                params={{ propertyId: String(property.id) }}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-primary transition hover:border-secondary"
              >{i18n.t("dashboard:savedpropertiespage_ver_propiedad")}</Link>
              {userId !== undefined && (
                <button
                  type="button"
                  onClick={() => startConversation.mutate({ participantIds: [userId, property.owner.id], propertyId: property.id })}
                  disabled={startConversation.isPending}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-secondary px-4 py-2 text-sm font-semibold text-white transition hover:bg-secondary-dark disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <MessageCircle size={16} aria-hidden="true" />
                  {startConversation.isPending ? i18n.t("dashboard:reservedpropertysection_abriendo") : i18n.t("dashboard:savedpropertiespage_escribir")}
                </button>
              )}
            </>
          )}
          <button
            type="button"
            onClick={() => toggle.mutate({ propertyId: property.id, save: false })}
            disabled={toggle.isPending}
            className="ml-auto rounded-lg px-3 py-2 text-sm font-semibold text-muted-ink transition hover:text-red-700 disabled:opacity-60"
          >{i18n.t("dashboard:savedpropertiespage_quitar")}</button>
        </div>
        {(toggle.isError || startConversation.isError) && (
          <p role="alert" className="mt-2 text-xs text-red-700">
            {toggle.isError ? i18n.t("dashboard:savedpropertiespage_no_pudimos_quitar_la_propiedad_intenta_de_nuevo") : i18n.t("dashboard:reservedpropertysection_no_pudimos_abrir_el_chat_intenta_de_nuevo")}
          </p>
        )}
      </div>
    </li>
  );
}

/** Propiedades que el inquilino guardó en su cuenta (GET /saved-properties). */
export default function SavedPropertiesPage() {
  useTranslation();
  const { userId } = useDashboardUser();
  const saved = useSavedProperties();

  return (
    <PageContainer>
      <PageHeader title={i18n.t("dashboard:clienthomepage_propiedades_guardadas")} description={i18n.t("dashboard:savedpropertiespage_las_propiedades_que_guardaste_para_revisar_despues")} />

      {saved.isPending ? (
        <SectionLoading shape="cards" />
      ) : saved.isError ? (
        <div role="alert" className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
          <p className="font-bold text-primary">{i18n.t("dashboard:recentsavedsection_no_pudimos_cargar_tus_guardadas")}</p>
          <button type="button" onClick={() => void saved.refetch()} className="mt-3 text-sm font-bold text-secondary hover:underline">{i18n.t("comments:propertycomments_reintentar")}</button>
        </div>
      ) : saved.data.length === 0 ? (
        <EmptyPanel
          icon={Heart}
          title={i18n.t("dashboard:savedpropertiespage_aun_no_has_guardado_propiedades")}
          description={i18n.t("dashboard:savedpropertiespage_pulsa_guardar_en_una_propiedad_y_aparecera_aqui")}
          action={
            <Link to="/explorar" className="rounded-xl bg-secondary px-5 py-2.5 text-sm font-bold text-white transition hover:bg-secondary-dark">{i18n.t("about:aboutcta_explorar_propiedades")}</Link>
          }
        />
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {saved.data.map((property) => (
            <SavedPropertyCard key={property.id} property={property} userId={userId} />
          ))}
        </ul>
      )}
    </PageContainer>
  );
}
