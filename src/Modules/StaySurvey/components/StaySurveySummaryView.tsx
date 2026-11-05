import { Briefcase, Droplets, Wifi, Zap } from 'lucide-react'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import i18n from '../../../i18n/instance'
import { useStaySurveySummary } from '../hooks/staySurveyHooks'

function Item({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <li className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3">
      <span className="grid size-9 shrink-0 place-items-center rounded-full bg-slate-100 text-secondary">{icon}</span>
      <div className="min-w-0">
        <p className="text-xs text-neutral/70">{label}</p>
        <p className="font-bold text-primary">{value}</p>
      </div>
    </li>
  )
}

/** "Experiencia de inquilinos": lo que dijeron en promedio quienes ya vivieron en la propiedad. No aparece si aún nadie la ha respondido. */
export default function StaySurveySummaryView({ propertyId }: { propertyId: number }) {
  useTranslation()
  const summary = useStaySurveySummary(propertyId)
  const data = summary.data
  if (!data || data.count === 0) return null

  const outOfFive = (value: number | null) => (value === null ? '—' : i18n.t('staySurvey:outOfFive', { value }))
  return (
    <section className="mt-8 border-t border-slate-200 pt-6" aria-labelledby="stay-survey-summary-title">
      <h2 id="stay-survey-summary-title" className="text-xl font-bold">{i18n.t('staySurvey:summaryTitle')}</h2>
      <p className="mt-1 text-sm text-neutral/70">{i18n.t('staySurvey:summaryBasedOn', { count: data.count })}</p>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        <Item icon={<Droplets size={18} aria-hidden="true" />} label={i18n.t('staySurvey:water')} value={outOfFive(data.waterStability)} />
        <Item icon={<Zap size={18} aria-hidden="true" />} label={i18n.t('staySurvey:electricity')} value={outOfFive(data.electricityStability)} />
        <Item icon={<Wifi size={18} aria-hidden="true" />} label={i18n.t('staySurvey:internetShort')} value={data.internetMbps === null ? '—' : i18n.t('staySurvey:mbps', { value: data.internetMbps })} />
        <Item icon={<Briefcase size={18} aria-hidden="true" />} label={i18n.t('staySurvey:workAreaShort')} value={data.hasWorkArea ? i18n.t('staySurvey:yes') : i18n.t('staySurvey:no')} />
      </ul>
    </section>
  )
}
