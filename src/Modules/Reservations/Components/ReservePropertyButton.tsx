import axios from 'axios'
import { CalendarCheck } from 'lucide-react'
import { useAuth } from '../../Auth/hooks/authHooks'
import type { Conversation } from '../../Messages/types/message'
import { useReserveProperty } from '../hooks/useReserveProperty'
import ReservedChip from './ReservedChip'

export default function ReservePropertyButton({ conversation }: { conversation: Conversation }) {
  const { user } = useAuth()
  const reserve = useReserveProperty(conversation.id)
  const property = conversation.property
  // Las conversaciones directas (administrador ↔ usuario) no tienen propiedad que alquilar.
  if (!property || user?.id !== property.owner.id || !user.roles.includes('OWNER')) return null

  const tenant = conversation.participants.find((participant) => participant.id !== user.id)

  // Ya reservada: no es un botón sino un estado, y dice a quién se reservó.
  if (property.reservedTenantId) {
    const forThisPerson = property.reservedTenantId === tenant?.id
    return <ReservedChip highlight={forThisPerson} label={forThisPerson && tenant ? `Reservada para ${tenant.name}` : 'Reservada a otra persona'} />
  }

  const notActive = property.status !== 'ACTIVE'
  let error = ''
  if (reserve.error) {
    const message: unknown = axios.isAxiosError(reserve.error) ? reserve.error.response?.data?.message : undefined
    error = typeof message === 'string' ? message : 'No se pudo reservar la propiedad. Intenta nuevamente.'
  }
  return <div className="flex max-w-xs flex-col items-end gap-1">
    <button type="button" onClick={() => reserve.mutate()}
      disabled={reserve.isPending || notActive}
      className="inline-flex items-center gap-1.5 rounded-lg bg-secondary px-3 py-2 text-xs font-bold text-white hover:bg-secondary-dark disabled:cursor-not-allowed disabled:opacity-60">
      <CalendarCheck className="size-4 shrink-0" aria-hidden="true" />
      {reserve.isPending ? 'Reservando…' : tenant ? `Reservar para ${tenant.name}` : 'Reservar a esta persona'}
    </button>
    {notActive && <p className="text-right text-xs text-slate-500">Debe estar aprobada y activa para reservarla.</p>}
    {error && <p role="alert" className="text-xs text-red-700">{error}</p>}
  </div>
}
