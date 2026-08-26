import { ArrowRight, Home } from 'lucide-react'

export default function OwnerCTA() {
  return <section id="owner-cta" className="scroll-mt-20 bg-primary px-4 py-16 sm:px-6"><div className="mx-auto max-w-2xl text-center text-white"><span className="mx-auto grid size-12 place-items-center rounded-xl bg-white/15"><Home size={24} aria-hidden="true" /></span><h2 className="mt-5 text-3xl font-extrabold tracking-tight sm:text-4xl">¿Tienes una propiedad para alquilar?</h2><p className="mx-auto mt-4 max-w-xl leading-7 text-white/80">Destaca tu inmueble ante inquilinos que buscan transparencia y calidad. Un buen SafeRent Score atrae mejores arrendatarios.</p><button type="button" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-secondary px-6 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-secondary-dark">Publica tu propiedad en SafeRent <ArrowRight size={17} aria-hidden="true" /></button></div></section>
}
