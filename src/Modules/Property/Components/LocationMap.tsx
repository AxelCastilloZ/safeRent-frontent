import { message } from '../../../i18n/messages';
import { useMessageState } from '../../../i18n/useMessageState';
import { useTranslation } from 'react-i18next';
import i18n from '../../../i18n/instance';
import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

export interface LocationPoint { latitude: number; longitude: number }

interface Props {
  point: LocationPoint | null
  onChange: (point: LocationPoint) => void
  disabled?: boolean
}

export default function LocationMap({ point, onChange, disabled = false }: Props) {
  const language = useTranslation().i18n.resolvedLanguage;
  const container = useRef<HTMLDivElement>(null)
  const map = useRef<L.Map | null>(null)
  const marker = useRef<L.Marker | null>(null)
  const callback = useRef(onChange)
  const isDisabled = useRef(disabled)
  const [notice, setNotice] = useMessageState('')
  useEffect(() => {
    callback.current = onChange
    isDisabled.current = disabled
  }, [onChange, disabled])

  useEffect(() => {
    if (!container.current) return
    const instance = L.map(container.current, { zoomControl: false }).setView([9.935, -84.084], 12)
    map.current = instance
    L.control.zoom({ zoomInTitle: i18n.t('common:zoomIn'), zoomOutTitle: i18n.t('common:zoomOut') }).addTo(instance)
    L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://www.openstreetmap.fr/">OSM France</a>',
      maxZoom: 20,
    }).addTo(instance).on('tileerror', () => setNotice(message("explore:propertymap_no_se_pudo_cargar_parte_del_mapa_revisa_tu")))
    instance.on('click', (event: L.LeafletMouseEvent) => {
      if (!isDisabled.current) callback.current({ latitude: event.latlng.lat, longitude: event.latlng.lng })
    })
    const observer = new ResizeObserver(() => instance.invalidateSize())
    observer.observe(container.current)
    return () => { observer.disconnect(); instance.remove(); map.current = null; marker.current = null }
  }, [setNotice])

  useEffect(() => {
    const instance = map.current
    if (!instance) return
    if (!point) { marker.current?.remove(); marker.current = null; return }
    const position: L.LatLngTuple = [point.latitude, point.longitude]
    if (!marker.current) {
      marker.current = L.marker(position, {
        draggable: !disabled,
        title: i18n.t("property:locationmap_ubicacion_de_la_propiedad_arrastra_para_ajustar"),
        icon: L.divIcon({
          className: '',
          html: '<div style="width:28px;height:28px;background:#0a2540;border:4px solid white;border-radius:50%;box-shadow:0 2px 8px #0005"></div>',
          iconSize: [28, 28], iconAnchor: [14, 14],
        }),
      }).addTo(instance)
      marker.current.on('dragend', () => {
        const value = marker.current!.getLatLng()
        if (!isDisabled.current) callback.current({ latitude: value.lat, longitude: value.lng })
      })
    } else marker.current.setLatLng(position)
    marker.current.getElement()?.setAttribute('title', i18n.t('property:locationmap_ubicacion_de_la_propiedad_arrastra_para_ajustar'))
    if (disabled) marker.current.dragging?.disable()
    else marker.current.dragging?.enable()
    instance.setView(position, Math.max(instance.getZoom(), 16))
  }, [point, disabled, language])

  useEffect(() => {
    const container = map.current?.getContainer();
    container?.querySelector('.leaflet-control-attribution a[href*="leafletjs.com"]')?.setAttribute('title', i18n.t('common:mapLibrary'));
    for (const [selector, key] of [['.leaflet-control-zoom-in', 'common:zoomIn'], ['.leaflet-control-zoom-out', 'common:zoomOut']]) {
      const button = container?.querySelector(selector);
      button?.setAttribute('title', i18n.t(key));
      button?.setAttribute('aria-label', i18n.t(key));
    }
  }, [language]);

  return <div>
    <div ref={container} className="relative z-0 h-72 w-full overflow-hidden rounded-xl border border-slate-200 sm:h-80" aria-label={i18n.t("property:locationmap_seleccionar_ubicacion_de_la_propiedad")} />
    {notice && <p role="status" className="mt-2 text-sm text-red-600">{notice}</p>}
  </div>
}
