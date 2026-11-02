/** Promedio (un decimal), cantidad y cuántas calificaciones hay de cada puntaje. */
export interface RatingSummary {
  average: number | null
  count: number
  distribution: Record<number, number>
}

/** Una calificación que un propietario le dio al inquilino. */
export interface TenantRatingEntry {
  id: number
  rating: number
  comment: string | null
  createdAt: string
  updatedAt: string
  /** Del propietario solo se muestra el nombre. */
  owner: { name: string }
  property: { title: string }
  /** La calificación la dio quien está viendo. */
  mine: boolean
}

/** Una reserva del propietario que consulta con este inquilino, y lo que calificó en ella. */
export interface MyReservationRating {
  reservationId: number
  active: boolean
  startedAt: string
  endedAt: string | null
  property: { id: number; title: string }
  myRating: { rating: number; comment: string | null } | null
}

/** GET /tenant-ratings/tenant/:id */
export interface TenantProfile {
  tenant: { id: number; name: string }
  summary: RatingSummary
  ratings: TenantRatingEntry[]
  /** Vacío si quien consulta no es propietario (el inquilino viendo las suyas, un administrador). */
  myReservations: MyReservationRating[]
}

/** GET /tenant-ratings/tenant/:id/summary: lo justo para el distintivo junto al nombre. */
export interface TenantRatingSummary {
  tenantId: number
  average: number | null
  count: number
}

export interface RateTenantPayload {
  reservationId: number
  rating: number
  comment?: string
}
