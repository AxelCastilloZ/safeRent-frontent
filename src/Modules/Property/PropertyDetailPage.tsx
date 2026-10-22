import { catalogText } from '../../i18n/catalog';
import { messageFromError, message } from '../../i18n/messages';
import { useMessageState } from '../../i18n/useMessageState';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n/instance';
import ReservationLabel from '../Reservations/Components/ReservationLabel'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate, useParams } from '@tanstack/react-router'
import { AlertTriangle, CheckCircle2, Circle, MapPin, BedDouble, DollarSign, Pencil } from 'lucide-react'
import StatusBadge from './Components/StatusBadge'
import { propertyService } from './services/propertyService'
import { ApiError } from './services/api'
import { statusBadgeVariant } from './utils/propertyStatus'
import { useDisplayCurrency } from '../Auth/hooks/useDisplayCurrency'
import { priceLabel } from '../Explore/utils/property.utils'
import PriceDetails from '../Explore/PriceDetails'
import { useSessionToken } from '../Auth/services/authSession'

export default function PropertyDetailPage() {
  useTranslation();
  const { currency, ready } = useDisplayCurrency()
  const token = useSessionToken()
  const { propertyId } = useParams({ strict: false }) as { propertyId: string }
  const navigate = useNavigate()
  const propertyQuery = useQuery({
    queryKey: ['owner-property', propertyId, currency, token],
    queryFn: () => propertyService.getById(Number(propertyId), currency),
    enabled: ready && Boolean(token) && Number.isInteger(Number(propertyId)) && Number(propertyId) > 0,
    retry: false,
  })
  const property = propertyQuery.data
  const loading = propertyQuery.isPending
  const loadError = propertyQuery.isError ? i18n.t("property:createpropertystep1page_no_se_pudo_cargar_la_propiedad") : null
  const [error, setError] = useMessageState<string | null>(null)
  const [publishing, setPublishing] = useState(false)

  async function handlePublish() {
    if (!property) return
    setPublishing(true)
    try {
      await propertyService.publish(property.id)
      await propertyQuery.refetch()
    } catch (err) {
      setError(err instanceof ApiError ? messageFromError(err) : message("property:propertydetailpage_error_al_publicar"))
    } finally {
      setPublishing(false)
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center py-24 text-sm text-slate-400">{i18n.t("property:createpropertylocationpage_cargando_propiedad")}</div>
  }

  if (error || loadError || !property) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24">
        <p className="text-sm text-red-600">{error ?? loadError ?? i18n.t("property:propertydetailpage_propiedad_no_encontrada")}</p>
        <button
          type="button"
          className="rounded-xl border border-slate-200 px-5 py-2 text-sm font-bold text-primary transition hover:bg-slate-50"
          onClick={() => navigate({ to: '/dashboard/owner/properties' })}
        >{i18n.t("property:propertydetailpage_volver_a_mis_propiedades")}</button>
      </div>
    )
  }

  const hasData = !!(property.title && property.description && property.address)
  const hasImages = (property.files?.length ?? 0) >= 3
  const hasServices = (property.services?.length ?? 0) > 0
  const hasLocation = typeof property.latitude === 'number' && typeof property.longitude === 'number' && Number.isFinite(property.latitude) && Number.isFinite(property.longitude)
  const canSubmit = hasData && hasImages && hasServices && hasLocation
  const canPublish = canSubmit && (property.status === 'DRAFT' || property.status === 'CHANGES_REQUESTED' || property.status === 'INACTIVE')

  const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

  return (
    <div className="mx-auto max-w-3xl">
      {!hasLocation && <div className="mb-6 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">{i18n.t("property:propertydetailpage_confirma_la_ubicacion_en_el_mapa_para_publicar")}<button type="button" className="ml-2 font-bold underline" onClick={() => navigate({ to: '/dashboard/owner/properties/new/location', search: { propertyId: property.id } })}>{i18n.t("property:propertydetailpage_completar_ubicacion")}</button>
      </div>}
      <div className="mb-6 flex items-start justify-between">
        <h1 className="text-2xl font-bold text-primary">{property.title || i18n.t("property:createpropertystep1page_sin_titulo")}</h1>
        <StatusBadge variant={statusBadgeVariant(property.status)} />
      </div>

      {property.status === 'DRAFT' && (
        <div className="mb-6 rounded-xl bg-blue-50 px-4 py-3 text-sm text-blue-700">{i18n.t("property:propertydetailpage_propiedad_creada_y_vinculada_a_tu_cuenta_aun_no")}</div>
      )}
      {property.status === 'PENDING' && (
        <div className="mb-6 rounded-xl bg-blue-50 px-4 py-3 text-sm text-blue-700">{i18n.t("property:propertydetailpage_en_revision_un_administrador_esta_verificando_los_datos_te")}</div>
      )}
      {property.status === 'CHANGES_REQUESTED' && (
        <div className="mb-6 flex items-start gap-2 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <AlertTriangle size={18} className="mt-0.5 shrink-0" />
          <span>
            <strong className="font-semibold">{i18n.t("property:propertydetailpage_el_administrador_pidio_corregir_algo")}</strong>{' '}
            {property.reviewNote || i18n.t("property:propertydetailpage_revisa_los_datos_de_la_propiedad")}{' '}{i18n.t("property:propertydetailpage_corrige_lo_necesario_y_vuelve_a_enviarla_a_revision")}</span>
        </div>
      )}
      {property.status === 'INACTIVE' && (
        <div className="mb-6 flex items-start gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertTriangle size={18} className="mt-0.5 shrink-0" />
          <span>
            <strong className="font-semibold">{i18n.t("property:propertydetailpage_propiedad_inactiva")}</strong>{' '}
            {property.reviewNote || i18n.t("property:propertydetailpage_no_es_visible_para_inquilinos")}{' '}{i18n.t("property:propertydetailpage_puedes_corregirla_y_enviarla_a_revision_de_nuevo")}</span>
        </div>
      )}

      <ReservationLabel property={property} />

      {/* Property data */}
      <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-bold text-primary">{i18n.t("property:propertydetailpage_datos_de_la_propiedad")}</h3>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold text-primary transition hover:bg-slate-50"
            onClick={() => navigate({ to: '/dashboard/owner/properties/new', search: { editId: property.id } })}
          >
            <Pencil size={13} />{i18n.t("property:propertydetailpage_editar_datos")}</button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex items-start gap-2">
            <MapPin size={16} className="mt-0.5 shrink-0 text-slate-400" />
            <div>
              <span className="block text-xs font-medium text-slate-400">{i18n.t("property:createpropertylocationpage_direccion")}</span>
              <span className="text-sm text-primary">{property.address || '—'}</span>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <DollarSign size={16} className="mt-0.5 shrink-0 text-slate-400" />
            <div>
              <span className="block text-xs font-medium text-slate-400">{i18n.t("property:createpropertystep1page_precio_mes")}</span>
              <div className="text-sm text-primary">{priceLabel(property)}<PriceDetails price={property.displayPrice} /></div>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <BedDouble size={16} className="mt-0.5 shrink-0 text-slate-400" />
            <div>
              <span className="block text-xs font-medium text-slate-400">{i18n.t("explore:explorepage_habitaciones")}</span>
              <span className="text-sm text-primary">{property.rooms ?? '—'}</span>
            </div>
          </div>
          {property.typeOfProperty && (
            <div>
              <span className="block text-xs font-medium text-slate-400">{i18n.t("property:propertydetailpage_tipo")}</span>
              <span className="text-sm text-primary">{catalogText(property.typeOfProperty)}</span>
            </div>
          )}
        </div>

        {property.description && (
          <div className="mt-4 border-t border-slate-100 pt-4">
            <span className="mb-1 block text-xs font-medium text-slate-400">{i18n.t("property:propertyformlayout_descripcion")}</span>
            <p className="text-sm leading-relaxed text-slate-600">{property.description}</p>
          </div>
        )}
      </div>

      {/* Image gallery */}
      <div className="mb-6">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-bold text-primary">{i18n.t("property:propertydetailpage_imagenes")}{property.files?.length ?? 0})</h3>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {property.files?.length > 0 ? (
            property.files.map((file) => (
              <div key={file.id} className="aspect-[4/3] overflow-hidden rounded-xl bg-slate-100">
                <img
                  src={file.url || `${API_BASE}/${file.path}`}
                  alt={file.fileName}
                  className="size-full object-cover"
                  loading="lazy"
                />
              </div>
            ))
          ) : (
            <div className="col-span-full rounded-xl bg-slate-50 py-8 text-center text-sm text-slate-400">{i18n.t("property:propertydetailpage_sin_imagenes")}</div>
          )}
        </div>
      </div>

      {/* Service tags */}
      <div className="mb-6">
        <h3 className="mb-3 text-sm font-bold text-primary">{i18n.t("dashboard:adminhomepage_servicios")}</h3>
        {property.services?.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {property.services.map((s) => (
              <span key={s.id} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                {catalogText(s)}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-400">{i18n.t("property:propertydetailpage_sin_servicios_asignados")}</p>
        )}
      </div>

      {/* Pre-publish checklist */}
      {property.status !== 'ACTIVE' && property.status !== 'PENDING' && (
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="mb-3 text-sm font-bold text-primary">{i18n.t("property:propertydetailpage_antes_de_enviar_a_revision")}</h3>
          <ul className="flex flex-col gap-2">
            {[
              { ok: hasData, label: i18n.t("property:propertydetailpage_datos_completos") },
              { ok: hasImages, label: i18n.t("property:propertydetailpage_3_imagenes") },
              { ok: hasServices, label: i18n.t("dashboard:adminhomepage_servicios") },
            ].map((item) => (
              <li key={item.label} className="flex items-center gap-2 text-sm">
                {item.ok ? (
                  <CheckCircle2 size={18} className="text-secondary" />
                ) : (
                  <Circle size={18} className="text-slate-300" />
                )}
                <span className={item.ok ? 'text-primary' : 'text-slate-400'}>{item.label}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-bold text-primary transition hover:bg-slate-50"
          onClick={() => navigate({ to: '/dashboard/owner/properties' })}
        >{i18n.t("dashboard:ownerhomepage_mis_propiedades")}</button>
        {(property.status === 'DRAFT' || property.status === 'CHANGES_REQUESTED' || property.status === 'INACTIVE') && (
          <button
            type="button"
            className="rounded-xl bg-secondary px-6 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-secondary-dark disabled:opacity-50"
            onClick={handlePublish}
            disabled={publishing || !canPublish}
            title={canPublish ? '' : i18n.t("property:propertydetailpage_completa_todos_los_requisitos_antes_de_enviar_a_revision")}
          >
            {publishing ? 'Enviando...' : i18n.t("property:propertyformlayout_enviar_a_revision")}
          </button>
        )}
      </div>
    </div>
  )
}

