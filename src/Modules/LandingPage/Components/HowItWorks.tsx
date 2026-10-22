import { useTranslation } from 'react-i18next';
import i18n from '../../../i18n/instance';
import { SectionTitle } from './BenefitsSection'
import Reveal from './Reveal'

const steps = () => ([
  { number: '1', title: i18n.t("landing:howitworks_busca"), description: i18n.t("landing:howitworks_encuentra_propiedades_en_las_zonas_que_te_interesan_con") },
  { number: '2', title: i18n.t("landing:howitworks_verifica"), description: i18n.t("landing:howitworks_revisa_el_saferent_score_experiencias_reales_y_datos_de") },
  { number: '3', title: i18n.t("landing:howitworks_alquila_con_confianza"), description: i18n.t("landing:howitworks_contacta_al_propietario_sabiendo_exactamente_que_esperar") },
])

export default function HowItWorks() {
  useTranslation();
  return (
    <section id="how-it-works" className="scroll-mt-20 bg-blue-50 px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <SectionTitle title={i18n.t("landing:howitworks_como_funciona_saferent")} />
        <div className="relative mt-12 grid grid-cols-1 gap-9 md:grid-cols-3 md:gap-8">
          <div className="pointer-events-none absolute inset-x-0 top-6 hidden h-px bg-gradient-to-r from-transparent via-primary/25 to-transparent md:block" aria-hidden="true" />
          {steps().map(({ number, title, description }, index) => (
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
