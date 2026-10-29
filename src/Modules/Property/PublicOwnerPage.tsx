import { useState } from 'react'
import { useParams } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { ArrowLeft, Building2 } from 'lucide-react'
import i18n from '../../i18n/instance'
import { errorMessage } from '../../i18n/messages'
import Navbar from '../LandingPage/Components/Navbar'
import Footer from '../LandingPage/Components/Footer'
import PropertyCard from '../LandingPage/Components/PropertyCard'
import { useProperties } from '../Explore/hooks/useProperties'
import { usePublicOwner } from './hooks/usePublicOwner'

/** Página pública con las propiedades publicadas de un propietario (se llega desde su nombre en el detalle de una propiedad). */
export default function PublicOwnerPage() {
  useTranslation()
  const { ownerId } = useParams({ strict: false })
  const id = Number(ownerId)
  const validId = Number.isInteger(id) && id > 0
  const owner = usePublicOwner(id)
  const [attempt, setAttempt] = useState(0)
  const listing = useProperties({ ownerId: validId ? id : undefined }, attempt)

  return <div className="min-h-screen bg-surface text-primary">
    <Navbar />
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <a href="/#properties" className="inline-flex items-center gap-2 text-sm font-semibold text-neutral hover:text-secondary"><ArrowLeft size={18} aria-hidden="true" />{i18n.t("property:publicpropertypage_volver_a_resultados")}</a>

      {!validId ? (
        <h1 className="py-20 text-center text-xl font-bold">{i18n.t("property:ownerPageInvalid")}</h1>
      ) : owner.isPending ? (
        <p role="status" className="py-24 text-center">{i18n.t("property:ownerPageLoading")}</p>
      ) : owner.isError ? (
        <div role="alert" className="mt-8 rounded-2xl bg-white p-12 text-center">
          <h1 className="text-xl font-bold">{errorMessage(owner.error)}</h1>
          <button type="button" onClick={() => void owner.refetch()} className="mt-4 font-bold text-secondary">{i18n.t("comments:propertycomments_reintentar")}</button>
        </div>
      ) : (
        <>
          <header className="mt-6 flex items-center gap-4">
            <span className="grid size-14 shrink-0 place-items-center rounded-full bg-secondary/10 text-secondary" aria-hidden="true"><Building2 size={28} /></span>
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-widest text-secondary">{i18n.t("property:ownerPageKicker")}</p>
              <h1 className="truncate text-3xl font-extrabold tracking-tight sm:text-4xl">{i18n.t("property:ownerPageTitle", { name: owner.data.name })}</h1>
              <p className="mt-1 text-sm text-neutral/70">{i18n.t("property:ownerPageCount", { count: owner.data.activeProperties })}</p>
            </div>
          </header>

          {listing.loading && <p role="status" className="mt-10 text-neutral">{i18n.t("landing:featuredproperties_cargando_propiedades")}</p>}
          {listing.error && <div role="alert" className="mt-10 text-neutral">
            <p>{listing.error}</p>
            <button type="button" onClick={() => setAttempt((value) => value + 1)} className="mt-2 font-bold text-secondary">{i18n.t("comments:propertycomments_reintentar")}</button>
          </div>}
          {!listing.loading && !listing.error && listing.properties.length === 0 && <p className="mt-10 text-neutral">{i18n.t("property:ownerPageEmpty")}</p>}
          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {listing.properties.map((property) => <PropertyCard key={property.id} property={property} />)}
          </div>
        </>
      )}
    </main>
    <Footer />
  </div>
}
