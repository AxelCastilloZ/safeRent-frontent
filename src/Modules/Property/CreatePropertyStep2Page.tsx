import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { AlertCircle, Check, ImagePlus, Plus, X } from 'lucide-react'
import Stepper from './Components/Stepper'
import { propertyService, serviceService } from './services/propertyService'
import { ApiError } from './services/api'
import type { Service } from './types/property'

const STEPS = ['Datos', 'Imágenes', 'Publicar']
const MIN_IMAGES = 3

interface PreviewFile {
  file: File
  url: string
}

export default function CreatePropertyStep2Page() {
  const navigate = useNavigate()
  const location = useLocation()
  const propertyId = (location.state as { propertyId?: number })?.propertyId

  const fileInputRef = useRef<HTMLInputElement>(null)

  const [images, setImages] = useState<PreviewFile[]>([])
  const [availableServices, setAvailableServices] = useState<Service[]>([])
  const [selectedServiceIds, setSelectedServiceIds] = useState<number[]>([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!propertyId) {
      navigate('/properties/new')
      return
    }
    loadServices()
  }, [propertyId, navigate])

  async function loadServices() {
    try {
      const data = await serviceService.getAll()
      setAvailableServices(data)
    } catch {
      // services are optional
    }
  }

  function handleFilesSelected(fileList: FileList | null) {
    if (!fileList) return
    const newFiles: PreviewFile[] = Array.from(fileList).map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }))
    setImages((prev) => [...prev, ...newFiles])
  }

  function removeImage(index: number) {
    setImages((prev) => {
      const removed = prev[index]
      URL.revokeObjectURL(removed.url)
      return prev.filter((_, i) => i !== index)
    })
  }

  function toggleService(id: number) {
    setSelectedServiceIds((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
    )
  }

  async function handleSaveDraft() {
    if (!propertyId) return
    setSaving(true)
    setError(null)
    try {
      if (selectedServiceIds.length > 0) {
        await propertyService.update(propertyId, { serviceIds: selectedServiceIds })
      }
      if (images.length > 0) {
        await propertyService.uploadFiles(propertyId, images.map((i) => i.file))
      }
      navigate('/propietario/propiedades')
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Error al guardar')
    } finally {
      setSaving(false)
    }
  }

  async function handleValidate() {
    if (images.length < MIN_IMAGES) {
      setError(`Se requieren al menos ${MIN_IMAGES} imágenes. Faltan ${MIN_IMAGES - images.length}.`)
      return
    }

    if (!propertyId) return
    setSaving(true)
    setError(null)
    try {
      if (selectedServiceIds.length > 0) {
        await propertyService.update(propertyId, { serviceIds: selectedServiceIds })
      }
      if (images.length > 0) {
        await propertyService.uploadFiles(propertyId, images.map((i) => i.file))
      }
      navigate(`properties/detail/${propertyId}`)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Error al validar datos')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-primary">Nueva propiedad</h1>
        <Stepper steps={STEPS} currentStep={2} />
      </div>

      {error && (
        <div className="mb-6 flex items-start gap-3 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Image upload */}
      <div className="mb-8">
        <p className="mb-3 text-sm font-medium text-primary">Imágenes (mín. {MIN_IMAGES})</p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {images.map((img, i) => (
            <div key={img.url} className="group relative aspect-square overflow-hidden rounded-xl bg-slate-100">
              <img src={img.url} alt={`Imagen ${i + 1}`} className="size-full object-cover" />
              <button
                type="button"
                className="absolute right-1.5 top-1.5 grid size-6 place-items-center rounded-full bg-black/50 text-white opacity-0 transition group-hover:opacity-100"
                onClick={() => removeImage(i)}
                aria-label="Eliminar imagen"
              >
                <X size={14} />
              </button>
            </div>
          ))}
          <div
            className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 text-slate-400 transition hover:border-primary hover:text-primary"
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault()
              handleFilesSelected(e.dataTransfer.files)
            }}
          >
            <ImagePlus size={24} />
            <span className="text-xs font-medium">Arrastra aquí</span>
          </div>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          hidden
          onChange={(e) => handleFilesSelected(e.target.files)}
        />
      </div>

      {/* Services */}
      <div className="mb-8">
        <p className="mb-3 text-sm font-medium text-primary">Servicios verificables</p>
        <div className="flex flex-wrap gap-2">
          {availableServices.map((service) => {
            const selected = selectedServiceIds.includes(service.id)
            return (
              <button
                key={service.id}
                type="button"
                className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition ${
                  selected
                    ? 'bg-secondary text-white'
                    : 'border border-slate-200 bg-white text-slate-600 hover:border-secondary hover:text-secondary'
                }`}
                onClick={() => toggleService(service.id)}
              >
                {selected ? <Check size={14} /> : <Plus size={14} />}
                {service.name}
              </button>
            )
          })}
          {availableServices.length === 0 && (
            <span className="text-sm text-slate-400">No hay servicios disponibles</span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3">
        <button
          type="button"
          className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-bold text-primary transition hover:bg-slate-50"
          onClick={() => navigate(-1)}
        >
          Atrás
        </button>
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
          onClick={handleValidate}
          disabled={saving}
        >
          {saving ? 'Guardando...' : 'Validar datos'}
        </button>
      </div>
    </div>
  )
}
