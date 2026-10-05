import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { propertyService } from '../services/propertyService'
import type { PropertyStatus, ReviewPropertyPayload } from '../types/property'

export const adminPropertiesQueryKey = (status?: PropertyStatus) => ['admin', 'properties', status ?? 'all'] as const

/** Propiedades para el panel de administración (GET /properties/admin/all, solo ADMIN). */
export function useAdminProperties(status?: PropertyStatus) {
  return useQuery({
    queryKey: adminPropertiesQueryKey(status),
    queryFn: () => propertyService.getAllForAdmin(status),
  })
}

/** Aprueba, pide cambios o rechaza una propiedad en revisión. */
export function useReviewProperty() {
  const client = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: ReviewPropertyPayload }) => propertyService.review(id, data),
    onSuccess: () => void client.invalidateQueries({ queryKey: ['admin', 'properties'] }),
  })
}
