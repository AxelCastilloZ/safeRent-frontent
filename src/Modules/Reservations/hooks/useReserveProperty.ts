import { useMutation, useQueryClient } from '@tanstack/react-query'
import { reserveFromConversation } from '../services/reservationService'
import { conversationKeys } from '../../Messages/hooks/messageHooks'

export function useReserveProperty(conversationId: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => reserveFromConversation(conversationId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: conversationKeys.all }),
  })
}
