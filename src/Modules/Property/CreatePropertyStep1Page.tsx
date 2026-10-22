import { useEffect, useState } from 'react'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { AlertCircle, Check, FileText, Minus, Plus, Sparkles, Users } from 'lucide-react'
import { FormSection, PropertyActions, PropertyFormLayout } from './Components/PropertyFormLayout'
import type { CreatePropertyPayload, Property, PropertyFile } from './types/property'
import { propertyService } from './services/propertyService'
import { ApiError } from './services/api'
import ServiceIcon from '../Services/components/ServiceIcon'
import { useServices } from '../Services/hooks/useServices'
import { getPropertyTypes } from '../Explore/services/property.service'
import { useDisplayCurrency } from '../Auth/hooks/useDisplayCurrency'
import CurrencySelect from './Components/CurrencySelect'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './Components/Select'
import UnsavedChangesDialog from './Components/UnsavedChangesDialog'
import { propertyTypeIcon } from './constants/propertyTypeIcons'
import { useUnsavedChangesWarning } from './hooks/useUnsavedChangesWarning'

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

/** `typeOfCoin` vacío = todavía sin elegir: se usa la moneda del perfil del usuario. */
const EMPTY_FORM: FormData = {
  title: '', cost: '', typeOfCoin: '', typeOfPropertyId: null, rooms: 1, guest: 1, description: '', serviceIds: [],
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
  if (!data.cost.trim() || !Number.isFinite(Number(data.cost)) || Number(data.cost) <= 0) errors.cost = 'Debe ser mayor a 0'
  if (!data.typeOfPropertyId) errors.typeOfPropertyId = 'Selecciona el tipo de propiedad'
  if (!data.description.trim()) errors.description = 'La descripción es obligatoria'
  if (data.serviceIds.length === 0) errors.serviceIds = 'Selecciona al menos un servicio'
  return errors
}

