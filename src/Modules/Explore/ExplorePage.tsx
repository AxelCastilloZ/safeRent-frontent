import Navbar from '../LandingPage/Components/Navbar';
import { catalogText } from '../../i18n/catalog';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n/instance';
import ServiceIcon from '../Services/components/ServiceIcon'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  BedDouble,
  Building2,
  LocateFixed,
  MapPin,
  Search,
  SlidersHorizontal,
  Users,
  X,
} from 'lucide-react'
import PropertyMap from './PropertyMap'
import { useProperties } from './hooks/useProperties'
import { useServices } from './hooks/useServices'
import type { Property } from './interfaces/property.interface'
import type { PropertyFilters } from './services/property.service'
import { coordinates, photoUrl, priceLabel } from './utils/property.utils'
import './explore.css'
import PriceDetails from './PriceDetails'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/Select'

const EMPTY_PROPERTIES: Property[] = []

function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value)
  const first = useRef(true)
  useEffect(() => {
    if (first.current) { first.current = false; return }
    const id = setTimeout(() => setDebounced(value), delayMs)
    return () => clearTimeout(id)
  }, [value, delayMs])
  return debounced
}

export default function ExplorePage() {
  useTranslation();
  const params = new URLSearchParams(window.location.search)
  const [query, setQuery] = useState(params.get('q') || '')
  const [sort, setSort] = useState<'newest' | 'price_asc' | 'price_desc'>('newest')
  const [rooms, setRooms] = useState('')
  const [services, setServices] = useState<number[]>([])
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [servicesAttempt, setServicesAttempt] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [attempt, setAttempt] = useState(0)
  const [mobileView, setMobileView] = useState('list')

  const debouncedQuery = useDebouncedValue(query, 400)

  const filters: PropertyFilters = useMemo(() => {
    const f: PropertyFilters = {}
    f.sort = sort
    if (services.length) f.serviceIds = services
    if (debouncedQuery.trim()) f.search = debouncedQuery.trim()
    if (rooms) f.minRooms = Number(rooms)
    return f
  }, [services, debouncedQuery, rooms, sort])

  const { properties: loadedProperties, loading, error } = useProperties(filters, attempt)
  const {
    services: availableServices,
    loading: servicesLoading,
    error: servicesError,
  } = useServices(servicesAttempt)

  const properties = loading || error ? EMPTY_PROPERTIES : loadedProperties

  const filtered = properties

  const activeProperty = filtered.find((p) => p.id === selected)
  const missingLocations = filtered.filter((p) => !coordinates(p)).length
  const activeFilterCount = services.length > 0 ? 1 : 0
  const hasFilters = Boolean(
    query || rooms || services.length,
  )
  const selectFromMap = useCallback((id: number) => {
    setSelected(id)
    document
      .getElementById(`property-${id}`)
      ?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  }, [])
  function resetFilters() {
    setQuery('')
    setRooms('')
    setServices([])
    setSort('newest')
  }

  return (
    <div className="explore-page">
      <Navbar />
      <main className="explore-layout" data-mobile-view={mobileView}>
        <section className="explore-results" aria-label={i18n.t("about:aboutcta_explorar_propiedades")}>
          <div className="explore-search">
            <p className="explore-eyebrow">{i18n.t("explore:explorepage_encuentra_tu_proximo_hogar")}</p>
            <h1>{i18n.t("about:aboutcta_explorar_propiedades")}</h1>
            <label className="location-search">
              <Search size={22} />
              <input
                aria-label={i18n.t("explore:explorepage_buscar_por_nombre_o_ubicacion")}
                placeholder={i18n.t("explore:explorepage_busca_una_ciudad_zona_o_propiedad")}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
              {query && (
                <button
                  aria-label={i18n.t("explore:explorepage_limpiar_busqueda")}
                  onClick={() => setQuery('')}
                >
                  <X size={18} />
                </button>
              )}
            </label>
            <div className="filter-toolbar">
              <button
                className={filtersOpen ? 'filter-pill active' : 'filter-pill'}
                aria-expanded={filtersOpen}
                aria-controls="explore-filters"
                onClick={() => setFiltersOpen(!filtersOpen)}
              >
                <SlidersHorizontal size={16} />{i18n.t("dashboard:adminhomepage_servicios")}{activeFilterCount > 0 && ` (${activeFilterCount})`}
              </button>
              <Select value={sort} onValueChange={value => setSort(value as typeof sort)}>
                <SelectTrigger aria-label={i18n.t("explore:explorepage_ordenar_propiedades")} className="w-full sm:w-auto sm:max-w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">{i18n.t("explore:explorepage_mas_recientes")}</SelectItem><SelectItem value="price_asc">{i18n.t("explore:explorepage_menor_precio")}</SelectItem><SelectItem value="price_desc">{i18n.t("explore:explorepage_mayor_precio")}</SelectItem>
                </SelectContent>
              </Select>
              <Select value={rooms || 'all'} onValueChange={value => setRooms(value === 'all' ? '' : value)}>
                <SelectTrigger aria-label={i18n.t("explore:explorepage_habitaciones_minimas")} className="w-full sm:w-auto sm:max-w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{i18n.t("explore:explorepage_habitaciones")}</SelectItem>
                  <SelectItem value="1">{i18n.t("explore:explorepage_1_habitaciones")}</SelectItem>
                  <SelectItem value="2">{i18n.t("explore:explorepage_2_habitaciones")}</SelectItem>
                  <SelectItem value="3">{i18n.t("explore:explorepage_3_habitaciones")}</SelectItem>
                  <SelectItem value="4">{i18n.t("explore:explorepage_4_habitaciones")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {filtersOpen && (
              <div id="explore-filters" className="expanded-filters">
                <fieldset aria-busy={servicesLoading}>
                  <legend className="filter-section-label">{i18n.t("explore:explorepage_servicios_incluidos")}</legend>
                  <p>{i18n.t("explore:explorepage_la_propiedad_debe_contar_con_todos_los_servicios_seleccionados")}</p>
                  {servicesLoading ? (
                    <p role="status">{i18n.t("explore:explorepage_cargando_servicios")}</p>
                  ) : servicesError ? (
                    <div role="alert">
                      <p>{servicesError}</p>
                      <button
                        className="text-button"
                        onClick={() => {
                          setServicesAttempt((n) => n + 1)
                        }}
                      >{i18n.t("explore:explorepage_reintentar_servicios")}</button>
                    </div>
                  ) : availableServices.length === 0 ? (
                    <p>{i18n.t("explore:explorepage_no_hay_servicios_en_el_catalogo_todavia")}</p>
                  ) : (
                    <div className="service-filters">
                      {availableServices.map((service) => (
                        <label
                          key={service.id}
                          title={catalogText(service, 'description') || undefined}
                        >
                          <input
                            type="checkbox"
                            checked={services.includes(service.id)}
                            onChange={() =>
                              setServices((current) =>
                                current.includes(service.id)
                                  ? current.filter((id) => id !== service.id)
                                  : [...current, service.id],
                              )
                            }
                          />
                          <ServiceIcon name={service.icono} size={15} className="inline-block shrink-0 align-middle" /> {catalogText(service)}
                        </label>
                      ))}
                    </div>
                  )}
                </fieldset>
                <button className="text-button" onClick={resetFilters}>{i18n.t("explore:explorepage_limpiar_filtros")}</button>
              </div>
            )}
          </div>
          <div className="result-summary" role="status">
            {loading
              ? i18n.t("explore:explorepage_buscando_tu_proximo_hogar")
              : error
                ? i18n.t("explore:explorepage_busqueda_no_disponible")
                : i18n.t('common:availableCount', { count: filtered.length })}
            <span>
              <span className="status-dot" />{' '}{i18n.t("explore:explorepage_publicadas")}</span>
          </div>
          <div className="property-list" aria-busy={loading}>
            {loading ? (
              <div className="empty-state">
                <Building2 size={36} />
                <h2>{i18n.t("explore:explorepage_cargando_propiedades")}</h2>
                <p>{i18n.t("explore:explorepage_estamos_consultando_las_publicaciones_disponibles")}</p>
              </div>
            ) : error ? (
              <div className="empty-state" role="alert">
                <h2>{i18n.t("explore:explorepage_no_se_pudieron_cargar")}</h2>
                <p>{error}</p>
                <button
                  onClick={() => {
                    setAttempt((n) => n + 1)
                  }}
                >{i18n.t("comments:propertycomments_reintentar")}</button>
              </div>
            ) : filtered.length === 0 ? (
              <div className="empty-state">
                <Search size={36} />
                <h2>{i18n.t("explore:explorepage_no_hay_propiedades_disponibles")}</h2>
                <p>
                  {hasFilters
                    ? i18n.t("explore:explorepage_prueba_otra_zona_o_ajusta_tus_filtros")
                    : i18n.t("explore:explorepage_las_nuevas_publicaciones_apareceran_aqui")}
                </p>
                {hasFilters && (
                  <button onClick={resetFilters}>{i18n.t("explore:explorepage_limpiar_filtros")}</button>
                )}
              </div>
            ) : (
              <>
                {missingLocations > 0 && (
                  <p className="location-note">
                    <MapPin size={15} />
                    {missingLocations}{' '}{i18n.t("explore:explorepage_sin_ubicacion_en_el_mapa_puedes_consultar_su_direccion")}</p>
                )}
                {filtered.map((property) => (
                  <article
                    key={property.id}
                    id={`property-${property.id}`}
                    className={`property-result ${selected === property.id ? 'selected' : ''}`}
                  >
                    <button
                      className="property-select"
                      onClick={() => setSelected(property.id)}
                      aria-pressed={selected === property.id}
                      aria-label={i18n.t("explore:explorepage_seleccionar_al_mes", { v0: property.title, v1: priceLabel(property) })}
                    >
                      <div className="property-photo">
                        <PropertyPhoto property={property} />
                        <span className="available-badge">
                          <span className="status-dot" />
                          {property.reservedTenantId ? i18n.t("dashboard:recentsavedsection_reservada") : i18n.t("explore:explorepage_disponible")}
                        </span>
                      </div>
                      <div className="property-info">
                        <div className="property-heading">
                          <h2>{property.title}</h2>
                          <p className="property-price">
                            {priceLabel(property)}
                            <small>{i18n.t("common:perMonth")}</small>
                          </p>
                        </div>
                        <PriceDetails price={property.displayPrice} />
                        <p className="property-address">
                          <MapPin size={14} />
                          {property.address}
                        </p>
                        <div className="property-facts">
                          <span>
                            <BedDouble size={16} />
                            {property.rooms}{' '}{i18n.t("explore:explorepage_hab")}</span>
                          <span>
                            <Users size={16} />
                            {property.guest}{' '}
                            {i18n.t('common:person', { count: property.guest })}
                          </span>
                        </div>
                        <div className="property-bottom">
                          <div className="property-services">
                            {property.services?.slice(0, 3).map((service) => (
                              <span key={service.id}><ServiceIcon name={service.icono} size={15} className="inline-block shrink-0 align-middle" /> {catalogText(service)}</span>
                            ))}
                          </div>
                          <span
                            className={
                              coordinates(property)
                                ? 'location-tag'
                                : 'no-location'
                            }
                          >
                            <LocateFixed size={13} />
                            {coordinates(property)
                              ? i18n.t("explore:explorepage_ver_ubicacion")
                              : i18n.t("explore:explorepage_sin_coordenadas")}
                          </span>
                        </div>
                      </div>
                    </button>
                    {selected === property.id && (
                      <div className="property-description">
                        <div>
                          <p>{property.description}</p>
                          {(property.services?.length || 0) > 3 && (
                            <p>{i18n.t("explore:explorepage_servicios")}{' '}
                              {property.services?.map((s) => catalogText(s)).join(', ')}
                            </p>
                          )}
                        </div>
                        <a
                          className="property-details-button"
                          href={`/property_detail/${property.id}`}
                        >{i18n.t("dashboard:reservedpropertysection_ver_detalles")}</a>
                      </div>
                    )}
                  </article>
                ))}
              </>
            )}
          </div>
        </section>
        <div className="map-panel">
          <PropertyMap
            properties={filtered}
            selected={activeProperty?.id ?? null}
            onSelect={selectFromMap}
          />
          {activeProperty && (
            <div className="selected-map-property">
              <div>
                <strong>{activeProperty.title}</strong>
                <p>
                  {priceLabel(activeProperty)}{' '}{i18n.t('common:perMonthDot')}{' '}{activeProperty.address}
                </p>
                {!coordinates(activeProperty) && (
                  <p>{i18n.t("explore:explorepage_esta_propiedad_todavia_no_tiene_coordenadas")}</p>
                )}
              </div>
              <button
                onClick={() => setSelected(null)}
                aria-label={i18n.t("explore:explorepage_cerrar_seleccion")}
              >
                <X size={18} />
              </button>
            </div>
          )}
        </div>
        <button
          className="mobile-view-toggle"
          onClick={() =>
            setMobileView((view) => (view === 'list' ? 'map' : 'list'))
          }
        >
          <MapPin size={18} />
          {mobileView === 'list' ? i18n.t("explore:explorepage_ver_mapa") : i18n.t("explore:explorepage_ver_lista")}
        </button>
      </main>
    </div>
  )
}

function PropertyPhoto({ property }: { property: Property }) {
  useTranslation();
  const [failed, setFailed] = useState(false)
  const url = photoUrl(property)
  return url && !failed ? (
    <img
      src={url}
      alt={property.title}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  ) : (
    <div className="photo-placeholder">
      <Building2 size={38} />
      <span>{i18n.t("explore:explorepage_sin_fotografia")}</span>
    </div>
  )
}
