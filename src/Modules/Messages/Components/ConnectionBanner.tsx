import { useTranslation } from 'react-i18next';
import i18n from '../../../i18n/instance';
import { WifiOff } from 'lucide-react'
import { useOnlineStatus } from '../hooks/useOnlineStatus'

/** Aviso sin conexión: los mensajes quedan en cola y salen solos al reconectar. */
export default function ConnectionBanner() {
  useTranslation();
  const online = useOnlineStatus()
  if (online) return null

  return (
    <div role="status" className="flex items-center gap-2 border-b border-amber-200 bg-amber-50 px-4 py-2 text-xs text-amber-900">
      <WifiOff className="size-4 shrink-0" aria-hidden="true" />{i18n.t("messages:connectionbanner_sin_conexion_tus_mensajes_se_enviaran_cuando_vuelva_internet")}</div>
  )
}
