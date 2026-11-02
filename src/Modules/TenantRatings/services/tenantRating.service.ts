import apiAxios from '../../../api/apiConfig'
import type { RateTenantPayload, TenantProfile, TenantRatingSummary } from '../types/tenantRating'

export async function getTenantProfile(tenantId: number, signal?: AbortSignal): Promise<TenantProfile> {
  const response = await apiAxios.get<TenantProfile>(`/tenant-ratings/tenant/${tenantId}`, { signal })
  return response.data
}

export async function getTenantRatingSummary(tenantId: number, signal?: AbortSignal): Promise<TenantRatingSummary> {
  const response = await apiAxios.get<TenantRatingSummary>(`/tenant-ratings/tenant/${tenantId}/summary`, { signal })
  return response.data
}

/** Calificar (o editar la calificación de) el inquilino de una reserva propia. */
export async function rateTenant({ reservationId, rating, comment }: RateTenantPayload) {
  const response = await apiAxios.put(`/tenant-ratings/reservation/${reservationId}`, { rating, comment })
  return response.data
}
