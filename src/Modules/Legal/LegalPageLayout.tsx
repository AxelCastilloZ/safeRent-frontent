import { Link } from 'react-router-dom'
import Navbar from '../LandingPage/Components/Navbar'
import Footer from '../LandingPage/Components/Footer'
import Reveal from '../LandingPage/Components/Reveal'
import type { LegalSection } from './types/legal'

type LegalPageLayoutProps = {
  eyebrow: string
  title: string
  description: string
  lastUpdated: string
  sections: LegalSection[]
}

/**
 * Layout compartido por las páginas legales (privacidad y términos): misma
 * cabecera, índice de contenidos e presentación de secciones. Prioriza
 * legibilidad — ancho de lectura de ~880px, contenido separado del maquetado
 * en `data/*.ts` para que sea fácil de editar más adelante.
 */
export default function LegalPageLayout({ eyebrow, title, description, lastUpdated, sections }: LegalPageLayoutProps) {
  return (
    <div className="min-h-screen bg-white text-ink">
      <Navbar />
      <main className="bg-surface px-4 py-14 sm:px-6 sm:py-20">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-primary">{eyebrow}</p>
          <h1 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">{title}</h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-neutral/75">{description}</p>
          <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-neutral/50">Última actualización: {lastUpdated}</p>
        </Reveal>

        <div className="mx-auto mt-12 max-w-6xl lg:grid lg:grid-cols-[220px_1fr] lg:items-start lg:gap-12">
          <nav aria-label="Índice de contenidos" className="mb-10 lg:sticky lg:top-24 lg:mb-0">
            <p className="mb-3 text-xs font-bold uppercase tracking-wider text-neutral/60">Índice</p>
            <ul className="space-y-2 border-l border-slate-200 pl-4 text-sm">
              {sections.map((section) => (
                <li key={section.id}>
                  <a href={`#${section.id}`} className="text-neutral/70 transition hover:text-primary">
                    {section.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="space-y-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
            {sections.map((section) => (
              <section key={section.id} id={section.id} className="scroll-mt-20">
                <h2 className="text-lg font-bold text-primary">{section.title}</h2>
                <div className="mt-3 space-y-3">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph} className="text-sm leading-7 text-neutral/75">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </section>
            ))}
            <Link to="/" className="inline-flex items-center gap-1 text-sm font-bold text-secondary transition hover:text-secondary-dark">
              ← Volver al inicio
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
