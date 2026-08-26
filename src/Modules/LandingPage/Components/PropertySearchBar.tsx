import { ChevronDown, MapPin, Search } from 'lucide-react'
import { useState, type FormEvent } from 'react'

const priceRanges = ['Cualquier precio', 'Hasta $300', '$300 - $500', '$500 - $800', 'Más de $800']

export default function PropertySearchBar() {
  const [location, setLocation] = useState('')
  const [price, setPrice] = useState(priceRanges[0])
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault() }

  return <section className="-mt-1 bg-surface px-4 pb-4 sm:px-6"><form className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-2 shadow-lg shadow-slate-200/70" onSubmit={handleSubmit}>
    <div className="flex flex-col gap-2 md:flex-row">
      <label className="relative flex min-w-0 flex-1 flex-col rounded-xl px-4 py-2 transition hover:bg-slate-50 focus-within:bg-slate-50"><span className="mb-1 text-[11px] font-bold uppercase tracking-wider text-neutral">Ubicación</span><input value={location} onChange={(event) => setLocation(event.target.value)} placeholder="Ciudad o Universidad..." className="w-full bg-transparent pr-8 text-sm text-neutral outline-none placeholder:text-slate-400" /><MapPin className="absolute right-4 top-1/2 text-neutral/70" size={18} aria-hidden="true" /></label>
      <div className="hidden w-px bg-slate-200 md:block" />
      <label className="relative flex flex-1 flex-col rounded-xl px-4 py-2 transition hover:bg-slate-50 focus-within:bg-slate-50"><span className="mb-1 text-[11px] font-bold uppercase tracking-wider text-neutral">Rango de precio</span><select value={price} onChange={(event) => setPrice(event.target.value)} className="w-full appearance-none bg-transparent pr-8 text-sm text-neutral outline-none">{priceRanges.map((range) => <option key={range}>{range}</option>)}</select><ChevronDown className="pointer-events-none absolute right-4 top-1/2 text-neutral/70" size={18} aria-hidden="true" /></label>
      <button type="submit" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white transition hover:bg-primary-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"><Search size={18} aria-hidden="true" />Buscar</button>
    </div>
  </form></section>
}
