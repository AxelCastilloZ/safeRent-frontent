export interface ReservationState {
  reservedTenantId?: number | null
  reservedTenantName?: string | null
  reservedAt?: string | null
}

export interface Reservation extends ReservationState {
  propertyId: number
}

/** Una reserva del historial (GET /reservations/me, /user/:id y /property/:id). */
export interface ReservationHistoryEntry {
  id: number
  startedAt: string
  endedAt: string | null
  endReason: string | null
  active: boolean
  property: { id: number; title: string; address: string }
  tenant: { id: number; name: string }
  owner: { id: number; name: string }
}

/** Historial de alquileres de una propiedad y cuántas veces se ha alquilado. */
export interface PropertyRentalHistory {
  propertyId: number
  timesRented: number
  reservations: ReservationHistoryEntry[]
}

export interface RentalCount {
  propertyId: number
  timesRented: number
}
