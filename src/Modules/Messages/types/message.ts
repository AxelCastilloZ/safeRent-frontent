export interface ConversationParticipant {
  id: number
  name: string
  surname1: string
  surname2?: string | null
}

import type { ReservationState } from '../../Reservations/models/reservation'

export interface ConversationProperty extends ReservationState {
  id: number
  title: string
  status: string
  owner: { id: number; name: string }
}

export interface Conversation {
  id: number
  createdAt: string
  /** Mensajes de la otra persona que aún no abriste. Solo viene en la bandeja (GET /conversations/user/:id). */
  unreadCount?: number
  participants: ConversationParticipant[]
  property: ConversationProperty
}

export interface Message {
  id: number
  message: string
  createdAt: string
  /** Cuándo lo vio la otra persona; null = sin leer. */
  readAt: string | null
  sender: ConversationParticipant
}

export interface CreateConversationRequest {
  participantIds: [number, number]
  propertyId: number
}

export interface SendMessageRequest {
  message: string
  senderId: number
}

/** Mensaje propio todavía no confirmado por el servidor (envío optimista). */
export interface PendingMessage {
  localId: string
  text: string
  status: 'sending' | 'failed'
}
