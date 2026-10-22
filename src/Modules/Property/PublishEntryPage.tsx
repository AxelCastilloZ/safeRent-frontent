import { useTranslation } from 'react-i18next';
import i18n from '../../i18n/instance';
import { Link } from '@tanstack/react-router'
import { ArrowRight, ClipboardCheck, FileText, ImagePlus, MapPin } from 'lucide-react'
import Footer from '../LandingPage/Components/Footer'
import Navbar from '../LandingPage/Components/Navbar'
import Reveal from '../LandingPage/Components/Reveal'

const steps = () => ([
  { title: i18n.t("property:propertydetailpage_datos_de_la_propiedad"), description: i18n.t("property:publishentrypage_titulo_descripcion_precio_y_servicios_que_ofreces"), Icon: FileText },
  { title: i18n.t("dashboard:adminpropertiespage_ubicacion"), description: i18n.t("property:publishentrypage_busca_la_direccion_y_confirmala_en_el_mapa"), Icon: MapPin },
  { title: i18n.t("property:createpropertylocationpage_fotografias"), description: i18n.t("property:publishentrypage_sube_imagenes_que_muestren_bien_la_propiedad"), Icon: ImagePlus },
  { title: i18n.t("property:publishentrypage_revision"), description: i18n.t("property:publishentrypage_un_administrador_la_revisa_y_al_aprobarla_queda_visible"), Icon: ClipboardCheck },
])

const primaryLink =
  'inline-flex items-center justify-center gap-2 rounded-xl bg-secondary px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-secondary-dark'
const secondaryLink =
  'inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-primary transition hover:border-secondary'

/**
 * Explica cómo publicar y abre el formulario; su guard conserva el destino al iniciar sesión.
 */
export default function PublishEntryPage() {
  useTranslation();

  return (
    <div className="min-h-screen bg-white text-ink">
      <Navbar />
      <main className="bg-surface px-4 py-14 sm:px-6 sm:py-20">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-primary">{i18n.t("explore:explorepage_para_propietarios")}</p>
          <h1 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">{i18n.t("landing:ownercta_publica_tu_propiedad_en_saferent")}</h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-neutral/75">{i18n.t("property:publishentrypage_llega_a_inquilinos_que_buscan_transparencia_tu_propiedad_se")}</p>
        </Reveal>

        <ol className="mx-auto mt-10 grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps().map(({ title, description, Icon }, index) => (
            <li key={title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">
                <Icon size={20} aria-hidden="true" />
              </span>
              <p className="mt-4 text-xs font-bold uppercase tracking-wide text-secondary-dark">{i18n.t("property:propertyformlayout_paso")}{' '}{index + 1}</p>
              <h3 className="mt-1 font-bold text-primary">{title}</h3>
              <p className="mt-1 text-sm leading-6 text-neutral/75">{description}</p>
            </li>
          ))}
        </ol>

        <div className="mx-auto mt-10 max-w-xl rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm sm:p-8">
          <h2 className="text-xl font-bold text-primary">{i18n.t("property:publishentrypage_crea_tu_propiedad")}</h2>
          <p className="mt-2 text-sm leading-6 text-neutral/75">{i18n.t("property:publishentrypage_completa_los_datos_y_envia_tu_propiedad_a_revision")}</p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Link to="/dashboard/owner/properties/new" className={primaryLink}>{i18n.t("property:publishentrypage_crear_propiedad")}<ArrowRight size={17} aria-hidden="true" />
            </Link>
            <Link to="/register" search={{ next: '/dashboard/owner/properties/new' }} className={secondaryLink}>{i18n.t("property:publishentrypage_crear_cuenta")}</Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
