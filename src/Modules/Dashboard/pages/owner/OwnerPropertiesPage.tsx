import { messageFromError, message } from '../../../../i18n/messages';
import { useMessageState } from '../../../../i18n/useMessageState';
import { useTranslation } from 'react-i18next';
import i18n from '../../../../i18n/instance';
import { Link, useNavigate } from '@tanstack/react-router';
import { AlertTriangle, Building2, CalendarX, CheckCircle2, ChevronDown, Eye, EyeOff, History, Pencil, Plus, Star } from 'lucide-react';
import Divider from '@mui/material/Divider';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import PropertyThumbCard from '../../Components/PropertyThumbCard';
import StatusBadge from '../../../Property/Components/StatusBadge';
import { statusBadgeVariant } from '../../../Property/utils/propertyStatus';
import { propertyService } from '../../../Property/services/propertyService';
import type { Property } from '../../../Property/types/property';
import { useOwnerPropertyRatings } from '../../../Comments/hooks/usePropertyComments';
import type { PropertyRating } from '../../../Comments/models/comment';
import { formatScore } from '../../../TenantRatings/utils/format';
import ConfirmDialog from '../../Components/ConfirmDialog';
import EmptyPanel from '../../Components/EmptyPanel';
import FilterTabs from '../../Components/FilterTabs';
import PageContainer from '../../Components/PageContainer';
import PageHeader from '../../Components/PageHeader';
import { useOwnerProperties } from '../../hooks/useOwnerProperties';
import { releaseReservation } from '../../../Reservations/services/reservationService';
import { useOwnerRentalCounts } from '../../../Reservations/hooks/useReservationHistory';
import { useDashboardUser } from '../../hooks/useDashboardUser';

const filters = () => ([
  { value: 'all', label: i18n.t("dashboard:ownerpropertiespage_todas") },
  { value: 'ACTIVE', label: i18n.t("dashboard:adminpropertiespage_activas") },
  { value: 'PENDING', label: i18n.t("dashboard:adminpropertiespage_en_revision") },
  { value: 'INACTIVE', label: i18n.t("dashboard:adminpropertiespage_inactivas") },
] as const);

type PropertyFilter = (ReturnType<typeof filters>)[number]['value'];

const chip = 'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold';

/** Cuántas veces se ha alquilado la propiedad, como una etiqueta corta. */
function RentedTimes({ times }: { times: number }) {
  useTranslation();
  return (
    <span className={`${chip} ${times > 0 ? 'bg-slate-100 text-primary' : 'bg-slate-50 text-muted-ink'}`}>
      <History size={13} aria-hidden="true" />
      {times > 0 ? i18n.t('reservations:rentedTimes', { count: times }) : i18n.t('reservations:neverRented')}
    </span>
  );
}

/** Calificación que los inquilinos le dieron a la propiedad: estrella, promedio y cuántas son. */
function PropertyRatingChip({ rating }: { rating?: PropertyRating }) {
  useTranslation();
  if (!rating) return <span className={`${chip} bg-slate-50 text-muted-ink`}><Star size={13} aria-hidden="true" />{i18n.t('dashboard:propertyNoRatings')}</span>;
  return (
    <span title={i18n.t('dashboard:propertyRatingTitle', { average: formatScore(rating.average), count: rating.count })} className={`${chip} bg-slate-100 text-primary`}>
      <Star size={13} aria-hidden="true" className="fill-amber-400 text-amber-500" />
      {formatScore(rating.average)}
      <span className="font-medium text-muted-ink">({rating.count})</span>
    </span>
  );
}

const publishLinkClass = 'inline-flex items-center gap-2 rounded-xl bg-secondary px-4 py-2.5 text-sm font-bold text-white transition hover:bg-secondary-dark';

