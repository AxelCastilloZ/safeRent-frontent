import { SectionTitle } from './BenefitsSection'

const steps = [
  { number: '1', title: 'Busca', description: 'Encuentra propiedades en las zonas que te interesan con filtros claros.' },
  { number: '2', title: 'Verifica', description: 'Revisa el SafeRent Score, experiencias reales y datos de servicios.' },
  { number: '3', title: 'Alquila con confianza', description: 'Contacta al propietario sabiendo exactamente qué esperar.' },
]

export default function HowItWorks() {
  return <section id="how-it-works" className="scroll-mt-20 bg-blue-50 px-4 py-16 sm:px-6"><div className="mx-auto max-w-5xl"><SectionTitle title="¿Cómo funciona SafeRent?" /><div className="mt-12 grid grid-cols-1 gap-9 md:grid-cols-3 md:gap-8">{steps.map(({ number, title, description }) => <article key={number} className="flex flex-col items-center text-center"><div className="flex size-12 items-center justify-center rounded-full bg-primary text-lg font-semibold text-white">{number}</div><h3 className="mt-5 font-bold text-primary">{title}</h3><p className="mt-2 max-w-60 text-sm leading-6 text-neutral/75">{description}</p></article>)}</div></div></section>
}
