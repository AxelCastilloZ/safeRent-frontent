import { FileQuestion, Layers, ShieldAlert, type LucideIcon } from 'lucide-react'
import Reveal from '../../LandingPage/Components/Reveal'
import { SectionTitle } from '../../LandingPage/Components/BenefitsSection'

const problems: { title: string; description: string; icon: LucideIcon }[] = [
  {
    title: 'Falta de confianza entre las partes',
    description: 'Arrendadores e inquilinos suelen negociar sin suficiente respaldo ni antecedentes verificables.',
    icon: ShieldAlert,
  },
  {
    title: 'Información limitada o poco clara',
    description: 'Las publicaciones muestran fotos y precio, pero rara vez datos reales sobre servicios o el entorno.',
    icon: FileQuestion,
  },
  {
    title: 'Procesos dispersos y poco transparentes',
    description: 'La búsqueda, el contacto y la negociación ocurren en canales distintos, sin un historial claro.',
    icon: Layers,
  },
]

export default function ProblemsSection() {
  return (
    <section className="bg-surface px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <SectionTitle title="¿Qué problema queremos resolver?" description="Estas son las fricciones más comunes al alquilar una vivienda." />
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {problems.map(({ title, description, icon: Icon }, index) => (
            <Reveal key={title} delay={index * 100} className="h-full">
              <article className="h-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                <span className="mb-5 grid size-11 place-items-center rounded-xl bg-primary/10 text-primary">
                  <Icon size={22} aria-hidden="true" />
                </span>
                <h3 className="text-base font-bold text-neutral">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-neutral/75">{description}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
