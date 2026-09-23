import { Search } from 'lucide-react'
import Reveal from '../../LandingPage/Components/Reveal'

type SupportHeroProps = {
  query: string
  onQueryChange: (value: string) => void
}

export default function SupportHero({ query, onQueryChange }: SupportHeroProps) {
  return (
    <section className="relative overflow-hidden bg-surface px-4 pb-10 pt-14 sm:px-6 sm:pb-12 sm:pt-20">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-20 left-1/2 size-80 -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-2xl text-center">
        <Reveal>
          <h1 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl lg:text-5xl">¿Cómo podemos ayudarte?</h1>
        </Reveal>
        <Reveal delay={80}>
          <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-neutral/80 sm:text-lg">Encuentra respuestas rápidas sobre SafeRent.</p>
        </Reveal>
        <Reveal delay={160}>
          <label className="relative mt-8 flex items-center rounded-2xl border border-slate-200 bg-white px-4 py-3.5 shadow-lg shadow-slate-200/70 transition focus-within:bg-slate-50">
            <Search size={20} className="shrink-0 text-neutral/60" aria-hidden="true" />
            <span className="sr-only">Buscar en el centro de ayuda</span>
            <input
              value={query}
              onChange={(event) => onQueryChange(event.target.value)}
              placeholder="Buscar en el centro de ayuda…"
              className="w-full bg-transparent px-3 text-sm text-neutral outline-none placeholder:text-slate-400"
            />
          </label>
        </Reveal>
      </div>
    </section>
  )
}
