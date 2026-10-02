import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

export interface LocationPoint { latitude: number; longitude: number }

interface Props {
  point: LocationPoint | null
  onChange: (point: LocationPoint) => void
  disabled?: boolean
}

export default function LocationMap({ point, onChange, disabled = false }: Props) {
  const container = useRef<HTMLDivElement>(null)
  const map = useRef<L.Map | null>(null)
  const marker = useRef<L.Marker | null>(null)
  const callback = useRef(onChange)
  const isDisabled = useRef(disabled)
  const [notice, setNotice] = useState('')
  useEffect(() => {
    callback.current = onChange
    isDisabled.current = disabled
  }, [onChange, disabled])

  useEffect(() => {
    if (!container.current) return
    const instance = L.map(container.current).setView([9.935, -84.084], 12)
    map.current = instance
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(instance).on('tileerror', () => setNotice('No se pudo cargar parte del mapa. Revisa tu conexión.'))
    instance.on('click', (event: L.LeafletMouseEvent) => {
      if (!isDisabled.current) callback.current({ latitude: event.latlng.lat, longitude: event.latlng.lng })
    })
    const observer = new ResizeObserver(() => instance.invalidateSize())
    observer.observe(container.current)
    return () => { observer.disconnect(); instance.remove(); map.current = null; marker.current = null }
  }, [])

  useEffect(() => {
    const instance = map.current
    if (!instance) return
    if (!point) { marker.current?.remove(); marker.current = null; return }
    const position: L.LatLngTuple = [point.latitude, point.longitude]
    if (!marker.current) {
      marker.current = L.marker(position, {
        draggable: !disabled,
        title: 'Ubicación de la propiedad. Arrastra para ajustar.',
        icon: L.divIcon({
          className: '',
          html: '<div style="width:28px;height:28px;background:#2563eb;border:4px solid white;border-radius:50%;box-shadow:0 2px 8px #0005"></div>',
          iconSize: [28, 28], iconAnchor: [14, 14],
        }),
      }).addTo(instance)
      marker.current.on('dragend', () => {
        const value = marker.current!.getLatLng()
        if (!isDisabled.current) callback.current({ latitude: value.lat, longitude: value.lng })
      })
    } else marker.current.setLatLng(position)
    if (disabled) marker.current.dragging?.disable()
    else marker.current.dragging?.enable()
    instance.setView(position, Math.max(instance.getZoom(), 16))
  }, [point, disabled])

  return <div>
    <div ref={container} className="relative z-0 h-80 w-full overflow-hidden rounded-xl border border-slate-200 sm:h-96" aria-label="Seleccionar ubicación de la propiedad" />
    {notice && <p role="status" className="mt-2 text-sm text-red-600">{notice}</p>}
  </div>
}
