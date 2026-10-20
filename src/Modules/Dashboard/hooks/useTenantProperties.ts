import { useQuery } from '@tanstack/react-query';
import apiAxios from '../../../api/apiConfig';
import type { Property } from '../../Explore/interfaces/property.interface';
import { useDashboardUser } from './useDashboardUser';
import { useDisplayCurrency } from '../../Auth/hooks/useDisplayCurrency';

export interface TenantProperty extends Property {
  status: string;
  owner: { id: number; name: string };
  reservedAt: string | null;
}

export function useTenantProperties() {
  const { currency, ready } = useDisplayCurrency();
  const { userId } = useDashboardUser();
  return useQuery({
    queryKey: ['tenant-properties', userId, currency],
    enabled: ready && userId !== undefined,
    queryFn: async ({ signal }) => {
      const response = await apiAxios.get<TenantProperty[]>('/properties/me/reserved', { signal, params: { displayCurrency: currency } });
      return response.data;
    },
  });
}
