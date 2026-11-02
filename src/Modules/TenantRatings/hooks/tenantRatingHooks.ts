import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getTenantProfile, getTenantRatingSummary, rateTenant } from '../services/tenantRating.service'

export const tenantRatingKeys = {
  all: ['tenant-ratings'] as const,
  profile: (tenantId: number | undefined) => ['tenant-ratings', 'profile', tenantId] as const,
  summary: (tenantId: number | undefined) => ['tenant-ratings', 'summary', tenantId] as const,
}

/** Perfil de un inquilino: su puntaje y lo que otros propietarios dijeron de él. */
export function useTenantProfile(tenantId: number | undefined) {
  return useQuery({
    queryKey: tenantRatingKeys.profile(tenantId),
    enabled: tenantId !== undefined && Number.isInteger(tenantId) && tenantId > 0,
    queryFn: ({ signal }) => getTenantProfile(tenantId!, signal),
    retry: false,
  })
}

/** Solo el puntaje, para el distintivo junto al nombre. Varias tarjetas del mismo inquilino comparten una consulta. */
export function useTenantRatingSummary(tenantId: number | undefined) {
  return useQuery({
    queryKey: tenantRatingKeys.summary(tenantId),
    enabled: tenantId !== undefined,
    queryFn: ({ signal }) => getTenantRatingSummary(tenantId!, signal),
    staleTime: 60_000,
    retry: false,
  })
}

export function useRateTenant() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: rateTenant,
    // Cambia el promedio, la lista y el distintivo de ese inquilino.
    onSuccess: () => queryClient.invalidateQueries({ queryKey: tenantRatingKeys.all }),
  })
}
