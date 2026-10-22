import { useTranslation } from 'react-i18next';
import i18n from '../../../i18n/instance';
import { BadgeCheck } from 'lucide-react'
import Reveal from '../../LandingPage/Components/Reveal'
import { SectionTitle } from '../../LandingPage/Components/BenefitsSection'

const features = () => ([
  i18n.t("about:howsaferenthelpssection_publicacion_clara_de_propiedades_con_fotos_precio_y_condiciones"),
  i18n.t("about:howsaferenthelpssection_catalogo_de_servicios_de_cada_propiedad_agua_electricidad_internet"),
  i18n.t("about:howsaferenthelpssection_busqueda_de_propiedades_con_filtros_por_zona_precio_y"),
  i18n.t("about:howsaferenthelpssection_geolocalizacion_para_ubicar_propiedades_y_su_entorno_en_el"),
  i18n.t("about:howsaferenthelpssection_comunicacion_directa_entre_arrendadores_e_inquilinos_dentro_de_la"),
  i18n.t("about:howsaferenthelpssection_resenas_de_residentes_para_conocer_la_experiencia_real_de"),
  i18n.t("about:howsaferenthelpssection_informacion_mas_transparente_para_tomar_una_mejor_decision_antes"),
])

export default function HowSafeRentHelpsSection() {
  useTranslation();
  return (
    <section className="px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <SectionTitle title={i18n.t("about:howsaferenthelpssection_como_ayuda_saferent")} description={i18n.t("about:howsaferenthelpssection_herramientas_pensadas_para_reducir_la_incertidumbre_en_cada_paso")} />
        <Reveal>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2">
            {features().map((feature) => (
              <li key={feature} className="flex items-start gap-3 rounded-xl bg-blue-50 p-4">
                <BadgeCheck size={20} className="mt-0.5 shrink-0 text-primary" aria-hidden="true" />
                <span className="text-sm leading-6 text-neutral/80">{feature}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  )
}
