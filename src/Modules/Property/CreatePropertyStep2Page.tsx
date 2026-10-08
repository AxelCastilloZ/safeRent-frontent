import ServiceIcon from '../Services/components/ServiceIcon'
import { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { AlertCircle, Check, ImagePlus, X } from 'lucide-react'
import Stepper from './Components/Stepper'
import { propertyService, serviceService } from './services/propertyService'
import { ApiError } from './services/api'
import type { PropertyFile, Service } from './types/property'

import { PROPERTY_STEPS as STEPS } from './constants/propertySteps'
const MIN_IMAGES = 3

interface NewFile {
  file: File
  url: string
}

export default function CreatePropertyStep2Page() {
  const navigate = useNavigate()
  const search = useSearch({ strict: false })
  const propertyIdFromState = search.propertyId
  const propertyIdRef = useRef(propertyIdFromState)
  const propertyId = propertyIdRef.current

  const fileInputRef = useRef<HTMLInputElement>(null)

  const [existingFiles, setExistingFiles] = useState<PropertyFile[]>([])
  const [newImages, setNewImages] = useState<NewFile[]>([])
  const [availableServices, setAvailableServices] = useState<Service[]>([])
  const [selectedServiceIds, setSelectedServiceIds] = useState<number[]>([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!propertyId) {
      navigate({ to: '/dashboard/owner/properties/new' })
      return
    }
    loadPropertyData(propertyId)
    loadServices()
  }, [propertyId, navigate])

  async function loadPropertyData(id: number) {
    try {
      const [files, property] = await Promise.all([
        propertyService.getFiles(id),
        propertyService.getById(id),
      ])
      setExistingFiles(files)
      if (property.services?.length > 0) {
        setSelectedServiceIds(property.services.map((s) => s.id))
      }
    } catch {
      // non-critical, continue with empty state
    }
  }

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
    const files: NewFile[] = Array.from(fileList).map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }))
    setNewImages((prev) => [...prev, ...files])
  }

  function removeNewImage(index: number) {
    setNewImages((prev) => {
      const removed = prev[index]
      URL.revokeObjectURL(removed.url)
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

  function toggleService(id: number) {
    setSelectedServiceIds((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
    )
  }

  const totalImages = existingFiles.length + newImages.length

  async function saveData() {
    if (!propertyId) return
    if (selectedServiceIds.length > 0) {
      await propertyService.update(propertyId, { serviceIds: selectedServiceIds })
    }
    if (newImages.length > 0) {
      await propertyService.uploadFiles(propertyId, newImages.map((i) => i.file))
    }
  }

  async function handleSaveDraft() {
    setSaving(true)
    setError(null)
    try {
      await saveData()
      navigate({ to: '/dashboard/owner/properties' })
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Error al guardar')
    } finally {
      setSaving(false)
    }
  }

  async function handleValidate() {
    if (totalImages < MIN_IMAGES) {
      setError(`Se requieren al menos ${MIN_IMAGES} imágenes. Faltan ${MIN_IMAGES - totalImages}.`)
      return
    }

    setSaving(true)
    setError(null)
    try {
      await saveData()
      navigate({ to: `/dashboard/owner/properties/detail/${propertyId}` })
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Error al validar datos')
    } finally {
      setSaving(false)
    }
  }

  const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-primary">Nueva propiedad</h1>
        <Stepper steps={STEPS} currentStep={3} />
      </div>

      {error && (
        <div className="mb-6 flex items-start gap-3 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Image upload */}
      <div className="mb-8">
        <p className="mb-3 text-sm font-medium text-primary">Imágenes ({totalImages} / mín. {MIN_IMAGES})</p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {existingFiles.map((file) => (
            <div key={`existing-${file.id}`} className="group relative aspect-square overflow-hidden rounded-xl bg-slate-100">
              <img src={`${API_BASE}/${file.path}`} alt={file.fileName} className="size-full object-cover" loading="lazy" />
              <button
                type="button"
                className="absolute right-1.5 top-1.5 grid size-6 place-items-center rounded-full bg-black/50 text-white opacity-0 transition group-hover:opacity-100"
                onClick={() => removeExistingFile(file.id)}
                aria-label="Eliminar imagen"
              >
                <X size={14} />
              </button>
            </div>
          ))}
          {newImages.map((img, i) => (
            <div key={img.url} className="group relative aspect-square overflow-hidden rounded-xl bg-slate-100">
              <img src={img.url} alt={`Nueva ${i + 1}`} className="size-full object-cover" />
              <button
                type="button"
                className="absolute right-1.5 top-1.5 grid size-6 place-items-center rounded-full bg-black/50 text-white opacity-0 transition group-hover:opacity-100"
                onClick={() => removeNewImage(i)}
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
                aria-pressed={selected}
                onClick={() => toggleService(service.id)}
              >
                <ServiceIcon name={service.icono} size={18} />{selected && <Check size={14} />}
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
          onClick={() => navigate({ to: '/dashboard/owner/properties/new/location', search: { propertyId } })}
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

