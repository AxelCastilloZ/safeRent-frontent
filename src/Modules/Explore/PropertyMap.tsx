import { message } from '../../i18n/messages';
import { useMessageState } from '../../i18n/useMessageState';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n/instance';
import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import { LocateFixed, Maximize } from 'lucide-react'
import 'leaflet/dist/leaflet.css'
import type { Property } from './interfaces/property.interface'
import { coordinates, priceLabel } from './utils/property.utils'

interface Props {
  properties: Property[]
  selected: number | null
  onSelect: (id: number) => void
}

export default function PropertyMap({ properties, selected, onSelect }: Props) {
  const language = useTranslation().i18n.resolvedLanguage;
  const container = useRef<HTMLDivElement>(null)
  const map = useRef<L.Map | null>(null)
  const markers = useRef(new Map<number, L.Marker>())
  const userMarker = useRef<L.CircleMarker | null>(null)
  const [notice, setNotice] = useMessageState('')
  const [locating, setLocating] = useState(false)

  useEffect(() => {
    if (!container.current) return
    const instance = L.map(container.current, { zoomControl: false }).setView(
      [9.935, -84.084],
      12,
    )
    map.current = instance
    L.control.zoom({ position: 'topright', zoomInTitle: i18n.t('common:zoomIn'), zoomOutTitle: i18n.t('common:zoomOut') }).addTo(instance)
    const tiles = L.tileLayer(
      'https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png',
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://www.openstreetmap.fr/">OSM France</a>',
        maxZoom: 20,
      },
    ).addTo(instance)
    tiles.on('tileerror', () =>
      setNotice(message("explore:propertymap_no_se_pudo_cargar_parte_del_mapa_revisa_tu")),
    )
    const observer = new ResizeObserver(() => instance.invalidateSize())
    observer.observe(container.current)
    return () => {
      observer.disconnect()
      instance.remove()
      map.current = null
    }
  }, [setNotice])

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
          iconSize: [174, 38],
          iconAnchor: [87, 38],
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
  }, [properties, onSelect, language])

  useEffect(() => {
    markers.current.forEach((marker, id) => {
      marker.getElement()?.classList.toggle('is-selected', id === selected)
      marker.setZIndexOffset(id === selected ? 1000 : 0)
    })
    const marker = selected === null ? undefined : markers.current.get(selected)
    if (marker) map.current?.panTo(marker.getLatLng())
  }, [selected, properties, language])

  useEffect(() => {
    const container = map.current?.getContainer();
    container?.querySelector('.leaflet-control-attribution a[href*="leafletjs.com"]')?.setAttribute('title', i18n.t('common:mapLibrary'));
    for (const [selector, key] of [['.leaflet-control-zoom-in', 'common:zoomIn'], ['.leaflet-control-zoom-out', 'common:zoomOut']]) {
      const button = container?.querySelector(selector);
      button?.setAttribute('title', i18n.t(key));
      button?.setAttribute('aria-label', i18n.t(key));
    }
  }, [language]);

  function locate() {
    if (!navigator.geolocation) {
      setNotice(message("explore:propertymap_tu_navegador_no_admite_geolocalizacion"))
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
          .bindTooltip(i18n.t("explore:propertymap_tu_ubicacion"))
        instance.setView(point, 14)
      },
      () => {
        setLocating(false)
        setNotice(
          message("explore:propertymap_no_pudimos_obtener_tu_ubicacion_revisa_los_permisos_del"),
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
    <section className="explore-map" aria-label={i18n.t("explore:propertymap_mapa_de_precios_y_ubicaciones")}>
      <div ref={container} className="map-canvas" />
      <div className="map-actions">
        <button
          type="button"
          onClick={locate}
          disabled={locating}
          aria-label={i18n.t("explore:propertymap_usar_mi_ubicacion")}
          title={i18n.t("explore:propertymap_usar_mi_ubicacion")}
        >
          <LocateFixed size={22} />
        </button>
        <button
          type="button"
          onClick={fitAll}
          aria-label={i18n.t("explore:propertymap_ver_todas_las_ubicaciones")}
          title={i18n.t("explore:propertymap_ver_todas_las_ubicaciones")}
        >
          <Maximize size={20} />
        </button>
      </div>
      <div className="map-caption">
        {properties.filter((p) => coordinates(p)).length}{' '}{i18n.t("explore:propertymap_propiedades_en_el_mapa")}</div>
      {notice && (
        <div role="status" className="map-notice">
          {notice}
          <button onClick={() => setNotice('')} aria-label={i18n.t("explore:propertymap_cerrar_aviso")}>
            ×
          </button>
        </div>
      )}
    </section>
  )
}
