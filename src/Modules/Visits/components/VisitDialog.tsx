import { X } from 'lucide-react'
import { useEffect, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import i18n from '../../../i18n/instance'

interface VisitDialogProps {
  title: string
  description?: string
  onClose: () => void
  /** Acción en la esquina superior, junto a la X (por ejemplo, chatear con el propietario). */
  headerAction?: ReactNode
  children: ReactNode
}

/** Ventana modal de las citas: Escape o la X la cierran, y el fondo no se desplaza mientras está abierta. */
export default function VisitDialog({ title, description, onClose, headerAction, children }: VisitDialogProps) {
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
        <div className="mb-4 flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
          <div className="min-w-0 flex-1 basis-44">
            <h2 id="visit-dialog-title" className="text-lg font-extrabold text-primary">{title}</h2>
            {description && <p className="mt-1 text-sm text-muted-ink">{description}</p>}
          </div>
          <div className="ml-auto flex shrink-0 items-center gap-1">
            {headerAction}
            <button type="button" onClick={onClose} aria-label={i18n.t('visits:close')} className="grid size-9 shrink-0 place-items-center rounded-lg text-slate-500 transition hover:bg-slate-100">
              <X size={18} aria-hidden="true" />
            </button>
          </div>
        </div>
        {children}
      </div>
    </dialog>,
    document.body,
  )
}
