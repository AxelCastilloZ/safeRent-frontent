import { useTranslation } from 'react-i18next';
import i18n from '../../../i18n/instance';
import { Link } from '@tanstack/react-router'
import { useAuth } from '../../Auth/hooks/authHooks'
import { useConversation, useMessages } from '../hooks/messageHooks'
import { useMarkReadWhileViewing } from '../hooks/useMarkReadWhileViewing'
import { useMessagesBasePath } from '../hooks/useMessagesBasePath'
import { useOutbox } from '../hooks/useOutbox'
import { buttonStyles } from './buttonStyles'
import ChatHeader from './ChatHeader'
import ConnectionBanner from './ConnectionBanner'
import MessageComposer from './MessageComposer'
import MessageList from './MessageList'

/** La pantalla de chat completa: cabecera + mensajes + caja de texto. */
export default function ChatPanel({ conversationId }: { conversationId: number }) {
  useTranslation();
  const { user: currentUser } = useAuth()
  const basePath = useMessagesBasePath()
  const conversation = useConversation(conversationId)
  const messages = useMessages(conversationId)
  const { pending, send, retry } = useOutbox(conversationId, currentUser?.id)
  useMarkReadWhileViewing(conversationId, messages.data, currentUser?.id)

  // El backend valida la participación; la pantalla también evita mostrar chats ajenos.
  const isParticipant =
    !conversation.data || !currentUser || conversation.data.participants.some((participant) => participant.id === currentUser.id)

  if (conversation.isError || !isParticipant) {
    return (
      <div role="alert" className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center">
        <h1 className="text-lg font-semibold">{i18n.t("messages:chatpanel_no_pudimos_abrir_esta_conversacion")}</h1>
        <p className="max-w-sm text-sm text-slate-500">{i18n.t("messages:chatpanel_puede_que_no_exista_o_que_no_tengas_acceso")}</p>
        <Link to={basePath} className={buttonStyles.outline}>{i18n.t("messages:chatheader_volver_a_mis_mensajes")}</Link>
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
