import { Target } from 'lucide-react'
import Reveal from '../../LandingPage/Components/Reveal'
import { SectionTitle } from '../../LandingPage/Components/BenefitsSection'

export default function MissionSection() {
  return (
    <section className="px-4 py-16 sm:px-6">
      <Reveal>
        <div className="mx-auto max-w-3xl text-center">
          <span className="mx-auto mb-5 grid size-12 place-items-center rounded-xl bg-primary/10 text-primary">
            <Target size={24} aria-hidden="true" />
          </span>
          <SectionTitle title="Nuestra misión" />
          <p className="mt-4 text-base leading-7 text-neutral/75">
            Queremos mejorar la confianza y la transparencia en el mercado de alquileres, acercando a arrendadores e inquilinos con información
            real sobre cada propiedad, para que alquilar deje de sentirse como una apuesta.
          </p>
        </div>
      </Reveal>
    </section>
  )
}
