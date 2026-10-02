import { useEffect, useRef } from 'react'
import type { Message, PendingMessage } from '../types/message'
import { MessageBubble, PendingBubble } from './MessageBubble'
import Skeleton from './Skeleton'

interface MessageListProps {
  messages: Message[] | undefined
  pending: PendingMessage[]
  currentUserId: number | undefined
  isLoading: boolean
  isError: boolean
  onRetry: (localId: string) => void
}

/** Historial del chat; baja solo al último mensaje cuando llega uno nuevo. */
export default function MessageList({ messages, pending, currentUserId, isLoading, isError, onRetry }: MessageListProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const total = (messages?.length ?? 0) + pending.length

  useEffect(() => {
    const container = scrollRef.current
    if (container) container.scrollTop = container.scrollHeight
  }, [total])

  return (
    <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto bg-white">
      <div className="space-y-3 p-4">
        {isLoading ? (
          <div className="space-y-3" aria-busy="true">
            <Skeleton className="h-10 w-2/5" />
            <Skeleton className="ml-auto h-10 w-1/3" />
            <Skeleton className="h-10 w-1/2" />
          </div>
        ) : isError && !messages ? (
          <p role="alert" className="py-8 text-center text-sm text-red-700">
            No pudimos cargar los mensajes. Reintentando…
          </p>
        ) : (
          <>
            {messages?.length === 0 && pending.length === 0 && (
              <p className="py-8 text-center text-sm text-slate-500">Aún no hay mensajes. Escribe el primero.</p>
            )}
            {messages?.map((message) => (
              <MessageBubble key={message.id} message={message} mine={message.sender.id === currentUserId} />
            ))}
            {pending.map((item) => (
              <PendingBubble key={item.localId} pending={item} onRetry={onRetry} />
            ))}
          </>
        )}
      </div>
    </div>
  )
}
