import { useQuery } from '@tanstack/react-query'
import { getPublicOwner } from '../services/publicProperty.service'

export function usePublicOwner(id: number) {
  return useQuery({
    queryKey: ['public-owner', id],
    queryFn: ({ signal }) => getPublicOwner(id, signal),
    enabled: Number.isInteger(id) && id > 0,
    retry: false,
  })
}
