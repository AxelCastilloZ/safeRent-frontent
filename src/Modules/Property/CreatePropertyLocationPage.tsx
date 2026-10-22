import { catalogText } from '../../i18n/catalog';
import { message, messageFromError } from '../../i18n/messages';
import { useMessageState } from '../../i18n/useMessageState';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n/instance';
import { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { AlertCircle, Camera, CheckCircle2, ImagePlus, LocateFixed, MapPin, Upload, X } from 'lucide-react'
import { FormSection, PropertyActions, PropertyFormLayout } from './Components/PropertyFormLayout'
import LocationMap, { type LocationPoint } from './Components/LocationMap'
import { useLocationSearch } from './hooks/useLocationSearch'
import { propertyService } from './services/propertyService'
import { ApiError } from './services/api'
import type { LocationSuggestion } from './services/locationService'
import type { Property, PropertyFile, PropertyStatus } from './types/property'

const MIN_IMAGES = 3
/** En estos estados la propiedad ya se envió: el paso solo guarda cambios, no la vuelve a enviar a revisión. */
const ALREADY_SUBMITTED: PropertyStatus[] = ['PENDING', 'ACTIVE']

interface NewFile {
  file: File
  url: string
}

/** Paso 2 del asistente: ubicación en el mapa e imágenes; al terminar envía la propiedad a revisión. */
export default function CreatePropertyLocationPage() {
  useTranslation();
  const navigate = useNavigate()
  const { propertyId } = useSearch({ strict: false })
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [address, setAddress] = useState('')
  const [property, setProperty] = useState<Property | null>(null)
  const [dragging, setDragging] = useState(false)
  const [removing, setRemoving] = useState(false)
  const imageUrls = useRef(new Set<string>())
  useEffect(() => { const urls = imageUrls.current; return () => { urls.forEach(url => URL.revokeObjectURL(url)) } }, [])
  const [point, setPoint] = useState<LocationPoint | null>(null)
  const [status, setStatus] = useState<PropertyStatus | null>(null)
  const [existingFiles, setExistingFiles] = useState<PropertyFile[]>([])
  const [newImages, setNewImages] = useState<NewFile[]>([])
  const [searching, setSearching] = useState(false)
  const [loading, setLoading] = useState(true)
  const [loadFailed, setLoadFailed] = useState(false)
  const [saving, setSaving] = useState(false)
  const [locating, setLocating] = useState(false)
  const [error, setError] = useMessageState('')
  const search = useLocationSearch(address, searching)

  useEffect(() => {
    let cancelled = false
    if (!propertyId) { navigate({ to: '/dashboard/owner/properties/new' }); return }
    Promise.all([propertyService.getById(propertyId), propertyService.getFiles(propertyId)]).then(([property, files]) => {
      if (cancelled) return
      setProperty(property)
      setAddress(property.address ?? '')
      setStatus(property.status)
      setExistingFiles(files)
      if (typeof property.latitude === 'number' && typeof property.longitude === 'number') {
        setPoint({ latitude: property.latitude, longitude: property.longitude })
      }
    }).catch(() => {
      if (!cancelled) { setLoadFailed(true); setError(message("property:createpropertylocationpage_no_se_pudo_cargar_la_propiedad_vuelve_a_intentarlo")) }
    }).finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [propertyId, navigate, setError])

  function select(suggestion: LocationSuggestion) {
    setAddress(suggestion.address)
    setPoint({ latitude: suggestion.latitude, longitude: suggestion.longitude })
    setSearching(false)
    setError('')
  }

  function locate() {
    if (!navigator.geolocation) { setError(message("explore:propertymap_tu_navegador_no_admite_geolocalizacion")); return }
    setLocating(true)
    navigator.geolocation.getCurrentPosition((position) => {
      setPoint({ latitude: position.coords.latitude, longitude: position.coords.longitude })
      setSearching(false)
      setLocating(false)
      setError('')
    }, () => {
      setLocating(false)
      setError(message("explore:propertymap_no_pudimos_obtener_tu_ubicacion_revisa_los_permisos_del"))
    }, { timeout: 10000, enableHighAccuracy: true })
  }

  function handleFilesSelected(fileList: FileList | null) {
    if (!fileList || saving || loadFailed || removing) return
    const accepted = Array.from(fileList).filter(file => ['image/jpeg', 'image/png', 'image/webp'].includes(file.type))
    if (accepted.length !== fileList.length) setError(message("property:createpropertylocationpage_solo_se_permiten_imagenes_jpg_png_o_webp"))
    else setError('')
    const files: NewFile[] = accepted.map(file => {
      const url = URL.createObjectURL(file)
      imageUrls.current.add(url)
      return { file, url }
    })
    setNewImages((prev) => [...prev, ...files])
  }

  function removeNewImage(index: number) {
    setNewImages((prev) => {
      URL.revokeObjectURL(prev[index].url)
      imageUrls.current.delete(prev[index].url)
      return prev.filter((_, i) => i !== index)
    })
  }

  async function removeExistingFile(fileId: number) {
    if (!propertyId || saving || removing) return
    setRemoving(true)
    try {
      await propertyService.removeFile(propertyId, fileId)
      setExistingFiles((prev) => prev.filter((f) => f.id !== fileId))
    } catch (err) {
      setError(err instanceof ApiError ? messageFromError(err) : message("property:createpropertylocationpage_error_al_eliminar_imagen"))
    } finally { setRemoving(false) }
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
      const uploaded = await propertyService.uploadFiles(propertyId, newImages.map((image) => image.file))
      setExistingFiles(prev => [...prev, ...uploaded])
      newImages.forEach(image => { URL.revokeObjectURL(image.url); imageUrls.current.delete(image.url) })
      setNewImages([])
    }
  }

  async function save(draft: boolean) {
    if (!propertyId || loadFailed || saving || removing) return
    if (!draft) {
      if (!address.trim() || !point) { setError(message("property:createpropertylocationpage_escribe_la_direccion_y_selecciona_la_ubicacion_en_el")); return }
      if (totalImages < MIN_IMAGES) { setError(message("property:createpropertylocationpage_se_requieren_al_menos_imagenes_faltan", { v0: MIN_IMAGES, v1: MIN_IMAGES - totalImages })); return }
    }
    setSaving(true)
    setError('')
    try {
      await saveData()
      if (draft) { navigate({ to: '/dashboard/owner/properties' }); return }
      if (!alreadySubmitted) await propertyService.publish(propertyId)
      navigate({ to: '/dashboard/owner/properties/detail/$propertyId', params: { propertyId: String(propertyId) } })
    } catch (err) {
      setError(err instanceof Error ? messageFromError(err) : message("property:createpropertylocationpage_no_se_pudo_guardar_la_propiedad"))
    } finally { setSaving(false) }
  }

  if (loading) return <div className="py-24 text-center text-sm text-slate-400">{i18n.t("property:createpropertylocationpage_cargando_propiedad")}</div>
  const disabled = saving || loadFailed || removing
  const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'
  async function back() {
    if (disabled || locating) return
    setSaving(true)
    setError('')
    try {
      await saveData()
      await navigate({ to: '/dashboard/owner/properties/new', search: { editId: propertyId } })
    } catch (err) {
      setError(err instanceof Error ? messageFromError(err) : message("property:createpropertylocationpage_no_se_pudieron_guardar_los_cambios_antes_de_volver"))
    } finally { setSaving(false) }
  }
  return <PropertyFormLayout step={2} editing={alreadySubmitted} preview={{
    title: property?.title ?? '', cost: property?.cost ?? 0, currency: property?.typeOfCoin || 'CRC',
    type: catalogText(property?.typeOfProperty), description: property?.description ?? '',
    rooms: property?.rooms ?? 1, guests: property?.guest ?? 1, services: property?.services ?? [],
    address, located: !!point, photos: [...existingFiles.map(file => API_BASE + '/' + file.path), ...newImages.map(image => image.url)],
  }} actions={<PropertyActions step={2} busy={saving} disabled={disabled || locating} onBack={() => { void back() }} onDraft={() => { void save(true) }} onPrimary={() => { void save(false) }} finalLabel={alreadySubmitted ? i18n.t("property:createpropertylocationpage_guardar_cambios") : i18n.t("property:propertyformlayout_enviar_a_revision")} />}>
    {error && <div role="alert" className="mb-5 flex gap-3 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700"><AlertCircle size={18} className="shrink-0" />{error}</div>}
    <FormSection icon={MapPin} title={i18n.t("dashboard:adminpropertiespage_ubicacion")} description={i18n.t("property:createpropertylocationpage_ayuda_a_los_inquilinos_a_encontrar_tu_propiedad")}>
      <div>
        <label htmlFor="property-address" className="mb-1.5 block text-sm font-medium text-primary">{i18n.t("property:createpropertylocationpage_direccion")}</label>
        <input id="property-address" value={address} maxLength={300} disabled={disabled} autoComplete="off"
          placeholder={i18n.t("property:createpropertylocationpage_busca_una_direccion_ciudad_o_pais")}
          className="property-input"
          onChange={(event) => { setAddress(event.target.value); setPoint(null); setSearching(true); setError('') }} />
        <div aria-live="polite">
          {search.loading && <p className="mt-2 text-xs text-slate-400">{i18n.t("property:createpropertylocationpage_buscando_direcciones")}</p>}
          {search.error && <p className="mt-2 text-sm text-red-600">{search.error}</p>}
          {search.searched && !search.error && search.suggestions.length === 0 && <p className="mt-2 text-sm text-slate-500">{i18n.t("property:createpropertylocationpage_sin_resultados_puedes_seleccionar_el_punto_directamente_en_el")}</p>}
        </div>
        {search.suggestions.length > 0 && <ul aria-label={i18n.t("property:createpropertylocationpage_direcciones_sugeridas")} className="mt-2 overflow-hidden rounded-xl border border-slate-200">
          {search.suggestions.map((suggestion, index) => <li key={index}><button type="button" disabled={disabled}
            onClick={() => select(suggestion)} className="flex w-full items-start gap-2 px-4 py-3 text-left text-sm text-primary hover:bg-slate-50 focus:bg-slate-50">
            <MapPin size={16} className="mt-0.5 shrink-0" />{suggestion.address}
          </button></li>)}
        </ul>}
        {search.searched && !search.error && <a href="https://www.geoapify.com/" target="_blank" rel="noreferrer" className="mt-2 block text-xs text-slate-400">{i18n.t("property:createpropertylocationpage_busqueda_de_direcciones_por_geoapify")}</a>}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-500">{i18n.t("property:createpropertylocationpage_haz_clic_en_el_mapa_o_arrastra_el_pin")}</p>
        <button type="button" disabled={disabled || locating} onClick={locate} className="property-button">
          <LocateFixed size={16} />{locating ? i18n.t("property:createpropertylocationpage_buscando_ubicacion") : i18n.t("explore:propertymap_usar_mi_ubicacion")}
        </button>
      </div>
      <LocationMap point={point} disabled={disabled} onChange={(value) => { setPoint(value); setSearching(false); setError('') }} />
      <p role="status" className="flex items-start gap-2 rounded-xl bg-slate-50 p-3 text-sm text-slate-600">{point && <CheckCircle2 size={18} className="shrink-0 text-teal-700" />}{point ? i18n.t("property:createpropertylocationpage_ubicacion_seleccionada_revisa_que_el_pin_este_sobre_la") : i18n.t("property:createpropertylocationpage_selecciona_una_direccion_sugerida_o_un_punto_en_el")}</p>
    </FormSection>
    <FormSection icon={Camera} title={i18n.t("property:createpropertylocationpage_fotografias")} description={i18n.t("property:createpropertylocationpage_muestra_los_espacios_principales_con_buena_luz_minimo_3")} aside={<span role="status" className={'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold ' + (totalImages >= MIN_IMAGES ? 'border-teal-200 bg-teal-50 text-teal-800' : 'border-amber-200 bg-amber-50 text-amber-800')}>{totalImages >= MIN_IMAGES ? <CheckCircle2 size={15} /> : <AlertCircle size={15} />}{totalImages >= MIN_IMAGES ? i18n.t("property:createpropertylocationpage_minimo_completado") : totalImages + i18n.t("property:createpropertylocationpage_de_3_imagenes_minimas")}</span>}>
      <div onDragOver={event => { event.preventDefault(); if (!disabled) setDragging(true) }} onDragLeave={() => setDragging(false)} onDrop={event => { event.preventDefault(); setDragging(false); handleFilesSelected(event.dataTransfer.files) }} className={dragging ? 'rounded-xl bg-teal-50 ring-2 ring-teal-700' : ''}>
      {totalImages === 0 && <div className="flex flex-col items-center gap-4 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-12 text-center"><span className="grid size-14 place-items-center rounded-2xl bg-white shadow-sm"><Upload size={24} /></span><div><p className="font-semibold">{dragging ? i18n.t("property:createpropertylocationpage_suelta_las_imagenes_para_agregarlas") : i18n.t("property:createpropertylocationpage_arrastra_tus_fotos_aqui")}</p><p className="mt-1 text-sm text-slate-500">{i18n.t("property:createpropertylocationpage_sala_cocina_habitaciones_y_vista_jpg_png_o_webp")}</p></div><button type="button" disabled={disabled} className="property-button property-primary" onClick={() => fileInputRef.current?.click()}><ImagePlus size={18} />{i18n.t("property:createpropertylocationpage_seleccionar_imagenes")}</button></div>}
      <div className={totalImages ? 'grid grid-cols-2 gap-3 sm:grid-cols-3' : 'hidden'}>
        {existingFiles.map((file) => (
          <div key={`existing-${file.id}`} className="group relative aspect-[4/3] overflow-hidden rounded-xl bg-slate-100">
            <img src={`${API_BASE}/${file.path}`} alt={file.fileName} className="size-full object-cover" loading="lazy" />
            <button type="button" disabled={disabled} onClick={() => removeExistingFile(file.id)} aria-label={i18n.t("property:createpropertylocationpage_eliminar_imagen")}
              className="absolute right-0 top-0 grid size-11 place-items-center rounded-bl-xl bg-white/90 text-primary shadow-sm transition hover:bg-red-50 hover:text-red-700">
              <X size={14} />
            </button>
          </div>
        ))}
        {newImages.map((image, i) => (
          <div key={image.url} className="group relative aspect-[4/3] overflow-hidden rounded-xl bg-slate-100">
            <img src={image.url} alt={i18n.t("property:createpropertylocationpage_nueva", { v0: i + 1 })} className="size-full object-cover" />
            <button type="button" disabled={disabled} onClick={() => removeNewImage(i)} aria-label={i18n.t("property:createpropertylocationpage_quitar_imagen")}
              className="absolute right-0 top-0 grid size-11 place-items-center rounded-bl-xl bg-white/90 text-primary shadow-sm transition hover:bg-red-50 hover:text-red-700">
              <X size={14} />
            </button>
          </div>
        ))}
        <button type="button" disabled={disabled} onClick={() => fileInputRef.current?.click()}
          className="flex aspect-[4/3] flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 text-slate-400 transition hover:border-primary hover:text-primary disabled:opacity-50">
          <ImagePlus size={24} />
          <span className="text-xs font-medium">{i18n.t("property:createpropertylocationpage_agregar_mas")}</span>
        </button>
      </div>
      </div>
      {totalImages > 0 && <p className="text-sm text-slate-500">{totalImages}{' '}{i18n.t("property:createpropertylocationpage_imagenes_agregadas")}</p>}
      <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" multiple hidden
        onChange={(e) => { handleFilesSelected(e.target.files); e.target.value = '' }} />
    </FormSection>
  </PropertyFormLayout>
}
