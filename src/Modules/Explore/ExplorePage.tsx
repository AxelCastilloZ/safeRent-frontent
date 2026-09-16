import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  BedDouble,
  Building2,
  ChevronRight,
  LocateFixed,
  MapPin,
  Search,
  SlidersHorizontal,
  Users,
  X,
} from 'lucide-react'
import PropertyMap from './PropertyMap'
import {
  coordinates,
  getProperties,
  normalize,
  photoUrl,
  priceLabel,
  type Property,
} from './properties'
import './explore.css'

export default function ExplorePage() {
  const params = new URLSearchParams(window.location.search)
  const [query, setQuery] = useState(params.get('q') || '')
  const [currency, setCurrency] = useState(params.get('currency') || '')
  const [minPrice, setMinPrice] = useState(params.get('min') || '')
  const [maxPrice, setMaxPrice] = useState(params.get('max') || '')
  const [rooms, setRooms] = useState('')
  const [services, setServices] = useState<number[]>([])
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [properties, setProperties] = useState<Property[]>([])
  const [selected, setSelected] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [attempt, setAttempt] = useState(0)
  const [mobileView, setMobileView] = useState('list')

  useEffect(() => {
    const controller = new AbortController()
    getProperties(controller.signal)
      .then(setProperties)
      .catch((reason: unknown) => {
        if (!controller.signal.aborted)
          setError(
            reason instanceof Error
              ? reason.message
              : 'No se pudo conectar con el servidor.',
          )
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })
    return () => controller.abort()
  }, [attempt])

  const availableServices = useMemo(
    () => [
      ...new Map(
        properties.flatMap((p) => p.services || []).map((s) => [s.id, s]),
      ).values(),
    ],
    [properties],
  )
  const currencies = useMemo(
    () =>
      [
        ...new Set(['CRC', 'USD', ...properties.map((p) => p.typeOfCoin)]),
      ].filter(Boolean),
    [properties],
  )
  const filtered = useMemo(
    () =>
      properties.filter(
        (property) =>
          normalize(`${property.title} ${property.address}`).includes(
            normalize(query.trim()),
          ) &&
          (!currency || property.typeOfCoin === currency) &&
          (!currency ||
            !minPrice ||
            Number(property.cost) >= Number(minPrice)) &&
          (!currency ||
            !maxPrice ||
            Number(property.cost) <= Number(maxPrice)) &&
          (!rooms || property.rooms >= Number(rooms)) &&
          services.every((id) =>
            property.services?.some((service) => service.id === id),
          ),
      ),
    [properties, query, currency, minPrice, maxPrice, rooms, services],
  )
  const activeProperty = filtered.find((p) => p.id === selected)
  const missingLocations = filtered.filter((p) => !coordinates(p)).length
  const selectFromMap = useCallback((id: number) => {
    setSelected(id)
    document
      .getElementById(`property-${id}`)
      ?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  }, [])
  function resetFilters() {
    setQuery('')
    setCurrency('')
    setMinPrice('')
    setMaxPrice('')
    setRooms('')
    setServices([])
  }

  return (
    <div className="explore-page">
      <header className="explore-header">
        <a className="explore-brand" href="/" aria-label="SafeRent, inicio">
          <img src="/LogoSafeRentAzul.png" alt="" />
          SafeRent
        </a>
        <nav aria-label="Navegación principal">
          <a href="/explorar" aria-current="page">
            Explorar
          </a>
          <a href="/#how-it-works">Cómo funciona</a>
          <a href="/#owner-cta">Para propietarios</a>
        </nav>
        <a className="back-home" href="/">
          Ir al inicio <ChevronRight size={16} />
        </a>
      </header>
      <main className="explore-layout" data-mobile-view={mobileView}>
        <section className="explore-results" aria-label="Explorar propiedades">
          <div className="explore-search">
            <p className="explore-eyebrow">ENCUENTRA TU PRÓXIMO HOGAR</p>
            <h1>Explorar propiedades</h1>
            <label className="location-search">
              <Search size={22} />
              <input
                aria-label="Buscar por nombre o ubicación"
                placeholder="Busca una ciudad, zona o propiedad"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
              {query && (
                <button
                  aria-label="Limpiar búsqueda"
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
                <SlidersHorizontal size={16} />
                Filtros{services.length > 0 && ` (${services.length})`}
              </button>
              <select
                aria-label="Moneda"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
              >
                <option value="">Todas las monedas</option>
                {currencies.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <select
                aria-label="Habitaciones mínimas"
                value={rooms}
                onChange={(e) => setRooms(e.target.value)}
              >
                <option value="">Habitaciones</option>
                <option value="1">1+ habitaciones</option>
                <option value="2">2+ habitaciones</option>
                <option value="3">3+ habitaciones</option>
                <option value="4">4+ habitaciones</option>
              </select>
            </div>
            {filtersOpen && (
              <div id="explore-filters" className="expanded-filters">
                <p>
                  Precio mensual{' '}
                  {currency
                    ? `en ${currency}`
                    : '· elige una moneda para filtrar'}
                </p>
                <div className="price-inputs">
                  <label>
                    Desde
                    <input
                      type="number"
                      min="0"
                      disabled={!currency}
                      placeholder="Sin mínimo"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                    />
                  </label>
                  <label>
                    Hasta
                    <input
                      type="number"
                      min="0"
                      disabled={!currency}
                      placeholder="Sin máximo"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                    />
                  </label>
                </div>
                {currency &&
                  minPrice &&
                  maxPrice &&
                  Number(minPrice) > Number(maxPrice) && (
                    <p role="status">
                      El precio mínimo debe ser menor o igual al máximo.
                    </p>
                  )}
                {availableServices.length > 0 && (
                  <fieldset>
                    <legend>Servicios incluidos</legend>
                    <div className="service-filters">
                      {availableServices.map((service) => (
                        <label key={service.id}>
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
                          {service.name}
                        </label>
                      ))}
                    </div>
                  </fieldset>
                )}
                <button className="text-button" onClick={resetFilters}>
                  Limpiar filtros
                </button>
              </div>
            )}
          </div>
          <div className="result-summary" role="status">
            {loading
              ? 'Buscando tu próximo hogar…'
              : `${filtered.length} ${filtered.length === 1 ? 'propiedad disponible' : 'propiedades disponibles'}`}
            <span>
              <span className="status-dot" /> Publicadas
            </span>
          </div>
          <div className="property-list" aria-busy={loading}>
            {loading ? (
              <div className="empty-state">
                <Building2 size={36} />
                <h2>Cargando propiedades</h2>
                <p>Estamos consultando las publicaciones disponibles.</p>
              </div>
            ) : error ? (
              <div className="empty-state" role="alert">
                <h2>No se pudieron cargar</h2>
                <p>{error}</p>
                <button
                  onClick={() => {
                    setLoading(true)
                    setError('')
                    setAttempt((n) => n + 1)
                  }}
                >
                  Reintentar
                </button>
              </div>
            ) : filtered.length === 0 ? (
              <div className="empty-state">
                <Search size={36} />
                <h2>No hay propiedades disponibles</h2>
                <p>
                  {properties.length
                    ? 'Prueba otra zona o ajusta tus filtros.'
                    : 'Las nuevas publicaciones aparecerán aquí.'}
                </p>
                {properties.length > 0 && (
                  <button onClick={resetFilters}>Limpiar filtros</button>
                )}
              </div>
            ) : (
              <>
                {missingLocations > 0 && (
                  <p className="location-note">
                    <MapPin size={15} />
                    {missingLocations} sin ubicación en el mapa; puedes
                    consultar su dirección.
                  </p>
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
                      aria-label={`Seleccionar ${property.title}, ${priceLabel(property)} al mes`}
                    >
                      <div className="property-photo">
                        <PropertyPhoto property={property} />
                        <span className="available-badge">
                          <span className="status-dot" />
                          Disponible
                        </span>
                      </div>
                      <div className="property-info">
                        <div className="property-heading">
                          <h2>{property.title}</h2>
                          <p className="property-price">
                            {priceLabel(property)}
                            <small>/mes</small>
                          </p>
                        </div>
                        <p className="property-address">
                          <MapPin size={14} />
                          {property.address}
                        </p>
                        <div className="property-facts">
                          <span>
                            <BedDouble size={16} />
                            {property.rooms} hab.
                          </span>
                          <span>
                            <Users size={16} />
                            {property.guest} {property.guest === 1 ? 'persona' : 'personas'}
                          </span>
                        </div>
                        <div className="property-bottom">
                          <div className="property-services">
                            {property.services?.slice(0, 3).map((service) => (
                              <span key={service.id}>{service.name}</span>
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
                              ? 'Ver ubicación'
                              : 'Sin coordenadas'}
                          </span>
                        </div>
                      </div>
                    </button>
                    {selected === property.id && (
                      <div className="property-description">
                        <p>{property.description}</p>
                        {(property.services?.length || 0) > 3 && (
                          <p>
                            Servicios:{' '}
                            {property.services?.map((s) => s.name).join(', ')}
                          </p>
                        )}
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
                  {priceLabel(activeProperty)} / mes · {activeProperty.address}
                </p>
                {!coordinates(activeProperty) && (
                  <p>Esta propiedad todavía no tiene coordenadas.</p>
                )}
              </div>
              <button
                onClick={() => setSelected(null)}
                aria-label="Cerrar selección"
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
          {mobileView === 'list' ? 'Ver mapa' : 'Ver lista'}
        </button>
      </main>
    </div>
  )
}

function PropertyPhoto({ property }: { property: Property }) {
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
      <span>Sin fotografía</span>
    </div>
  )
}
