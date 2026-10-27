import { X } from 'lucide-react'
import { useEffect, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import i18n from '../../../i18n/instance'

interface VisitDialogProps {
  title: string
  description?: string
  onClose: () => void
  children: ReactNode
}

/** Ventana modal de las citas: Escape o la X la cierran, y el fondo no se desplaza mientras está abierta. */
export default function VisitDialog({ title, description, onClose, children }: VisitDialogProps) {
  useTranslation()
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
      aria-labelledby="visit-dialog-title"
      className="m-auto max-h-[92vh] w-[min(640px,94vw)] overflow-y-auto rounded-2xl border border-slate-200 bg-white p-0 shadow-xl backdrop:bg-slate-900/40"
      onCancel={(event) => { event.preventDefault(); onClose() }}
    >
      <div className="p-5 sm:p-6">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h2 id="visit-dialog-title" className="text-lg font-extrabold text-primary">{title}</h2>
            {description && <p className="mt-1 text-sm text-muted-ink">{description}</p>}
          </div>
          <button type="button" onClick={onClose} aria-label={i18n.t('visits:close')} className="grid size-9 shrink-0 place-items-center rounded-lg text-slate-500 transition hover:bg-slate-100">
            <X size={18} aria-hidden="true" />
          </button>
        </div>
        {children}
      </div>
    </dialog>,
    document.body,
  )
}
