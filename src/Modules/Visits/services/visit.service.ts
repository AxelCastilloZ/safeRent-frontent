import apiAxios from '../../../api/apiConfig'
import type { Availability, AvailabilityRule, RequestVisitPayload, SlotsResponse, Visit, VisitSummary } from '../types/visit'

const BASE = '/visits'

export async function getSlots(propertyId: number, from: string, to: string, signal?: AbortSignal): Promise<SlotsResponse> {
  const response = await apiAxios.get<SlotsResponse>(`${BASE}/properties/${propertyId}/slots`, { params: { from, to }, signal })
  return response.data
}

export async function requestVisit(payload: RequestVisitPayload): Promise<Visit> {
  const response = await apiAxios.post<Visit>(BASE, payload)
  return response.data
}

export async function getMyVisits(signal?: AbortSignal): Promise<Visit[]> {
  const response = await apiAxios.get<Visit[]>(`${BASE}/mine`, { signal })
  return response.data
}

/** Citas recibidas por el propietario: las solicitudes pendientes primero, de la más antigua a la más reciente. */
export async function getReceivedVisits(signal?: AbortSignal): Promise<Visit[]> {
  const response = await apiAxios.get<Visit[]>(`${BASE}/received`, { signal })
  return response.data
}

export async function getVisitSummary(signal?: AbortSignal): Promise<VisitSummary> {
  const response = await apiAxios.get<VisitSummary>(`${BASE}/summary`, { signal })
  return response.data
}

export async function confirmVisit(id: number): Promise<Visit> {
  return (await apiAxios.patch<Visit>(`${BASE}/${id}/confirm`)).data
}

export async function proposeVisit(id: number, scheduledAt: string): Promise<Visit> {
  return (await apiAxios.patch<Visit>(`${BASE}/${id}/propose`, { scheduledAt })).data
}

export async function acceptVisit(id: number): Promise<Visit> {
  return (await apiAxios.patch<Visit>(`${BASE}/${id}/accept`)).data
}

export async function cancelVisit(id: number, reason?: string): Promise<Visit> {
  return (await apiAxios.patch<Visit>(`${BASE}/${id}/cancel`, { reason: reason?.trim() || undefined })).data
}

export async function getAvailability(propertyId: number, signal?: AbortSignal): Promise<Availability> {
  const response = await apiAxios.get<Availability>(`${BASE}/properties/${propertyId}/availability`, { signal })
  return response.data
}

export async function setAvailability(propertyId: number, payload: { timezone: string; rules: AvailabilityRule[] }): Promise<Availability> {
  const response = await apiAxios.put<Availability>(`${BASE}/properties/${propertyId}/availability`, payload)
  return response.data
}

/** El propietario reserva la propiedad para el inquilino de una cita confirmada. */
export async function reserveFromVisit(visitId: number): Promise<void> {
  await apiAxios.post(`/reservations/visit/${visitId}`)
}
