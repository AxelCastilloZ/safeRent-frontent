import { Link } from 'react-router-dom'

const companyLinks = [
  { label: 'Sobre nosotros', to: '/sobre-nosotros' },
  { label: 'Soporte', to: '/soporte' },
]
const legalLinks = [
  { label: 'Política de privacidad', to: '/politica-de-privacidad' },
  { label: 'Términos del servicio', to: '/terminos-del-servicio' },
]

export default function Footer() {
  return <footer className="bg-slate-100 text-neutral">
    <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[2fr_1fr_1fr]">
      <div><div className="mb-4 flex items-center gap-2 text-primary"><span className="grid size-9 place-items-center rounded-lg bg-primary text-white"><img src="/LogoSafeRentAzul.png" alt="" className="size-9 rounded-lg object-contain" /></span><span className="text-xl font-bold">SafeRent</span></div><p className="max-w-sm text-sm leading-6 text-neutral/75">Elevando el estándar de confianza en el mercado de alquileres a través de la transparencia.</p></div>
      <FooterLinks title="Compañía" links={companyLinks} />
      <FooterLinks title="Legal" links={legalLinks} />
    </div>
    <div className="border-t border-slate-200"><p className="mx-auto max-w-6xl px-4 py-5 text-center text-xs text-neutral/65 sm:px-6 sm:text-left">© 2026 SafeRent. Todos los derechos reservados.</p></div>
  </footer>
}

function FooterLinks({ title, links }: { title: string; links: { label: string; to: string }[] }) {
  return <div><h2 className="mb-4 text-sm font-semibold text-primary">{title}</h2><ul className="space-y-3">{links.map((link) => <li key={link.to}><Link to={link.to} className="text-sm text-neutral/80 transition hover:text-secondary">{link.label}</Link></li>)}</ul></div>
}
