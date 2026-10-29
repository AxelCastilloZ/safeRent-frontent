import type { Visit } from '../types/visit'

/** ¿La cita todavía no ha empezado? */
export const isUpcomingVisit = (visit: Visit) => new Date(visit.scheduledAt).getTime() > Date.now()

/** Una cita sigue "viva" mientras espera respuesta o está confirmada y todavía no pasó. */
export const isLiveVisit = (visit: Visit) =>
  visit.status === 'PENDING' || visit.status === 'COUNTER_PROPOSED' || (visit.status === 'CONFIRMED' && isUpcomingVisit(visit))

/**
 * Reparte las citas en secciones, respetando el orden del backend:
 * - `queue`: solicitudes sin responder, de la más antigua a la más reciente (quién pidió primero).
 * - `upcoming`: las demás citas vivas, por fecha.
 * - `history`: canceladas, vencidas y ya realizadas.
 */
export function splitVisits(visits: Visit[]) {
  return {
    queue: visits.filter((visit) => visit.status === 'PENDING'),
    upcoming: visits.filter((visit) => isLiveVisit(visit) && visit.status !== 'PENDING'),
    history: visits.filter((visit) => !isLiveVisit(visit)),
  }
}
