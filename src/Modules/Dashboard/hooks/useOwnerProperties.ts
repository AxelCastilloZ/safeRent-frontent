import { useQuery } from '@tanstack/react-query';
import { ApiError } from '../../Property/services/api';
import { propertyService } from '../../Property/services/propertyService';
import { useDashboardUser } from './useDashboardUser';
import { useDisplayCurrency } from '../../Auth/hooks/useDisplayCurrency';

/** Propiedades del usuario de la sesión (GET /properties/owner/:id). Sin propiedades = lista vacía. */
export function useOwnerProperties() {
  const { currency, ready } = useDisplayCurrency();
  const { userId } = useDashboardUser();

  return useQuery({
    queryKey: ['owner-properties', userId, currency],
    enabled: ready && userId !== undefined,
    queryFn: async () => {
      try {
        return await propertyService.getByOwner(userId!, currency);
      } catch (error) {
        if (error instanceof ApiError && error.status === 404) return [];
        throw error;
      }
    },
  });
}
