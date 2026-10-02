import { MessageSquare } from 'lucide-react'

/** Panel derecho de /messages cuando todavía no se eligió una conversación (wireframe 3a). */
export default function MessagesIndexPage() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center text-slate-500">
      <MessageSquare className="size-10" aria-hidden="true" />
      <p>Escoge una conversación para ver los mensajes.</p>
    </div>
  )
}
