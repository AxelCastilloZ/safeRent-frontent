import { Outlet, useParams } from '@tanstack/react-router'
import ConversationList from './ConversationList'

/**
 * Bandeja a la izquierda y el chat (Outlet) a la derecha. En mobile se ve un
 * solo panel a la vez: la bandeja sin conversación abierta, el chat si hay una.
 * Lo comparten la zona pública y la del arrendatario; cada una pone su marco.
 */
export default function MessagesLayout() {
  const { conversationId } = useParams({ strict: false })
  const hasConversation = Boolean(conversationId)

  return (
    <div className="grid min-h-0 min-w-0 flex-1 md:grid-cols-[22rem_minmax(0,1fr)]">
      <div className={`min-h-0 ${hasConversation ? 'hidden md:block' : 'block'}`}>
        <ConversationList />
      </div>
      <main className={`min-h-0 min-w-0 ${hasConversation ? 'block' : 'hidden md:block'}`}>
        <Outlet />
      </main>
    </div>
  )
}
