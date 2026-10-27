import { errorMessage } from '../../i18n/messages';
import { catalogText } from '../../i18n/catalog';
import { message } from '../../i18n/messages';
import { useMessageState } from '../../i18n/useMessageState';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n/instance';
import PropertyComments from '../Comments/Components/PropertyComments'
import ReservationLabel from '../Reservations/Components/ReservationLabel'
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from '@tanstack/react-router'
import { ArrowLeft, BedDouble, CalendarCheck, Heart, MapPin, Share2, Users } from 'lucide-react'
import Navbar from '../LandingPage/Components/Navbar'
import Footer from '../LandingPage/Components/Footer'
import ServiceIcon from '../Services/components/ServiceIcon'
import PropertyGallery from './Components/PropertyGallery'
import { usePublicProperty } from './hooks/usePublicProperty'
import { priceLabel } from '../Explore/utils/property.utils'
import { useAuth } from '../Auth/hooks/authHooks'
import PriceDetails from '../Explore/PriceDetails'
import ScheduleVisitDialog from '../Visits/components/ScheduleVisitDialog'
import { clearPendingVisitProperty, peekPendingVisitProperty, setPendingVisitProperty } from '../Visits/utils/pendingVisit'
import { useSavedPropertyIds, useToggleSavedProperty } from '../SavedProperties/hooks/savedPropertyHooks'
import { consumePendingSaveProperty, setPendingSaveProperty } from '../SavedProperties/utils/pendingSave'

