import apiAxios from '../../../api/apiConfig'
import type { Reservation } from '../models/reservation'

export async function releaseReservation({ propertyId, reason }: { propertyId: number; reason: string }): Promise<Reservation> {
  const response = await apiAxios.delete<Reservation>(`/reservations/property/${propertyId}`, { data: { reason } })
  return response.data
}

export async function reserveFromConversation(conversationId: number): Promise<Reservation> {
  const response = await apiAxios.post<Reservation>(`/reservations/conversation/${conversationId}`)
  return response.data
}
