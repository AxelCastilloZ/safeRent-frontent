import { Building2 } from 'lucide-react'

const companyLinks = ['Sobre nosotros', 'Soporte', 'Carreras']
const legalLinks = ['Política de privacidad', 'Términos del servicio', 'Política de cookies']

export default function Footer() {
  return <footer className="bg-slate-100 text-neutral">
    <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[2fr_1fr_1fr]">
      <div><div className="mb-4 flex items-center gap-2 text-primary"><span className="grid size-9 place-items-center rounded-lg bg-primary text-white"><Building2 size={20} /></span><span className="text-xl font-bold">SafeRent</span></div><p className="max-w-sm text-sm leading-6 text-neutral/75">Elevando el estándar de confianza en el mercado de alquileres a través de la transparencia.</p></div>
      <FooterLinks title="Compañía" links={companyLinks} />
      <FooterLinks title="Legal" links={legalLinks} />
    </div>
    <div className="border-t border-slate-200"><p className="mx-auto max-w-6xl px-4 py-5 text-center text-xs text-neutral/65 sm:px-6 sm:text-left">© 2026 SafeRent. Todos los derechos reservados.</p></div>
  </footer>
}

function FooterLinks({ title, links }: { title: string; links: string[] }) {
  return <div><h2 className="mb-4 text-sm font-semibold text-primary">{title}</h2><ul className="space-y-3">{links.map((link) => <li key={link}><button type="button" className="text-sm text-neutral/80 transition hover:text-secondary">{link}</button></li>)}</ul></div>
}
