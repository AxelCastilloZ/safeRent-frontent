import { useTranslation } from 'react-i18next';
import i18n from '../../../i18n/instance';
import { Eye, HeartHandshake, ShieldCheck, Sparkles, type LucideIcon } from 'lucide-react'
import Reveal from '../../LandingPage/Components/Reveal'
import { SectionTitle } from '../../LandingPage/Components/BenefitsSection'

const values: () => { title: string; description: string; icon: LucideIcon }[] = () => ([
  { title: i18n.t("about:valuessection_transparencia"), description: i18n.t("about:valuessection_mostramos_informacion_real_y_verificable_sin_letra_pequena"), icon: Eye },
  { title: i18n.t("about:valuessection_seguridad"), description: i18n.t("about:valuessection_priorizamos_la_proteccion_de_los_datos_y_la_identidad"), icon: ShieldCheck },
  { title: i18n.t("about:valuessection_confianza"), description: i18n.t("about:valuessection_construimos_una_relacion_honesta_entre_arrendadores_e_inquilinos"), icon: HeartHandshake },
  { title: i18n.t("about:valuessection_simplicidad"), description: i18n.t("about:valuessection_simplificamos_cada_paso_del_proceso_de_alquiler"), icon: Sparkles },
])

export default function ValuesSection() {
  useTranslation();
  return (
    <section className="bg-surface px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <SectionTitle title={i18n.t("about:valuessection_nuestros_valores")} />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {values().map(({ title, description, icon: Icon }, index) => (
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
