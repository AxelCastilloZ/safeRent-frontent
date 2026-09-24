import { BadgeCheck } from 'lucide-react'
import Reveal from '../../LandingPage/Components/Reveal'
import { SectionTitle } from '../../LandingPage/Components/BenefitsSection'

const features = [
  'Publicación clara de propiedades, con fotos, precio y condiciones visibles.',
  'Catálogo de servicios de cada propiedad: agua, electricidad, internet y más.',
  'Búsqueda de propiedades con filtros por zona, precio y características.',
  'Geolocalización para ubicar propiedades y su entorno en el mapa.',
  'Comunicación directa entre arrendadores e inquilinos dentro de la plataforma.',
  'Reseñas de residentes para conocer la experiencia real de vivir ahí.',
  'Información más transparente para tomar una mejor decisión antes de alquilar.',
]

export default function HowSafeRentHelpsSection() {
  return (
    <section className="px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <SectionTitle title="¿Cómo ayuda SafeRent?" description="Herramientas pensadas para reducir la incertidumbre en cada paso del alquiler." />
        <Reveal>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2">
            {features.map((feature) => (
              <li key={feature} className="flex items-start gap-3 rounded-xl bg-blue-50 p-4">
                <BadgeCheck size={20} className="mt-0.5 shrink-0 text-primary" aria-hidden="true" />
                <span className="text-sm leading-6 text-neutral/80">{feature}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  )
}
