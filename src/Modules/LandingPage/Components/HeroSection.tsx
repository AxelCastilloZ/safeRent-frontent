import { useTranslation } from 'react-i18next';
import i18n from '../../../i18n/instance';
import Reveal from './Reveal'

export default function HeroSection() {
  useTranslation();
  return (
    <section id="top" className="relative overflow-hidden bg-surface px-4 pb-8 pt-16 sm:px-6 sm:pb-10 sm:pt-24">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-24 left-1/2 size-96 -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -right-16 top-10 size-64 rounded-full bg-secondary/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-3xl text-center">
        <Reveal>
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-primary">{i18n.t("landing:herosection_alquila_con_informacion_real")}</p>
        </Reveal>
        <Reveal delay={80}>
          <h1 className="text-4xl font-extrabold tracking-tight text-ink sm:text-5xl lg:text-6xl">{i18n.t("landing:herosection_encuentra_un_lugar_donde")}{' '}<span className="block">{i18n.t("landing:herosection_realmente_quieras_vivir")}</span>
          </h1>
        </Reveal>
        <Reveal delay={160}>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-neutral/80 sm:text-lg">{i18n.t("landing:herosection_descubre_propiedades_experiencias_reales_de_residentes_y_datos_sobre")}</p>
        </Reveal>
      </div>
    </section>
  )
}
