import { messageFromError, message } from '../../../../i18n/messages';
import { useMessageState } from '../../../../i18n/useMessageState';
import { currentLocale } from '../../../../i18n/formatters';
import { useTranslation } from 'react-i18next';
import i18n from '../../../../i18n/instance';
import { useState } from 'react';
import { Building2, Check, EyeOff, MapPin, MessageSquareWarning, XCircle } from 'lucide-react';
import AdminPropertyDialog from '../../Components/AdminPropertyDialog';
import { useAdminProperties, useReviewProperty } from '../../../Property/hooks/useAdminProperties';
import type { Property, PropertyStatus } from '../../../Property/types/property';
import NoteDialog from '../../Components/NoteDialog';
import EmptyPanel from '../../Components/EmptyPanel';
import FilterTabs from '../../Components/FilterTabs';
import PageContainer from '../../Components/PageContainer';
import PageHeader from '../../Components/PageHeader';

const filters = () => ([
  { value: 'active', label: i18n.t("dashboard:adminpropertiespage_activas") },
  { value: 'review', label: i18n.t("dashboard:adminpropertiespage_en_revision") },
  { value: 'inactive', label: i18n.t("dashboard:adminpropertiespage_inactivas") },
] as const);

type PropertyFilter = (ReturnType<typeof filters>)[number]['value'];

const STATUS_BY_FILTER: Record<PropertyFilter, PropertyStatus> = {
  active: 'ACTIVE',
  review: 'PENDING',
  inactive: 'INACTIVE',
};

function formatDate(value: string): string {
  try {
    return new Date(value).toLocaleDateString(currentLocale(), { year: 'numeric', month: 'short', day: 'numeric' });
  } catch {
    return value;
  }
}

