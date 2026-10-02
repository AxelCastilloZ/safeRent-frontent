import { Link } from '@tanstack/react-router'
import { useAuth } from '../../Auth/hooks/authHooks'
import { useConversation, useMessages } from '../hooks/messageHooks'
import { useMessagesBasePath } from '../hooks/useMessagesBasePath'
import { useOutbox } from '../hooks/useOutbox'
import { buttonStyles } from './buttonStyles'
import ChatHeader from './ChatHeader'
import ConnectionBanner from './ConnectionBanner'
import MessageComposer from './MessageComposer'
import MessageList from './MessageList'

/** La pantalla de chat completa: cabecera + mensajes + caja de texto. */
export default function ChatPanel({ conversationId }: { conversationId: number }) {
  const { user: currentUser } = useAuth()
  const basePath = useMessagesBasePath()
  const conversation = useConversation(conversationId)
  const messages = useMessages(conversationId)
  const { pending, send, retry } = useOutbox(conversationId, currentUser?.id)

  // El backend no restringe GET /conversations/:id a sus participantes todavía;
  // mientras tanto, la pantalla no muestra chats ajenos.
  const isParticipant =
    !conversation.data || !currentUser || conversation.data.participants.some((participant) => participant.id === currentUser.id)

  if (conversation.isError || !isParticipant) {
    return (
      <div role="alert" className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center">
        <h1 className="text-lg font-semibold">No pudimos abrir esta conversación</h1>
        <p className="max-w-sm text-sm text-slate-500">Puede que no exista o que no tengas acceso a ella.</p>
        <Link to={basePath} className={buttonStyles.outline}>
          Volver a mis mensajes
        </Link>
      </div>
    )
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <ChatHeader conversation={conversation.data} currentUserId={currentUser?.id} />
      <ConnectionBanner />
      <MessageList
        messages={messages.data}
        pending={pending}
        currentUserId={currentUser?.id}
        isLoading={messages.isPending}
        isError={messages.isError}
        onRetry={retry}
      />
      <MessageComposer onSend={send} disabled={!currentUser} />
    </div>
  )
}
