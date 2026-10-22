import { useTranslation } from 'react-i18next';
import i18n from '../../../i18n/instance';
import { Link, useParams } from '@tanstack/react-router'
import { Building2, ShieldCheck } from 'lucide-react'
import { useAuth } from '../../Auth/hooks/authHooks'
import { useConversations } from '../hooks/messageHooks'
import { useMessagesBasePath } from '../hooks/useMessagesBasePath'
import {
  conversationContext,
  otherParticipant,
  otherParticipantRole,
  participantFullName,
  participantInitials,
  shortDate,
} from '../utils/conversation'
import ParticipantAvatar from './ParticipantAvatar'
import RoleBadge from './RoleBadge'
import UnreadBadge from './UnreadBadge'
import UserSearchPanel from './UserSearchPanel'
import Skeleton from './Skeleton'

/** Bandeja (wireframe 3a): todas las conversaciones del usuario, sea inquilino o arrendatario en cada una. */
export default function ConversationList() {
  useTranslation();
  const { user: currentUser } = useAuth()
  const { data: conversations, isPending, isError, refetch } = useConversations()
  const { conversationId } = useParams({ strict: false })
  const basePath = useMessagesBasePath()
  const activeId = conversationId ? Number(conversationId) : null
  // Solo el administrador inicia conversaciones (directas, con cualquier usuario activo).
  const canStartDirect = Boolean(currentUser?.roles.includes('ADMIN'))

  return (
    <aside aria-label={i18n.t("messages:conversationlist_conversaciones")} className="flex h-full flex-col border-r border-slate-200 bg-white">
      <h1 className="border-b border-slate-200 px-5 py-4 text-lg font-bold">{i18n.t("dashboard:adminhomepage_mensajes")}</h1>
      {canStartDirect && <UserSearchPanel />}
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
            <p className="text-red-700">{i18n.t("dashboard:recentconversationssection_no_pudimos_cargar_tus_conversaciones")}</p>
            <button type="button" onClick={() => void refetch()} className="font-semibold text-secondary hover:underline">{i18n.t("comments:propertycomments_reintentar")}</button>
          </div>
        ) : conversations.length === 0 ? (
          <div className="space-y-1 p-5 text-sm text-slate-500">
            <p className="font-medium text-primary">{i18n.t("messages:conversationlist_todavia_no_tienes_conversaciones")}</p>
            {canStartDirect ? (
              <p>{i18n.t("messages:conversationlist_busca_un_usuario_arriba_para_iniciar_una_conversacion")}</p>
            ) : (
              <>
                <p>{i18n.t("messages:conversationlist_entra_a_una_propiedad_y_pulsa_chatear_con_el")}</p>
                <Link to="/explorar" className="inline-block pt-2 font-semibold text-secondary hover:underline">{i18n.t("about:aboutcta_explorar_propiedades")}</Link>
              </>
            )}
          </div>
        ) : (
          <ul>
            {conversations.map((conversation) => {
              const other = currentUser ? otherParticipant(conversation, currentUser.id) : undefined
              const isActive = conversation.id === activeId
              const unread = conversation.unreadCount ?? 0
              return (
                <li key={conversation.id} className="border-b border-slate-200 last:border-b-0">
                  <Link
                    to={`${basePath}/${conversation.id}` as string}
                    aria-current={isActive ? 'page' : undefined}
                    className={`flex items-center gap-3 px-5 py-4 transition-colors hover:bg-slate-100 ${isActive ? 'bg-slate-100' : ''}`}
                  >
                    <ParticipantAvatar initials={other ? participantInitials(other) : '?'} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className={`truncate ${unread > 0 ? 'font-extrabold text-primary' : 'font-semibold'}`}>{other ? participantFullName(other) : i18n.t("dashboard:recentconversationssection_usuario")}</p>
                        {currentUser && <RoleBadge>{otherParticipantRole(conversation, currentUser.id)}</RoleBadge>}
                      </div>
                      <div className="flex items-center justify-between gap-2 text-xs text-slate-500">
                        <p className="flex min-w-0 items-center gap-1">
                          {conversation.property ? (
                            <Building2 className="size-3.5 shrink-0" aria-hidden="true" />
                          ) : (
                            <ShieldCheck className="size-3.5 shrink-0" aria-hidden="true" />
                          )}
                          <span className="truncate">
                            {currentUser ? conversationContext(conversation, currentUser.id) : (conversation.property?.title ?? '')}
                          </span>
                        </p>
                        <span className="flex shrink-0 items-center gap-2">
                          <UnreadBadge count={unread} />
                          <time dateTime={conversation.createdAt}>{shortDate(conversation.createdAt)}</time>
                        </span>
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
