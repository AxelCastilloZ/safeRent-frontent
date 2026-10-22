import { errorMessage } from '../../../i18n/messages';
import { completeTranslations, type CatalogTranslations } from '../../../i18n/catalog';
import CatalogTranslationsEditor from '../components/CatalogTranslationsEditor';
import { catalogText } from '../../../i18n/catalog';
import { message } from '../../../i18n/messages';
import { useMessageState } from '../../../i18n/useMessageState';
import { useTranslation } from 'react-i18next';
import i18n from '../../../i18n/instance';
import LanguageSelector from '../../../i18n/LanguageSelector';
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
  LoaderCircle,
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
  useTranslation();
  const [editing, setEditing] = useState<Service | null>(null)
  const catalog = useServices()
  const mutation = useCreateService()
  const submitting = useRef(false)
  const [name, setName] = useState('')
  const [translations, setTranslations] = useState<CatalogTranslations>({})
  const [description, setDescription] = useState('')
  const [icono, setIcono] = useState('wifi')
  const [iconSearch, setIconSearch] = useState('')
  const [catalogSearch, setCatalogSearch] = useState('')
  const [validation, setValidation] = useMessageState('')
  const [success, setSuccess] = useMessageState('')
  const icons = serviceIcons().filter((icon) =>
    normalize(icon.label + ' ' + icon.name).includes(normalize(iconSearch)),
  )
  const services = (catalog.data || []).filter((service) =>
    normalize(catalogText(service) + ' ' + (catalogText(service, 'description') || '')).includes(
      normalize(catalogSearch),
    ),
  )
  const selectedIcon = serviceIcons().find((icon) => icon.name === icono)!

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (submitting.current) return
    setValidation('')
    setSuccess('')
    mutation.reset()
    if (!name.trim()) {
      setValidation(message("services:editservicemodal_escribe_un_nombre_para_el_servicio"))
      return
    }
    if (name.trim().length > 100 || description.trim().length > 255) {
      setValidation(message("services:editservicemodal_revisa_la_longitud_del_nombre_y_la_descripcion"))
      return
    }
    if (
      catalog.data?.some(
        (service) =>
          service.name.trim().toLowerCase() === name.trim().toLowerCase(),
      )
    ) {
      setValidation(message("services:servicesadminpage_ya_existe_un_servicio_con_ese_nombre"))
      return
    }
    if (!completeTranslations(translations, description)) { setValidation(message('catalog:incomplete')); return }
    submitting.current = true
    try {
      const created = await mutation.mutateAsync({ name, icono, description, translations: { ...translations, es: { name, description } } })
      setSuccess(message('catalog:created', { name: created.name }))
      setTranslations({})
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
      {editing && <EditServiceModal key={editing.id} service={editing} catalog={catalog.data || []} onClose={() => setEditing(null)} onSaved={updated => { setEditing(null); setSuccess(message('catalog:updated', { name: updated.name })); }} />}
      <header className="sa-header">
        <Link to="/" className="sa-brand">
          <img src="/LogoSafeRentAzul.png" alt="" />
          SafeRent
        </Link>
        <span className="sa-admin-label">
          <ShieldCheck size={15} />{' '}{i18n.t("services:servicesadminpage_administracion")}</span>
        <div className="ml-auto"><LanguageSelector /></div>
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
              <p className="sa-overline">{i18n.t("services:servicesadminpage_catalogo_de_hospedajes")}</p>
              {/* <h1>Servicios que hacen la diferencia</h1> */}
              <p>{i18n.t("services:servicesadminpage_crea_las_opciones_que_los_propietarios_podran_agregar_a")}</p>
            </div>
            <span className="sa-count">
              <LayoutGrid size={16} />
              {catalog.data
                ? catalog.data.length + i18n.t("services:servicesadminpage_servicios")
                : i18n.t("services:servicesadminpage_catalogo_de_servicios")}
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
                  <h2>{i18n.t("services:servicesadminpage_crear_un_servicio")}</h2>
                  {/* <p>Un nombre, un icono y todo listo.</p> */}
                </div>
              </div>
              <form noValidate onSubmit={submit}>
                <fieldset
                  disabled={mutation.isPending}
                  className="sa-form-fields"
                >
                  <label htmlFor="service-name">{i18n.t("services:editservicemodal_nombre_del_servicio")}{' '}<span aria-hidden="true">*</span>
                  </label>
                  <input
                    id="service-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    maxLength={100}
                    required
                    placeholder={i18n.t("services:servicesadminpage_ej_internet_de_alta_velocidad")}
                    aria-describedby={validation ? 'service-error' : undefined}
                  />
                  <div className="sa-label-row">
                    <label htmlFor="service-description">{i18n.t("property:propertyformlayout_descripcion")}{' '}<span className="sa-optional">{i18n.t("services:editservicemodal_opcional")}</span>
                    </label>
                    <span>{description.length}/255</span>
                  </div>
                  <textarea
                    id="service-description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    maxLength={255}
                    rows={3}
                    placeholder={i18n.t("services:servicesadminpage_describe_brevemente_que_incluye_este_servicio")}
                  />
                  <fieldset className="sa-icon-fieldset">
                    <legend>{i18n.t("services:servicesadminpage_elige_un_icono")}{' '}
                      <span className="sa-optional">{selectedIcon.label}</span>
                    </legend>
                    <label className="sa-search">
                      <Search size={17} />
                      <input
                        aria-label={i18n.t("services:servicesadminpage_buscar_iconos")}
                        placeholder={i18n.t("services:editservicemodal_buscar_agua_internet_cocina")}
                        value={iconSearch}
                        onChange={(e) => setIconSearch(e.target.value)}
                      />
                    </label>
                    <div className="sa-icon-grid">
                      {icons.map(({ name: key, label, Icon }) => (
                        <button
                          key={key}
                          type="button"
                          aria-label={i18n.t("services:editservicemodal_icono") + label}
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
                      <p className="sa-muted" role="status">{i18n.t("services:editservicemodal_no_encontramos_ese_icono_prueba_otra_palabra")}</p>
                    )}
                  </fieldset>
                </fieldset>
                <CatalogTranslationsEditor value={translations} onChange={setTranslations} disabled={mutation.isPending} />
          {(validation || mutation.error) && (
                  <p id="service-error" className="sa-error" role="alert">
                    {validation || errorMessage(mutation.error)}
                  </p>
                )}
                <div className="sa-form-footer">
                  <p>{i18n.t("services:servicesadminpage_disponible_para_todos_los_hospedajes")}</p>
                  <button
                    className="sa-primary"
                    type="submit"
                    disabled={mutation.isPending}
                  >
                    {mutation.isPending ? (
                      <LoaderCircle className="sa-spin" size={17} />
                    ) : (
                      <Plus size={17} />
                    )}
                    {mutation.isPending ? i18n.t('catalog:creating') : i18n.t('services:servicesadminpage_crear_un_servicio')}
                  </button>
                </div>
              </form>
            </section>
            <aside className="sa-preview-area">
              <p className="sa-overline">{i18n.t("services:servicesadminpage_vista_previa")}</p>
              <h2>{i18n.t("services:servicesadminpage_asi_lo_veran_los_propietarios")}</h2>
              {/* <p className="sa-muted">Un icono que comunica de un vistazo.</p> */}
              <div className="sa-preview-card">
                <span className="sa-preview-icon">
                  <ServiceIcon name={icono} size={34} />
                </span>
                <h3>{name.trim() || i18n.t("services:editservicemodal_nombre_del_servicio")}</h3>
                <p>
                  {description.trim() ||
                    i18n.t("services:servicesadminpage_la_descripcion_de_tu_servicio_aparecera_aqui")}
                </p>
                <span className="sa-preview-chip">
                  <ServiceIcon name={icono} size={16} />
                  {name.trim() || selectedIcon.label}
                </span>
              </div>
              <div className="sa-tip">
                <CheckCircle2 size={18} />
                <p>{i18n.t("services:servicesadminpage_usa_nombres_breves_y_especificos_como_agua_caliente_o")}</p>
              </div>
            </aside>
          </div>
          <section className="sa-catalog" aria-labelledby="catalog-heading">
            <div className="sa-catalog-heading">
              <div>
                <h2 id="catalog-heading">{i18n.t("services:servicesadminpage_servicios_del_catalogo")}</h2>
                <p>{i18n.t("services:servicesadminpage_opciones_disponibles_al_crear_un_hospedaje")}</p>
              </div>
              <label className="sa-search">
                <Search size={17} />
                <input
                  aria-label={i18n.t("services:servicesadminpage_buscar_servicios_del_catalogo")}
                  placeholder={i18n.t("services:servicesadminpage_buscar_un_servicio")}
                  value={catalogSearch}
                  onChange={(e) => setCatalogSearch(e.target.value)}
                />
              </label>
            </div>
            {catalog.isPending ? (
              <p className="sa-empty" role="status">{i18n.t("explore:explorepage_cargando_servicios")}</p>
            ) : catalog.isError ? (
              <div className="sa-empty" role="alert">
                <p>{i18n.t("services:servicesadminpage_no_pudimos_cargar_el_catalogo")}{' '}{errorMessage(catalog.error)}</p>
                <button
                  className="sa-secondary"
                  onClick={() => void catalog.refetch()}
                  disabled={catalog.isFetching}
                >{i18n.t("comments:propertycomments_reintentar")}</button>
              </div>
            ) : services.length === 0 ? (
              <div className="sa-empty">
                <LayoutGrid size={28} />
                <h3>
                  {catalogSearch
                    ? i18n.t("services:servicesadminpage_no_hay_coincidencias")
                    : i18n.t("services:servicesadminpage_tu_catalogo_empieza_aqui")}
                </h3>
                <p>
                  {catalogSearch
                    ? i18n.t("services:servicesadminpage_prueba_con_otro_nombre")
                    : i18n.t("services:servicesadminpage_crea_el_primer_servicio_usando_el_formulario_de_arriba")}
                </p>
              </div>
            ) : (
              <div className="sa-catalog-grid">
                {services.map((service) => (
                  <article className="sa-service-card" key={service.id}>
                    <ServiceActions name={catalogText(service)} onEdit={() => setEditing(service)} />
                    <span className="sa-catalog-icon">
                      <ServiceIcon name={service.icono} size={23} />
                    </span>
                    <div>
                      <h3>{catalogText(service)}</h3>
                      <p>{catalogText(service, 'description') || i18n.t("services:servicesadminpage_sin_descripcion")}</p>
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