/** Propiedades (admin): revisión real — aprobar, pedir cambios o rechazar lo que envían los propietarios. */
export default function AdminPropertiesPage() {
  useTranslation();
  const [filter, setFilter] = useState<PropertyFilter>('active');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [requestingChanges, setRequestingChanges] = useState<Property | null>(null);
  const [rejecting, setRejecting] = useState<Property | null>(null);
  const [actionError, setActionError] = useMessageState<Record<number, string>>({});

  const status = STATUS_BY_FILTER[filter];
  const properties = useAdminProperties(status);
  const review = useReviewProperty();

  const list = properties.data?.data ?? [];

  async function approve(property: Property) {
    setActionError((prev) => ({ ...prev, [property.id]: '' }));
    try {
      await review.mutateAsync({ id: property.id, data: { status: 'ACTIVE' } });
    } catch (err) {
      setActionError((prev) => ({ ...prev, [property.id]: err instanceof Error ? messageFromError(err) : message("dashboard:adminpropertiespage_no_se_pudo_aprobar_la_propiedad") }));
    }
  }

  async function submitNote(property: Property, status: 'CHANGES_REQUESTED' | 'INACTIVE', note: string) {
    try {
      await review.mutateAsync({ id: property.id, data: { status, note } });
      setRequestingChanges(null);
      setRejecting(null);
    } catch (err) {
      setActionError((prev) => ({ ...prev, [property.id]: err instanceof Error ? messageFromError(err) : message("dashboard:adminpropertiespage_no_se_pudo_completar_la_accion") }));
    }
  }

  return (
    <PageContainer>
      <PageHeader title={i18n.t("dashboard:adminpropertiespage_propiedades_2b3936")} description={i18n.t("dashboard:adminpropertiespage_revisa_las_propiedades_enviadas_por_los_propietarios_y_aplica")} />
      <FilterTabs label={i18n.t("dashboard:adminpropertiespage_estado_de_la_propiedad")} options={[...filters()]} value={filter} onChange={setFilter} />

      {properties.isPending ? (
        <p role="status" className="py-12 text-center text-sm text-muted-ink">{i18n.t("dashboard:adminpropertiespage_cargando_propiedades")}</p>
      ) : properties.isError ? (
        <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-700">{i18n.t("dashboard:discoversection_no_pudimos_cargar_las_propiedades")}{' '}
          <button type="button" onClick={() => void properties.refetch()} className="font-semibold underline">{i18n.t("comments:propertycomments_reintentar")}</button>
        </div>
      ) : list.length === 0 ? (
        <EmptyPanel icon={Building2} title={i18n.t("dashboard:adminpropertiespage_no_hay_propiedades", { v0: filters().find((f) => f.value === filter)?.label.toLowerCase() })} description={i18n.t("dashboard:adminpropertiespage_las_propiedades_que_envien_los_propietarios_apareceran_aqui")} />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full min-w-[820px] text-left text-sm">
            <caption className="sr-only">{i18n.t("dashboard:adminpropertiespage_propiedades_71a805")}{' '}{filters().find((f) => f.value === filter)?.label}</caption>
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-muted-ink">
              <tr>
                {[i18n.t("dashboard:adminpropertiespage_propiedad"), i18n.t("auth:roles_propietario"), i18n.t("dashboard:adminpropertiespage_ubicacion"), i18n.t("dashboard:adminpropertiespage_fecha"), i18n.t("dashboard:adminpropertiespage_acciones")].map((column) => (
                  <th key={column} scope="col" className="px-4 py-3 font-semibold">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {list.map((property) => (
                <tr key={property.id} className="cursor-pointer transition hover:bg-slate-50" onClick={() => setSelectedProperty(property)}>
                  <td className="px-4 py-3 font-semibold text-primary">
                    <button type="button" aria-haspopup="dialog" onClick={(event) => { event.stopPropagation(); setSelectedProperty(property); }} className="rounded text-left underline decoration-slate-300 underline-offset-4 hover:decoration-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">{property.title}</button>
                  </td>
                  <td className="px-4 py-3 text-muted-ink">
                    {property.owner.name} {property.owner.surname1}
                  </td>
                  <td className="px-4 py-3 text-muted-ink">
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin size={14} className="shrink-0" aria-hidden="true" />
                      <span className="max-w-[220px] truncate">{property.address || '—'}</span>
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-ink">{formatDate(property.createdAt)}</td>
                  <td className="px-4 py-3" onClick={(event) => event.stopPropagation()}>
                    {property.status === 'PENDING' ? (
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          title={i18n.t("dashboard:adminpropertiespage_aprobar_10a00f")}
                          aria-label={i18n.t("dashboard:adminpropertiespage_aprobar_11a9c2", { v0: property.title })}
                          disabled={review.isPending}
                          className="rounded-lg p-1.5 text-slate-500 transition hover:bg-green-50 hover:text-green-700 disabled:opacity-50"
                          onClick={() => void approve(property)}
                        >
                          <Check size={17} />
                        </button>
                        <button
                          type="button"
                          title={i18n.t("dashboard:adminpropertiespage_solicitar_cambios_e1aab9")}
                          aria-label={i18n.t("dashboard:adminpropertiespage_solicitar_cambios_a", { v0: property.title })}
                          className="rounded-lg p-1.5 text-slate-500 transition hover:bg-amber-50 hover:text-amber-700"
                          onClick={() => setRequestingChanges(property)}
                        >
                          <MessageSquareWarning size={17} />
                        </button>
                        <button
                          type="button"
                          title={i18n.t("dashboard:adminpropertiespage_rechazar_2a0515")}
                          aria-label={i18n.t("dashboard:adminpropertiespage_rechazar_177aaa", { v0: property.title })}
                          className="rounded-lg p-1.5 text-slate-500 transition hover:bg-red-50 hover:text-red-600"
                          onClick={() => setRejecting(property)}
                        >
                          <XCircle size={17} />
                        </button>
                      </div>
                    ) : property.status === 'ACTIVE' ? (
                      <button
                        type="button"
                        title={i18n.t("dashboard:adminpropertiespage_desactivar_7ef1cd")}
                        aria-label={i18n.t("dashboard:adminpropertiespage_desactivar_9a3405", { v0: property.title })}
                        disabled={review.isPending}
                        className="rounded-lg p-1.5 text-slate-500 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                        onClick={() => setRejecting(property)}
                      >
                        <EyeOff size={17} />
                      </button>
                    ) : (
                      <span className="text-xs text-slate-400">
                        {property.reviewedAt ? i18n.t("dashboard:adminpropertiespage_revisada_el", { v0: formatDate(property.reviewedAt) }) : '—'}
                      </span>
                    )}
                    {actionError[property.id] && <p role="alert" className="mt-1 text-xs text-red-600">{actionError[property.id]}</p>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedProperty && (
        <AdminPropertyDialog
          property={selectedProperty}
          loading={review.isPending}
          error={actionError[selectedProperty.id] || null}
          onClose={() => setSelectedProperty(null)}
          onApprove={async (property) => {
            setActionError((prev) => ({ ...prev, [property.id]: '' }));
            try {
              await review.mutateAsync({ id: property.id, data: { status: 'ACTIVE' } });
              setSelectedProperty(null);
            } catch (err) {
              setActionError((prev) => ({ ...prev, [property.id]: err instanceof Error ? messageFromError(err) : message('dashboard:adminpropertiespage_no_se_pudo_aprobar_la_propiedad') }));
            }
          }}
          onRequestChanges={(property) => { setSelectedProperty(null); setRequestingChanges(property); }}
          onReject={(property) => { setSelectedProperty(null); setRejecting(property); }}
        />
      )}

      {requestingChanges && (
        <NoteDialog
          title={i18n.t("dashboard:adminpropertiespage_solicitar_cambios_712a1a", { v0: requestingChanges.title })}
          description={i18n.t("dashboard:adminpropertiespage_el_propietario_vera_esta_nota_y_podra_corregir_y")}
          confirmLabel={i18n.t("dashboard:adminpropertiespage_solicitar_cambios_e1aab9")}
          placeholder={i18n.t("dashboard:adminpropertiespage_ej_falta_confirmar_la_ubicacion_exacta_en_el_mapa")}
          loading={review.isPending}
          error={actionError[requestingChanges.id] || null}
          onConfirm={(note) => void submitNote(requestingChanges, 'CHANGES_REQUESTED', note)}
          onCancel={() => setRequestingChanges(null)}
        />
      )}

      {rejecting && (
        <NoteDialog
          title={i18n.t("dashboard:adminpropertiespage_rechazar_44569c", { v0: rejecting.title })}
          description={i18n.t("dashboard:adminpropertiespage_la_propiedad_queda_inactiva_y_no_sera_visible_para")}
          confirmLabel={i18n.t("dashboard:adminpropertiespage_rechazar_propiedad")}
          placeholder={i18n.t("dashboard:adminpropertiespage_ej_las_imagenes_no_corresponden_a_la_direccion_indicada")}
          loading={review.isPending}
          error={actionError[rejecting.id] || null}
          onConfirm={(note) => void submitNote(rejecting, 'INACTIVE', note)}
          onCancel={() => setRejecting(null)}
        />
      )}
    </PageContainer>
  );
}
