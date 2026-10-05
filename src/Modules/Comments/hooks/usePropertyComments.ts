import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createPropertyComment, getPropertyComments } from '../services/commentService'

export function usePropertyComments(propertyId: number) {
  return useQuery({
    queryKey: ['property-comments', propertyId],
    queryFn: () => getPropertyComments(propertyId),
  })
}

export function useCreatePropertyComment(propertyId: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (content: string) => createPropertyComment(propertyId, content),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['property-comments', propertyId] }),
  })
}
