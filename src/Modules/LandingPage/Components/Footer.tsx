import { useTranslation } from 'react-i18next';
import i18n from '../../../i18n/instance';
import { Link } from '@tanstack/react-router'

const companyLinks = () => ([
  { label: i18n.t("landing:footer_sobre_nosotros"), to: '/sobre-nosotros' },
  { label: i18n.t("landing:footer_soporte"), to: '/soporte' },
])
const legalLinks = () => ([
  { label: i18n.t("landing:footer_politica_de_privacidad"), to: '/politica-de-privacidad' },
  { label: i18n.t("landing:footer_terminos_del_servicio"), to: '/terminos-del-servicio' },
])

export default function Footer() {
  useTranslation();
  return <footer className="bg-slate-100 text-neutral">
    <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[2fr_1fr_1fr]">
      <div><div className="mb-4 flex items-center gap-2 text-primary"><span className="grid size-9 place-items-center rounded-lg bg-primary text-white"><img src="/LogoSafeRentAzul.png" alt="" className="size-9 rounded-lg object-contain" /></span><span className="text-xl font-bold">SafeRent</span></div><p className="max-w-sm text-sm leading-6 text-neutral/75">{i18n.t("landing:footer_elevando_el_estandar_de_confianza_en_el_mercado_de")}</p></div>
      <FooterLinks title={i18n.t("landing:footer_compania")} links={companyLinks()} />
      <FooterLinks title={i18n.t("landing:footer_legal")} links={legalLinks()} />
    </div>
    <div className="border-t border-slate-200"><p className="mx-auto max-w-6xl px-4 py-5 text-center text-xs text-neutral/65 sm:px-6 sm:text-left">{i18n.t("landing:footer_2026_saferent_todos_los_derechos_reservados")}</p></div>
  </footer>
}

function FooterLinks({ title, links }: { title: string; links: { label: string; to: string }[] }) {
  useTranslation();
  return <div><h2 className="mb-4 text-sm font-semibold text-primary">{title}</h2><ul className="space-y-3">{links.map((link) => <li key={link.to}><Link to={link.to} className="text-sm text-neutral/80 transition hover:text-secondary">{link.label}</Link></li>)}</ul></div>
}
