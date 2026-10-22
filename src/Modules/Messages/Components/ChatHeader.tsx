import { useTranslation } from 'react-i18next';
import i18n from '../../../i18n/instance';
import ReservePropertyButton from '../../Reservations/Components/ReservePropertyButton'
import ReservedChip from '../../Reservations/Components/ReservedChip'
import { Link } from '@tanstack/react-router'
import { ArrowLeft, Building2, ExternalLink, ShieldCheck } from 'lucide-react'
import { useMessagesBasePath } from '../hooks/useMessagesBasePath'
import type { Conversation } from '../types/message'
import { conversationContext, otherParticipant, otherParticipantRole, participantFullName, participantInitials } from '../utils/conversation'
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
  useTranslation();
  const basePath = useMessagesBasePath()
  const other = conversation && currentUserId !== undefined ? otherParticipant(conversation, currentUserId) : undefined

  return (
    <header className="flex flex-wrap items-center gap-3 border-b border-slate-200 bg-white px-4 py-3">
      <Link to={basePath} aria-label={i18n.t("messages:chatheader_volver_a_mis_mensajes")} className={`${buttonStyles.ghostIcon} md:hidden`}>
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
              {conversation.property ? (
                <Building2 className="size-3.5 shrink-0" aria-hidden="true" />
              ) : (
                <ShieldCheck className="size-3.5 shrink-0" aria-hidden="true" />
              )}
              {conversationContext(conversation, currentUserId)}
            </p>
            {/* Al propietario el estado se lo muestra el propio botón de reservar; aquí solo al inquilino. */}
            {conversation.property?.reservedTenantId && conversation.property.owner.id !== currentUserId && (
              <div className="mt-1.5">
                <ReservedChip
                  highlight={conversation.property.reservedTenantId === currentUserId}
                  label={conversation.property.reservedTenantId === currentUserId ? i18n.t("reservations:reservedForYou") : i18n.t("reservations:reservedByOther")}
                />
              </div>
            )}
          </div>
          {/* Las conversaciones directas (administrador ↔ usuario) no tienen propiedad: sin reservar ni "Ver propiedad". */}
          {conversation.property && (
            <>
              <ReservePropertyButton conversation={conversation} />
              <Link
                to="/property_detail/$propertyId"
                params={{ propertyId: String(conversation.property.id) }}
                aria-label={i18n.t("dashboard:savedpropertiespage_ver_propiedad")}
                className={buttonStyles.outline}
              >
                {/* Con sidebar + bandeja + chat el ancho es justo: solo icono hasta pantallas muy anchas.
                    No hay "Salir del chat": la bandeja siempre está a la vista (en mobile, la flecha de volver). */}
                <ExternalLink aria-hidden="true" className="2xl:hidden" />
                <span className="hidden 2xl:inline">{i18n.t("dashboard:savedpropertiespage_ver_propiedad")}</span>
              </Link>
            </>
          )}
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
