import { currentLocale } from '../../../i18n/formatters';
import i18n from '../../../i18n/instance';
import { getPrimaryRole, ROLE_LABELS } from '../../Auth/utils/roles'
import type { Conversation, ConversationParticipant } from '../types/message'

export function participantFullName(participant: ConversationParticipant): string {
  return [participant.name, participant.surname1].filter(Boolean).join(' ')
}

export function participantInitials(participant: ConversationParticipant): string {
  return `${participant.name.charAt(0)}${participant.surname1.charAt(0)}`.toUpperCase()
}

/** El otro participante de la conversación, visto desde `currentUserId`. */
export function otherParticipant(conversation: Conversation, currentUserId: number): ConversationParticipant | undefined {
  return conversation.participants.find((participant) => participant.id !== currentUserId)
}

/** Conversación directa (administrador ↔ usuario): no gira en torno a una propiedad. */
export function isDirectConversation(conversation: Conversation): boolean {
  return conversation.property === null
}

/** El rol no es del usuario sino de la conversación: dueño de ESA propiedad o no. */
export function isPropertyOwner(conversation: Conversation, currentUserId: number): boolean {
  return conversation.property?.owner.id === currentUserId
}

/**
 * Etiqueta del interlocutor. En una conversación por propiedad: si yo soy el dueño, el otro es "Inquilino";
 * si no, es el "Arrendatario". En una directa no hay propiedad: se rotula por su rol en la plataforma.
 */
export function otherParticipantRole(conversation: Conversation, currentUserId: number): string {
  if (!isDirectConversation(conversation)) return isPropertyOwner(conversation, currentUserId) ? i18n.t("auth:roles_inquilino") : i18n.t("messages:conversation_arrendatario")

  const role = getPrimaryRole(otherParticipant(conversation, currentUserId)?.roles ?? [])
  return role ? ROLE_LABELS()[role] : i18n.t("dashboard:recentconversationssection_usuario")
}

/** Segunda línea de la bandeja y del chat: la propiedad, o quién escribe si es una conversación directa. */
export function conversationContext(conversation: Conversation, currentUserId: number): string {
  if (conversation.property) return conversation.property.title
  const isAdmin = otherParticipant(conversation, currentUserId)?.roles?.includes('ADMIN')
  return isAdmin ? i18n.t("messages:conversation_mensaje_del_administrador") : i18n.t("messages:conversation_conversacion_directa")
}

/** Fecha corta para la bandeja: "hoy", "ayer" o "12 oct". */
export function shortDate(iso: string, now: Date = new Date()): string {
  const date = new Date(iso)
  const dayMs = 24 * 60 * 60 * 1000
  const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()
  const diffDays = Math.round((startOfDay(now) - startOfDay(date)) / dayMs)
  if (diffDays === 0) return i18n.t("messages:conversation_hoy")
  if (diffDays === 1) return i18n.t("messages:conversation_ayer")
  return date.toLocaleDateString(currentLocale(), { day: 'numeric', month: 'short' })
}
