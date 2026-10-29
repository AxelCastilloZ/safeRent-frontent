import { errorMessage } from '../../i18n/messages';
import PropertyDescription from './Components/PropertyDescription';
import { message } from '../../i18n/messages';
import { useMessageState } from '../../i18n/useMessageState';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n/instance';
import PropertyComments from '../Comments/Components/PropertyComments'
import PropertyPriceCard from './Components/PropertyPriceCard'
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from '@tanstack/react-router'
import { ArrowLeft, CalendarCheck, Heart, Share2 } from 'lucide-react'
import Navbar from '../LandingPage/Components/Navbar'
import Footer from '../LandingPage/Components/Footer'
import PropertyGallery from './Components/PropertyGallery'
import { usePublicProperty } from './hooks/usePublicProperty'

import { useAuth } from '../Auth/hooks/authHooks'

import ScheduleVisitDialog from '../Visits/components/ScheduleVisitDialog'
import { useLiveVisitForProperty } from '../Visits/hooks/visitHooks'
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
  // Si ya tiene una cita viva aquí, no puede iniciar otra: el botón se deshabilita y se le lleva a ella.
  const liveVisit = useLiveVisitForProperty(property?.id)
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
            <PropertyDescription property={property} />
            <PropertyComments propertyId={property.id} tenantId={property.reservedTenantId} />
          </article>
          <PropertyPriceCard property={property} ownerName={property.owner.name}>
            {isOwnProperty ? (
              <div role="status" className="rounded-xl bg-slate-50 p-4 text-sm text-neutral">
                <p className="font-bold text-primary">{i18n.t("property:ownPropertyTitle")}</p>
                <p className="mt-1 text-neutral/75">{i18n.t("property:ownPropertyMessages")}</p>
                <Link to="/dashboard/owner/properties" className="mt-2 inline-block font-bold text-secondary hover:underline">{i18n.t("property:goToMyProperties")}</Link>
              </div>
            ) : (
            <>
              <button
                type="button"
                onClick={scheduleVisit}
                disabled={Boolean(property.reservedTenantId) || Boolean(liveVisit)}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-secondary px-4 py-3 font-bold text-white transition hover:bg-secondary-dark disabled:cursor-not-allowed disabled:opacity-60"
              ><CalendarCheck size={20} aria-hidden="true" />{liveVisit ? i18n.t("visits:alreadyScheduled") : i18n.t("visits:scheduleVisit")}</button>
              {liveVisit && <Link to="/dashboard/visits" className="mt-3 inline-block text-sm font-bold text-secondary hover:underline">{i18n.t("visits:viewThisVisit")}</Link>}
            </>
            )}
          </PropertyPriceCard>
        </div>
      </>}
    </main>
    {(scheduling || resumeScheduling) && property && <ScheduleVisitDialog propertyId={property.id} ownerId={property.owner.id} onClose={() => { setScheduling(false); setPendingDismissed(true) }} />}
    <Footer />
  </div>
}
