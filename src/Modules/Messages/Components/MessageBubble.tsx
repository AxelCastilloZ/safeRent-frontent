import { AlertCircle, Check, CheckCheck, RotateCw } from 'lucide-react'
import type { ReactNode } from 'react'
import type { Message, PendingMessage } from '../types/message'

const timeFormat = new Intl.DateTimeFormat('es', { hour: '2-digit', minute: '2-digit' })

interface MessageBubbleProps {
  message: Message
  mine: boolean
}

/** Mensaje ya confirmado por el servidor. Los propios muestran si la otra persona ya los leyó. */
export function MessageBubble({ message, mine }: MessageBubbleProps) {
  const time = timeFormat.format(new Date(message.createdAt))
  return (
    <Bubble
      mine={mine}
      footer={
        mine ? (
          <span className="inline-flex items-center gap-2">
            {time}
            <ReadStatus read={message.readAt !== null} />
          </span>
        ) : (
          time
        )
      }
    >
      {message.message}
    </Bubble>
  )
}

/** ✓ Enviado / ✓✓ Leído (con texto, no solo el ícono, para lectores de pantalla). */
function ReadStatus({ read }: { read: boolean }) {
  return read ? (
    <span className="inline-flex items-center gap-1 font-semibold text-secondary">
      <CheckCheck className="size-3.5" aria-hidden="true" />
      Leído
    </span>
  ) : (
    <span className="inline-flex items-center gap-1">
      <Check className="size-3.5" aria-hidden="true" />
      Enviado
    </span>
  )
}

interface PendingBubbleProps {
  pending: PendingMessage
  onRetry: (localId: string) => void
}

/** Mensaje propio que todavía no se confirmó: "Enviando…" o "No enviado · Reintentar". */
export function PendingBubble({ pending, onRetry }: PendingBubbleProps) {
  const failed = pending.status === 'failed'
  return (
    <Bubble
      mine
      muted={!failed}
      failed={failed}
      footer={
        failed ? (
          <button
            type="button"
            onClick={() => onRetry(pending.localId)}
            className="inline-flex items-center gap-1 font-semibold text-red-700 hover:underline"
          >
            <AlertCircle className="size-3.5" aria-hidden="true" />
            No enviado · Reintentar
            <RotateCw className="size-3.5" aria-hidden="true" />
          </button>
        ) : (
          'Enviando…'
        )
      }
    >
      {pending.text}
    </Bubble>
  )
}

interface BubbleProps {
  mine: boolean
  muted?: boolean
  failed?: boolean
  footer: ReactNode
  children: ReactNode
}

function Bubble({ mine, muted, failed, footer, children }: BubbleProps) {
  const color = failed
    ? 'border border-red-200 bg-red-50 text-primary'
    : mine
      ? 'bg-primary text-white'
      : 'bg-slate-100 text-primary'

  return (
    <div className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm sm:max-w-[70%] ${color} ${muted ? 'opacity-70' : ''}`}>
        <p className="whitespace-pre-wrap break-words">{children}</p>
        <p className={`mt-1 text-[11px] ${failed ? '' : mine ? 'text-white/70' : 'text-slate-500'}`}>{footer}</p>
      </div>
    </div>
  )
}
