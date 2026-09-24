import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { CheckCircle } from 'lucide-react'
import StatusBadge from './Components/StatusBadge'
import { propertyService } from './services/propertyService'
import type { Property } from './types/property'

export default function PropertyPublishedPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [property, setProperty] = useState<Property | null>(null)

  useEffect(() => {
    if (!id) return
    propertyService.getById(Number(id)).then(setProperty).catch(() => {})
  }, [id])

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="mb-4 text-secondary">
        <CheckCircle size={64} strokeWidth={1.5} />
      </div>
      <h1 className="text-2xl font-bold text-primary">Propiedad publicada</h1>
      <p className="mt-2 text-sm text-muted-ink">
        Ya está disponible para reservas. isActive: true.
      </p>

      {property && (
        <div className="mt-8 flex w-full max-w-sm items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="size-14 shrink-0 rounded-xl bg-slate-100" />
          <div className="flex-1 text-left">
            <div className="text-sm font-bold text-primary">{property.title}</div>
            <div className="mt-0.5 text-xs text-slate-400">
              {property.address} · ${property.cost}/{property.typeOfCoin === 'CRC' ? 'mes' : property.typeOfCoin}
            </div>
          </div>
          <StatusBadge variant="active" />
        </div>
      )}

      <div className="mt-8 flex items-center gap-3">
        <button
          type="button"
          className="rounded-xl bg-primary px-6 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-primary-dark"
          onClick={() => property && navigate(`/propietario/propiedades/${property.id}`)}
        >
          Ver como inquilino
        </button>
        <button
          type="button"
          className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-bold text-primary transition hover:bg-slate-50"
          onClick={() => navigate('/propietario/propiedades')}
        >
          Mis propiedades
        </button>
      </div>
    </div>
  )
}
