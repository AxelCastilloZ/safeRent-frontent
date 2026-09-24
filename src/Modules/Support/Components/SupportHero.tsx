import { Search } from 'lucide-react'
import { useState } from 'react'
import Reveal from '../../LandingPage/Components/Reveal'
import type { FaqItem } from '../types/faq'

type SupportHeroProps = {
  query: string
  onQueryChange: (value: string) => void
  suggestions: FaqItem[]
  onSelectSuggestion: (item: FaqItem) => void
}

export default function SupportHero({ query, onQueryChange, suggestions, onSelectSuggestion }: SupportHeroProps) {
  const [isFocused, setIsFocused] = useState(false)
  const showDropdown = isFocused && query.trim().length > 0

  function pickSuggestion(item: FaqItem) {
    onSelectSuggestion(item)
    setIsFocused(false)
  }

  return (
    <section className="relative bg-surface px-4 pb-10 pt-14 sm:px-6 sm:pb-12 sm:pt-20">
      {/* overflow-hidden vive en este wrapper decorativo, no en la sección:
          así el blob de fondo se sigue recortando, pero el panel de
          sugerencias (más abajo) nunca queda atrapado por un overflow del
          contenedor padre. */}
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
          {/* Sin `relative`: ya no hace falta como contexto de posicionamiento
              — el panel de sugerencias vive en el flujo normal (ver abajo),
              así la sección crece con él en vez de recortarlo. */}
          <div className="mt-8">
            <label className="relative flex items-center rounded-2xl border border-slate-200 bg-white px-4 py-3.5 shadow-lg shadow-slate-200/70 transition focus-within:bg-slate-50">
              <Search size={20} className="shrink-0 text-neutral/60" aria-hidden="true" />
              <span className="sr-only">Buscar en el centro de ayuda</span>
              <input
                value={query}
                onChange={(event) => onQueryChange(event.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                onKeyDown={(event) => {
                  if (event.key === 'Escape') setIsFocused(false)
                }}
                placeholder="Buscar en el centro de ayuda…"
                className="w-full bg-transparent px-3 text-sm text-neutral outline-none placeholder:text-slate-400"
              />
            </label>

            {showDropdown && (
              // Parte del flujo normal (no absolute): la sección crece con el
              // contenido en vez de recortarlo, sin depender de z-index ni de
              // que el padre tenga overflow visible.
              <div
                id="support-suggestions"
                role="region"
                aria-label="Sugerencias de búsqueda"
                className="mt-2 overflow-hidden rounded-2xl border border-slate-200 bg-white text-left shadow-lg shadow-slate-200/70"
              >
                {suggestions.length === 0 ? (
                  <p className="px-5 py-4 text-center text-sm text-neutral/70">No encontramos resultados para tu búsqueda.</p>
                ) : (
                  <ul>
                    {suggestions.map((item) => (
                      <li key={item.id}>
                        <button
                          type="button"
                          // Evita que el input pierda el foco (y el dropdown se
                          // cierre) antes de que el click en la sugerencia se registre.
                          onMouseDown={(event) => event.preventDefault()}
                          onClick={() => pickSuggestion(item)}
                          className="flex w-full flex-col items-start gap-0.5 border-b border-slate-100 px-5 py-3 text-left transition-colors last:border-b-0 hover:bg-slate-50"
                        >
                          <span className="text-sm font-semibold text-ink">{item.question}</span>
                          <span className="text-xs text-neutral/60">{item.category}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
