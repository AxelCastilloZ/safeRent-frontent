import apiAxios from '../../../api/apiConfig'
import type {
  Conversation,
  CreateConversationRequest,
  Message,
  SendMessageRequest,
} from '../types/message'

const BASE = '/conversations'

export async function getConversations(userId: number): Promise<Conversation[]> {
  const response = await apiAxios.get<Conversation[]>(`${BASE}/user/${userId}`)
  return response.data
}

export async function getConversation(conversationId: number): Promise<Conversation> {
  const response = await apiAxios.get<Conversation>(`${BASE}/${conversationId}`)
  return response.data
}

export async function getMessages(conversationId: number): Promise<Message[]> {
  const response = await apiAxios.get<Message[]>(`${BASE}/${conversationId}/messages`)
  return response.data
}

/** Idempotente en el backend: si ya existe la conversación (misma propiedad y participantes), la devuelve. */
export async function createConversation(payload: CreateConversationRequest): Promise<Conversation> {
  const response = await apiAxios.post<Conversation>(BASE, payload)
  return response.data
}

export async function sendMessage(conversationId: number, payload: SendMessageRequest): Promise<Message> {
  const response = await apiAxios.post<Message>(`${BASE}/${conversationId}/messages`, payload)
  return response.data
}

/** Marca como leídos los mensajes que la otra persona te envió en esa conversación. */
export async function markConversationRead(conversationId: number): Promise<{ updated: number }> {
  const response = await apiAxios.patch<{ updated: number }>(`${BASE}/${conversationId}/read`)
  return response.data
}
