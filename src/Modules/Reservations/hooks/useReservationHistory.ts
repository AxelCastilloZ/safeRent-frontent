import { useQuery } from '@tanstack/react-query'
import {
  getMyReservationHistory,
  getOwnerRentalCounts,
  getPropertyRentalHistory,
  getUserReservationHistory,
} from '../services/reservationService'

/** Historial de reservas del usuario de la sesión. */
export function useMyReservationHistory() {
  return useQuery({ queryKey: ['reservation-history', 'me'], queryFn: getMyReservationHistory })
}

/** Historial de reservas de un usuario (vista de administrador). */
export function useUserReservationHistory(userId: number) {
  return useQuery({ queryKey: ['reservation-history', 'user', userId], queryFn: () => getUserReservationHistory(userId) })
}

/** Historial de alquileres de una propiedad y cuántas veces se alquiló. */
export function usePropertyRentalHistory(propertyId: number, enabled = true) {
  return useQuery({
    queryKey: ['reservation-history', 'property', propertyId],
    queryFn: () => getPropertyRentalHistory(propertyId),
    enabled: enabled && Number.isInteger(propertyId) && propertyId > 0,
  })
}

/** Veces que se alquiló cada propiedad de un propietario, como mapa propiedad → cantidad. */
export function useOwnerRentalCounts(ownerId: number | undefined) {
  return useQuery({
    queryKey: ['reservation-history', 'owner-counts', ownerId],
    queryFn: async () => new Map((await getOwnerRentalCounts(ownerId!)).map((row) => [row.propertyId, row.timesRented])),
    enabled: ownerId !== undefined,
  })
}
