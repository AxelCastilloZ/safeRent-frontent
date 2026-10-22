import { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { AlertCircle, ImagePlus, LocateFixed, MapPin, X } from 'lucide-react'
import Stepper from './Components/Stepper'
import LocationMap, { type LocationPoint } from './Components/LocationMap'
import { PROPERTY_STEPS } from './constants/propertySteps'
import { useLocationSearch } from './hooks/useLocationSearch'
import { propertyService } from './services/propertyService'
import { ApiError } from './services/api'
import type { LocationSuggestion } from './services/locationService'
import type { PropertyFile, PropertyStatus } from './types/property'

const MIN_IMAGES = 3
/** En estos estados la propiedad ya se envió: el paso solo guarda cambios, no la vuelve a enviar a revisión. */
const ALREADY_SUBMITTED: PropertyStatus[] = ['PENDING', 'ACTIVE']

interface NewFile {
  file: File
  url: string
}

/** Paso 2 del asistente: ubicación en el mapa e imágenes; al terminar envía la propiedad a revisión. */
export default function CreatePropertyLocationPage() {
  const navigate = useNavigate()
  const { propertyId } = useSearch({ strict: false })
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [address, setAddress] = useState('')
  const [point, setPoint] = useState<LocationPoint | null>(null)
  const [status, setStatus] = useState<PropertyStatus | null>(null)
  const [existingFiles, setExistingFiles] = useState<PropertyFile[]>([])
  const [newImages, setNewImages] = useState<NewFile[]>([])
  const [searching, setSearching] = useState(false)
  const [loading, setLoading] = useState(true)
  const [loadFailed, setLoadFailed] = useState(false)
  const [saving, setSaving] = useState(false)
  const [locating, setLocating] = useState(false)
  const [error, setError] = useState('')
  const search = useLocationSearch(address, searching)

  useEffect(() => {
    let cancelled = false
    if (!propertyId) { navigate({ to: '/dashboard/owner/properties/new' }); return }
    Promise.all([propertyService.getById(propertyId), propertyService.getFiles(propertyId)]).then(([property, files]) => {
      if (cancelled) return
      setAddress(property.address ?? '')
      setStatus(property.status)
      setExistingFiles(files)
      if (typeof property.latitude === 'number' && typeof property.longitude === 'number') {
        setPoint({ latitude: property.latitude, longitude: property.longitude })
      }
    }).catch(() => {
      if (!cancelled) { setLoadFailed(true); setError('No se pudo cargar la propiedad. Vuelve a intentarlo.') }
    }).finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [propertyId, navigate])

  function select(suggestion: LocationSuggestion) {
    setAddress(suggestion.address)
    setPoint({ latitude: suggestion.latitude, longitude: suggestion.longitude })
    setSearching(false)
    setError('')
  }

  function locate() {
    if (!navigator.geolocation) { setError('Tu navegador no admite geolocalización.'); return }
    setLocating(true)
    navigator.geolocation.getCurrentPosition((position) => {
      setPoint({ latitude: position.coords.latitude, longitude: position.coords.longitude })
      setSearching(false)
      setLocating(false)
      setError('')
    }, () => {
      setLocating(false)
      setError('No pudimos obtener tu ubicación. Revisa los permisos del navegador.')
    }, { timeout: 10000, enableHighAccuracy: true })
  }

  function handleFilesSelected(fileList: FileList | null) {
    if (!fileList) return
    const files: NewFile[] = Array.from(fileList).map((file) => ({ file, url: URL.createObjectURL(file) }))
    setNewImages((prev) => [...prev, ...files])
    setError('')
  }

  function removeNewImage(index: number) {
    setNewImages((prev) => {
      URL.revokeObjectURL(prev[index].url)
      return prev.filter((_, i) => i !== index)
    })
  }

  async function removeExistingFile(fileId: number) {
    if (!propertyId) return
    try {
      await propertyService.removeFile(propertyId, fileId)
      setExistingFiles((prev) => prev.filter((f) => f.id !== fileId))
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Error al eliminar imagen')
    }
  }

  const totalImages = existingFiles.length + newImages.length
  const alreadySubmitted = status !== null && ALREADY_SUBMITTED.includes(status)

  /** Guarda la ubicación y sube las imágenes nuevas (una vez subidas pasan a ser imágenes existentes). */
  async function saveData() {
    if (!propertyId) return
    await propertyService.update(propertyId, {
      address: address.trim(), latitude: point?.latitude ?? null, longitude: point?.longitude ?? null,
    })
    if (newImages.length > 0) {
      await propertyService.uploadFiles(propertyId, newImages.map((image) => image.file))
      newImages.forEach((image) => URL.revokeObjectURL(image.url))
      setNewImages([])
      setExistingFiles(await propertyService.getFiles(propertyId))
    }
  }

  async function save(draft: boolean) {
    if (!propertyId || loadFailed) return
    if (!draft) {
      if (!address.trim() || !point) { setError('Escribe la dirección y selecciona la ubicación en el mapa.'); return }
      if (totalImages < MIN_IMAGES) { setError(`Se requieren al menos ${MIN_IMAGES} imágenes. Faltan ${MIN_IMAGES - totalImages}.`); return }
    }
    setSaving(true)
    setError('')
    try {
      await saveData()
      if (draft) { navigate({ to: '/dashboard/owner/properties' }); return }
      if (!alreadySubmitted) await propertyService.publish(propertyId)
      navigate({ to: '/dashboard/owner/properties/detail/$propertyId', params: { propertyId: String(propertyId) } })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo guardar la propiedad.')
    } finally { setSaving(false) }
  }

  if (loading) return <div className="py-24 text-center text-sm text-slate-400">Cargando propiedad...</div>
  const disabled = saving || loadFailed
  const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'
  return <div className="mx-auto max-w-2xl">
    <div className="mb-6 flex flex-col gap-4">
      <h1 className="text-2xl font-bold text-primary">Ubicación e imágenes</h1>
      <Stepper steps={PROPERTY_STEPS} currentStep={2} />
    </div>
    {error && <div role="alert" className="mb-5 flex gap-3 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700"><AlertCircle size={18} className="shrink-0" />{error}</div>}
    <div className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div>
        <label htmlFor="property-address" className="mb-1.5 block text-sm font-medium text-primary">Dirección</label>
        <input id="property-address" value={address} maxLength={300} disabled={disabled} autoComplete="off"
          placeholder="Busca una dirección, ciudad o país"
          className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-primary outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
          onChange={(event) => { setAddress(event.target.value); setPoint(null); setSearching(true); setError('') }} />
        <div aria-live="polite">
          {search.loading && <p className="mt-2 text-xs text-slate-400">Buscando direcciones...</p>}
          {search.error && <p className="mt-2 text-sm text-red-600">{search.error}</p>}
          {search.searched && !search.error && search.suggestions.length === 0 && <p className="mt-2 text-sm text-slate-500">Sin resultados. Puedes seleccionar el punto directamente en el mapa.</p>}
        </div>
        {search.suggestions.length > 0 && <ul aria-label="Direcciones sugeridas" className="mt-2 overflow-hidden rounded-xl border border-slate-200">
          {search.suggestions.map((suggestion, index) => <li key={index}><button type="button" disabled={disabled}
            onClick={() => select(suggestion)} className="flex w-full items-start gap-2 px-4 py-3 text-left text-sm text-primary hover:bg-slate-50 focus:bg-slate-50">
            <MapPin size={16} className="mt-0.5 shrink-0" />{suggestion.address}
          </button></li>)}
        </ul>}
        {search.searched && !search.error && <a href="https://www.geoapify.com/" target="_blank" rel="noreferrer" className="mt-2 block text-xs text-slate-400">Búsqueda de direcciones por Geoapify</a>}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-500">Haz clic en el mapa o arrastra el pin hasta la propiedad.</p>
        <button type="button" disabled={disabled || locating} onClick={locate} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-primary disabled:opacity-50">
          <LocateFixed size={16} />{locating ? 'Buscando ubicación...' : 'Usar mi ubicación'}
        </button>
      </div>
      <LocationMap point={point} disabled={disabled} onChange={(value) => { setPoint(value); setSearching(false); setError('') }} />
      <p role="status" className="text-sm text-slate-500">{point ? 'Ubicación seleccionada. Revisa que el pin esté sobre la propiedad antes de continuar.' : 'Selecciona una dirección sugerida o un punto en el mapa.'}</p>
    </div>

    <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="mb-3 text-sm font-medium text-primary">Imágenes ({totalImages} / mín. {MIN_IMAGES})</p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {existingFiles.map((file) => (
          <div key={`existing-${file.id}`} className="group relative aspect-square overflow-hidden rounded-xl bg-slate-100">
            <img src={`${API_BASE}/${file.path}`} alt={file.fileName} className="size-full object-cover" loading="lazy" />
            <button type="button" disabled={disabled} onClick={() => removeExistingFile(file.id)} aria-label="Eliminar imagen"
              className="absolute right-1.5 top-1.5 grid size-6 place-items-center rounded-full bg-black/50 text-white opacity-0 transition group-hover:opacity-100 focus:opacity-100">
              <X size={14} />
            </button>
          </div>
        ))}
        {newImages.map((image, i) => (
          <div key={image.url} className="group relative aspect-square overflow-hidden rounded-xl bg-slate-100">
            <img src={image.url} alt={`Nueva ${i + 1}`} className="size-full object-cover" />
            <button type="button" disabled={disabled} onClick={() => removeNewImage(i)} aria-label="Quitar imagen"
              className="absolute right-1.5 top-1.5 grid size-6 place-items-center rounded-full bg-black/50 text-white opacity-0 transition group-hover:opacity-100 focus:opacity-100">
              <X size={14} />
            </button>
          </div>
        ))}
        <button type="button" disabled={disabled} onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => { e.preventDefault(); handleFilesSelected(e.dataTransfer.files) }}
          className="flex aspect-square flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 text-slate-400 transition hover:border-primary hover:text-primary disabled:opacity-50">
          <ImagePlus size={24} />
          <span className="text-xs font-medium">Agregar o arrastrar</span>
        </button>
      </div>
      <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" multiple hidden
        onChange={(e) => { handleFilesSelected(e.target.files); e.target.value = '' }} />
    </div>

    <div className="mt-6 flex flex-wrap justify-end gap-3">
      <button type="button" disabled={saving} onClick={() => navigate({ to: '/dashboard/owner/properties/new', search: { editId: propertyId } })} className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-bold text-primary hover:bg-slate-50">Atrás</button>
      <button type="button" disabled={disabled || locating} onClick={() => save(true)} className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-bold text-primary disabled:opacity-50">Guardar borrador</button>
      <button type="button" disabled={disabled || locating} onClick={() => save(false)} className="rounded-xl bg-primary px-6 py-2.5 text-sm font-bold text-white hover:bg-primary-dark disabled:opacity-50">
        {saving ? 'Guardando...' : alreadySubmitted ? 'Guardar cambios' : 'Enviar a revisión'}
      </button>
    </div>
  </div>
}
