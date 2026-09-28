import { updateService } from '../services/service.service'
import type { UpdateServiceInput } from '../interfaces/service.interface'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createService, listServices } from '../services/service.service'
import type { Service } from '../interfaces/service.interface'

export const servicesQueryKey = ['services', 'catalog'] as const

export function useServices() {
  return useQuery({
    queryKey: servicesQueryKey,
    queryFn: ({ signal }) => listServices(signal),
  })
}

export function useCreateService() {
  const client = useQueryClient()
  return useMutation({
    mutationFn: createService,
    retry: false,
    onSuccess: (created) => {
      client.setQueryData<Service[]>(servicesQueryKey, (current) =>
        [
          ...(current || []).filter((item) => item.id !== created.id),
          created,
        ].sort((a, b) => a.name.localeCompare(b.name, 'es')),
      )
      void client.invalidateQueries({ queryKey: servicesQueryKey })
    },
  })
}

export function useUpdateService() {
  const client = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: UpdateServiceInput }) =>
      updateService(id, input),
    retry: false,
    onSuccess: (updated) => {
      client.setQueryData<Service[]>(servicesQueryKey, (current) =>
        current
          ?.map((item) => (item.id === updated.id ? updated : item))
          .sort((a, b) => a.name.localeCompare(b.name, 'es')),
      )
      void client.invalidateQueries({ queryKey: servicesQueryKey })
    },
  })
}
