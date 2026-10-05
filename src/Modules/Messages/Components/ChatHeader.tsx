import { Link } from '@tanstack/react-router'
import { ArrowLeft, Building2, ExternalLink } from 'lucide-react'
import { useMessagesBasePath } from '../hooks/useMessagesBasePath'
import type { Conversation } from '../types/message'
import { otherParticipant, otherParticipantRole, participantFullName, participantInitials } from '../utils/conversation'
import { buttonStyles } from './buttonStyles'
import ParticipantAvatar from './ParticipantAvatar'
import RoleBadge from './RoleBadge'
import Skeleton from './Skeleton'

interface ChatHeaderProps {
  conversation: Conversation | undefined
  currentUserId: number | undefined
}

/** Cabecera del chat (wireframe 1f/3b): quién es, su rol en esta conversación, la propiedad y las salidas. */
export default function ChatHeader({ conversation, currentUserId }: ChatHeaderProps) {
  const basePath = useMessagesBasePath()
  const other = conversation && currentUserId !== undefined ? otherParticipant(conversation, currentUserId) : undefined

  return (
    <header className="flex items-center gap-3 border-b border-slate-200 bg-white px-4 py-3">
      <Link to={basePath} aria-label="Volver a mis mensajes" className={`${buttonStyles.ghostIcon} md:hidden`}>
        <ArrowLeft aria-hidden="true" />
      </Link>

      {conversation && other && currentUserId !== undefined ? (
        <>
          <ParticipantAvatar initials={participantInitials(other)} />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h1 className="truncate font-semibold">{participantFullName(other)}</h1>
              <RoleBadge>{otherParticipantRole(conversation, currentUserId)}</RoleBadge>
            </div>
            <p className="flex items-center gap-1 truncate text-xs text-slate-500">
              <Building2 className="size-3.5 shrink-0" aria-hidden="true" />
              {conversation.property.title}
            </p>
          </div>
          <Link
            to="/property_detail/$propertyId"
            params={{ propertyId: String(conversation.property.id) }}
            aria-label="Ver propiedad"
            className={buttonStyles.outline}
          >
            {/* Con sidebar + bandeja + chat el ancho es justo: solo icono hasta pantallas muy anchas.
                No hay "Salir del chat": la bandeja siempre está a la vista (en mobile, la flecha de volver). */}
            <ExternalLink aria-hidden="true" className="2xl:hidden" />
            <span className="hidden 2xl:inline">Ver propiedad</span>
          </Link>
        </>
      ) : (
        <div className="flex flex-1 items-center gap-3" aria-busy="true">
          <Skeleton className="size-8 rounded-full" />
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-3 w-28" />
          </div>
        </div>
      )}
    </header>
  )
}
