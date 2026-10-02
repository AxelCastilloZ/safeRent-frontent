import { Outlet, useParams } from '@tanstack/react-router'
import Navbar from '../../LandingPage/Components/Navbar'
import { useAuth } from '../../Auth/hooks/authHooks'
import ConversationList from '../Components/ConversationList'
import SessionGate from '../Components/SessionGate'

/**
 * Layout de Mensajes: bandeja a la izquierda y el chat (Outlet) a la derecha.
 * En mobile se ve un solo panel a la vez: la bandeja en /messages, el chat en
 * /messages/$conversationId. Todavía no hay guard de rutas en el router, así
 * que la sesión se valida acá (useAuth limpia el token si el servidor responde 401).
 */
export default function MessagesPage() {
  const { hasSession } = useAuth()
  const { conversationId } = useParams({ strict: false })
  const hasConversation = Boolean(conversationId)

  if (!hasSession) return <SessionGate />

  return (
    <div className="flex h-screen flex-col bg-white text-primary">
      <Navbar />
      <div className="grid min-h-0 flex-1 md:grid-cols-[22rem_minmax(0,1fr)]">
        <div className={`min-h-0 ${hasConversation ? 'hidden md:block' : 'block'}`}>
          <ConversationList />
        </div>
        <main className={`min-h-0 min-w-0 ${hasConversation ? 'block' : 'hidden md:block'}`}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
