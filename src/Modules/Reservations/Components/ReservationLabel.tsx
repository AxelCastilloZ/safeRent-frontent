import type { ReservationState } from '../models/reservation'

export default function ReservationLabel({ property }: { property: ReservationState }) {
  if (!property.reservedTenantId) return null
  // return <p role="status" className="rounded-lg bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-900">
  //   Reservada
  // </p>
  return null
}
