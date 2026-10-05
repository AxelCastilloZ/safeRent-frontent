import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createPropertyComment, getOwnPropertyComment, getPropertyComments } from '../services/commentService'

export function usePropertyComments(propertyId: number) {
  return useQuery({
    queryKey: ['property-comments', propertyId],
    queryFn: () => getPropertyComments(propertyId),
  })
}

export function useOwnPropertyComment(propertyId: number, userId?: number) {
  return useQuery({
    queryKey: ['own-property-comment', propertyId, userId],
    queryFn: () => getOwnPropertyComment(propertyId),
    enabled: Boolean(userId),
  })
}

export function useCreatePropertyComment(propertyId: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (content: string) => createPropertyComment(propertyId, content),
    onSuccess: () => Promise.all([
      queryClient.invalidateQueries({ queryKey: ['property-comments', propertyId] }),
      queryClient.invalidateQueries({ queryKey: ['own-property-comment', propertyId] }),
    ]),
  })
}
