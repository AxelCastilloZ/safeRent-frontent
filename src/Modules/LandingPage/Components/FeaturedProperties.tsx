import { ArrowRight } from 'lucide-react'
import { featuredProperties } from '../data/properties'
import PropertyCard from './PropertyCard'

export default function FeaturedProperties() {
  return <section id="properties" className="scroll-mt-20 bg-surface px-4 py-16 sm:px-6"><div className="mx-auto max-w-6xl"><div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-sm font-bold uppercase tracking-wider text-primary">Elegidas para ti</p><h2 className="mt-2 text-3xl font-extrabold tracking-tight text-primary sm:text-4xl">Propiedades destacadas</h2></div><a href="/explorar" className="inline-flex items-center gap-1 self-start text-sm font-bold text-secondary transition hover:text-secondary-dark sm:self-auto">Ver todas <ArrowRight size={16} aria-hidden="true" /></a></div><div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">{featuredProperties.map((property) => <PropertyCard key={property.id} property={property} />)}</div></div></section>
}
