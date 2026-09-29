import { useQuery } from '@tanstack/react-query'
import { getPublicProperty } from '../services/publicProperty.service'

export function usePublicProperty(id: number) {
  return useQuery({
    queryKey: ['public-property', id],
    queryFn: ({ signal }) => getPublicProperty(id, signal),
    enabled: Number.isInteger(id) && id > 0,
    retry: false,
  })
}
