export type VisitStatus = 'PENDING' | 'COUNTER_PROPOSED' | 'CONFIRMED' | 'CANCELLED' | 'EXPIRED'

/** Cita para visitar una propiedad (GET /visits/mine y /visits/received). */
export interface Visit {
  id: number
  status: VisitStatus
  /** Horario vigente (ISO, UTC). Si hay contrapropuesta, es el que propuso el propietario. */
  scheduledAt: string
  /** Horario que había pedido el inquilino cuando hay una contrapropuesta. */
  previousScheduledAt: string | null
  /** Zona horaria de la propiedad: la hora se muestra siempre en ella. */
  timezone: string
  note: string | null
  cancelReason: string | null
  /** 'SYSTEM' cuando la cita se canceló sola (por ejemplo, la propiedad se reservó para otra persona). */
  cancelledBy: 'TENANT' | 'OWNER' | 'SYSTEM' | null
  /** Cuándo se solicitó: define quién fue primero. */
  createdAt: string
  expiresAt: string | null
  confirmedAt: string | null
  property: {
    id: number
    title: string
    address: string
    status: string
    reserved: boolean
    reservedForTenant: boolean
  }
  tenant: { id: number; name: string; surname1: string; surname2: string | null }
  owner: { id: number; name: string; surname1: string }
}

export interface Slot {
  /** Inicio real (ISO, UTC): es lo que se envía al pedir la cita. */
  start: string
  /** Fecha y hora en la zona de la propiedad, listas para agrupar y mostrar. */
  localDate: string
  localTime: string
  available: boolean
}

export interface SlotsResponse {
  timezone: string
  slotMinutes: number
  propertyReserved: boolean
  /** El propietario confirma las citas al instante. */
  autoConfirm: boolean
  slots: Slot[]
}

/** Ventana semanal de atención: `weekday` 0 = domingo … 6 = sábado, "HH:mm" en la zona de la propiedad. */
export interface AvailabilityRule {
  weekday: number
  start: string
  end: string
}

export interface Availability {
  timezone: string
  rules: AvailabilityRule[]
  /** true mientras el propietario no haya guardado nada y se use el horario por defecto. */
  isDefault: boolean
  /** Las citas que se pidan quedan confirmadas sin que el propietario responda. */
  autoConfirm: boolean
  slotMinutes: number
}

/** Cifras para los contadores del menú y los inicios (GET /visits/summary). */
export interface VisitSummary {
  /** Solicitudes que esperan respuesta del propietario. */
  ownerPending: number
  ownerUpcoming: number
  /** Contrapropuestas que esperan respuesta del inquilino. */
  tenantNeedsAnswer: number
  tenantUpcoming: number
}

export interface RequestVisitPayload {
  propertyId: number
  scheduledAt: string
  note?: string
}
