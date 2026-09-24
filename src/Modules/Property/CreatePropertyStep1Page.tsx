import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertCircle } from 'lucide-react'
import Stepper from './Components/Stepper'
import { propertyService } from './services/propertyService'
import { ApiError } from './services/api'

const STEPS = ['Datos', 'Imágenes', 'Publicar']
const MOCK_OWNER_ID = 1

interface FormData {
  title: string
  cost: string
  address: string
  zona: string
  rooms: string
  m2: string
  description: string
}

interface FormErrors {
  title?: string
  cost?: string
  address?: string
  description?: string
}

function validate(data: FormData): FormErrors {
  const errors: FormErrors = {}
  if (!data.title.trim()) errors.title = 'El título es obligatorio'
  if (!data.cost.trim() || Number(data.cost) <= 0) errors.cost = 'Debe ser mayor a 0'
  if (!data.address.trim()) errors.address = 'La dirección es obligatoria'
  if (!data.description.trim()) errors.description = 'La descripción es obligatoria'
  return errors
}

export default function CreatePropertyStep1Page() {
  const navigate = useNavigate()
  const [form, setForm] = useState<FormData>({
    title: '', cost: '', address: '', zona: '', rooms: '', m2: '', description: '',
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [apiError, setApiError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const errorCount = Object.keys(errors).length

  function handleChange(field: keyof FormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[field as keyof FormErrors]
        return next
      })
    }
  }

  async function handleSaveDraft() {
    setSaving(true)
    setApiError(null)
    try {
      await propertyService.create({
        title: form.title || 'Sin título',
        description: form.description || '',
        cost: Number(form.cost) || 0,
        address: form.address || '',
        rooms: form.rooms ? Number(form.rooms) : undefined,
        ownerId: MOCK_OWNER_ID,
      })
      navigate('/propietario/propiedades')
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
      const property = await propertyService.create({
        title: form.title,
        description: form.description,
        cost: Number(form.cost),
        address: form.address,
        rooms: form.rooms ? Number(form.rooms) : undefined,
        ownerId: MOCK_OWNER_ID,
      })
      navigate('/propietario/propiedades/nueva/media', { state: { propertyId: property.id } })
    } catch (err) {
      setApiError(err instanceof ApiError ? err.message : 'Error al crear la propiedad')
    } finally {
      setSaving(false)
    }
  }

  const inputBase = 'w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-primary outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10'
  const inputError = 'border-red-400 focus:border-red-500 focus:ring-red-100'

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-primary">Nueva propiedad</h1>
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
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-primary">Título</label>
            <input
              type="text"
              className={`${inputBase} ${errors.title ? inputError : ''}`}
              value={form.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Nombre de la propiedad"
            />
            {errors.title && <span className="mt-1 block text-xs text-red-500">{errors.title}</span>}
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-primary">Precio / mes</label>
            <input
              type="number"
              className={`${inputBase} ${errors.cost ? inputError : ''}`}
              value={form.cost}
              onChange={(e) => handleChange('cost', e.target.value)}
              placeholder="0"
              min="0"
            />
            {errors.cost && <span className="mt-1 block text-xs text-red-500">{errors.cost}</span>}
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-primary">Dirección</label>
          <input
            type="text"
            className={`${inputBase} ${errors.address ? inputError : ''}`}
            value={form.address}
            onChange={(e) => handleChange('address', e.target.value)}
            placeholder="Dirección completa"
          />
          {errors.address && <span className="mt-1 block text-xs text-red-500">{errors.address}</span>}
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-primary">Zona</label>
            <input
              type="text"
              className={inputBase}
              value={form.zona}
              onChange={(e) => handleChange('zona', e.target.value)}
              placeholder="Ej: Centro"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-primary">Habitaciones</label>
            <input
              type="number"
              className={inputBase}
              value={form.rooms}
              onChange={(e) => handleChange('rooms', e.target.value)}
              placeholder="0"
              min="0"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-primary">M²</label>
            <input
              type="number"
              className={inputBase}
              value={form.m2}
              onChange={(e) => handleChange('m2', e.target.value)}
              placeholder="0"
              min="0"
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-primary">Descripción</label>
          <textarea
            className={`${inputBase} resize-none ${errors.description ? inputError : ''}`}
            value={form.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Describe la propiedad..."
            rows={4}
          />
          {errors.description && <span className="mt-1 block text-xs text-red-500">{errors.description}</span>}
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
