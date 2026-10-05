import { useParams } from '@tanstack/react-router'
import ChatPanel from '../Components/ChatPanel'

/** /messages/$conversationId — la pantalla para chatear con el arrendador (o el inquilino). */
export default function ConversationPage() {
  const { conversationId } = useParams({ strict: false })
  const id = Number(conversationId)

  if (!Number.isInteger(id) || id <= 0) {
    return <p role="alert" className="flex h-full items-center justify-center p-8 text-slate-500">Conversación no válida.</p>
  }

  // key: al cambiar de conversación se reinicia el estado local (cola de envío, scroll).
  return <ChatPanel key={id} conversationId={id} />
}