/** Campo numérico con botones − / + (mínimo 1, como exige el backend). */
function Counter({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
  const button = 'grid size-11 place-items-center rounded-xl border border-slate-200 text-primary transition hover:bg-slate-50 disabled:opacity-40'
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 p-4">
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

  const { currency: profileCurrency, ready: currencyReady } = useDisplayCurrency()
  const [form, setForm] = useState<FormData>(EMPTY_FORM)
  // Lo último guardado (o el formulario vacío): sirve para saber si hay cambios sin guardar.
  const [baseline, setBaseline] = useState<FormData>(EMPTY_FORM)
  const currency = form.typeOfCoin || profileCurrency
  const [errors, setErrors] = useState<FormErrors>({})
  const [apiError, setApiError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [loadedProperty, setLoadedProperty] = useState<Property | null>(null)
  const [loadedFiles, setLoadedFiles] = useState<PropertyFile[]>([])
  const [loadFailed, setLoadFailed] = useState(false)
  const [loadingProperty, setLoadingProperty] = useState(!!editId)

  useEffect(() => {
    if (!editId) return
    let cancelled = false
    async function load() {
      try {
        const [p, files] = await Promise.all([propertyService.getById(editId!), propertyService.getFiles(editId!)])
        if (cancelled) return
        setLoadedProperty(p)
        setLoadedFiles(files)
        const loaded: FormData = {
          title: p.title ?? '',
          cost: p.cost ? String(p.cost) : '',
          typeOfCoin: p.typeOfCoin || 'CRC',
          typeOfPropertyId: p.typeOfProperty?.id ?? null,
          rooms: p.rooms || 1,
          guest: p.guest || 1,
          description: p.description ?? '',
          serviceIds: p.services?.map((s) => s.id) ?? [],
        }
        setForm(loaded)
        setBaseline(loaded)
      } catch (err) {
        if (!cancelled) {
          setLoadFailed(true)
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
  const dirty = JSON.stringify(form) !== JSON.stringify(baseline)
  const { blocker, allowLeaving } = useUnsavedChangesWarning(dirty)

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

  function payload(): CreatePropertyPayload {
    return {
      title: form.title,
      description: form.description,
      cost: Number(form.cost) || 0,
      typeOfCoin: currency,
      typeOfPropertyId: form.typeOfPropertyId ?? undefined,
      rooms: form.rooms,
      guest: form.guest,
      serviceIds: form.serviceIds,
    }
  }

  /** Crea o actualiza la propiedad (queda como borrador hasta enviarla a revisión) y devuelve su id. */
  async function save(): Promise<number> {
    if (editId) {
      await propertyService.update(editId, payload())
      return editId
    }
    const property = await propertyService.create(payload())
    // Crear una propiedad otorga el rol de propietario; refrescamos la sesión para que se refleje de una vez.
    queryClient.invalidateQueries({ queryKey: ['auth', 'me'] })
    return property.id
  }

  async function handleNext() {
    if (saving || loadFailed) return
    const validationErrors = validate(form)
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length > 0) {
      setApiError('No pudimos validar la propiedad. Corrige los campos marcados y vuelve a intentar.')
      return
    }

    setApiError(null)
    setSaving(true)

    try {
      const propertyId = await save()
      allowLeaving()
      navigate({ to: '/dashboard/owner/properties/new/location', search: { propertyId } })
    } catch (err) {
      setApiError(err instanceof ApiError ? err.message : 'Error al crear la propiedad')
    } finally {
      setSaving(false)
    }
  }

  const inputBase = 'property-input'
  const inputError = 'border-red-400 focus:border-red-500 focus:ring-red-100'

  if (loadingProperty) {
    return <div className="flex items-center justify-center py-24 text-sm text-slate-400">Cargando propiedad...</div>
  }

  return (
<PropertyFormLayout step={1} editing={!!editId} preview={{
      title: form.title, cost: Number(form.cost), currency,
      type: propertyTypes.data?.find(type => type.id === form.typeOfPropertyId)?.name,
      rooms: form.rooms, guests: form.guest, description: form.description,
      services: services.data?.filter(service => form.serviceIds.includes(service.id)) ?? [],
      address: loadedProperty?.address,
      located: loadedProperty?.latitude != null && loadedProperty?.longitude != null,
      photos: loadedFiles.map(file => (import.meta.env.VITE_API_URL ?? 'http://localhost:3000') + '/' + file.path),
    }} actions={<PropertyActions step={1} busy={saving} disabled={loadFailed || (!editId && !currencyReady)} onPrimary={handleNext} />}>
      <UnsavedChangesDialog blocked={blocker.status === 'blocked'} onLeave={() => blocker.proceed?.()} onStay={() => blocker.reset?.()} />
      {apiError && (
        <div role="alert" className="mb-6 flex items-start gap-3 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          <div>
            <span>{apiError}</span>
            {errorCount > 0 && (
              <span className="ml-2 font-semibold">Revisar {errorCount} campos</span>
            )}
          </div>
        </div>
      )}

      <form onSubmit={(e) => { e.preventDefault(); void handleNext() }}>
        <fieldset disabled={saving || loadFailed} className="min-w-0 space-y-6">
        <FormSection icon={FileText} title="Información general" description="Lo primero que verán los inquilinos.">
        <div>
          <label htmlFor="property-title" className="mb-1.5 block text-sm font-medium text-primary">Título</label>
          <input
            id="property-title"
            aria-invalid={!!errors.title}
            aria-describedby={errors.title ? 'property-title-error' : undefined}
            type="text"
            maxLength={200}
            className={`${inputBase} ${errors.title ? inputError : ''}`}
            value={form.title}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="Ej. Apartamento amueblado en Barrio Escalante"
          />
          {errors.title && <span id="property-title-error" className="mt-1 block text-xs text-red-500">{errors.title}</span>}
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="property-cost" className="mb-1.5 block text-sm font-medium text-primary">Precio / mes</label>
            <div className="flex rounded-xl border border-slate-300 bg-white focus-within:ring-2 focus-within:ring-teal-700">
              <CurrencySelect
                value={currency}
                profileCurrency={profileCurrency}
                onChange={(code) => handleChange('typeOfCoin', code)}
              />
              <input
                id="property-cost"
                type="number"
                step="0.01"
                aria-invalid={!!errors.cost}
                aria-describedby="property-cost-error"
                className="min-h-12 min-w-0 flex-1 rounded-r-xl px-3 text-sm"
                value={form.cost}
                onChange={(e) => handleChange('cost', e.target.value)}
                placeholder="0"
                min="0"
              />
            </div>
            {errors.cost
              ? <span id="property-cost-error" className="mt-1 block text-xs text-red-500">{errors.cost}</span>
              : <span className="mt-1 block text-xs text-slate-500">{currency === profileCurrency ? 'Moneda de tu perfil. Pulsa la moneda para cambiarla.' : `Distinta a la moneda de tu perfil (${profileCurrency}).`}</span>}
          </div>
          <div>
            <label htmlFor="property-type" className="mb-1.5 block text-sm font-medium text-primary">Tipo de propiedad</label>
            <Select
              value={form.typeOfPropertyId ? String(form.typeOfPropertyId) : ''}
              onValueChange={(value) => handleChange('typeOfPropertyId', Number(value))}
              disabled={propertyTypes.isPending}
            >
              <SelectTrigger
                id="property-type"
                aria-invalid={!!errors.typeOfPropertyId}
                aria-describedby={errors.typeOfPropertyId ? 'property-type-error' : undefined}
              >
                <SelectValue placeholder={propertyTypes.isPending ? 'Cargando tipos...' : 'Selecciona un tipo'} />
              </SelectTrigger>
              <SelectContent>
                {propertyTypes.data?.map((type) => {
                  const Icon = propertyTypeIcon(type.name)
                  return (
                    <SelectItem key={type.id} value={String(type.id)} description={type.description ?? undefined}>
                      <span className="flex items-center gap-2"><Icon size={16} className="text-slate-500" aria-hidden="true" />{type.name}</span>
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
            {propertyTypes.isError && <span className="mt-1 block text-xs text-red-500">No se pudieron cargar los tipos de propiedad.</span>}
            {errors.typeOfPropertyId && <span id="property-type-error" className="mt-1 block text-xs text-red-500">{errors.typeOfPropertyId}</span>}
          </div>
        </div>

        <div>
          <label htmlFor="property-description" className="mb-1.5 block text-sm font-medium text-primary">Descripción</label>
          <textarea
            id="property-description"
            aria-invalid={!!errors.description}
            aria-describedby={errors.description ? 'property-description-error' : undefined}
            className={`${inputBase} resize-y ${errors.description ? inputError : ''}`}
            value={form.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Describe la propiedad..."
            rows={4}
          />
          {errors.description && <span id="property-description-error" className="mt-1 block text-xs text-red-500">{errors.description}</span>}
        </div>

        </FormSection>
        <FormSection icon={Users} title="Capacidad" description="Cuántas personas pueden vivir cómodamente.">
        <div className="grid gap-4 sm:grid-cols-2">
          <Counter label="Habitaciones" value={form.rooms} onChange={(value) => handleChange('rooms', value)} />
          <Counter label="Huéspedes" value={form.guest} onChange={(value) => handleChange('guest', value)} />
        </div>

        </FormSection>
        <FormSection icon={Sparkles} title="Servicios" description="Selecciona todo lo que incluye el alquiler." aside={<span className="text-xs text-slate-500" aria-live="polite">{form.serviceIds.length} seleccionados</span>}>
        <div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {services.data?.map((service) => {
              const selected = form.serviceIds.includes(service.id)
              return (
                <button
                  key={service.id}
                  type="button"
                  className={`relative flex min-h-24 flex-col items-start justify-center gap-3 rounded-xl border px-4 py-3 text-left text-sm font-medium transition ${
                    selected
                      ? 'border-teal-700 bg-teal-50 text-teal-800'
                      : 'border border-slate-200 bg-white text-slate-600 hover:border-teal-700 hover:text-teal-800'
                  }`}
                  aria-pressed={selected}
                  onClick={() => toggleService(service.id)}
                >
                  <ServiceIcon name={service.icono} size={18} />{selected && <Check size={16} className="absolute right-2 top-2" />}
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

        </FormSection>
        </fieldset>
      </form>
    </PropertyFormLayout>
  )
}
