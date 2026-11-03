import { CheckCircle2 } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import i18n from '../../../i18n/instance'
import type { MyStay } from '../types/staySurvey'

interface StaySurveyThanksDialogProps {
  /** Encuestas que aún le faltan: si hay, el inquilino decide si sigue y con cuál. */
  remaining: MyStay[]
  onAnswer: (stay: MyStay) => void
  onClose: () => void
}

/** Agradece la encuesta enviada y, si quedan otras, deja que la persona elija si sigue respondiendo (y cuál) o vuelve al panel. */
export default function StaySurveyThanksDialog({ remaining, onAnswer, onClose }: StaySurveyThanksDialogProps) {
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
      aria-labelledby="stay-survey-thanks-title"
      className="m-auto w-[min(440px,92vw)] rounded-2xl border border-slate-200 bg-white p-0 shadow-xl backdrop:bg-slate-900/40"
      onCancel={(event) => { event.preventDefault(); onClose() }}
    >
      <div className="p-6">
        <div className="flex flex-col items-center gap-3 text-center">
          <span className="grid size-14 place-items-center rounded-full bg-green-50 text-green-700"><CheckCircle2 size={32} aria-hidden="true" /></span>
          <h2 id="stay-survey-thanks-title" className="text-xl font-extrabold text-primary">{i18n.t('staySurvey:thanksTitle')}</h2>
          <p className="text-sm text-muted-ink">{remaining.length > 0 ? i18n.t('staySurvey:thanksMore', { count: remaining.length }) : i18n.t('staySurvey:thanksDone')}</p>
        </div>

        {remaining.length > 0 && (
          <ul className="mt-5 max-h-56 space-y-2 overflow-y-auto">
            {remaining.map((stay) => (
              <li key={stay.reservationId} className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 p-3">
                <span className="min-w-0 truncate text-sm font-semibold text-primary">{stay.property.title}</span>
                <button type="button" onClick={() => onAnswer(stay)} className="shrink-0 rounded-lg bg-secondary px-3 py-1.5 text-sm font-bold text-white transition hover:bg-secondary-dark">{i18n.t('staySurvey:bannerAction')}</button>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-6 flex justify-end">
          <button type="button" onClick={onClose} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-primary transition hover:bg-slate-50">
            {remaining.length > 0 ? i18n.t('staySurvey:thanksBack') : i18n.t('staySurvey:thanksClose')}
          </button>
        </div>
      </div>
    </dialog>,
    document.body,
  )
}
