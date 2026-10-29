import { currentLocale } from '../../../i18n/formatters';
import { useTranslation } from 'react-i18next';
import i18n from '../../../i18n/instance';
import { Link } from '@tanstack/react-router';
import { CalendarCheck } from 'lucide-react';
import EmptyPanel from '../Components/EmptyPanel';
import PageContainer from '../Components/PageContainer';
import PageHeader from '../Components/PageHeader';
import { useTenantProperties } from '../hooks/useTenantProperties';
import { priceLabel } from '../../Explore/utils/property.utils';
import PriceDetails from '../../Explore/PriceDetails';
import ReservationHistoryList from '../../Reservations/Components/ReservationHistoryList';
import { useMyReservationHistory } from '../../Reservations/hooks/useReservationHistory';

export default function ReservationsPage() {
  useTranslation();
  const properties = useTenantProperties();
  const history = useMyReservationHistory();
  return (
    <PageContainer>
      <PageHeader title={i18n.t("dashboard:reservationspage_mis_reservaciones")} description={i18n.t("dashboard:reservationspage_consulta_las_propiedades_reservadas_a_tu_nombre")} />
      {properties.isPending && <p role="status">{i18n.t("dashboard:ownerpropertiespage_cargando_tus_propiedades")}</p>}
      {properties.isError && <div role="alert" className="rounded-xl border border-red-200 bg-white p-5 text-red-700">{i18n.t("dashboard:reservationspage_no_se_pudieron_cargar_tus_propiedades")}<button type="button" onClick={() => void properties.refetch()} className="ml-3 font-semibold underline">{i18n.t("comments:propertycomments_reintentar")}</button>
      </div>}
      {properties.isSuccess && (properties.data.length ? (
        <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {properties.data.map((property) => (
            <li key={property.id} className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-bold text-primary">{property.title}</h2>
              <p className="text-sm text-muted-ink">{property.address}</p>
              <p className="font-semibold">{priceLabel(property)}{' '}{i18n.t('common:perMonth')}{' '}</p>
              <PriceDetails price={property.displayPrice} />
              <p className="text-sm">{i18n.t("dashboard:reservedpropertysection_propietario")}{' '}{property.owner.name}</p>
              {property.reservedAt && <p className="text-sm text-muted-ink">{i18n.t("dashboard:ownerreservedsection_reservada_el")}{' '}{new Date(property.reservedAt).toLocaleDateString(currentLocale())}</p>}
              {property.status === 'ACTIVE' && <a href={`/property_detail/${property.id}`} className="mt-auto font-bold text-secondary hover:underline">{i18n.t("dashboard:reservedpropertysection_ver_detalles")}</a>}
            </li>
          ))}
        </ul>
      ) : (
        <EmptyPanel icon={CalendarCheck} title={i18n.t("dashboard:ownerreservedsection_aun_no_tienes_propiedades_reservadas")} description={i18n.t("dashboard:reservationspage_cuando_el_propietario_confirme_tu_reserva_aparecera_aqui")} action={
          <Link to="/explorar" className="rounded-xl bg-secondary px-5 py-2.5 text-sm font-bold text-white hover:bg-secondary-dark">{i18n.t("about:aboutcta_explorar_propiedades")}</Link>
        } />
      ))}

      <section aria-labelledby="reservation-history-title" className="mt-10">
        <h2 id="reservation-history-title" className="text-xl font-bold text-primary">{i18n.t('reservations:historyTitle')}</h2>
        <p className="mb-4 mt-1 text-sm text-muted-ink">{i18n.t('reservations:historyDescription')}</p>
        {history.isPending && <p role="status" className="text-sm text-muted-ink">{i18n.t('reservations:historyLoading')}</p>}
        {history.isError && <div role="alert" className="rounded-xl border border-red-200 bg-white p-5 text-red-700">{i18n.t('reservations:historyLoadError')}<button type="button" onClick={() => void history.refetch()} className="ml-3 font-semibold underline">{i18n.t('comments:propertycomments_reintentar')}</button></div>}
        {history.isSuccess && <ReservationHistoryList reservations={history.data} show="property" />}
      </section>
    </PageContainer>
  );
}
