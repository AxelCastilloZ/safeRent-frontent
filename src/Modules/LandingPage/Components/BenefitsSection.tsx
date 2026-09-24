import { BadgeCheck, Building2, ShieldCheck, type LucideIcon } from 'lucide-react'
import Reveal from './Reveal'

const benefits: { title: string; description: string; icon: LucideIcon }[] = [
  { title: 'Información real de residentes', description: 'Conoce la experiencia de quienes han vivido allí antes de firmar.', icon: Building2 },
  { title: 'Servicios verificados', description: 'Datos sobre agua, electricidad y velocidad real de internet.', icon: BadgeCheck },
  { title: 'Seguridad y entorno', description: 'Información sobre ruido y percepción de seguridad del vecindario.', icon: ShieldCheck },
]

export default function BenefitsSection() {
  return (
    <section className="px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <SectionTitle title="No alquiles a ciegas" description="Todo lo que necesitas saber antes de elegir tu próximo hogar." />
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {benefits.map(({ title, description, icon: Icon }, index) => (
            <Reveal key={title} delay={index * 100} className="h-full">
              <article className="group h-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-lg hover:shadow-slate-200/70">
                <span className="mb-5 grid size-11 place-items-center rounded-xl bg-primary/10 text-primary ring-4 ring-primary/5 transition-colors group-hover:bg-primary group-hover:text-white">
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

export function SectionTitle({ title, description }: { title: string; description?: string }) {
  return (
    <div className="text-center">
      <h2 className="text-3xl font-extrabold tracking-tight text-primary sm:text-4xl">{title}</h2>
      {description && <p className="mt-3 text-neutral/75">{description}</p>}
    </div>
  )
}
