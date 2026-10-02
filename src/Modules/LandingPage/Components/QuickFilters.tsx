import { useState } from 'react'
import { useServices } from '../../Explore/hooks/useServices'
import ServiceIcon from '../../Services/components/ServiceIcon'

type QuickFiltersProps = {
  activeFilters: number[]
  onToggle: (id: number) => void
}

export default function QuickFilters({ activeFilters, onToggle }: QuickFiltersProps) {
  const [attempt, setAttempt] = useState(0)
  const { services, loading, error } = useServices(attempt)

  return (
    <section aria-label="Filtrar por servicios" className="bg-surface px-4 pb-12 sm:px-6">
      <div className="mx-auto flex max-w-4xl flex-wrap justify-center gap-2">
        {loading && <p role="status" className="text-sm text-neutral">Cargando servicios...</p>}
        {error && <div role="alert" className="text-center text-sm text-neutral">
          <p>{error}</p>
          <button type="button" onClick={() => setAttempt((value) => value + 1)} className="mt-2 font-bold text-secondary">Reintentar</button>
        </div>}
        {!loading && !error && services.length === 0 && <p className="text-sm text-neutral">No hay servicios registrados.</p>}
        {services.map((service) => {
          const isActive = activeFilters.includes(service.id)
          return (
            <button key={service.id} type="button" aria-pressed={isActive} onClick={() => onToggle(service.id)}
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-all active:scale-95 ${isActive ? 'border-primary bg-primary text-white shadow-sm shadow-primary/20' : 'border-slate-200 bg-white text-neutral hover:-translate-y-0.5 hover:border-secondary hover:text-secondary hover:shadow-sm'}`}>
              <ServiceIcon name={service.icono} size={16} className={isActive ? undefined : 'text-primary'} />
              {service.name}
            </button>
          )
        })}
      </div>
    </section>
  )
}
