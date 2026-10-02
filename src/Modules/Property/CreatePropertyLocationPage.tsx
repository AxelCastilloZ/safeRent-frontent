import { useEffect, useState } from 'react'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { AlertCircle, LocateFixed, MapPin } from 'lucide-react'
import Stepper from './Components/Stepper'
import LocationMap, { type LocationPoint } from './Components/LocationMap'
import { PROPERTY_STEPS } from './constants/propertySteps'
import { useLocationSearch } from './hooks/useLocationSearch'
import { propertyService } from './services/propertyService'
import type { LocationSuggestion } from './services/locationService'

export default function CreatePropertyLocationPage() {
  const navigate = useNavigate()
  const { propertyId } = useSearch({ from: '/properties/new/location' })
  const [address, setAddress] = useState('')
  const [point, setPoint] = useState<LocationPoint | null>(null)
  const [searching, setSearching] = useState(false)
  const [loading, setLoading] = useState(true)
  const [loadFailed, setLoadFailed] = useState(false)
  const [saving, setSaving] = useState(false)
  const [locating, setLocating] = useState(false)
  const [error, setError] = useState('')
  const search = useLocationSearch(address, searching)

  useEffect(() => {
    let cancelled = false
    if (!propertyId) { navigate({ to: '/properties/new' }); return }
    propertyService.getById(propertyId).then((property) => {
      if (cancelled) return
      setAddress(property.address ?? '')
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

  async function save(draft: boolean) {
    if (!propertyId || loadFailed) return
    if (!draft && (!address.trim() || !point)) {
      setError('Escribe la dirección y selecciona la ubicación en el mapa.')
      return
    }
    setSaving(true)
    setError('')
    try {
      await propertyService.update(propertyId, {
        address: address.trim(), latitude: point?.latitude ?? null, longitude: point?.longitude ?? null,
      })
      if (draft) navigate({ to: '/properties' })
      else navigate({ to: '/properties/new/media', search: { propertyId } })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo guardar la ubicación.')
    } finally { setSaving(false) }
  }

  if (loading) return <div className="py-24 text-center text-sm text-slate-400">Cargando propiedad...</div>
  const disabled = saving || loadFailed
  return <div className="mx-auto max-w-2xl">
    <div className="mb-6 flex flex-col gap-4">
      <h1 className="text-2xl font-bold text-primary">Ubicación de la propiedad</h1>
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
    <div className="mt-6 flex flex-wrap justify-end gap-3">
      <button type="button" disabled={saving} onClick={() => navigate({ to: '/properties/new', search: { editId: propertyId } })} className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-bold text-primary hover:bg-slate-50">Atrás</button>
      <button type="button" disabled={disabled || locating} onClick={() => save(true)} className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-bold text-primary disabled:opacity-50">Guardar borrador</button>
      <button type="button" disabled={disabled || locating} onClick={() => save(false)} className="rounded-xl bg-primary px-6 py-2.5 text-sm font-bold text-white hover:bg-primary-dark disabled:opacity-50">{saving ? 'Guardando...' : 'Siguiente'}</button>
    </div>
  </div>
}
