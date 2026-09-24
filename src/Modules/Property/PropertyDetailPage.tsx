import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { CheckCircle2, Circle } from 'lucide-react'
import StatusBadge from './Components/StatusBadge'
import { propertyService } from './services/propertyService'
import { ApiError } from './services/api'
import type { Property } from './types/property'

export default function PropertyDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [publishing, setPublishing] = useState(false)

  useEffect(() => {
    if (!id) return
    loadProperty(Number(id))
  }, [id])

  async function loadProperty(propertyId: number) {
    try {
      setLoading(true)
      const data = await propertyService.getById(propertyId)
      setProperty(data)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'No se pudo cargar la propiedad')
    } finally {
      setLoading(false)
    }
  }

  async function handlePublish() {
    if (!property) return
    setPublishing(true)
    try {
      await propertyService.publish(property.id)
      navigate(`/propietario/propiedades/${property.id}/publicada`)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Error al publicar')
    } finally {
      setPublishing(false)
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center py-24 text-sm text-slate-400">Cargando propiedad...</div>
  }

  if (error || !property) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24">
        <p className="text-sm text-red-600">{error ?? 'Propiedad no encontrada'}</p>
        <button
          type="button"
          className="rounded-xl border border-slate-200 px-5 py-2 text-sm font-bold text-primary transition hover:bg-slate-50"
          onClick={() => navigate('/propietario/propiedades')}
        >
          Volver a mis propiedades
        </button>
      </div>
    )
  }

  const hasData = !!(property.title && property.description && property.address)
  const hasImages = (property.files?.length ?? 0) >= 3
  const hasServices = (property.services?.length ?? 0) > 0
  const canPublish = hasData && hasImages && hasServices

  const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex items-start justify-between">
        <h1 className="text-2xl font-bold text-primary">{property.title}</h1>
        <StatusBadge variant={property.isActive ? 'active' : 'draft'} />
      </div>

      {!property.isActive && (
        <div className="mb-6 rounded-xl bg-blue-50 px-4 py-3 text-sm text-blue-700">
          Propiedad creada y vinculada a tu cuenta. Aún no es visible para inquilinos.
        </div>
      )}

      {/* Image gallery */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {property.files?.length > 0 ? (
          property.files.map((file) => (
            <div key={file.id} className="aspect-[4/3] overflow-hidden rounded-xl bg-slate-100">
              <img
                src={`${API_BASE}/${file.path}`}
                alt={file.fileName}
                className="size-full object-cover"
                loading="lazy"
              />
            </div>
          ))
        ) : (
          <>
            <div className="aspect-[4/3] rounded-xl bg-slate-100" />
            <div className="aspect-[4/3] rounded-xl bg-slate-100" />
          </>
        )}
      </div>

      {/* Service tags */}
      {property.services?.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2">
          {property.services.map((s) => (
            <span key={s.id} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
              {s.name}
            </span>
          ))}
        </div>
      )}

      {/* Pre-publish checklist */}
      {!property.isActive && (
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="mb-3 text-sm font-bold text-primary">Antes de publicar</h3>
          <ul className="flex flex-col gap-2">
            {[
              { ok: hasData, label: 'Datos completos' },
              { ok: hasImages, label: '3 imágenes' },
              { ok: hasServices, label: 'Servicios' },
            ].map((item) => (
              <li key={item.label} className="flex items-center gap-2 text-sm">
                {item.ok ? (
                  <CheckCircle2 size={18} className="text-secondary" />
                ) : (
                  <Circle size={18} className="text-slate-300" />
                )}
                <span className={item.ok ? 'text-primary' : 'text-slate-400'}>{item.label}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-3">
        {!property.isActive && (
          <>
            <button
              type="button"
              className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-bold text-primary transition hover:bg-slate-50"
              onClick={() => navigate('/propietario/propiedades/nueva', { state: { editId: property.id } })}
            >
              Seguir editando
            </button>
            <button
              type="button"
              className="rounded-xl bg-secondary px-6 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-secondary-dark disabled:opacity-50"
              onClick={handlePublish}
              disabled={publishing || !canPublish}
              title={canPublish ? '' : 'Completa todos los requisitos antes de publicar'}
            >
              {publishing ? 'Publicando...' : 'Publicar propiedad'}
            </button>
          </>
        )}
        {property.isActive && (
          <button
            type="button"
            className="rounded-xl bg-primary px-6 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-primary-dark"
            onClick={() => navigate('/propietario/propiedades')}
          >
            Mis propiedades
          </button>
        )}
      </div>
    </div>
  )
}
