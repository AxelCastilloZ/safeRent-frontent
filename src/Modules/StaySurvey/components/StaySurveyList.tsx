import { ClipboardCheck } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import i18n from '../../../i18n/instance'
import { formatDate } from '../../../i18n/formatters'
import { useMyStays } from '../hooks/staySurveyHooks'
import type { MyStay } from '../types/staySurvey'
import StaySurveyDialog from './StaySurveyDialog'

/**
 * Sección del inquilino con sus estadías terminadas: las que aún no tienen encuesta se resaltan.
 * Lo que responde aquí se promedia con lo de otros inquilinos y alimenta los filtros del explorador.
 */
export default function StaySurveyList() {
  useTranslation()
  const stays = useMyStays()
  const [answering, setAnswering] = useState<MyStay | null>(null)

  if (!stays.data?.length) return null
  const pending = stays.data.filter((stay) => !stay.survey).length

  return (
    <section aria-labelledby="stay-survey-title" className="mt-10">
      <h2 id="stay-survey-title" className="text-xl font-bold text-primary">{i18n.t('staySurvey:sectionTitle')}</h2>
      <p className="mb-4 mt-1 text-sm text-muted-ink">{pending > 0 ? i18n.t('staySurvey:sectionPending', { count: pending }) : i18n.t('staySurvey:sectionDone')}</p>
      <ul className="flex flex-col gap-3">
        {stays.data.map((stay) => (
          <li key={stay.reservationId} className={`flex flex-wrap items-center justify-between gap-3 rounded-xl border p-4 ${stay.survey ? 'border-slate-200 bg-white' : 'border-amber-300 bg-amber-50/60'}`}>
            <div>
              <p className="font-semibold text-primary">{stay.property.title}</p>
              <p className="text-sm text-muted-ink">{i18n.t('staySurvey:endedOn', { date: formatDate(stay.endedAt) })}</p>
            </div>
            <button
              type="button"
              onClick={() => setAnswering(stay)}
              className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition ${stay.survey ? 'border border-slate-200 text-primary hover:bg-slate-50' : 'bg-secondary text-white hover:bg-secondary-dark'}`}
            ><ClipboardCheck size={16} aria-hidden="true" />{stay.survey ? i18n.t('staySurvey:edit') : i18n.t('staySurvey:answer')}</button>
          </li>
        ))}
      </ul>
      {answering && <StaySurveyDialog stay={answering} onClose={() => setAnswering(null)} />}
    </section>
  )
}
