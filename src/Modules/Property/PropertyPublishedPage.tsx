import { useEffect, useState } from 'react'
import { useNavigate, useParams } from '@tanstack/react-router'
import { CheckCircle, Clock } from 'lucide-react'
import StatusBadge from './Components/StatusBadge'
import { propertyService } from './services/propertyService'
import { statusBadgeVariant } from './utils/propertyStatus'
import type { Property } from './types/property'

const COPY: Record<Property['status'], { icon: typeof CheckCircle; title: string; description: string }> = {
  DRAFT: { icon: Clock, title: 'Propiedad guardada', description: 'Todavía no se ha enviado a revisión.' },
  PENDING: { icon: Clock, title: 'Enviada a revisión', description: 'Un administrador va a verificar los datos antes de activarla.' },
  ACTIVE: { icon: CheckCircle, title: 'Propiedad activa', description: 'Ya está disponible para reservas.' },
  CHANGES_REQUESTED: { icon: Clock, title: 'Requiere cambios', description: 'El administrador pidió corregir algo antes de aprobarla.' },
  INACTIVE: { icon: Clock, title: 'Propiedad inactiva', description: 'No está disponible para reservas.' },
}

export default function PropertyPublishedPage() {
  const { propertyId } = useParams({ strict: false }) as { propertyId: string }
  const navigate = useNavigate()
  const [property, setProperty] = useState<Property | null>(null)

  useEffect(() => {
    if (!propertyId) return
    propertyService.getById(Number(propertyId)).then(setProperty).catch(() => {})
  }, [propertyId])

  const copy = property ? COPY[property.status] : COPY.PENDING
  const Icon = copy.icon

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="mb-4 text-secondary">
        <Icon size={64} strokeWidth={1.5} />
      </div>
      <h1 className="text-2xl font-bold text-primary">{copy.title}</h1>
      <p className="mt-2 text-sm text-muted-ink">{copy.description}</p>

      {property && (
        <div className="mt-8 flex w-full max-w-sm items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="size-14 shrink-0 rounded-xl bg-slate-100" />
          <div className="flex-1 text-left">
            <div className="text-sm font-bold text-primary">{property.title}</div>
            <div className="mt-0.5 text-xs text-slate-400">
              {property.address} · ${property.cost}/{property.typeOfCoin === 'CRC' ? 'mes' : property.typeOfCoin}
            </div>
          </div>
          <StatusBadge variant={statusBadgeVariant(property.status)} />
        </div>
      )}

      <div className="mt-8 flex items-center gap-3">
        <button
          type="button"
          className="rounded-xl bg-primary px-6 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-primary-dark"
          onClick={() => property && navigate({ to: `/properties/detail/${property.id}` })}
        >
          Ver detalle
        </button>
        <button
          type="button"
          className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-bold text-primary transition hover:bg-slate-50"
          onClick={() => navigate({ to: '/properties' })}
        >
          Mis propiedades
        </button>
      </div>
    </div>
  )
}
