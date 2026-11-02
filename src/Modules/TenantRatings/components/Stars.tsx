import { Star } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import i18n from '../../../i18n/instance'
import { formatScore } from '../utils/format'

const STARS = [1, 2, 3, 4, 5]

/** Estrellas de solo lectura: se rellenan las del puntaje redondeado. */
export function Stars({ value, size = 16, className = '' }: { value: number; size?: number; className?: string }) {
  useTranslation()
  const filled = Math.round(value)
  return (
    <span role="img" aria-label={i18n.t('tenantRatings:starsLabel', { value: formatScore(value) })} className={`inline-flex items-center gap-0.5 ${className}`}>
      {STARS.map((star) => <Star key={star} size={size} aria-hidden="true" className={star <= filled ? 'fill-amber-400 text-amber-500' : 'text-slate-300'} />)}
    </span>
  )
}

/** Selector de 1 a 5 estrellas. */
export function StarInput({ value, onChange, disabled = false }: { value: number; onChange: (value: number) => void; disabled?: boolean }) {
  useTranslation()
  return (
    <div role="radiogroup" aria-label={i18n.t('tenantRatings:ratingLabel')} className="flex items-center gap-1">
      {STARS.map((star) => (
        <button
          key={star}
          type="button"
          role="radio"
          aria-checked={value === star}
          aria-label={i18n.t('tenantRatings:starsOption', { count: star })}
          disabled={disabled}
          onClick={() => onChange(star)}
          className="rounded-lg p-1 transition hover:scale-110 focus-visible:outline-2 focus-visible:outline-secondary disabled:opacity-60"
        >
          <Star size={34} aria-hidden="true" className={`pointer-events-none ${star <= value ? 'fill-amber-400 text-amber-500' : 'text-slate-300'}`} />
        </button>
      ))}
    </div>
  )
}
