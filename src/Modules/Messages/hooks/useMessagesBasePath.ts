import { createContext, useContext } from 'react'

/**
 * Ruta donde está montado Mensajes. La bandeja y el chat se montan dentro de cada
 * área del panel (cliente, propietario, admin), y los links internos (abrir un chat,
 * volver a la bandeja) deben quedarse en esa área. El panel entrega el valor.
 */
export const MessagesBasePathContext = createContext<string>('/dashboard/messages')

export function useMessagesBasePath(): string {
  return useContext(MessagesBasePathContext)
}