export default function PublicPropertyPage() {
  useTranslation();
  const { propertyId } = useParams({ strict: false })
  const id = Number(propertyId)
  const query = usePublicProperty(id)
  const [notice, setNotice] = useMessageState('')
  const property = query.data
  const navigate = useNavigate()
  const { user: currentUser, hasSession } = useAuth()
  const [scheduling, setScheduling] = useState(false)
  // Intención de agendar guardada antes de ir a iniciar sesión (se lee una vez, al abrir la página).
  const [pendingVisitId] = useState(peekPendingVisitProperty)
  const [pendingDismissed, setPendingDismissed] = useState(false)
  const savedIds = useSavedPropertyIds()
  const savedMutation = useToggleSavedProperty()
  const saved = property !== undefined && Boolean(savedIds.data?.includes(property.id))
  // Es la propiedad de quien tiene la sesión: no puede agendar una cita ni guardarla (el backend también lo rechaza).
  const isOwnProperty = Boolean(property && currentUser && currentUser.id === property.owner.id)
  // Solo el inquilino guarda propiedades. Sin sesión (o mientras se verifica) el botón se muestra.
  const canShowSave = property !== undefined && !isOwnProperty && (!currentUser || currentUser.roles.includes('CLIENT'))

  /** "Agendar cita": abre el calendario. Sin sesión se recuerda la intención y se vuelve aquí tras el login. */
  function scheduleVisit() {
    if (!property) return
    if (!hasSession) {
      // useAuth ya limpia el token vencido.
      setPendingVisitProperty(property.id)
      void navigate({ to: '/login', search: { next: `/property_detail/${property.id}` } })
      return
    }
    if (!currentUser) {
      setNotice(message("visits:sessionChecking"))
      return
    }
    if (!currentUser.roles.includes('CLIENT')) {
      setNotice(message("visits:tenantRoleRequired"))
      return
    }
    setScheduling(true)
  }

  // Al volver del login con la intención pendiente, el calendario se abre solo.
  const loadedPropertyId = property?.id
  const ownerId = property?.owner.id
  const currentUserId = currentUser?.roles.includes('CLIENT') ? currentUser.id : undefined
  const resumeScheduling = !pendingDismissed && loadedPropertyId !== undefined && pendingVisitId === loadedPropertyId
    && currentUserId !== undefined && currentUserId !== ownerId
  useEffect(() => {
    if (resumeScheduling) clearPendingVisitProperty()
  }, [resumeScheduling])

  function updateSaved(propertyId: number, save: boolean) {
    savedMutation.mutate({ propertyId, save }, {
      onSuccess: () => setNotice(save ? message("property:publicpropertypage_propiedad_guardada_en_tu_cuenta") : message("property:publicpropertypage_propiedad_eliminada_de_tus_guardadas")),
      onError: () => setNotice(message("property:publicpropertypage_no_pudimos_actualizar_tus_guardadas_intenta_de_nuevo")),
    })
  }

  // Al volver del login con la intención de guardar pendiente, se guarda sola.
  const { mutate: saveMutate } = savedMutation
  useEffect(() => {
    if (loadedPropertyId === undefined || ownerId === undefined || currentUserId === undefined) return
    if (consumePendingSaveProperty() !== loadedPropertyId || currentUserId === ownerId) return
    saveMutate(
      { propertyId: loadedPropertyId, save: true },
      {
        onSuccess: () => setNotice(message("property:publicpropertypage_propiedad_guardada_en_tu_cuenta")),
        onError: () => setNotice(message("property:publicpropertypage_no_pudimos_guardar_la_propiedad_intenta_de_nuevo")),
      },
    )
  }, [loadedPropertyId, ownerId, currentUserId, saveMutate, setNotice])

  function toggleSaved() {
    if (!property) return
    if (!hasSession) {
      // Sin sesión: se recuerda la intención y se guarda al volver del login.
      setPendingSaveProperty(property.id)
      void navigate({ to: '/login', search: { next: `/property_detail/${property.id}` } })
      return
    }
    if (!currentUser) {
      setNotice(message("property:publicpropertypage_estamos_verificando_tu_sesion_intenta_de_nuevo_en_un"))
      return
    }
    updateSaved(property.id, !saved)
  }
  async function share() {
    try {
      if (navigator.share) await navigator.share({ title: property?.title, url: window.location.href })
      else { await navigator.clipboard.writeText(window.location.href); setNotice(message("property:publicpropertypage_enlace_copiado")) }
    } catch (reason) {
      if (!(reason instanceof DOMException && reason.name === 'AbortError')) setNotice(message("property:publicpropertypage_puedes_compartir_el_enlace_de_la_barra_de_direcciones"))
    }
  }
  return <div className="min-h-screen bg-surface text-primary">
    <Navbar />
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <a href="/#properties" className="inline-flex items-center gap-2 text-sm font-semibold text-neutral hover:text-secondary"><ArrowLeft size={18} />{i18n.t("property:publicpropertypage_volver_a_resultados")}</a>
        {property && <div className="flex gap-2">
          {canShowSave && <button type="button" onClick={toggleSaved} disabled={savedMutation.isPending} aria-pressed={saved} className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm hover:border-secondary disabled:opacity-60"><Heart size={16} className={saved ? 'fill-secondary text-secondary' : ''} />{saved ? i18n.t("property:publicpropertypage_guardada") : i18n.t("property:publicpropertypage_guardar")}</button>}
          <button type="button" onClick={() => void share()} className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm hover:border-secondary"><Share2 size={16} />{i18n.t("property:publicpropertypage_compartir")}</button>
        </div>}
      </div>
      <p role="status" className="mb-3 text-sm text-secondary-dark">{notice}</p>
      {(!Number.isInteger(id) || id <= 0) ? <h1 className="py-20 text-center text-xl font-bold">{i18n.t("property:publicpropertypage_propiedad_no_valida")}</h1> : query.isPending ? <p role="status" className="py-24 text-center">{i18n.t("property:createpropertylocationpage_cargando_propiedad")}</p> : query.isError ? <div role="alert" className="rounded-2xl bg-white p-12 text-center"><h1 className="text-xl font-bold">{errorMessage(query.error)}</h1><button type="button" onClick={() => void query.refetch()} className="mt-4 font-bold text-secondary">{i18n.t("comments:propertycomments_reintentar")}</button></div> : property && <>
        <PropertyGallery key={property.id} property={property} />
        <div className="mt-8 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
          <article>
            <p className="text-xs font-bold uppercase tracking-widest text-secondary">{catalogText(property.typeOfProperty) || i18n.t("property:publicpropertypage_propiedad_en_alquiler")}</p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">{property.title}</h1>
            <p className="mt-3 flex items-center gap-2 text-neutral"><MapPin size={18} className="shrink-0" />{property.address}</p>
            <div className="mt-4 flex flex-wrap gap-5 text-sm text-neutral"><span className="inline-flex items-center gap-2"><BedDouble size={19} />{property.rooms}{' '}{i18n.t('common:room', { count: property.rooms })}</span><span className="inline-flex items-center gap-2"><Users size={19} />{property.guest}{' '}{i18n.t('common:person', { count: property.guest })}</span></div>
            <section className="mt-8 border-t border-slate-200 pt-6"><h2 className="text-xl font-bold">{i18n.t("explore:explorepage_servicios_incluidos")}</h2>
              <ul className="mt-4 flex flex-wrap gap-2">{property.services?.map((service) => <li key={service.id} className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm"><ServiceIcon name={service.icono} size={17} className="text-secondary" />{catalogText(service)}</li>)}</ul>
              {!property.services?.length && <p className="mt-3 text-sm text-neutral/70">{i18n.t("property:publicpropertypage_no_se_han_especificado_servicios")}</p>}
            </section>
            <section className="mt-8 border-t border-slate-200 pt-6"><h2 className="text-xl font-bold">{i18n.t("property:publicpropertypage_acerca_de_esta_propiedad")}</h2><p className="mt-4 whitespace-pre-wrap break-words leading-7 text-neutral">{property.description || i18n.t("property:publicpropertypage_sin_descripcion_disponible")}</p>
              <ul className="mt-4 flex flex-wrap gap-3">{property.iconDescriptions?.map((detail) => <li key={detail.id} className="inline-flex items-center gap-2 text-sm"><ServiceIcon name={detail.icon} size={18} />{detail.title}</li>)}</ul>
            </section>
            <PropertyComments propertyId={property.id} tenantId={property.reservedTenantId} />
          </article>
          <aside aria-label={i18n.t("property:publicpropertypage_precio_y_contacto")} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:sticky lg:top-24">
            <p><span className="text-3xl font-extrabold">{priceLabel(property)}</span><span className="text-sm text-neutral/70">{' '}{i18n.t("common:perMonth")}</span></p>
            <ReservationLabel property={property} />
            <PriceDetails price={property.displayPrice} />
            <div className="my-6 border-y border-slate-100 py-4"><p className="text-xs uppercase tracking-wide text-neutral/60">{i18n.t("property:publicpropertypage_publicado_por")}</p><p className="mt-1 font-bold">{property.owner.name}</p></div>
            {isOwnProperty ? (
              <div role="status" className="rounded-xl bg-slate-50 p-4 text-sm text-neutral">
                <p className="font-bold text-primary">{i18n.t("property:ownPropertyTitle")}</p>
                <p className="mt-1 text-neutral/75">{i18n.t("property:ownPropertyMessages")}</p>
                <Link to="/dashboard/owner/properties" className="mt-2 inline-block font-bold text-secondary hover:underline">{i18n.t("property:goToMyProperties")}</Link>
              </div>
            ) : (
            <button
              type="button"
              onClick={scheduleVisit}
              disabled={Boolean(property.reservedTenantId)}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-secondary px-4 py-3 font-bold text-white transition hover:bg-secondary-dark disabled:cursor-not-allowed disabled:opacity-60"
            ><CalendarCheck size={20} aria-hidden="true" />{i18n.t("visits:scheduleVisit")}</button>
            )}
          </aside>
        </div>
      </>}
    </main>
    {(scheduling || resumeScheduling) && property && <ScheduleVisitDialog propertyId={property.id} onClose={() => { setScheduling(false); setPendingDismissed(true) }} />}
    <Footer />
  </div>
}
