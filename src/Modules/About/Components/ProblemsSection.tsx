import { useTranslation } from 'react-i18next';
import i18n from '../../../i18n/instance';
import { FileQuestion, Layers, ShieldAlert, type LucideIcon } from 'lucide-react'
import Reveal from '../../LandingPage/Components/Reveal'
import { SectionTitle } from '../../LandingPage/Components/BenefitsSection'

const problems: () => { title: string; description: string; icon: LucideIcon }[] = () => ([
  {
    title: i18n.t("about:problemssection_falta_de_confianza_entre_las_partes"),
    description: i18n.t("about:problemssection_arrendadores_e_inquilinos_suelen_negociar_sin_suficiente_respaldo_ni"),
    icon: ShieldAlert,
  },
  {
    title: i18n.t("about:problemssection_informacion_limitada_o_poco_clara"),
    description: i18n.t("about:problemssection_las_publicaciones_muestran_fotos_y_precio_pero_rara_vez"),
    icon: FileQuestion,
  },
  {
    title: i18n.t("about:problemssection_procesos_dispersos_y_poco_transparentes"),
    description: i18n.t("about:problemssection_la_busqueda_el_contacto_y_la_negociacion_ocurren_en"),
    icon: Layers,
  },
])

export default function ProblemsSection() {
  useTranslation();
  return (
    <section className="bg-surface px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <SectionTitle title={i18n.t("about:problemssection_que_problema_queremos_resolver")} description={i18n.t("about:problemssection_estas_son_las_fricciones_mas_comunes_al_alquilar_una")} />
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {problems().map(({ title, description, icon: Icon }, index) => (
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
