import { ChevronDown } from 'lucide-react'
import { useId, useState } from 'react'
import Reveal from '../../LandingPage/Components/Reveal'
import { SectionTitle } from '../../LandingPage/Components/BenefitsSection'
import type { FaqItem } from '../types/faq'

type FaqSectionProps = {
  items: FaqItem[]
  hasQuery: boolean
}

export default function FaqSection({ items, hasQuery }: FaqSectionProps) {
  return (
    <section id="faq" className="scroll-mt-20 bg-blue-50 px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <SectionTitle title="Preguntas frecuentes" description="Las dudas más comunes sobre cómo usar SafeRent." />
        <div className="mt-10 space-y-3" role="list">
          {items.length === 0 ? (
            <p className="text-center text-sm text-neutral/70">
              {hasQuery ? 'No encontramos preguntas para tu búsqueda.' : 'Todavía no hay preguntas frecuentes disponibles.'}
            </p>
          ) : (
            items.map((item, index) => <FaqAccordionItem key={item.question} item={item} defaultOpen={index === 0 && !hasQuery} />)
          )}
        </div>
      </div>
    </section>
  )
}

function FaqAccordionItem({ item, defaultOpen = false }: { item: FaqItem; defaultOpen?: boolean }) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const id = useId()
  const panelId = `faq-panel-${id}`
  const buttonId = `faq-button-${id}`

  return (
    <Reveal>
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm" role="listitem">
        <h3>
          <button
            type="button"
            id={buttonId}
            aria-expanded={isOpen}
            aria-controls={panelId}
            onClick={() => setIsOpen((open) => !open)}
            className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-bold text-primary transition-colors hover:bg-slate-50"
          >
            {item.question}
            <ChevronDown
              size={18}
              className={`shrink-0 text-neutral/60 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
              aria-hidden="true"
            />
          </button>
        </h3>
        <div
          id={panelId}
          role="region"
          aria-labelledby={buttonId}
          className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
        >
          <div className="overflow-hidden">
            <p className="px-5 pb-4 text-sm leading-6 text-neutral/75">{item.answer}</p>
          </div>
        </div>
      </div>
    </Reveal>
  )
}
