import { useTranslation } from 'react-i18next';
import i18n from '../../../i18n/instance';
import { ArrowRight } from 'lucide-react'
import { useState } from 'react'
import { useProperties } from '../../Explore/hooks/useProperties'
import PropertyCard from './PropertyCard'
import Reveal from './Reveal'

export default function FeaturedProperties({ serviceIds }: { serviceIds: number[] }) {
  useTranslation();
  const [attempt, setAttempt] = useState(0)
  const { properties, loading, error } = useProperties({ serviceIds }, attempt)
  // The public endpoint returns published properties, newest first.
  const featuredProperties = properties.slice(0, 6)
  return (
    <section id="properties" className="scroll-mt-20 bg-surface px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-primary">{i18n.t("landing:featuredproperties_elegidas_para_ti")}</p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-primary sm:text-4xl">{i18n.t("landing:featuredproperties_propiedades_destacadas")}</h2>
          </div>
          <a href="/explorar" className="group inline-flex items-center gap-1 self-start text-sm font-bold text-secondary transition hover:text-secondary-dark sm:self-auto">{i18n.t("landing:featuredproperties_ver_todas")}{' '}<ArrowRight size={16} aria-hidden="true" className="transition-transform group-hover:translate-x-1" />
          </a>
        </div>
        {loading && <p role="status" className="mt-8 text-neutral">{i18n.t("landing:featuredproperties_cargando_propiedades")}</p>}
        {error && <div role="alert" className="mt-8 text-neutral">
          <p>{error}</p>
          <button type="button" onClick={() => setAttempt((value) => value + 1)} className="mt-2 font-bold text-secondary">{i18n.t("comments:propertycomments_reintentar")}</button>
        </div>}
        {!loading && !error && featuredProperties.length === 0 && (
          <p className="mt-8 text-neutral">{serviceIds.length ? i18n.t("landing:featuredproperties_no_hay_propiedades_con_los_servicios_seleccionados") : i18n.t("landing:featuredproperties_aun_no_hay_propiedades_publicadas")}</p>
        )}
        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {featuredProperties.map((property, index) => (
            <Reveal key={property.id} delay={index * 100} className="h-full">
              <PropertyCard property={property} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
