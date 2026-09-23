import { Building2, ClipboardList, MessageCircle, Search, ShieldCheck, Star, UserCircle, type LucideIcon } from 'lucide-react'
import Reveal from '../../LandingPage/Components/Reveal'
import { SectionTitle } from '../../LandingPage/Components/BenefitsSection'

const categories: { title: string; description: string; icon: LucideIcon }[] = [
  { title: 'Cuenta y perfil', description: 'Registro, datos personales y preferencias de tu cuenta.', icon: UserCircle },
  { title: 'Publicación de propiedades', description: 'Cómo crear, editar y administrar tus publicaciones.', icon: Building2 },
  { title: 'Búsqueda y filtros', description: 'Encuentra propiedades por zona, precio y características.', icon: Search },
  { title: 'Servicios de propiedades', description: 'Agua, electricidad, internet y otros datos verificables.', icon: ClipboardList },
  { title: 'Mensajería', description: 'Comunicación entre arrendadores e inquilinos.', icon: MessageCircle },
  { title: 'Reseñas', description: 'Cómo funcionan las calificaciones de residentes.', icon: Star },
  { title: 'Seguridad y privacidad', description: 'Protección de tus datos y buenas prácticas.', icon: ShieldCheck },
]

export default function SupportCategories() {
  return (
    <section className="px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <SectionTitle title="Explora por categoría" description="Encuentra ayuda organizada por los temas más comunes." />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map(({ title, description, icon: Icon }, index) => (
            <Reveal key={title} delay={index * 70} className="h-full">
              <article className="group h-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-md">
                <span className="mb-5 grid size-11 place-items-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
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
