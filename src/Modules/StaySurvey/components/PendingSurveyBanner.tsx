import { Link } from '@tanstack/react-router'
import { ClipboardCheck } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import i18n from '../../../i18n/instance'
import { useMyStays } from '../hooks/staySurveyHooks'

/** Aviso en el inicio del inquilino cuando terminó una estadía y le falta contar cómo fue. */
export default function PendingSurveyBanner() {
  useTranslation()
  const stays = useMyStays()
  const pending = (stays.data ?? []).filter((stay) => !stay.survey).length
  if (pending === 0) return null
  return (
    <div role="status" className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-300 bg-amber-50 p-4">
      <div className="flex items-start gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-full bg-amber-100 text-amber-700"><ClipboardCheck size={20} aria-hidden="true" /></span>
        <div>
          <p className="font-bold text-primary">{i18n.t('staySurvey:bannerTitle', { count: pending })}</p>
          <p className="text-sm text-muted-ink">{i18n.t('staySurvey:bannerDescription')}</p>
        </div>
      </div>
      <Link to="/dashboard/reservations" className="rounded-lg bg-secondary px-4 py-2 text-sm font-bold text-white transition hover:bg-secondary-dark">{i18n.t('staySurvey:bannerAction')}</Link>
    </div>
  )
}
