import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { getPropertyViews, recordPropertyView } from '../services/propertyView.service'
import { getVisitorId } from '../utils/visitorId'

/**
 * Cuántas personas han abierto una propiedad. Con `record` también registra esta vista (una vez al abrir la página);
 * sin él solo consulta (el propietario viendo la suya, o un administrador, no suman). Devuelve undefined mientras no se sabe.
 */
export function usePropertyViews(propertyId: number | undefined, record: boolean): number | undefined {
  const queryClient = useQueryClient()
  const valid = propertyId !== undefined && Number.isInteger(propertyId) && propertyId > 0
  const key = ['property-views', propertyId]

  const counted = useQuery({
    queryKey: key,
    enabled: valid && !record,
    queryFn: ({ signal }) => getPropertyViews(propertyId!, signal),
    staleTime: 60_000,
    retry: false,
  })
  const registration = useMutation({
    mutationFn: (id: number) => recordPropertyView(id, getVisitorId()),
    onSuccess: (data) => queryClient.setQueryData(key, data),
  })

  const { mutate } = registration
  useEffect(() => {
    if (record && valid) mutate(propertyId)
  }, [record, valid, propertyId, mutate])

  return counted.data?.views ?? registration.data?.views
}
