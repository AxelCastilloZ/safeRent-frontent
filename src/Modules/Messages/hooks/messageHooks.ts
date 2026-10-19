import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { useAuth } from '../../Auth/hooks/authHooks'
import {
  createConversation,
  getConversation,
  getConversations,
  getMessages,
  markConversationRead,
  sendMessage,
} from '../services/messageServices'
import type { Conversation, SendMessageRequest } from '../types/message'

const MESSAGES_POLL_MS = 4000
// La bandeja cambia poco: basta para que un arrendatario vea una consulta nueva sin recargar.
const CONVERSATIONS_POLL_MS = 15000

export const conversationKeys = {
  all: ['conversations'] as const,
  list: (userId: number | undefined) => ['conversations', 'user', userId] as const,
  detail: (conversationId: number) => ['conversations', conversationId] as const,
  messages: (conversationId: number) => ['conversations', conversationId, 'messages'] as const,
}

/** Bandeja: conversaciones del usuario con sesión iniciada. */
export function useConversations() {
  const { user: currentUser } = useAuth()
  return useQuery({
    queryKey: conversationKeys.list(currentUser?.id),
    queryFn: () => getConversations(currentUser!.id),
    enabled: currentUser !== undefined,
    refetchInterval: CONVERSATIONS_POLL_MS,
  })
}

/** Mensajes sin leer del usuario: suma de la bandeja (misma consulta y caché que useConversations). */
export function useUnreadMessagesCount(): number {
  const { data } = useConversations()
  return data?.reduce((total, conversation) => total + (conversation.unreadCount ?? 0), 0) ?? 0
}

export function useConversation(conversationId: number) {
  return useQuery({
    queryKey: conversationKeys.detail(conversationId),
    queryFn: () => getConversation(conversationId),
    retry: false,
    refetchInterval: CONVERSATIONS_POLL_MS,
  })
}

/** Sin WebSockets en el backend: se refresca por polling mientras el chat está abierto. */
export function useMessages(conversationId: number) {
  return useQuery({
    queryKey: conversationKeys.messages(conversationId),
    queryFn: () => getMessages(conversationId),
    refetchInterval: MESSAGES_POLL_MS,
  })
}

export function useSendMessage(conversationId: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: SendMessageRequest) => sendMessage(conversationId, payload),
    // Devolver la promesa: el mensaje pendiente se retira recién cuando la lista ya trae el confirmado.
    onSuccess: () => queryClient.invalidateQueries({ queryKey: conversationKeys.messages(conversationId) }),
  })
}

/**
 * Marca una conversación como leída. La bandeja baja el contador al instante (sin esperar al servidor)
 * y después se vuelve a consultar para quedar igual que el backend.
 */
export function useMarkConversationRead() {
  const queryClient = useQueryClient()
  const { user } = useAuth()
  return useMutation({
    mutationFn: markConversationRead,
    onMutate: (conversationId: number) => {
      queryClient.setQueryData<Conversation[]>(conversationKeys.list(user?.id), (list) =>
        list?.map((conversation) => (conversation.id === conversationId ? { ...conversation, unreadCount: 0 } : conversation)),
      )
    },
    onSettled: (_data, _error, conversationId) =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: conversationKeys.list(user?.id) }),
        queryClient.invalidateQueries({ queryKey: conversationKeys.messages(conversationId) }),
      ]),
  })
}

/** "Chatear con el propietario": crea (o recupera) la conversación y abre el chat. */
export function useStartConversation() {
  const queryClient = useQueryClient()
  const router = useRouter()
  return useMutation({
    mutationFn: createConversation,
    onSuccess: async (conversation) => {
      await queryClient.invalidateQueries({ queryKey: conversationKeys.all })
      // El chat vive en el panel del inquilino (quien contacta a un propietario desde una propiedad).
      router.history.push(`/dashboard/messages/${conversation.id}`)
    },
  })
}
