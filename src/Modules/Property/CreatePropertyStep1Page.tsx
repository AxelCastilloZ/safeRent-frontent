import { useEffect, useState } from 'react'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { AlertCircle, Check, Minus, Plus } from 'lucide-react'
import Stepper from './Components/Stepper'
import { propertyService } from './services/propertyService'
import { ApiError } from './services/api'
import type { CreatePropertyPayload } from './types/property'
import ServiceIcon from '../Services/components/ServiceIcon'
import { useServices } from '../Services/hooks/useServices'
import { getPropertyTypes } from '../Explore/services/property.service'

import { PROPERTY_STEPS as STEPS } from './constants/propertySteps'

/** Monedas en las que se puede publicar un precio (el backend guarda `typeOfCoin`, por defecto CRC). */
const CURRENCIES = [
  { code: 'CRC', label: '₡ Colones (CRC)' },
  { code: 'USD', label: '$ Dólares (USD)' },
]

interface FormData {
  title: string
  cost: string
  typeOfCoin: string
  typeOfPropertyId: number | null
  rooms: number
  guest: number
  description: string
  serviceIds: number[]
}

interface FormErrors {
  title?: string
  cost?: string
  typeOfPropertyId?: string
  description?: string
  serviceIds?: string
}

function validate(data: FormData): FormErrors {
  const errors: FormErrors = {}
  if (!data.title.trim()) errors.title = 'El título es obligatorio'
  if (!data.cost.trim() || Number(data.cost) <= 0) errors.cost = 'Debe ser mayor a 0'
  if (!data.typeOfPropertyId) errors.typeOfPropertyId = 'Selecciona el tipo de propiedad'
  if (!data.description.trim()) errors.description = 'La descripción es obligatoria'
  if (data.serviceIds.length === 0) errors.serviceIds = 'Selecciona al menos un servicio'
  return errors
}

