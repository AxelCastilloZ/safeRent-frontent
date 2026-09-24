import { Building2, ClipboardList, MessageCircle, Search, ShieldCheck, Star, UserCircle, type LucideIcon } from 'lucide-react'
import Reveal from '../../LandingPage/Components/Reveal'
import { SectionTitle } from '../../LandingPage/Components/BenefitsSection'
import { SUPPORT_CATEGORIES, type SupportCategory } from '../types/faq'

// Record en vez de array: si se agrega una categoría a SUPPORT_CATEGORIES sin
// darle ícono/descripción aquí, TypeScript lo marca en tiempo de compilación.
const categoryDetails: Record<SupportCategory, { description: string; icon: LucideIcon }> = {
  'Cuenta y perfil': { description: 'Registro, datos personales y preferencias de tu cuenta.', icon: UserCircle },
  'Publicación de propiedades': { description: 'Cómo crear, editar y administrar tus publicaciones.', icon: Building2 },
  'Búsqueda y filtros': { description: 'Encuentra propiedades por zona, precio y características.', icon: Search },
  'Servicios de propiedades': { description: 'Agua, electricidad, internet y otros datos verificables.', icon: ClipboardList },
  Mensajería: { description: 'Comunicación entre arrendadores e inquilinos.', icon: MessageCircle },
  Reseñas: { description: 'Cómo funcionan las calificaciones de residentes.', icon: Star },
  'Seguridad y privacidad': { description: 'Protección de tus datos y buenas prácticas.', icon: ShieldCheck },
}

type SupportCategoriesProps = {
  activeCategory: SupportCategory | null
  onSelectCategory: (category: SupportCategory) => void
}

export default function SupportCategories({ activeCategory, onSelectCategory }: SupportCategoriesProps) {
  return (
    <section className="px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <SectionTitle title="Explora por categoría" description="Encuentra ayuda organizada por los temas más comunes." />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SUPPORT_CATEGORIES.map((category, index) => {
            const { description, icon: Icon } = categoryDetails[category]
            const isActive = activeCategory === category
            return (
              <Reveal key={category} delay={index * 70} className="h-full">
                <button
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => onSelectCategory(category)}
                  className={`group h-full w-full rounded-2xl border p-6 text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${
                    isActive ? 'border-primary bg-primary/5' : 'border-slate-200 bg-white hover:border-primary/20'
                  }`}
                >
                  <span
                    className={`mb-5 grid size-11 place-items-center rounded-xl transition-colors ${
                      isActive ? 'bg-primary text-white' : 'bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white'
                    }`}
                  >
                    <Icon size={22} aria-hidden="true" />
                  </span>
                  <h3 className="text-base font-bold text-neutral">{category}</h3>
                  <p className="mt-2 text-sm leading-6 text-neutral/75">{description}</p>
                </button>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
