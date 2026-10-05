import { useCallback, useEffect, useRef, useState } from 'react'
import type { PendingMessage } from '../types/message'
import { useSendMessage } from './messageHooks'

/**
 * Cola de envío optimista: el mensaje aparece al instante como "Enviando…",
 * y si el servidor falla queda como "No enviado · Reintentar" en vez de perderse.
 */
export function useOutbox(conversationId: number, senderId: number | undefined) {
  const [pending, setPending] = useState<PendingMessage[]>([])
  const { mutateAsync } = useSendMessage(conversationId)
  const pendingRef = useRef(pending)

  useEffect(() => {
    pendingRef.current = pending
  }, [pending])

  const deliver = useCallback(
    async (localId: string, text: string) => {
      if (senderId === undefined) return
      try {
        await mutateAsync({ message: text, senderId })
        setPending((current) => current.filter((item) => item.localId !== localId))
      } catch {
        setPending((current) =>
          current.map((item) => (item.localId === localId ? { ...item, status: 'failed' } : item)),
        )
      }
    },
    [mutateAsync, senderId],
  )

  const send = useCallback(
    (text: string) => {
      const localId = crypto.randomUUID()
      setPending((current) => [...current, { localId, text, status: 'sending' }])
      void deliver(localId, text)
    },
    [deliver],
  )

  const retry = useCallback(
    (localId: string) => {
      const item = pendingRef.current.find((candidate) => candidate.localId === localId)
      if (!item || item.status !== 'failed') return
      setPending((current) =>
        current.map((candidate) => (candidate.localId === localId ? { ...candidate, status: 'sending' } : candidate)),
      )
      void deliver(localId, item.text)
    },
    [deliver],
  )

  // Al volver la conexión se reintentan solos los que habían fallado.
  useEffect(() => {
    const retryFailed = () => {
      pendingRef.current.filter((item) => item.status === 'failed').forEach((item) => retry(item.localId))
    }
    window.addEventListener('online', retryFailed)
    return () => window.removeEventListener('online', retryFailed)
  }, [retry])

  return { pending, send, retry }
}