/** Mis propiedades: lista real del propietario con el estado de revisión de cada una. */
export default function OwnerPropertiesPage() {
  useTranslation();
  const properties = useOwnerProperties();
  const { userId } = useDashboardUser();
  const rentalCounts = useOwnerRentalCounts(userId);
  const ratings = useOwnerPropertyRatings();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [propertyMenu, setPropertyMenu] = useState<{ anchor: HTMLElement; property: Property } | null>(null);
  const [filter, setFilter] = useState<PropertyFilter>('all');
  const [releasing, setReleasing] = useState<Property | null>(null);
  const [releaseReason, setReleaseReason] = useState('');
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
        <ul className="grid items-stretch gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {visible.map((property) => (
            <li key={property.id} className="flex min-w-0 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <PropertyThumbCard property={property} to={'/dashboard/owner/properties/detail/' + property.id} flush />
              <div className="flex flex-1 flex-col gap-3 px-3 pb-3">
                {property.status !== 'ACTIVE' && <div className="flex flex-wrap items-center gap-2"><StatusBadge variant={statusBadgeVariant(property.status)} /></div>}
                {/* Quién la reservó se ve al abrir la propiedad (su historial de alquileres); aquí solo el resumen. */}
                <div className="flex flex-wrap items-center gap-2">
                  {ratings.isSuccess && <PropertyRatingChip rating={ratings.data.get(property.id)} />}
                  {rentalCounts.isSuccess && <RentedTimes times={rentalCounts.data.get(property.id) ?? 0} />}
                  {property.reservedTenantId && (
                    <span
                      role="status"
                      title={`${i18n.t("dashboard:ownerpropertiespage_reservada_para")} ${property.reservedTenantName || i18n.t("dashboard:ownerpropertiespage_un_inquilino")}`}
                      className={`${chip} bg-secondary/10 text-secondary`}
                    ><CheckCircle2 size={13} aria-hidden="true" />{i18n.t("dashboard:recentsavedsection_reservada")}</span>
                  )}
                </div>
                {property.reviewNote && (property.status === 'CHANGES_REQUESTED' || property.status === 'INACTIVE') && (
                  <p className="flex items-start gap-1.5 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">
                    <AlertTriangle size={14} className="mt-0.5 shrink-0" aria-hidden="true" />
                    <span>{property.reviewNote}</span>
                  </p>
                )}
              <div className="mt-auto space-y-2 border-t border-slate-100 pt-3">
                <div className="flex gap-2">
                  <button
                    id={`property-actions-${property.id}`}
                    type="button"
                    aria-haspopup="menu"
                    aria-expanded={propertyMenu?.property.id === property.id}
                    aria-controls={propertyMenu?.property.id === property.id ? 'owner-property-menu' : undefined}
                    onClick={(event) => setPropertyMenu({ anchor: event.currentTarget, property })}
                    title={property.title}
                    className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-primary transition hover:border-secondary hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
                  >{i18n.t('dashboard:moreOptions')}<ChevronDown size={15} aria-hidden="true" /></button>
                  {property.reservedTenantId && (
                    <button
                      type="button"
                      disabled={release.isPending}
                      onClick={() => { release.reset(); setReleaseReason(''); setReleasing(property); }}
                      className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-secondary px-3 py-2 text-xs font-bold text-white transition hover:bg-secondary-dark disabled:opacity-60"
                    ><CalendarX size={15} aria-hidden="true" />{i18n.t('dashboard:ownerpropertiespage_quitar_reserva_61b7f5')}</button>
                  )}
                </div>
              </div>
              </div>
            </li>
          ))}
        </ul>
      )}
      <Menu
        id="owner-property-menu"
        anchorEl={propertyMenu?.anchor ?? null}
        open={Boolean(propertyMenu)}
        onClose={() => setPropertyMenu(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        slotProps={{
          list: { 'aria-labelledby': propertyMenu ? `property-actions-${propertyMenu.property.id}` : undefined },
          paper: { sx: { mt: 0.75, minWidth: 190, borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 8px 24px rgb(10 37 64 / 10%)', color: 'var(--color-primary)', '& .MuiMenuItem-root': { gap: 1.5, fontFamily: 'inherit', fontSize: '0.875rem', minHeight: 40, '&:hover': { backgroundColor: 'var(--color-surface)' } } } },
        }}
      >
        <MenuItem onClick={() => {
          if (!propertyMenu) return;
          const { property } = propertyMenu;
          setPropertyMenu(null);
          void navigate({ to: '/dashboard/owner/properties/new', search: { editId: property.id } });
        }}><Pencil size={16} aria-hidden="true" />{i18n.t('dashboard:ownerpropertiespage_editar')}</MenuItem>
        <MenuItem onClick={() => {
          if (!propertyMenu) return;
          const { property } = propertyMenu;
          setPropertyMenu(null);
          void navigate({ to: '/dashboard/owner/properties/detail/$propertyId', params: { propertyId: String(property.id) } });
        }}><Eye size={16} aria-hidden="true" />{i18n.t('dashboard:ownerpropertiespage_ver')}</MenuItem>
        {propertyMenu && propertyMenu.property.status !== 'INACTIVE' && propertyMenu.property.status !== 'DRAFT' && <Divider />}
        {propertyMenu && propertyMenu.property.status !== 'INACTIVE' && propertyMenu.property.status !== 'DRAFT' && <MenuItem onClick={() => {
          const { property } = propertyMenu;
          setPropertyMenu(null);
          setDeactivating(property);
          setDeactivateError(null);
        }} sx={{ color: '#dc2626' }}><EyeOff size={16} aria-hidden="true" />{i18n.t('dashboard:adminpropertiespage_desactivar_7ef1cd')}</MenuItem>}
      </Menu>
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
        confirmDisabled={!releaseReason.trim()}
        onConfirm={() => release.mutate({ propertyId: releasing.id, reason: releaseReason.trim() })}
        onCancel={() => { if (!release.isPending) setReleasing(null); }}
      >
        <label className="mb-4 block text-sm font-semibold text-primary">
          {i18n.t('reservations:cancellationReason')}
          <textarea
            value={releaseReason}
            onChange={(event) => setReleaseReason(event.target.value)}
            maxLength={500}
            required
            disabled={release.isPending}
            aria-describedby="release-reason-hint"
            className="mt-2 block w-full rounded-lg border border-slate-300 p-2 text-sm font-normal"
          />
          <span id="release-reason-hint" className="mt-1 block text-xs font-normal text-muted-ink">{i18n.t('reservations:cancellationReasonHint')}</span>
        </label>
      </ConfirmDialog>}
    </PageContainer>
  );
}
