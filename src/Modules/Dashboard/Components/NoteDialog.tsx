import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { LoaderCircle, MessageSquareWarning } from 'lucide-react'

interface NoteDialogProps {
  title: string
  description: string
  confirmLabel: string
  placeholder?: string
  loading?: boolean
  error?: string | null
  onConfirm: (note: string) => void
  onCancel: () => void
}

/** Diálogo con un campo de texto obligatorio: para pedir cambios o rechazar con una nota al propietario. */
export default function NoteDialog({
  title,
  description,
  confirmLabel,
  placeholder,
  loading,
  error,
  onConfirm,
  onCancel,
}: NoteDialogProps) {
  const dialog = useRef<HTMLDialogElement>(null)
  const [note, setNote] = useState('')
  const [validation, setValidation] = useState('')

  useEffect(() => {
    const element = dialog.current!
    const overflow = document.body.style.overflow
    element.showModal()
    document.body.style.overflow = 'hidden'
    return () => {
      element.close()
      document.body.style.overflow = overflow
    }
  }, [])

  function submit() {
    if (!note.trim()) {
      setValidation('Escribe una nota para el propietario.')
      return
    }
    setValidation('')
    onConfirm(note.trim())
  }

  return createPortal(
    <dialog
      ref={dialog}
      className="m-auto w-[min(480px,90vw)] rounded-2xl border border-slate-200 bg-white p-0 shadow-xl backdrop:bg-slate-900/40"
      aria-labelledby="note-dialog-title"
      onCancel={(event) => {
        event.preventDefault()
        if (!loading) onCancel()
      }}
    >
      <div className="p-6">
        <div className="mb-4 flex items-start gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-amber-100 text-amber-600">
            <MessageSquareWarning size={20} aria-hidden="true" />
          </span>
          <div>
            <h2 id="note-dialog-title" className="text-base font-bold text-primary">
              {title}
            </h2>
            <p className="mt-1 text-sm text-muted-ink">{description}</p>
          </div>
        </div>

        <label htmlFor="note-dialog-text" className="mb-1.5 block text-sm font-medium text-primary">
          Nota para el propietario
        </label>
        <textarea
          id="note-dialog-text"
          rows={4}
          maxLength={500}
          value={note}
          placeholder={placeholder}
          disabled={loading}
          onChange={(event) => setNote(event.target.value)}
          className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-primary outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
        />
        <div className="mt-1 flex justify-end text-xs text-slate-400">{note.length}/500</div>

        {(validation || error) && (
          <p role="alert" className="mb-2 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">
            {validation || error}
          </p>
        )}

        <div className="mt-2 flex items-center justify-end gap-2">
          <button
            type="button"
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-primary transition hover:bg-slate-50"
            disabled={loading}
            onClick={onCancel}
          >
            Cancelar
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white transition hover:bg-primary-dark disabled:opacity-60"
            disabled={loading}
            onClick={submit}
          >
            {loading && <LoaderCircle size={15} className="animate-spin" />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </dialog>,
    document.body,
  )
}
