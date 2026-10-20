import { useQuery } from '@tanstack/react-query'
import { getPublicProperty } from '../services/publicProperty.service'
import { useDisplayCurrency } from '../../Auth/hooks/useDisplayCurrency'

export function usePublicProperty(id: number) {
  const { currency, ready } = useDisplayCurrency()
  return useQuery({
    queryKey: ['public-property', id, currency],
    queryFn: ({ signal }) => getPublicProperty(id, signal, currency),
    enabled: ready && Number.isInteger(id) && id > 0,
    retry: false,
  })
}