/** Campo numérico con botones − / + (mínimo 1, como exige el backend). */
function Counter({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
  const button = 'grid size-10 place-items-center rounded-xl border border-slate-200 text-primary transition hover:bg-slate-50 disabled:opacity-40'
  return (
    <div>
      <span className="mb-1.5 block text-sm font-medium text-primary">{label}</span>
      <div className="flex items-center gap-3">
        <button type="button" className={button} onClick={() => onChange(value - 1)} disabled={value <= 1} aria-label={`Restar ${label.toLowerCase()}`}>
          <Minus size={16} />
        </button>
        <span className="w-8 text-center text-base font-semibold text-primary" aria-live="polite">{value}</span>
        <button type="button" className={button} onClick={() => onChange(value + 1)} disabled={value >= 50} aria-label={`Sumar ${label.toLowerCase()}`}>
          <Plus size={16} />
        </button>
      </div>
    </div>
  )
}

export default function CreatePropertyStep1Page() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const search = useSearch({ strict: false })
  const editId = search.editId ?? null

  const services = useServices()
  const propertyTypes = useQuery({ queryKey: ['properties', 'types'], queryFn: ({ signal }) => getPropertyTypes(signal) })

  const [form, setForm] = useState<FormData>({
    title: '', cost: '', typeOfCoin: 'CRC', typeOfPropertyId: null, rooms: 1, guest: 1, description: '', serviceIds: [],
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [apiError, setApiError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [loadingProperty, setLoadingProperty] = useState(!!editId)

  useEffect(() => {
    if (!editId) return
    let cancelled = false
    async function load() {
      try {
        const p = await propertyService.getById(editId!)
        if (cancelled) return
        setForm({
          title: p.title ?? '',
          cost: p.cost ? String(p.cost) : '',
          typeOfCoin: p.typeOfCoin || 'CRC',
          typeOfPropertyId: p.typeOfProperty?.id ?? null,
          rooms: p.rooms || 1,
          guest: p.guest || 1,
          description: p.description ?? '',
          serviceIds: p.services?.map((s) => s.id) ?? [],
        })
      } catch (err) {
        if (!cancelled) {
          setApiError(err instanceof ApiError ? err.message : 'No se pudo cargar la propiedad')
        }
      } finally {
        if (!cancelled) setLoadingProperty(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [editId])

  const errorCount = Object.keys(errors).length

  function handleChange<K extends keyof FormData>(field: K, value: FormData[K]) {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[field as keyof FormErrors]
        return next
      })
    }
  }

  function toggleService(id: number) {
    handleChange('serviceIds', form.serviceIds.includes(id) ? form.serviceIds.filter((s) => s !== id) : [...form.serviceIds, id])
  }

  function payload(draft: boolean): CreatePropertyPayload {
    return {
      title: draft ? form.title || 'Sin título' : form.title,
      description: form.description,
      cost: Number(form.cost) || 0,
      typeOfCoin: form.typeOfCoin,
      typeOfPropertyId: form.typeOfPropertyId ?? undefined,
      rooms: form.rooms,
      guest: form.guest,
      serviceIds: form.serviceIds,
    }
  }

  /** Crea o actualiza el borrador y devuelve su id. */
  async function save(draft: boolean): Promise<number> {
    if (editId) {
      await propertyService.update(editId, payload(draft))
      return editId
    }
    const property = await propertyService.create(payload(draft))
    // Crear una propiedad otorga el rol de propietario; refrescamos la sesión para que se refleje de una vez.
    queryClient.invalidateQueries({ queryKey: ['auth', 'me'] })
    return property.id
  }

  async function handleSaveDraft() {
    setSaving(true)
    setApiError(null)
    try {
      await save(true)
      navigate({ to: '/dashboard/owner/properties' })
    } catch (err) {
      setApiError(err instanceof ApiError ? err.message : 'Error al guardar borrador')
    } finally {
      setSaving(false)
    }
  }

  async function handleNext() {
    const validationErrors = validate(form)
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length > 0) {
      setApiError('No pudimos validar la propiedad. Corrige los campos marcados y vuelve a intentar.')
      return
    }

    setApiError(null)
    setSaving(true)

    try {
      const propertyId = await save(false)
      navigate({ to: '/dashboard/owner/properties/new/location', search: { propertyId } })
    } catch (err) {
      setApiError(err instanceof ApiError ? err.message : 'Error al crear la propiedad')
    } finally {
      setSaving(false)
    }
  }

  const inputBase = 'w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-primary outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10'
  const inputError = 'border-red-400 focus:border-red-500 focus:ring-red-100'

  if (loadingProperty) {
    return <div className="flex items-center justify-center py-24 text-sm text-slate-400">Cargando propiedad...</div>
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-primary">{editId ? 'Editar propiedad' : 'Nueva propiedad'}</h1>
        <Stepper steps={STEPS} currentStep={1} />
      </div>

      {apiError && (
        <div className="mb-6 flex items-start gap-3 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          <div>
            <span>{apiError}</span>
            {errorCount > 0 && (
              <span className="ml-2 font-semibold">Revisar {errorCount} campos</span>
            )}
          </div>
        </div>
      )}

      <form className="flex flex-col gap-5" onSubmit={(e) => e.preventDefault()}>
        <div>
          <label htmlFor="property-title" className="mb-1.5 block text-sm font-medium text-primary">Título</label>
          <input
            id="property-title"
            type="text"
            maxLength={200}
            className={`${inputBase} ${errors.title ? inputError : ''}`}
            value={form.title}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="Nombre de la propiedad"
          />
          {errors.title && <span className="mt-1 block text-xs text-red-500">{errors.title}</span>}
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="property-cost" className="mb-1.5 block text-sm font-medium text-primary">Precio / mes</label>
            <div className="flex gap-2">
              <select
                aria-label="Moneda"
                className={`${inputBase} w-auto`}
                value={form.typeOfCoin}
                onChange={(e) => handleChange('typeOfCoin', e.target.value)}
              >
                {CURRENCIES.map((currency) => (
                  <option key={currency.code} value={currency.code}>{currency.label}</option>
                ))}
              </select>
              <input
                id="property-cost"
                type="number"
                className={`${inputBase} ${errors.cost ? inputError : ''}`}
                value={form.cost}
                onChange={(e) => handleChange('cost', e.target.value)}
                placeholder="0"
                min="0"
              />
            </div>
            {errors.cost && <span className="mt-1 block text-xs text-red-500">{errors.cost}</span>}
          </div>
          <div>
            <label htmlFor="property-type" className="mb-1.5 block text-sm font-medium text-primary">Tipo de propiedad</label>
            <select
              id="property-type"
              className={`${inputBase} ${errors.typeOfPropertyId ? inputError : ''}`}
              value={form.typeOfPropertyId ?? ''}
              onChange={(e) => handleChange('typeOfPropertyId', e.target.value ? Number(e.target.value) : null)}
              disabled={propertyTypes.isPending}
            >
              <option value="">{propertyTypes.isPending ? 'Cargando tipos...' : 'Selecciona un tipo'}</option>
              {propertyTypes.data?.map((type) => (
                <option key={type.id} value={type.id}>{type.name}</option>
              ))}
            </select>
            {propertyTypes.isError && <span className="mt-1 block text-xs text-red-500">No se pudieron cargar los tipos de propiedad.</span>}
            {errors.typeOfPropertyId && <span className="mt-1 block text-xs text-red-500">{errors.typeOfPropertyId}</span>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-5">
          <Counter label="Habitaciones" value={form.rooms} onChange={(value) => handleChange('rooms', value)} />
          <Counter label="Huéspedes" value={form.guest} onChange={(value) => handleChange('guest', value)} />
        </div>

        <div>
          <label htmlFor="property-description" className="mb-1.5 block text-sm font-medium text-primary">Descripción</label>
          <textarea
            id="property-description"
            className={`${inputBase} resize-none ${errors.description ? inputError : ''}`}
            value={form.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Describe la propiedad..."
            rows={4}
          />
          {errors.description && <span className="mt-1 block text-xs text-red-500">{errors.description}</span>}
        </div>

        <div>
          <p className="mb-3 text-sm font-medium text-primary">Servicios verificables</p>
          <div className="flex flex-wrap gap-2">
            {services.data?.map((service) => {
              const selected = form.serviceIds.includes(service.id)
              return (
                <button
                  key={service.id}
                  type="button"
                  className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition ${
                    selected
                      ? 'bg-secondary text-white'
                      : 'border border-slate-200 bg-white text-slate-600 hover:border-secondary hover:text-secondary'
                  }`}
                  aria-pressed={selected}
                  onClick={() => toggleService(service.id)}
                >
                  <ServiceIcon name={service.icono} size={18} />{selected && <Check size={14} />}
                  {service.name}
                </button>
              )
            })}
            {services.isPending && <span className="text-sm text-slate-400">Cargando servicios...</span>}
            {services.isError && <span className="text-sm text-red-500">No se pudieron cargar los servicios.</span>}
            {services.data?.length === 0 && <span className="text-sm text-slate-400">No hay servicios disponibles</span>}
          </div>
          {errors.serviceIds && <span className="mt-2 block text-xs text-red-500">{errors.serviceIds}</span>}
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-bold text-primary transition hover:bg-slate-50"
            onClick={handleSaveDraft}
            disabled={saving}
          >
            Guardar borrador
          </button>
          <button
            type="button"
            className="rounded-xl bg-primary px-6 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-primary-dark disabled:opacity-50"
            onClick={handleNext}
            disabled={saving}
          >
            {saving ? 'Guardando...' : 'Siguiente'}
          </button>
        </div>
      </form>
    </div>
  )
}
