import { errorMessage } from '../../../i18n/messages';
import { catalogTranslations, completeTranslations, type CatalogTranslations } from '../../../i18n/catalog';
import CatalogTranslationsEditor from './CatalogTranslationsEditor';
import { message } from '../../../i18n/messages';
import { useMessageState } from '../../../i18n/useMessageState';
import { useTranslation } from 'react-i18next';
import i18n from '../../../i18n/instance';
import { useEffect, useRef, useState, type FormEvent } from 'react'
import { createPortal } from 'react-dom'
import { Check, LoaderCircle, Save, Search, X } from 'lucide-react'
import type { Service } from '../interfaces/service.interface'
import { serviceIcons } from '../icons/serviceIcons'
import { useUpdateService } from '../hooks/useServices'
import ServiceIcon from './ServiceIcon'
const normalize = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
export default function EditServiceModal({
  service,
  catalog,
  onClose,
  onSaved,
}: {
  service: Service
  catalog: Service[]
  onClose: () => void
  onSaved: (service: Service) => void
}) {
  useTranslation();
  const dialog = useRef<HTMLDialogElement>(null)
  const submitting = useRef(false)
  const mutation = useUpdateService()
  const [name, setName] = useState(service.name)
  const [translations, setTranslations] = useState<CatalogTranslations>(() => catalogTranslations(service))
  const [description, setDescription] = useState(service.description || '')
  const [icono, setIcono] = useState<string | null>(service.icono ?? null)
  const [search, setSearch] = useState('')
  const [validation, setValidation] = useMessageState('')
  const icons = serviceIcons().filter((icon) =>
    normalize(icon.label + ' ' + icon.name).includes(normalize(search)),
  )
  useEffect(() => {
    const element = dialog.current!
    const overflow = document.body.style.overflow
    element.showModal()
    document.body.style.overflow = 'hidden'
    return () => {
      element.close()
      document.body.style.overflow = overflow
    }
  }, [])
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (submitting.current) return
    setValidation('')
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
      catalog.some(
        (item) =>
          item.id !== service.id &&
          normalize(item.name.trim()) === normalize(name.trim()),
      )
    ) {
      setValidation(message("services:editservicemodal_ya_existe_otro_servicio_con_ese_nombre"))
      return
    }
    if (!completeTranslations(translations, description)) { setValidation(message('catalog:incomplete')); return }
    submitting.current = true
    try {
      const updated = await mutation.mutateAsync({
        id: service.id,
        input: { name, icono, description: description.trim() || null, translations: { ...translations, es: { name, description } } },
      })
      onSaved(updated)
    } catch {
      // Preserve the edited values on failure so the user can retry.
    } finally {
      submitting.current = false
    }
  }
  return createPortal(
    <div className="services-admin sa-modal-scope">
      <dialog
        ref={dialog}
        className="sa-edit-modal"
        aria-labelledby="edit-service-title"
        aria-describedby="edit-service-subtitle"
        onCancel={(event) => {
          event.preventDefault()
          if (!submitting.current) onClose()
        }}
      >
        <div className="sa-modal-heading">
          <div>
            <h2 id="edit-service-title">{i18n.t("services:editservicemodal_editar_servicio")}</h2>
            <p id="edit-service-subtitle">{i18n.t("services:editservicemodal_actualiza_el_servicio_del_catalogo_y_su_icono")}</p>
          </div>
          <button
            type="button"
            className="sa-more-button"
            aria-label={i18n.t("services:editservicemodal_cerrar_edicion")}
            disabled={mutation.isPending}
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>
        <form noValidate onSubmit={submit}>
          <fieldset className="sa-form-fields" disabled={mutation.isPending}>
            <label htmlFor="edit-service-name">{i18n.t("services:editservicemodal_nombre_del_servicio")}</label>
            <input
              id="edit-service-name"
              required
              maxLength={100}
              value={name}
              onChange={(event) => setName(event.target.value)}
              aria-describedby={validation ? 'edit-service-error' : undefined}
            />
            <div className="sa-label-row">
              <label htmlFor="edit-service-description">{i18n.t("property:propertyformlayout_descripcion")}{' '}<span className="sa-optional">{i18n.t("services:editservicemodal_opcional")}</span>
              </label>
              <span>{description.length}/255</span>
            </div>
            <textarea
              id="edit-service-description"
              maxLength={255}
              rows={3}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
            <fieldset className="sa-icon-fieldset">
              <legend>{i18n.t("services:editservicemodal_icono_del_servicio")}</legend>
              <div className="sa-current-icon">
                <ServiceIcon name={icono} size={25} />
                <span>
                  {name.trim() || i18n.t("services:editservicemodal_servicio")}
                  <small>
                    {serviceIcons().find((icon) => icon.name === icono)?.label ||
                      i18n.t("services:editservicemodal_icono_actual")}
                  </small>
                </span>
              </div>
              <label className="sa-search">
                <Search size={17} />
                <input
                  aria-label={i18n.t("services:editservicemodal_buscar_iconos_para_editar")}
                  placeholder={i18n.t("services:editservicemodal_buscar_agua_internet_cocina")}
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
              </label>
              <div className="sa-icon-grid">
                {icons.map(({ name: key, label, Icon }) => (
                  <button
                    type="button"
                    key={key}
                    aria-label={i18n.t("services:editservicemodal_icono") + label}
                    aria-pressed={icono === key}
                    className={
                      'sa-icon-option' + (icono === key ? ' selected' : '')
                    }
                    onClick={() => setIcono(key)}
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
            <p className="sa-error" id="edit-service-error" role="alert">
              {validation || errorMessage(mutation.error)}
            </p>
          )}
          <div className="sa-form-footer sa-modal-footer">
            <button
              className="sa-cancel-button"
              type="button"
              disabled={mutation.isPending}
              onClick={onClose}
            >{i18n.t("comments:admincommentspage_cancelar")}</button>
            <button
              className="sa-primary"
              type="submit"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? (
                <LoaderCircle size={17} className="sa-spin" />
              ) : (
                <Save size={17} />
              )}
              {mutation.isPending ? i18n.t("comments:admincommentspage_guardando") : i18n.t("property:createpropertylocationpage_guardar_cambios")}
            </button>
          </div>
        </form>
      </dialog>
    </div>,
    document.body,
  )
}
