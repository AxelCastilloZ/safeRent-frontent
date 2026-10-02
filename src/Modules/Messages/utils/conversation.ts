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

/** El rol no es del usuario sino de la conversación: dueño de ESA propiedad o no. */
export function isPropertyOwner(conversation: Conversation, currentUserId: number): boolean {
  return conversation.property.owner.id === currentUserId
}

/** Etiqueta del interlocutor: si yo soy el dueño, el otro es "Inquilino"; si no, es el "Arrendatario". */
export function otherParticipantRole(conversation: Conversation, currentUserId: number): 'Inquilino' | 'Arrendatario' {
  return isPropertyOwner(conversation, currentUserId) ? 'Inquilino' : 'Arrendatario'
}

/** Fecha corta para la bandeja: "hoy", "ayer" o "12 oct". */
export function shortDate(iso: string, now: Date = new Date()): string {
  const date = new Date(iso)
  const dayMs = 24 * 60 * 60 * 1000
  const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()
  const diffDays = Math.round((startOfDay(now) - startOfDay(date)) / dayMs)
  if (diffDays === 0) return 'Hoy'
  if (diffDays === 1) return 'Ayer'
  return date.toLocaleDateString('es', { day: 'numeric', month: 'short' })
}
