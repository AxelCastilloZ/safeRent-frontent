import apiAxios from '../../../api/apiConfig'
import type { PropertyRentalHistory, RentalCount, Reservation, ReservationHistoryEntry } from '../models/reservation'

export async function releaseReservation({ propertyId, reason }: { propertyId: number; reason: string }): Promise<Reservation> {
  const response = await apiAxios.delete<Reservation>(`/reservations/property/${propertyId}`, { data: { reason } })
  return response.data
}

export async function reserveFromConversation(conversationId: number): Promise<Reservation> {
  const response = await apiAxios.post<Reservation>(`/reservations/conversation/${conversationId}`)
  return response.data
}

/** Historial privado de reservas del usuario de la sesión. */
export async function getMyReservationHistory(): Promise<ReservationHistoryEntry[]> {
  const response = await apiAxios.get<ReservationHistoryEntry[]>('/reservations/me')
  return response.data
}

/** Historial de reservas de otro usuario (solo administradores). */
export async function getUserReservationHistory(userId: number): Promise<ReservationHistoryEntry[]> {
  const response = await apiAxios.get<ReservationHistoryEntry[]>(`/reservations/user/${userId}`)
  return response.data
}

/** Historial de alquileres de una propiedad (su propietario o un administrador). */
export async function getPropertyRentalHistory(propertyId: number): Promise<PropertyRentalHistory> {
  const response = await apiAxios.get<PropertyRentalHistory>(`/reservations/property/${propertyId}`)
  return response.data
}

/** Veces que se alquiló cada propiedad de un propietario. */
export async function getOwnerRentalCounts(ownerId: number): Promise<RentalCount[]> {
  const response = await apiAxios.get<RentalCount[]>(`/reservations/owner/${ownerId}/counts`)
  return response.data
}
