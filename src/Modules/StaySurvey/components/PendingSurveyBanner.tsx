import { Link } from '@tanstack/react-router'
import { ClipboardCheck } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import i18n from '../../../i18n/instance'
import { useMyStays } from '../hooks/staySurveyHooks'
import type { MyStay } from '../types/staySurvey'
import StaySurveyDialog from './StaySurveyDialog'
import StaySurveyThanksDialog from './StaySurveyThanksDialog'

/** Cuántas encuestas pendientes se nombran en el aviso; el resto se ve en "Mis reservaciones". */
const VISIBLE_ROWS = 3

/**
 * Aviso en el inicio del inquilino cuando terminó una estadía y le falta contar cómo fue.
 * Es uno solo sin importar cuántas haya; cada pendiente tiene su botón, así la persona elige cuál responde.
 */
export default function PendingSurveyBanner() {
  useTranslation()
  const stays = useMyStays()
  const [answering, setAnswering] = useState<MyStay | null>(null)
  const [thanks, setThanks] = useState(false)
  const pending = (stays.data ?? []).filter((stay) => !stay.survey)

  return (
    <>
      {pending.length > 0 && (
        <section aria-labelledby="pending-survey-title" className="my-6 rounded-2xl border border-amber-300 bg-amber-50 p-4 sm:p-5">
          <div className="flex items-start gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-amber-100 text-amber-700"><ClipboardCheck size={20} aria-hidden="true" /></span>
            <div>
              <h2 id="pending-survey-title" className="font-bold text-primary">{i18n.t('staySurvey:bannerTitle', { count: pending.length })}</h2>
              <p className="text-sm text-muted-ink">{i18n.t('staySurvey:bannerDescription')}</p>
            </div>
          </div>
          <ul className="mt-3 space-y-2">
            {pending.slice(0, VISIBLE_ROWS).map((stay) => (
              <li key={stay.reservationId} className="flex items-center justify-between gap-3 rounded-xl bg-white/80 px-3 py-2">
                <span className="min-w-0 truncate text-sm font-semibold text-primary">{stay.property.title}</span>
                <button type="button" onClick={() => setAnswering(stay)} className="shrink-0 rounded-lg bg-secondary px-3 py-1.5 text-sm font-bold text-white transition hover:bg-secondary-dark">{i18n.t('staySurvey:bannerAction')}</button>
              </li>
            ))}
          </ul>
          {pending.length > VISIBLE_ROWS && (
            <Link to="/dashboard/reservations" className="mt-3 inline-block text-sm font-bold text-secondary hover:underline">{i18n.t('staySurvey:bannerSeeAll', { count: pending.length })}</Link>
          )}
        </section>
      )}
      {answering && <StaySurveyDialog stay={answering} onClose={() => setAnswering(null)} onSubmitted={() => { setAnswering(null); setThanks(true) }} />}
      {thanks && !answering && (
        <StaySurveyThanksDialog
          remaining={pending}
          onAnswer={(stay) => { setThanks(false); setAnswering(stay) }}
          onClose={() => setThanks(false)}
        />
      )}
    </>
  )
}
