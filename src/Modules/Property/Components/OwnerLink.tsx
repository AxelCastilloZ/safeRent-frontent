import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import i18n from '../../../i18n/instance'

interface OwnerLinkProps {
  ownerId: number
  name: string
  /** Se llama al pulsar el enlace (por ejemplo, para cerrar una ventana que no se cierra sola al navegar). */
  onNavigate?: () => void
}

/**
 * Nombre de un propietario como enlace a la página con sus propiedades publicadas.
 * Se usa en toda pantalla donde aparece el nombre de un propietario, para ahorrar clics.
 */
export default function OwnerLink({ ownerId, name, onNavigate }: OwnerLinkProps) {
  useTranslation()
  return (
    <Link
      to="/owner_properties/$ownerId"
      params={{ ownerId: String(ownerId) }}
      title={i18n.t('property:ownerLinkTitle', { name })}
      onClick={onNavigate}
      className="font-semibold text-primary underline decoration-secondary/50 underline-offset-2 transition hover:text-secondary hover:decoration-secondary"
    >
      {name}
    </Link>
  )
}
