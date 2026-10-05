import axios from 'axios'
import { useAuth } from '../../Auth/hooks/authHooks'
import type { Conversation } from '../../Messages/types/message'
import { useReserveProperty } from '../hooks/useReserveProperty'

export default function ReservePropertyButton({ conversation }: { conversation: Conversation }) {
  const { user } = useAuth()
  const reserve = useReserveProperty(conversation.id)
  const property = conversation.property
  if (user?.id !== property.owner.id || !user.roles.includes('OWNER')) return null

  let error = ''
  if (reserve.error) {
    const message: unknown = axios.isAxiosError(reserve.error) ? reserve.error.response?.data?.message : undefined
    error = typeof message === 'string' ? message : 'No se pudo reservar la propiedad. Intenta nuevamente.'
  }
  return <div className="flex max-w-xs flex-col items-end gap-1">
    <button type="button" onClick={() => reserve.mutate()}
      disabled={reserve.isPending || Boolean(property.reservedTenantId) || property.status !== 'ACTIVE'}
      title={property.status !== 'ACTIVE' ? 'La propiedad debe estar aprobada y activa para alquilarla' : undefined}
      className="rounded-lg bg-secondary px-3 py-2 text-xs font-bold text-white hover:bg-secondary-dark disabled:cursor-not-allowed disabled:opacity-60">
      {property.reservedTenantId ? 'Propiedad reservada' : reserve.isPending ? 'Reservando…' : 'Alquilar a esta persona'}
    </button>
    {error && <p role="alert" className="text-xs text-red-700">{error}</p>}
  </div>
}
