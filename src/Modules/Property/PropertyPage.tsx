import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus } from 'lucide-react'
import PropertyCard from './Components/PropertyCard'
import EmptyState from './Components/EmptyState'
import { propertyService } from './services/propertyService'
import { ApiError } from './services/api'
import type { Property } from './types/property'

const MOCK_OWNER_ID = 1

export default function PropertyPage() {
  const navigate = useNavigate()
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadProperties()
  }, [])

  async function loadProperties() {
    try {
      setLoading(true)
      setError(null)
      const data = await propertyService.getByOwner(MOCK_OWNER_ID)
      setProperties(data)
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) {
        setProperties([])
      } else {
        setError('No se pudieron cargar las propiedades')
      }
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center py-24 text-sm text-slate-400">Cargando propiedades...</div>
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24">
        <p className="text-sm text-red-600">{error}</p>
        <button
          type="button"
          className="rounded-xl border border-slate-200 px-5 py-2 text-sm font-bold text-primary transition hover:bg-slate-50"
          onClick={loadProperties}
        >
          Reintentar
        </button>
      </div>
    )
  }

  if (properties.length === 0) {
    return (
      <EmptyState
        title="Publica tu primera propiedad"
        description="Un buen SafeRent Score atrae mejores arrendatarios."
        actionLabel="Nueva propiedad"
        onAction={() => navigate('/propietario/propiedades/nueva')}
      />
    )
  }

  const activeCount = properties.filter((p) => p.isActive).length
  const draftCount = properties.filter((p) => !p.isActive).length

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-primary">
          Mis propiedades ({properties.length})
        </h1>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-xl bg-secondary px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-secondary-dark"
          onClick={() => navigate('/propietario/propiedades/nueva')}
        >
          <Plus size={16} />
          Nueva propiedad
        </button>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {properties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: 'Activas', value: activeCount },
          { label: 'Borradores', value: draftCount },
          { label: 'Visitas mes', value: '—' },
          { label: 'Solicitudes', value: '—' },
        ].map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-sm">
            <span className="block text-xs font-medium text-slate-400">{stat.label}</span>
            <span className="mt-1 block text-2xl font-bold text-primary">{stat.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
