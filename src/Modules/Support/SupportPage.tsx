import { useMemo, useState } from 'react'
import Navbar from '../LandingPage/Components/Navbar'
import Footer from '../LandingPage/Components/Footer'
import { normalize } from '../Explore/properties'
import { faqItems } from './data/faq'
import SupportHero from './Components/SupportHero'
import SupportCategories from './Components/SupportCategories'
import FaqSection from './Components/FaqSection'
import SupportCta from './Components/SupportCta'

export default function SupportPage() {
  const [query, setQuery] = useState('')

  // Filtrado 100% en el frontend: todavía no existe un backend de soporte/búsqueda,
  // así que esto solo acota la lista de preguntas frecuentes ya cargadas.
  const filteredFaq = useMemo(() => {
    const normalizedQuery = normalize(query.trim())
    if (!normalizedQuery) return faqItems
    return faqItems.filter((item) => normalize(`${item.question} ${item.answer}`).includes(normalizedQuery))
  }, [query])

  return (
    <div className="min-h-screen bg-white text-ink">
      <Navbar />
      <main>
        <SupportHero query={query} onQueryChange={setQuery} />
        <SupportCategories />
        <FaqSection items={filteredFaq} hasQuery={query.trim().length > 0} />
        <SupportCta />
      </main>
      <Footer />
    </div>
  )
}
