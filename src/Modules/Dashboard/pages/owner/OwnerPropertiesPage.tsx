import { messageFromError, message } from '../../../../i18n/messages';
import { useMessageState } from '../../../../i18n/useMessageState';
import { useTranslation } from 'react-i18next';
import i18n from '../../../../i18n/instance';
import { Link } from '@tanstack/react-router';
import { AlertTriangle, Building2, EyeOff, MapPin, Plus } from 'lucide-react';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import StatusBadge from '../../../Property/Components/StatusBadge';
import { statusBadgeVariant } from '../../../Property/utils/propertyStatus';
import { propertyService } from '../../../Property/services/propertyService';
import type { Property } from '../../../Property/types/property';
import ConfirmDialog from '../../Components/ConfirmDialog';
import EmptyPanel from '../../Components/EmptyPanel';
import FilterTabs from '../../Components/FilterTabs';
import PageContainer from '../../Components/PageContainer';
import PageHeader from '../../Components/PageHeader';
import { useOwnerProperties } from '../../hooks/useOwnerProperties';
import { releaseReservation } from '../../../Reservations/services/reservationService';
import ReservationLabel from '../../../Reservations/Components/ReservationLabel';

const filters = () => ([
  { value: 'all', label: i18n.t("dashboard:ownerpropertiespage_todas") },
  { value: 'ACTIVE', label: i18n.t("dashboard:adminpropertiespage_activas") },
  { value: 'PENDING', label: i18n.t("dashboard:adminpropertiespage_en_revision") },
  { value: 'INACTIVE', label: i18n.t("dashboard:adminpropertiespage_inactivas") },
] as const);

type PropertyFilter = (ReturnType<typeof filters>)[number]['value'];

const publishLinkClass = 'inline-flex items-center gap-2 rounded-xl bg-secondary px-4 py-2.5 text-sm font-bold text-white transition hover:bg-secondary-dark';

