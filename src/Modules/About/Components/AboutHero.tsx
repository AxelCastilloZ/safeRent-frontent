import Reveal from '../../LandingPage/Components/Reveal'

export default function AboutHero() {
  return (
    <section className="relative overflow-hidden bg-surface px-4 pb-10 pt-14 sm:px-6 sm:pb-12 sm:pt-20">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-20 left-1/2 size-80 -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-3xl text-center">
        <Reveal>
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-primary">Sobre SafeRent</p>
        </Reveal>
        <Reveal delay={80}>
          <h1 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl lg:text-5xl">Hacemos que alquilar sea más seguro</h1>
        </Reveal>
        <Reveal delay={160}>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-neutral/80 sm:text-lg">
            SafeRent busca facilitar una experiencia de alquiler más transparente, segura y confiable para arrendadores e inquilinos.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
