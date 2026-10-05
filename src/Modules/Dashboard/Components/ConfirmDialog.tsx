import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { AlertTriangle, LoaderCircle } from 'lucide-react'

interface ConfirmDialogProps {
  title: string
  description: string
  confirmLabel: string
  cancelLabel?: string
  /** Estilo del botón de confirmar: rojo para acciones destructivas (eliminar), primario para el resto. */
  danger?: boolean
  loading?: boolean
  error?: string | null
  onConfirm: () => void
  onCancel: () => void
}

/** Diálogo de confirmación genérico (eliminar, desactivar, rechazar…) para las pantallas del panel. */
export default function ConfirmDialog({
  title,
  description,
  confirmLabel,
  cancelLabel = 'Cancelar',
  danger,
  loading,
  error,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const dialog = useRef<HTMLDialogElement>(null)

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

  return createPortal(
    <dialog
      ref={dialog}
      className="m-auto w-[min(420px,90vw)] rounded-2xl border border-slate-200 bg-white p-0 shadow-xl backdrop:bg-slate-900/40"
      aria-labelledby="confirm-dialog-title"
      onCancel={(event) => {
        event.preventDefault()
        if (!loading) onCancel()
      }}
    >
      <div className="p-6">
        <div className="mb-4 flex items-start gap-3">
          <span className={`grid size-10 shrink-0 place-items-center rounded-full ${danger ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'}`}>
            <AlertTriangle size={20} aria-hidden="true" />
          </span>
          <div>
            <h2 id="confirm-dialog-title" className="text-base font-bold text-primary">
              {title}
            </h2>
            <p className="mt-1 text-sm text-muted-ink">{description}</p>
          </div>
        </div>

        {error && (
          <p role="alert" className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">
            {error}
          </p>
        )}

        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-primary transition hover:bg-slate-50"
            disabled={loading}
            onClick={onCancel}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold text-white transition disabled:opacity-60 ${
              danger ? 'bg-red-600 hover:bg-red-700' : 'bg-primary hover:bg-primary-dark'
            }`}
            disabled={loading}
            onClick={onConfirm}
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
