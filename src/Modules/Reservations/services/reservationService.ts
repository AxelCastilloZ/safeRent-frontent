import apiAxios from '../../../api/apiConfig'
import type { Reservation } from '../models/reservation'

export async function releaseReservation(propertyId: number): Promise<Reservation> {
  const response = await apiAxios.delete<Reservation>(`/reservations/property/${propertyId}`)
  return response.data
}

export async function reserveFromConversation(conversationId: number): Promise<Reservation> {
  const response = await apiAxios.post<Reservation>(`/reservations/conversation/${conversationId}`)
  return response.data
}
