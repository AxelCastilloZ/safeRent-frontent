import PropertyComments from '../Comments/Components/PropertyComments'
import ReservationLabel from '../Reservations/Components/ReservationLabel'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from '@tanstack/react-router'
import { ArrowLeft, BedDouble, Heart, MapPin, MessageCircle, Share2, Users } from 'lucide-react'
import Navbar from '../LandingPage/Components/Navbar'
import Footer from '../LandingPage/Components/Footer'
import ServiceIcon from '../Services/components/ServiceIcon'
import PropertyGallery from './Components/PropertyGallery'
import { usePublicProperty } from './hooks/usePublicProperty'
import { priceLabel } from '../Explore/utils/property.utils'
import { useAuth } from '../Auth/hooks/authHooks'
import { useStartConversation } from '../Messages/hooks/messageHooks'
import { consumePendingChatProperty, setPendingChatProperty } from '../Messages/utils/pendingChat'

export default function PublicPropertyPage() {
  const { propertyId } = useParams({ strict: false })
  const id = Number(propertyId)
  const query = usePublicProperty(id)
  const [notice, setNotice] = useState('')
  const [saved, setSaved] = useState(() => {
    try { return localStorage.getItem(`saved-property-${id}`) === 'true' } catch { return false }
  })
  const property = query.data
  const navigate = useNavigate()
  const { user: currentUser, hasSession } = useAuth()
  const startConversation = useStartConversation()

  function contactOwner() {
    if (!property) return
    if (!hasSession) {
      // Sin sesión (useAuth ya limpia el token vencido): se recuerda la intención y se vuelve aquí tras el login.
      setPendingChatProperty(property.id)
      void navigate({ to: '/login', search: { next: `/property_detail/${property.id}` } })
      return
    }
    if (!currentUser) {
      setNotice('Estamos verificando tu sesión. Intenta de nuevo en un momento.')
      return
    }
    if (!currentUser.roles.includes('CLIENT')) {
      setNotice('Necesitas el rol de inquilino para contactar al propietario.');
      return;
    }
    if (currentUser.id === property.owner.id) {
      setNotice('Esta propiedad es tuya: no puedes chatear contigo mismo.')
      return
    }
    startConversation.mutate({ participantIds: [currentUser.id, property.owner.id], propertyId: property.id })
  }

  // Al volver del login con la intención pendiente, el chat se abre solo.
  const loadedPropertyId = property?.id
  const ownerId = property?.owner.id
  const currentUserId = currentUser?.roles.includes('CLIENT') ? currentUser.id : undefined
  const { mutate: startConversationMutate } = startConversation
  useEffect(() => {
    if (loadedPropertyId === undefined || ownerId === undefined || currentUserId === undefined) return
    if (consumePendingChatProperty() !== loadedPropertyId || currentUserId === ownerId) return
    startConversationMutate({ participantIds: [currentUserId, ownerId], propertyId: loadedPropertyId })
  }, [loadedPropertyId, ownerId, currentUserId, startConversationMutate])
  function toggleSaved() {
    try {
      localStorage.setItem(`saved-property-${id}`, String(!saved))
      setSaved(!saved)
      setNotice(!saved ? 'Propiedad guardada en este dispositivo.' : 'Propiedad eliminada de tus guardados.')
    } catch { setNotice('No se pudo guardar la propiedad en este dispositivo.') }
  }
  async function share() {
    try {
      if (navigator.share) await navigator.share({ title: property?.title, url: window.location.href })
      else { await navigator.clipboard.writeText(window.location.href); setNotice('Enlace copiado.') }
    } catch (reason) {
      if (!(reason instanceof DOMException && reason.name === 'AbortError')) setNotice('Puedes compartir el enlace de la barra de direcciones.')
    }
  }
  return <div className="min-h-screen bg-surface text-primary">
    <Navbar />
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <a href="/#properties" className="inline-flex items-center gap-2 text-sm font-semibold text-neutral hover:text-secondary"><ArrowLeft size={18} />Volver a resultados</a>
        {property && <div className="flex gap-2">
          <button type="button" onClick={toggleSaved} aria-pressed={saved} className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm hover:border-secondary"><Heart size={16} className={saved ? 'fill-secondary text-secondary' : ''} />{saved ? 'Guardada' : 'Guardar'}</button>
          <button type="button" onClick={() => void share()} className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm hover:border-secondary"><Share2 size={16} />Compartir</button>
        </div>}
      </div>
      <p role="status" className="mb-3 text-sm text-secondary-dark">{notice}</p>
      {startConversation.isError && <p role="alert" className="mb-3 text-sm text-red-700">No pudimos abrir el chat. Intenta nuevamente.</p>}
      {(!Number.isInteger(id) || id <= 0) ? <h1 className="py-20 text-center text-xl font-bold">Propiedad no válida</h1> : query.isPending ? <p role="status" className="py-24 text-center">Cargando propiedad...</p> : query.isError ? <div role="alert" className="rounded-2xl bg-white p-12 text-center"><h1 className="text-xl font-bold">{query.error.message}</h1><button type="button" onClick={() => void query.refetch()} className="mt-4 font-bold text-secondary">Reintentar</button></div> : property && <>
        <PropertyGallery key={property.id} property={property} />
        <div className="mt-8 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
          <article>
            <p className="text-xs font-bold uppercase tracking-widest text-secondary">{property.typeOfProperty?.name || 'Propiedad en alquiler'}</p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">{property.title}</h1>
            <p className="mt-3 flex items-center gap-2 text-neutral"><MapPin size={18} className="shrink-0" />{property.address}</p>
            <div className="mt-4 flex flex-wrap gap-5 text-sm text-neutral"><span className="inline-flex items-center gap-2"><BedDouble size={19} />{property.rooms} habitaciones</span><span className="inline-flex items-center gap-2"><Users size={19} />{property.guest} huéspedes</span></div>
            <section className="mt-8 border-t border-slate-200 pt-6"><h2 className="text-xl font-bold">Servicios incluidos</h2>
              <ul className="mt-4 flex flex-wrap gap-2">{property.services?.map((service) => <li key={service.id} className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm"><ServiceIcon name={service.icono} size={17} className="text-secondary" />{service.name}</li>)}</ul>
              {!property.services?.length && <p className="mt-3 text-sm text-neutral/70">No se han especificado servicios.</p>}
            </section>
            <section className="mt-8 border-t border-slate-200 pt-6"><h2 className="text-xl font-bold">Acerca de esta propiedad</h2><p className="mt-4 whitespace-pre-wrap break-words leading-7 text-neutral">{property.description || 'Sin descripción disponible.'}</p>
              <ul className="mt-4 flex flex-wrap gap-3">{property.iconDescriptions?.map((detail) => <li key={detail.id} className="inline-flex items-center gap-2 text-sm"><ServiceIcon name={detail.icon} size={18} />{detail.title}</li>)}</ul>
            </section>
            <PropertyComments propertyId={property.id} tenantId={property.reservedTenantId} />
          </article>
          <aside aria-label="Precio y contacto" className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:sticky lg:top-24">
            <p><span className="text-3xl font-extrabold">{priceLabel(property)}</span><span className="text-sm text-neutral/70"> / mes</span></p>
            <ReservationLabel property={property} />
            <p className="mt-2 text-xs text-neutral/60">Precio en {property.typeOfCoin || 'CRC'}</p>
            <div className="my-6 border-y border-slate-100 py-4"><p className="text-xs uppercase tracking-wide text-neutral/60">Publicado por</p><p className="mt-1 font-bold">{property.owner.name}</p></div>
            <button type="button" onClick={contactOwner} disabled={startConversation.isPending} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-secondary px-4 py-3 font-bold text-white transition hover:bg-secondary-dark disabled:cursor-not-allowed disabled:opacity-60"><MessageCircle size={20} aria-hidden="true" />{startConversation.isPending ? 'Abriendo chat…' : 'Chatear con el propietario'}</button>
          </aside>
        </div>
      </>}
    </main>
    <Footer />
  </div>
}
