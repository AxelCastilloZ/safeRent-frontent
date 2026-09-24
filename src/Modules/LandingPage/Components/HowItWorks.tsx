import { SectionTitle } from './BenefitsSection'
import Reveal from './Reveal'

const steps = [
  { number: '1', title: 'Busca', description: 'Encuentra propiedades en las zonas que te interesan con filtros claros.' },
  { number: '2', title: 'Verifica', description: 'Revisa el SafeRent Score, experiencias reales y datos de servicios.' },
  { number: '3', title: 'Alquila con confianza', description: 'Contacta al propietario sabiendo exactamente qué esperar.' },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-20 bg-blue-50 px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <SectionTitle title="¿Cómo funciona SafeRent?" />
        <div className="relative mt-12 grid grid-cols-1 gap-9 md:grid-cols-3 md:gap-8">
          <div className="pointer-events-none absolute inset-x-0 top-6 hidden h-px bg-gradient-to-r from-transparent via-primary/25 to-transparent md:block" aria-hidden="true" />
          {steps.map(({ number, title, description }, index) => (
            <Reveal key={number} delay={index * 120}>
              <article className="flex flex-col items-center text-center">
                <div className="relative z-10 flex size-12 items-center justify-center rounded-full bg-primary text-lg font-semibold text-white shadow-md shadow-primary/20 ring-8 ring-blue-50">
                  {number}
                </div>
                <h3 className="mt-5 font-bold text-primary">{title}</h3>
                <p className="mt-2 max-w-60 text-sm leading-6 text-neutral/75">{description}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
