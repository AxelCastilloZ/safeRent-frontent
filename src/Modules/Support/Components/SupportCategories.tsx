import { categoryLabel } from '../categoryLabel';
import { useTranslation } from 'react-i18next';
import i18n from '../../../i18n/instance';
import { Building2, ClipboardList, MessageCircle, Search, ShieldCheck, Star, UserCircle, type LucideIcon } from 'lucide-react'
import Reveal from '../../LandingPage/Components/Reveal'
import { SectionTitle } from '../../LandingPage/Components/BenefitsSection'
import { SUPPORT_CATEGORIES, type SupportCategory } from '../types/faq'

// Record en vez de array: si se agrega una categoría a SUPPORT_CATEGORIES sin
// darle ícono/descripción aquí, TypeScript lo marca en tiempo de compilación.
const categoryDetails: () => Record<SupportCategory, { description: string; icon: LucideIcon }> = () => ({
  'Cuenta y perfil': { description: i18n.t("support:supportcategories_registro_datos_personales_y_preferencias_de_tu_cuenta"), icon: UserCircle },
  'Publicación de propiedades': { description: i18n.t("support:supportcategories_como_crear_editar_y_administrar_tus_publicaciones"), icon: Building2 },
  'Búsqueda y filtros': { description: i18n.t("support:supportcategories_encuentra_propiedades_por_zona_precio_y_caracteristicas"), icon: Search },
  'Servicios de propiedades': { description: i18n.t("support:supportcategories_agua_electricidad_internet_y_otros_datos_verificables"), icon: ClipboardList },
  Mensajería: { description: i18n.t("support:supportcategories_comunicacion_entre_arrendadores_e_inquilinos"), icon: MessageCircle },
  Reseñas: { description: i18n.t("support:supportcategories_como_funcionan_las_calificaciones_de_residentes"), icon: Star },
  'Seguridad y privacidad': { description: i18n.t("support:supportcategories_proteccion_de_tus_datos_y_buenas_practicas"), icon: ShieldCheck },
})

type SupportCategoriesProps = {
  activeCategory: SupportCategory | null
  onSelectCategory: (category: SupportCategory) => void
}

export default function SupportCategories({ activeCategory, onSelectCategory }: SupportCategoriesProps) {
  useTranslation();
  return (
    <section className="px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <SectionTitle title={i18n.t("support:supportcategories_explora_por_categoria")} description={i18n.t("support:supportcategories_encuentra_ayuda_organizada_por_los_temas_mas_comunes")} />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SUPPORT_CATEGORIES.map((category, index) => {
            const { description, icon: Icon } = categoryDetails()[category]
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
                  <h3 className="text-base font-bold text-neutral">{categoryLabel(category)}</h3>
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
