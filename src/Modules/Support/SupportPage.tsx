import { useEffect, useMemo, useRef, useState } from 'react'
import Navbar from '../LandingPage/Components/Navbar'
import Footer from '../LandingPage/Components/Footer'
import { faqItems, searchFaq } from './data/faq'
import type { FaqItem, SupportCategory } from './types/faq'
import SupportHero from './Components/SupportHero'
import SupportCategories from './Components/SupportCategories'
import FaqSection from './Components/FaqSection'
import SupportCta from './Components/SupportCta'

export default function SupportPage() {
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<SupportCategory | null>(null)
  const [openIds, setOpenIds] = useState<Set<string>>(() => new Set(faqItems[0] ? [faqItems[0].id] : []))
  // Elemento a enfocar con scroll suave después del próximo render, disparado
  // desde una sugerencia o una categoría. Un ref (no state) para el id porque
  // el efecto solo debe leerlo, nunca "resetearlo" con setState; el contador
  // es lo único que necesita disparar el efecto, incluso si se pide el mismo
  // destino dos veces seguidas.
  const scrollTargetRef = useRef<string | null>(null)
  const [scrollRequestId, setScrollRequestId] = useState(0)

  // Filtrado 100% en el frontend: sin backend ni servicios HTTP, todo corre
  // sobre el array local `faqItems` (ver data/faq.ts).
  const filteredFaq = useMemo(() => {
    const byCategory = activeCategory ? faqItems.filter((item) => item.category === activeCategory) : faqItems
    return searchFaq(query, byCategory)
  }, [query, activeCategory])

  // Hasta 5 sugerencias en vivo mientras el usuario escribe.
  const suggestions = useMemo(() => (query.trim() ? searchFaq(query).slice(0, 5) : []), [query])

  useEffect(() => {
    if (scrollRequestId === 0 || !scrollTargetRef.current) return
    document.getElementById(scrollTargetRef.current)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [scrollRequestId])

  function requestScroll(elementId: string) {
    scrollTargetRef.current = elementId
    setScrollRequestId((current) => current + 1)
  }

  function toggleFaq(id: string) {
    setOpenIds((current) => {
      const next = new Set(current)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function handleSelectSuggestion(item: FaqItem) {
    setActiveCategory(null)
    setQuery(item.question)
    setOpenIds((current) => new Set(current).add(item.id))
    requestScroll(`faq-item-${item.id}`)
  }

  function handleSelectCategory(category: SupportCategory) {
    setQuery('')
    setActiveCategory((current) => (current === category ? null : category))
    requestScroll('faq')
  }

  return (
    <div className="min-h-screen bg-white text-ink">
      <Navbar />
      <main>
        <SupportHero query={query} onQueryChange={setQuery} suggestions={suggestions} onSelectSuggestion={handleSelectSuggestion} />
        <SupportCategories activeCategory={activeCategory} onSelectCategory={handleSelectCategory} />
        <FaqSection
          items={filteredFaq}
          openIds={openIds}
          onToggle={toggleFaq}
          hasActiveFilter={query.trim().length > 0 || activeCategory !== null}
        />
        <SupportCta />
      </main>
      <Footer />
    </div>
  )
}
