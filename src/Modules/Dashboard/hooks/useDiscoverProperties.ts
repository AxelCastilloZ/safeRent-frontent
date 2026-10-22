import { useQuery } from '@tanstack/react-query';
import apiAxios from '../../../api/apiConfig';
import type { Property } from '../../Explore/interfaces/property.interface';
import { useDisplayCurrency } from '../../Auth/hooks/useDisplayCurrency';
import { useDashboardUser } from './useDashboardUser';

/** Propiedad del listado público; `ownerId` permite no ofrecerle al usuario sus propias publicaciones. */
export interface DiscoverProperty extends Property {
  ownerId?: number;
}

const FETCHED = 10;
export const DISCOVER_SHOWN = 8;

/** Las propiedades activas más recientes (GET /properties/active), sin las del propio usuario. */
export function useDiscoverProperties() {
  const { currency, ready } = useDisplayCurrency();
  const { userId } = useDashboardUser();
  return useQuery({
    queryKey: ['discover-properties', userId, currency],
    enabled: ready,
    queryFn: async ({ signal }) => {
      const response = await apiAxios.get<{ data: DiscoverProperty[] }>('/properties/active', {
        signal,
        params: { page: 1, limit: FETCHED, sort: 'newest', displayCurrency: currency },
      });
      return response.data.data.filter((property) => property.ownerId !== userId).slice(0, DISCOVER_SHOWN);
    },
  });
}
