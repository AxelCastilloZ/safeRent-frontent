export interface ReservationState {
  reservedTenantId?: number | null
  reservedTenantName?: string | null
  reservedAt?: string | null
}

export interface Reservation extends ReservationState {
  propertyId: number
}
