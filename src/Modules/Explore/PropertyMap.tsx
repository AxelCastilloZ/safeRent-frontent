import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import { LocateFixed, Maximize } from 'lucide-react'
import 'leaflet/dist/leaflet.css'
import { coordinates, priceLabel, type Property } from './properties'

interface Props {
  properties: Property[]
  selected: number | null
  onSelect: (id: number) => void
}

export default function PropertyMap({ properties, selected, onSelect }: Props) {
  const container = useRef<HTMLDivElement>(null)
  const map = useRef<L.Map | null>(null)
  const markers = useRef(new Map<number, L.Marker>())
  const userMarker = useRef<L.CircleMarker | null>(null)
  const [notice, setNotice] = useState('')
  const [locating, setLocating] = useState(false)

  useEffect(() => {
    if (!container.current) return
    const instance = L.map(container.current, { zoomControl: false }).setView(
      [9.935, -84.084],
      12,
    )
    map.current = instance
    L.control.zoom({ position: 'topright' }).addTo(instance)
    const tiles = L.tileLayer(
      'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      },
    ).addTo(instance)
    tiles.on('tileerror', () =>
      setNotice('No se pudo cargar parte del mapa. Revisa tu conexión.'),
    )
    const observer = new ResizeObserver(() => instance.invalidateSize())
    observer.observe(container.current)
    return () => {
      observer.disconnect()
      instance.remove()
      map.current = null
    }
  }, [])

  useEffect(() => {
    const instance = map.current
    if (!instance) return
    const layer = L.layerGroup().addTo(instance)
    const nextMarkers = new Map<number, L.Marker>()
    const points: L.LatLngTuple[] = []
    properties.forEach((property) => {
      const point = coordinates(property)
      if (!point) return
      points.push(point)
      const label = document.createElement('span')
      label.textContent = priceLabel(property)
      const marker = L.marker(point, {
        icon: L.divIcon({
          className: 'price-marker',
          html: label,
          iconSize: [112, 38],
          iconAnchor: [56, 38],
        }),
        title: `${property.title}: ${priceLabel(property)}`,
        keyboard: true,
      }).addTo(layer)
      marker.on('click', () => onSelect(property.id))
      nextMarkers.set(property.id, marker)
    })
    markers.current = nextMarkers
    if (points.length)
      instance.fitBounds(L.latLngBounds(points), {
        padding: [75, 75],
        maxZoom: 15,
      })
    return () => {
      layer.remove()
      markers.current.clear()
    }
  }, [properties, onSelect])

  useEffect(() => {
    markers.current.forEach((marker, id) => {
      marker.getElement()?.classList.toggle('is-selected', id === selected)
      marker.setZIndexOffset(id === selected ? 1000 : 0)
    })
    const marker = selected === null ? undefined : markers.current.get(selected)
    if (marker) map.current?.panTo(marker.getLatLng())
  }, [selected, properties])

  function locate() {
    if (!navigator.geolocation) {
      setNotice('Tu navegador no admite geolocalización.')
      return
    }
    setLocating(true)
    setNotice('')
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocating(false)
        const instance = map.current
        if (!instance) return
        const point: L.LatLngTuple = [
          position.coords.latitude,
          position.coords.longitude,
        ]
        userMarker.current?.remove()
        userMarker.current = L.circleMarker(point, {
          radius: 8,
          color: '#fff',
          weight: 3,
          fillColor: '#2563eb',
          fillOpacity: 1,
        })
          .addTo(instance)
          .bindTooltip('Tu ubicación')
        instance.setView(point, 14)
      },
      () => {
        setLocating(false)
        setNotice(
          'No pudimos obtener tu ubicación. Revisa los permisos del navegador.',
        )
      },
      { timeout: 10000 },
    )
  }

  function fitAll() {
    const points = properties
      .map(coordinates)
      .filter((point): point is [number, number] => point !== null)
    if (points.length)
      map.current?.fitBounds(L.latLngBounds(points), {
        padding: [75, 75],
        maxZoom: 15,
      })
  }

  return (
    <section className="explore-map" aria-label="Mapa de precios y ubicaciones">
      <div ref={container} className="map-canvas" />
      <div className="map-actions">
        <button
          type="button"
          onClick={locate}
          disabled={locating}
          aria-label="Usar mi ubicación"
          title="Usar mi ubicación"
        >
          <LocateFixed size={22} />
        </button>
        <button
          type="button"
          onClick={fitAll}
          aria-label="Ver todas las ubicaciones"
          title="Ver todas las ubicaciones"
        >
          <Maximize size={20} />
        </button>
      </div>
      <div className="map-caption">
        {properties.filter((p) => coordinates(p)).length} propiedades en el mapa
      </div>
      {notice && (
        <div role="status" className="map-notice">
          {notice}
          <button onClick={() => setNotice('')} aria-label="Cerrar aviso">
            ×
          </button>
        </div>
      )}
    </section>
  )
}
