import { errorMessage } from '../../../i18n/messages';
import { useTranslation } from 'react-i18next';
import i18n from '../../../i18n/instance';
import { useAuth } from '../../Auth/hooks/authHooks'
import type { Conversation } from '../../Messages/types/message'
import { useReserveProperty } from '../hooks/useReserveProperty'

export default function ReservePropertyButton({ conversation }: { conversation: Conversation }) {
  useTranslation();
  const { user } = useAuth()
  const reserve = useReserveProperty(conversation.id)
  const property = conversation.property
  // Las conversaciones directas (administrador ↔ usuario) no tienen propiedad que alquilar.
  if (!property || user?.id !== property.owner.id || !user.roles.includes('OWNER')) return null

  let error = ''
  if (reserve.error) {
    error = errorMessage(reserve.error, i18n.t("reservations:reservepropertybutton_no_se_pudo_reservar_la_propiedad_intenta_nuevamente"))
  }
  return <div className="flex max-w-xs flex-col items-end gap-1">
    <button type="button" onClick={() => reserve.mutate()}
      disabled={reserve.isPending || Boolean(property.reservedTenantId) || property.status !== 'ACTIVE'}
      title={property.status !== 'ACTIVE' ? i18n.t("reservations:reservepropertybutton_la_propiedad_debe_estar_aprobada_y_activa_para_alquilarla") : undefined}
      className="rounded-lg bg-secondary px-3 py-2 text-xs font-bold text-white hover:bg-secondary-dark disabled:cursor-not-allowed disabled:opacity-60">
      {property.reservedTenantId ? i18n.t("reservations:reservepropertybutton_propiedad_reservada") : reserve.isPending ? i18n.t("reservations:reservepropertybutton_reservando") : i18n.t("reservations:reservepropertybutton_alquilar_a_esta_persona")}
    </button>
    {error && <p role="alert" className="text-xs text-red-700">{error}</p>}
  </div>
}
