import { useEffect } from 'react'
import type { Message } from '../types/message'
import { useMarkConversationRead } from './messageHooks'
import { useDocumentVisible } from './useDocumentVisible'

/** Id del último mensaje de la otra persona que aún no se marcó como leído (undefined si no hay). */
function latestUnreadFromOther(messages: Message[] | undefined, currentUserId: number | undefined): number | undefined {
  if (!messages || currentUserId === undefined) return undefined
  for (let index = messages.length - 1; index >= 0; index -= 1) {
    const message = messages[index]
    if (message.sender.id !== currentUserId && message.readAt === null) return message.id
  }
  return undefined
}

/**
 * Mientras el chat está abierto y la pestaña a la vista, marca como leído lo que llega de la otra persona.
 * Se dispara solo cuando aparece un mensaje nuevo sin leer; si el servidor falla no reintenta en bucle
 * (el efecto no cambia hasta que llegue otro mensaje o se vuelva a la pestaña).
 */
export function useMarkReadWhileViewing(conversationId: number, messages: Message[] | undefined, currentUserId: number | undefined) {
  const { mutate: markRead } = useMarkConversationRead()
  const visible = useDocumentVisible()
  const latestUnreadId = latestUnreadFromOther(messages, currentUserId)

  useEffect(() => {
    if (visible && latestUnreadId !== undefined) markRead(conversationId)
  }, [visible, latestUnreadId, conversationId, markRead])
}
