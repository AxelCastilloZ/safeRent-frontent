import { GraduationCap, ShieldCheck, Star, Wifi } from 'lucide-react'
import { useState } from 'react'

const filters = [
  { id: 'universities', label: 'Cerca de universidades', icon: GraduationCap },
  { id: 'internet', label: 'Internet de alta velocidad', icon: Wifi },
  { id: 'top-rated', label: 'Mejor valoradas', icon: Star },
  { id: 'safe', label: 'Zonas seguras', icon: ShieldCheck },
]

export default function QuickFilters() {
  const [activeFilters, setActiveFilters] = useState<string[]>([])
  const toggleFilter = (id: string) => setActiveFilters((current) => current.includes(id) ? current.filter((filter) => filter !== id) : [...current, id])
  return <section className="bg-surface px-4 pb-12 sm:px-6"><div className="mx-auto flex max-w-4xl flex-wrap justify-center gap-2">{filters.map(({ id, label, icon: Icon }) => { const isActive = activeFilters.includes(id); return <button key={id} type="button" aria-pressed={isActive} onClick={() => toggleFilter(id)} className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-all active:scale-95 ${isActive ? 'border-primary bg-primary text-white shadow-sm shadow-primary/20' : 'border-slate-200 bg-white text-neutral hover:-translate-y-0.5 hover:border-secondary hover:text-secondary hover:shadow-sm'}`}><Icon size={16} aria-hidden="true" className={isActive ? undefined : 'text-primary'} />{label}</button> })}</div></section>
}
