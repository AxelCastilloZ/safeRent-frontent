import { ArrowRight, Search } from 'lucide-react'
import { Link } from 'react-router-dom'
import Reveal from '../../LandingPage/Components/Reveal'

export default function AboutCta() {
  return (
    <section className="relative overflow-hidden bg-primary px-4 py-16 sm:px-6">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -left-20 -top-20 size-72 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute -bottom-24 -right-10 size-72 rounded-full bg-secondary/20 blur-3xl" />
      </div>

      <Reveal className="relative mx-auto max-w-2xl text-center text-white">
        <span className="mx-auto grid size-12 place-items-center rounded-xl bg-white/15">
          <Search size={24} aria-hidden="true" />
        </span>
        <h2 className="mt-5 text-3xl font-extrabold tracking-tight sm:text-4xl">Encuentra tu próximo hogar</h2>
        <p className="mx-auto mt-4 max-w-xl leading-7 text-white/80">
          Explora propiedades verificadas, con información real de servicios y de la comunidad, antes de tomar tu decisión.
        </p>
        <Link
          to="/explorar"
          className="group mt-8 inline-flex items-center gap-2 rounded-xl bg-secondary px-6 py-3.5 text-sm font-bold text-white shadow-sm shadow-black/10 transition hover:-translate-y-0.5 hover:bg-secondary-dark hover:shadow-md"
        >
          Explorar propiedades
          <ArrowRight size={17} aria-hidden="true" className="transition-transform group-hover:translate-x-1" />
        </Link>
      </Reveal>
    </section>
  )
}
