import { useTranslation } from 'react-i18next';
import i18n from '../../../i18n/instance';
import { Target } from 'lucide-react'
import Reveal from '../../LandingPage/Components/Reveal'
import { SectionTitle } from '../../LandingPage/Components/BenefitsSection'

export default function MissionSection() {
  useTranslation();
  return (
    <section className="px-4 py-16 sm:px-6">
      <Reveal>
        <div className="mx-auto max-w-3xl text-center">
          <span className="mx-auto mb-5 grid size-12 place-items-center rounded-xl bg-primary/10 text-primary">
            <Target size={24} aria-hidden="true" />
          </span>
          <SectionTitle title={i18n.t("about:missionsection_nuestra_mision")} />
          <p className="mt-4 text-base leading-7 text-neutral/75">{i18n.t("about:missionsection_queremos_mejorar_la_confianza_y_la_transparencia_en_el")}</p>
        </div>
      </Reveal>
    </section>
  )
}