/** Mis propiedades: lista real del propietario con el estado de revisión de cada una. */
export default function OwnerPropertiesPage() {
  useTranslation();
  const properties = useOwnerProperties();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<PropertyFilter>('all');
  const [releasing, setReleasing] = useState<Property | null>(null);
  const release = useMutation({
    mutationFn: releaseReservation,
    onSuccess: async () => {
      setReleasing(null);
      await queryClient.invalidateQueries();
    },
  });
  const [deactivating, setDeactivating] = useState<Property | null>(null);
  const [deactivateError, setDeactivateError] = useMessageState<string | null>(null);

  const deactivate = useMutation({
    mutationFn: (id: number) => propertyService.remove(id),
    onSuccess: () => {
      setDeactivating(null);
      setDeactivateError(null);
      queryClient.invalidateQueries({ queryKey: ['owner-properties'] });
    },
    onError: (err) => {
      setDeactivateError(err instanceof Error ? messageFromError(err) : message("dashboard:ownerpropertiespage_no_se_pudo_desactivar_la_propiedad"));
    },
  });

  const visible = (properties.data ?? []).filter((property) =>
    filter === 'all' ? true : property.status === filter,
  );

  return (
    <PageContainer>
      <PageHeader
        title={i18n.t("dashboard:ownerhomepage_mis_propiedades")}
        description={i18n.t("dashboard:ownerpropertiespage_gestiona_las_propiedades_que_publicas_en_saferent")}
        actions={
          <Link to="/dashboard/owner/properties/new" className={publishLinkClass}>
            <Plus size={18} aria-hidden="true" />{i18n.t("dashboard:clienthomepage_publicar_propiedad")}</Link>
        }
      />
      <FilterTabs label={i18n.t("dashboard:adminpropertiespage_estado_de_la_propiedad")} options={[...filters()]} value={filter} onChange={setFilter} />

      {properties.isPending ? (
        <p role="status" className="py-12 text-center text-sm text-muted-ink">{i18n.t("dashboard:ownerpropertiespage_cargando_tus_propiedades")}</p>
      ) : properties.isError ? (
        <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-700">{i18n.t("dashboard:attentionsection_no_pudimos_cargar_tus_propiedades")}{' '}
          <button type="button" onClick={() => void properties.refetch()} className="font-semibold underline">{i18n.t("comments:propertycomments_reintentar")}</button>
        </div>
      ) : visible.length === 0 ? (
        <EmptyPanel
          icon={Building2}
          title={filter === 'all' ? i18n.t("dashboard:ownerpropertiespage_aun_no_tienes_propiedades") : i18n.t("dashboard:ownerpropertiespage_no_hay_propiedades_en_este_estado")}
          description={i18n.t("dashboard:ownerpropertiespage_publica_tu_primera_propiedad_para_empezar_a_recibir_consultas")}
          action={
            <Link to="/dashboard/owner/properties/new" className={publishLinkClass}>
              <Plus size={18} aria-hidden="true" />{i18n.t("dashboard:clienthomepage_publicar_propiedad")}</Link>
          }
        />
      ) : (
        <ul className="space-y-3">
          {visible.map((property) => (
            <li key={property.id} className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="truncate font-bold text-primary">{property.title}</h2>
                  <StatusBadge variant={statusBadgeVariant(property.status)} />
                  <ReservationLabel property={property} />
                </div>
                <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-ink">
                  <MapPin size={15} className="shrink-0" aria-hidden="true" />
                  <span className="truncate">{property.address}</span>
                </p>
                {property.reservedTenantId && <p className="mt-2 text-sm text-amber-900">{i18n.t("dashboard:ownerpropertiespage_reservada_para")}{' '}{property.reservedTenantName || i18n.t("dashboard:ownerpropertiespage_un_inquilino")}</p>}
                {property.reviewNote && (property.status === 'CHANGES_REQUESTED' || property.status === 'INACTIVE') && (
                  <p className="mt-2 flex items-start gap-1.5 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">
                    <AlertTriangle size={14} className="mt-0.5 shrink-0" aria-hidden="true" />
                    <span>{property.reviewNote}</span>
                  </p>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {property.reservedTenantId && <button type="button" onClick={() => { release.reset(); setReleasing(property); }} className="rounded-lg border border-amber-300 px-4 py-2 text-sm font-semibold text-amber-800 hover:bg-amber-50">{i18n.t("dashboard:ownerpropertiespage_quitar_reserva_61b7f5")}</button>}
                <Link
                  to="/dashboard/owner/properties/detail/$propertyId"
                  params={{ propertyId: String(property.id) }}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-primary transition hover:border-secondary"
                >{i18n.t("dashboard:ownerpropertiespage_ver")}</Link>
                <Link
                  to="/dashboard/owner/properties/new"
                  search={{ editId: property.id }}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-primary transition hover:border-secondary"
                >{i18n.t("dashboard:ownerpropertiespage_editar")}</Link>
                {property.status !== 'INACTIVE' && property.status !== 'DRAFT' && (
                  <button
                    type="button"
                    onClick={() => { setDeactivating(property); setDeactivateError(null); }}
                    className="rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                  >
                    <EyeOff size={16} className="inline-block mr-1" aria-hidden="true" />{i18n.t("dashboard:adminpropertiespage_desactivar_7ef1cd")}</button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
      {deactivating && (
        <ConfirmDialog
          title={i18n.t("dashboard:ownerpropertiespage_desactivar", { v0: deactivating.title })}
          description={i18n.t("dashboard:ownerpropertiespage_la_propiedad_dejara_de_ser_visible_para_los_inquilinos")}
          confirmLabel={i18n.t("dashboard:ownerpropertiespage_desactivar_propiedad")}
          danger
          loading={deactivate.isPending}
          error={deactivateError}
          onConfirm={() => deactivate.mutate(deactivating.id)}
          onCancel={() => setDeactivating(null)}
        />
      )}
      {releasing && <ConfirmDialog
        title={i18n.t("dashboard:ownerpropertiespage_quitar_reserva_37aa93", { v0: releasing.title })}
        description={i18n.t("dashboard:ownerpropertiespage_se_quitara_la_reserva_de_y_la_propiedad_quedara", { v0: releasing.reservedTenantName || i18n.t('common:thisTenant') })}
        confirmLabel={i18n.t("dashboard:ownerpropertiespage_quitar_reserva_61b7f5")}
        loading={release.isPending}
        error={release.isError ? i18n.t("dashboard:ownerpropertiespage_no_se_pudo_quitar_la_reserva_intenta_nuevamente") : null}
        onConfirm={() => release.mutate(releasing.id)}
        onCancel={() => { if (!release.isPending) setReleasing(null); }}
      />}
    </PageContainer>
  );
}
