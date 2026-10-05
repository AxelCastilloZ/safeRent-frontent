import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getAdminComments, moderateComment } from '../services/commentService'
import type { ModerateCommentPayload } from '../models/comment'

export function useAdminComments(enabled: boolean) {
  return useQuery({ queryKey: ['admin-comments'], queryFn: getAdminComments, enabled })
}

export function useModerateComment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: ModerateCommentPayload }) => moderateComment(id, data),
    onSuccess: () => Promise.all([
      queryClient.invalidateQueries({ queryKey: ['admin-comments'] }),
      queryClient.invalidateQueries({ queryKey: ['property-comments'] }),
      queryClient.invalidateQueries({ queryKey: ['own-property-comment'] }),
    ]),
  })
}
