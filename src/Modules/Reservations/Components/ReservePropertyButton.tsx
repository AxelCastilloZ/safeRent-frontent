import { CalendarCheck } from 'lucide-react'
import { errorMessage } from '../../../i18n/messages';
import { useTranslation } from 'react-i18next';
import i18n from '../../../i18n/instance';
import { useAuth } from '../../Auth/hooks/authHooks'
import type { Conversation } from '../../Messages/types/message'
import { useReserveProperty } from '../hooks/useReserveProperty'
import ReservedChip from './ReservedChip'

export default function ReservePropertyButton({ conversation }: { conversation: Conversation }) {
  useTranslation();
  const { user } = useAuth()
  const reserve = useReserveProperty(conversation.id)
  const property = conversation.property
  // Las conversaciones directas (administrador ↔ usuario) no tienen propiedad que alquilar.
  if (!property || user?.id !== property.owner.id || !user.roles.includes('OWNER')) return null

  const tenant = conversation.participants.find((participant) => participant.id !== user.id)

  // Ya reservada: no es un botón sino un estado, y dice a quién se reservó.
  if (property.reservedTenantId) {
    const forThisPerson = property.reservedTenantId === tenant?.id
    return <ReservedChip highlight={forThisPerson} label={forThisPerson && tenant ? i18n.t("reservations:reservedForTenant", { name: tenant.name }) : i18n.t("reservations:reservedForOther")} />
  }

  const notActive = property.status !== 'ACTIVE'
  let error = ''
  if (reserve.error) {
    error = errorMessage(reserve.error, i18n.t("reservations:reservepropertybutton_no_se_pudo_reservar_la_propiedad_intenta_nuevamente"))
  }
  return <div className="flex max-w-xs flex-col items-end gap-1">
    <button type="button" onClick={() => reserve.mutate()}
      disabled={reserve.isPending || notActive}
      className="inline-flex items-center gap-1.5 rounded-lg bg-secondary px-3 py-2 text-xs font-bold text-white hover:bg-secondary-dark disabled:cursor-not-allowed disabled:opacity-60">
      <CalendarCheck className="size-4 shrink-0" aria-hidden="true" />
      {reserve.isPending ? i18n.t("reservations:reservepropertybutton_reservando") : tenant ? i18n.t("reservations:reserveForTenant", { name: tenant.name }) : i18n.t("reservations:reserveForPerson")}
    </button>
    {notActive && <p className="text-right text-xs text-slate-500">{i18n.t("reservations:activeRequired")}</p>}
    {error && <p role="alert" className="text-xs text-red-700">{error}</p>}
  </div>
}
