export interface ConversationParticipant {
  id: number
  name: string
  surname1: string
  surname2?: string | null
}

export interface ConversationProperty {
  id: number
  title: string
  owner: { id: number; name: string }
}

export interface Conversation {
  id: number
  createdAt: string
  participants: ConversationParticipant[]
  property: ConversationProperty
}

export interface Message {
  id: number
  message: string
  createdAt: string
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
