import { Send } from 'lucide-react'
import { useState } from 'react'
import type { SubmitEvent } from 'react'
import { buttonStyles } from './buttonStyles'

// Mismo límite que valida el backend (CreateMessageDto).
const MAX_LENGTH = 2000

interface MessageComposerProps {
  onSend: (text: string) => void
  disabled?: boolean
}

/** Caja de texto del chat: Enter envía; no deja enviar mensajes vacíos. */
export default function MessageComposer({ onSend, disabled }: MessageComposerProps) {
  const [text, setText] = useState('')
  const trimmed = text.trim()

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!trimmed || disabled) return
    onSend(trimmed)
    setText('')
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-slate-200 bg-white p-3">
      <input
        type="text"
        value={text}
        onChange={(event) => setText(event.target.value)}
        maxLength={MAX_LENGTH}
        placeholder="Escribe un mensaje…"
        aria-label="Mensaje"
        autoComplete="off"
        className="h-9 min-w-0 flex-1 rounded-md border border-slate-200 bg-white px-3 text-sm outline-none transition focus-visible:border-secondary focus-visible:ring-[3px] focus-visible:ring-secondary/30"
      />
      <button type="submit" disabled={!trimmed || disabled} className={buttonStyles.primary}>
        <Send aria-hidden="true" />
        <span className="max-sm:sr-only">Enviar</span>
      </button>
    </form>
  )
}
