import { Star } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import i18n from '../../../i18n/instance'
import { useTenantRatingSummary } from '../hooks/tenantRatingHooks'
import { formatScore } from '../utils/format'

/** Estrella y promedio junto al nombre de un inquilino, o "Sin calificaciones" si nadie lo ha calificado. No muestra nada si no se pudo consultar. */
export default function TenantRatingBadge({ tenantId }: { tenantId: number }) {
  useTranslation()
  const summary = useTenantRatingSummary(tenantId)
  if (!summary.data) return null
  const { average, count } = summary.data
  if (average === null) {
    return <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600">{i18n.t('tenantRatings:noRatings')}</span>
  }
  return (
    <span
      title={i18n.t('tenantRatings:badgeTitle', { average: formatScore(average), count })}
      className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-bold text-amber-900"
    >
      <Star size={12} aria-hidden="true" className="fill-amber-400 text-amber-500" />
      {formatScore(average)}
      <span className="font-semibold text-amber-800/80">({count})</span>
    </span>
  )
}
