import { Eye, HeartHandshake, ShieldCheck, Sparkles, type LucideIcon } from 'lucide-react'
import Reveal from '../../LandingPage/Components/Reveal'
import { SectionTitle } from '../../LandingPage/Components/BenefitsSection'

const values: { title: string; description: string; icon: LucideIcon }[] = [
  { title: 'Transparencia', description: 'Mostramos información real y verificable, sin letra pequeña.', icon: Eye },
  { title: 'Seguridad', description: 'Priorizamos la protección de los datos y la identidad de nuestros usuarios.', icon: ShieldCheck },
  { title: 'Confianza', description: 'Construimos una relación honesta entre arrendadores e inquilinos.', icon: HeartHandshake },
  { title: 'Simplicidad', description: 'Simplificamos cada paso del proceso de alquiler.', icon: Sparkles },
]

export default function ValuesSection() {
  return (
    <section className="bg-surface px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <SectionTitle title="Nuestros valores" />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {values.map(({ title, description, icon: Icon }, index) => (
            <Reveal key={title} delay={index * 90} className="h-full">
              <article className="h-full rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                <span className="mx-auto mb-5 grid size-11 place-items-center rounded-xl bg-primary/10 text-primary">
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
