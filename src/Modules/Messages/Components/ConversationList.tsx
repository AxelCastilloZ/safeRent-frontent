import { Link, useParams } from '@tanstack/react-router'
import { Building2 } from 'lucide-react'
import { useAuth } from '../../Auth/hooks/authHooks'
import { useConversations } from '../hooks/messageHooks'
import {
  otherParticipant,
  otherParticipantRole,
  participantFullName,
  participantInitials,
  shortDate,
} from '../utils/conversation'
import ParticipantAvatar from './ParticipantAvatar'
import RoleBadge from './RoleBadge'
import Skeleton from './Skeleton'

/** Bandeja (wireframe 3a): todas las conversaciones del usuario, sea inquilino o arrendatario en cada una. */
export default function ConversationList() {
  const { user: currentUser } = useAuth()
  const { data: conversations, isPending, isError, refetch } = useConversations()
  const { conversationId } = useParams({ strict: false })
  const activeId = conversationId ? Number(conversationId) : null

  return (
    <aside aria-label="Conversaciones" className="flex h-full flex-col border-r border-slate-200 bg-white">
      <h1 className="border-b border-slate-200 px-5 py-4 text-lg font-bold">Mensajes</h1>
      <div className="min-h-0 flex-1 overflow-y-auto">
        {isPending ? (
          <div className="space-y-4 p-5" aria-busy="true">
            {[0, 1, 2].map((row) => (
              <div key={row} className="flex items-center gap-3">
                <Skeleton className="size-8 rounded-full" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-4 w-3/5" />
                  <Skeleton className="h-3 w-4/5" />
                </div>
              </div>
            ))}
          </div>
        ) : isError ? (
          <div role="alert" className="space-y-2 p-5 text-sm">
            <p className="text-red-700">No pudimos cargar tus conversaciones.</p>
            <button type="button" onClick={() => void refetch()} className="font-semibold text-secondary hover:underline">
              Reintentar
            </button>
          </div>
        ) : conversations.length === 0 ? (
          <div className="space-y-1 p-5 text-sm text-slate-500">
            <p className="font-medium text-primary">Todavía no tienes conversaciones.</p>
            <p>Entra a una propiedad y pulsa «Chatear con el propietario» para empezar.</p>
            <Link to="/explorar" className="inline-block pt-2 font-semibold text-secondary hover:underline">
              Explorar propiedades
            </Link>
          </div>
        ) : (
          <ul>
            {conversations.map((conversation) => {
              const other = currentUser ? otherParticipant(conversation, currentUser.id) : undefined
              const isActive = conversation.id === activeId
              return (
                <li key={conversation.id} className="border-b border-slate-200 last:border-b-0">
                  <Link
                    to="/messages/$conversationId"
                    params={{ conversationId: String(conversation.id) }}
                    aria-current={isActive ? 'page' : undefined}
                    className={`flex items-center gap-3 px-5 py-4 transition-colors hover:bg-slate-100 ${isActive ? 'bg-slate-100' : ''}`}
                  >
                    <ParticipantAvatar initials={other ? participantInitials(other) : '?'} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate font-semibold">{other ? participantFullName(other) : 'Usuario'}</p>
                        {currentUser && <RoleBadge>{otherParticipantRole(conversation, currentUser.id)}</RoleBadge>}
                      </div>
                      <div className="flex items-center justify-between gap-2 text-xs text-slate-500">
                        <p className="flex min-w-0 items-center gap-1">
                          <Building2 className="size-3.5 shrink-0" aria-hidden="true" />
                          <span className="truncate">{conversation.property.title}</span>
                        </p>
                        <time dateTime={conversation.createdAt} className="shrink-0">
                          {shortDate(conversation.createdAt)}
                        </time>
                      </div>
                    </div>
                  </Link>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </aside>
  )
}
