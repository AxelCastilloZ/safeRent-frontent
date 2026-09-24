import { useNavigate } from 'react-router-dom'
import { Pencil } from 'lucide-react'
import StatusBadge from './StatusBadge'
import type { Property } from '../types/property'

type PropertyCardProps = { property: Property }

export default function PropertyCard({ property }: PropertyCardProps) {
  const navigate = useNavigate()
  const variant = property.isActive ? 'active' : 'draft'
  const thumbnail = property.files?.[0]?.path
  const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        {thumbnail ? (
          <img
            src={`${API_BASE}/${thumbnail}`}
            alt={property.title}
            className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex size-full items-center justify-center text-slate-300">
            <span className="text-4xl">🏠</span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <span className="text-base font-bold leading-snug text-primary">{property.title}</span>
          <StatusBadge variant={variant} />
        </div>

        <button
          type="button"
          className="mt-auto inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 py-2.5 text-sm font-bold text-primary transition-colors hover:border-primary hover:bg-primary/5"
          onClick={() => navigate(`/propietario/propiedades/${property.id}`)}
        >
          <Pencil size={15} />
          Editar
        </button>
      </div>
    </article>
  )
}
