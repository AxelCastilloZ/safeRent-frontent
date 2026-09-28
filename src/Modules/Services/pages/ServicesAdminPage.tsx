import ServiceActions from '../components/ServiceActions'
import EditServiceModal from '../components/EditServiceModal'
import type { Service } from '../interfaces/service.interface'
import { useRef, useState, type FormEvent } from 'react'
import { Link } from '@tanstack/react-router'
import {
  // ArrowLeft,
  // ArrowUpRight,
  Check,
  CheckCircle2,
  LayoutGrid,
  // LoaderCircle,
  Plus,
  Search,
  ShieldCheck,
  // Sparkles,
} from 'lucide-react'
import { useCreateService, useServices } from '../hooks/useServices'
import { serviceIcons } from '../icons/serviceIcons'
import ServiceIcon from '../components/ServiceIcon'
import './services-admin.css'

const normalize = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()

export default function ServicesAdminPage() {
  const [editing, setEditing] = useState<Service | null>(null)
  const catalog = useServices()
  const mutation = useCreateService()
  const submitting = useRef(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [icono, setIcono] = useState('wifi')
  const [iconSearch, setIconSearch] = useState('')
  const [catalogSearch, setCatalogSearch] = useState('')
  const [validation, setValidation] = useState('')
  const [success, setSuccess] = useState('')
  const icons = serviceIcons.filter((icon) =>
    normalize(icon.label + ' ' + icon.name).includes(normalize(iconSearch)),
  )
  const services = (catalog.data || []).filter((service) =>
    normalize(service.name + ' ' + (service.description || '')).includes(
      normalize(catalogSearch),
    ),
  )
  const selectedIcon = serviceIcons.find((icon) => icon.name === icono)!

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (submitting.current) return
    setValidation('')
    setSuccess('')
    mutation.reset()
    if (!name.trim()) {
      setValidation('Escribe un nombre para el servicio.')
      return
    }
    if (name.trim().length > 100 || description.trim().length > 255) {
      setValidation('Revisa la longitud del nombre y la descripción.')
      return
    }
    if (
      catalog.data?.some(
        (service) =>
          service.name.trim().toLowerCase() === name.trim().toLowerCase(),
      )
    ) {
      setValidation('Ya existe un servicio con ese nombre.')
      return
    }
    submitting.current = true
    try {
      const created = await mutation.mutateAsync({ name, icono, description })
      setSuccess(
        'Servicio «' +
          created.name +
          '» creado. Ya está disponible para los hospedajes.',
      )
      setName('')
      setDescription('')
      setIconSearch('')
      setCatalogSearch('')
    } catch {
      // The mutation exposes the server error and preserves the form for retry.
    } finally {
      submitting.current = false
    }
  }

  return (
    <div className="services-admin">
      {editing && <EditServiceModal key={editing.id} service={editing} catalog={catalog.data || []} onClose={() => setEditing(null)} onSaved={updated => { setEditing(null); setSuccess('Servicio «' + updated.name + '» actualizado.'); }} />}
      <header className="sa-header">
        <Link to="/" className="sa-brand">
          <img src="/LogoSafeRentAzul.png" alt="" />
          SafeRent
        </Link>
        <span className="sa-admin-label">
          <ShieldCheck size={15} /> Administración
        </span>
        {/* <Link to="/" className="sa-explore">
          Ver hospedajes <ArrowUpRight size={16} />
        </Link> */}
      </header>
      <div className="sa-shell">
        {/* <aside className="sa-sidebar">
          <p className="sa-overline">ESPACIO DE ADMINISTRACIÓN</p>
          <Link
            to="/admin/servicios"
            aria-current="page"
            className="sa-nav-active"
          >
            <LayoutGrid size={19} />
            Servicios
          </Link>
          <div className="sa-sidebar-note">
            <Sparkles size={21} />
            <strong>Los detalles hacen un hogar</strong>
            <p>
              Ayuda a identificar lo que ofrece cada hospedaje con servicios
              claros y fáciles de reconocer.
            </p>
          </div>
          <Link to="/" className="sa-return">
            <ArrowLeft size={16} />
            Volver al inicio
          </Link>
        </aside> */}
        <main className="sa-main">
          <div className="sa-heading">
            <div>
              <p className="sa-overline">CATÁLOGO DE HOSPEDAJES</p>
              {/* <h1>Servicios que hacen la diferencia</h1> */}
              <p>
                Crea las opciones que los propietarios podrán agregar a sus
                hospedajes.
              </p>
            </div>
            <span className="sa-count">
              <LayoutGrid size={16} />
              {catalog.data
                ? catalog.data.length + ' servicios'
                : 'Catálogo de servicios'}
            </span>
          </div>
          {success && (
            <div className="sa-success" role="status">
              <CheckCircle2 size={20} />
              {success}
            </div>
          )}
          <div className="sa-create-grid">
            <section className="sa-panel">
              <div className="sa-panel-title">
                <span className="sa-title-icon">
                  <Plus size={21} />
                </span>
                <div>
                  <h2>Crear un servicio</h2>
                  {/* <p>Un nombre, un icono y todo listo.</p> */}
                </div>
              </div>
              <form onSubmit={submit}>
                <fieldset
                  disabled={mutation.isPending}
                  className="sa-form-fields"
                >
                  <label htmlFor="service-name">
                    Nombre del servicio <span aria-hidden="true">*</span>
                  </label>
                  <input
                    id="service-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    maxLength={100}
                    required
                    placeholder="Ej. Internet de alta velocidad"
                    aria-describedby={validation ? 'service-error' : undefined}
                  />
                  <div className="sa-label-row">
                    <label htmlFor="service-description">
                      Descripción <span className="sa-optional">Opcional</span>
                    </label>
                    <span>{description.length}/255</span>
                  </div>
                  <textarea
                    id="service-description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    maxLength={255}
                    rows={3}
                    placeholder="Describe brevemente qué incluye este servicio."
                  />
                  <fieldset className="sa-icon-fieldset">
                    <legend>
                      Elige un icono{' '}
                      <span className="sa-optional">{selectedIcon.label}</span>
                    </legend>
                    <label className="sa-search">
                      <Search size={17} />
                      <input
                        aria-label="Buscar iconos"
                        placeholder="Buscar agua, internet, cocina…"
                        value={iconSearch}
                        onChange={(e) => setIconSearch(e.target.value)}
                      />
                    </label>
                    <div className="sa-icon-grid">
                      {icons.map(({ name: key, label, Icon }) => (
                        <button
                          key={key}
                          type="button"
                          aria-label={'Icono: ' + label}
                          aria-pressed={icono === key}
                          className={
                            'sa-icon-option' +
                            (icono === key ? ' selected' : '')
                          }
                          onClick={() => setIcono(key)}
                          title={label}
                        >
                          <Icon size={23} />
                          <span>{label}</span>
                          {icono === key && (
                            <Check size={12} className="sa-icon-check" />
                          )}
                        </button>
                      ))}
                    </div>
                    {icons.length === 0 && (
                      <p className="sa-muted" role="status">
                        No encontramos ese icono. Prueba otra palabra.
                      </p>
                    )}
                  </fieldset>
                </fieldset>
                {(validation || mutation.error) && (
                  <p id="service-error" className="sa-error" role="alert">
                    {validation || mutation.error?.message}
                  </p>
                )}
                <div className="sa-form-footer">
                  <p>Disponible para todos los hospedajes.</p>
                  {/* <button
                    className="sa-primary"
                    type="submit"
                    disabled={mutation.isPending}
                  >
                    {mutation.isPending ? (
                      <LoaderCircle className="sa-spin" size={17} />
                    ) : (
                      <Plus size={17} />
                    )}
                    {mutation.isPending ? 'Creando…' : 'Crear servicio'}
                  </button> */}
                </div>
              </form>
            </section>
            <aside className="sa-preview-area">
              <p className="sa-overline">VISTA PREVIA</p>
              <h2>Así lo verán los propietarios</h2>
              {/* <p className="sa-muted">Un icono que comunica de un vistazo.</p> */}
              <div className="sa-preview-card">
                <span className="sa-preview-icon">
                  <ServiceIcon name={icono} size={34} />
                </span>
                <h3>{name.trim() || 'Nombre del servicio'}</h3>
                <p>
                  {description.trim() ||
                    'La descripción de tu servicio aparecerá aquí.'}
                </p>
                <span className="sa-preview-chip">
                  <ServiceIcon name={icono} size={16} />
                  {name.trim() || selectedIcon.label}
                </span>
              </div>
              <div className="sa-tip">
                <CheckCircle2 size={18} />
                <p>
                  Usa nombres breves y específicos, como “Agua caliente” o
                  “Estacionamiento”.
                </p>
              </div>
            </aside>
          </div>
          <section className="sa-catalog" aria-labelledby="catalog-heading">
            <div className="sa-catalog-heading">
              <div>
                <h2 id="catalog-heading">Servicios del catálogo</h2>
                <p>Opciones disponibles al crear un hospedaje.</p>
              </div>
              <label className="sa-search">
                <Search size={17} />
                <input
                  aria-label="Buscar servicios del catálogo"
                  placeholder="Buscar un servicio…"
                  value={catalogSearch}
                  onChange={(e) => setCatalogSearch(e.target.value)}
                />
              </label>
            </div>
            {catalog.isPending ? (
              <p className="sa-empty" role="status">
                Cargando servicios…
              </p>
            ) : catalog.isError ? (
              <div className="sa-empty" role="alert">
                <p>No pudimos cargar el catálogo. {catalog.error.message}</p>
                <button
                  className="sa-secondary"
                  onClick={() => void catalog.refetch()}
                  disabled={catalog.isFetching}
                >
                  Reintentar
                </button>
              </div>
            ) : services.length === 0 ? (
              <div className="sa-empty">
                <LayoutGrid size={28} />
                <h3>
                  {catalogSearch
                    ? 'No hay coincidencias'
                    : 'Tu catálogo empieza aquí'}
                </h3>
                <p>
                  {catalogSearch
                    ? 'Prueba con otro nombre.'
                    : 'Crea el primer servicio usando el formulario de arriba.'}
                </p>
              </div>
            ) : (
              <div className="sa-catalog-grid">
                {services.map((service) => (
                  <article className="sa-service-card" key={service.id}>
                    <ServiceActions name={service.name} onEdit={() => setEditing(service)} />
                    <span className="sa-catalog-icon">
                      <ServiceIcon name={service.icono} size={23} />
                    </span>
                    <div>
                      <h3>{service.name}</h3>
                      <p>{service.description || 'Sin descripción'}</p>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  )
}
