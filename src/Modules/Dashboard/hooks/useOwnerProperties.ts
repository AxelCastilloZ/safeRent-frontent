import { useQuery } from '@tanstack/react-query';
import { ApiError } from '../../Property/services/api';
import { propertyService } from '../../Property/services/propertyService';
import { useDashboardUser } from './useDashboardUser';

/** Propiedades del usuario de la sesión (GET /properties/owner/:id). Sin propiedades = lista vacía. */
export function useOwnerProperties() {
  const { userId } = useDashboardUser();

  return useQuery({
    queryKey: ['owner-properties', userId],
    enabled: userId !== undefined,
    queryFn: async () => {
      try {
        return await propertyService.getByOwner(userId!);
      } catch (error) {
        if (error instanceof ApiError && error.status === 404) return [];
        throw error;
      }
    },
  });
}
