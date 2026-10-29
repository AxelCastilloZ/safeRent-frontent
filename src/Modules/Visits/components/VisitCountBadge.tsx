import { useTranslation } from 'react-i18next'

/** Pastilla con la cantidad de citas que esperan una respuesta. No muestra nada si no hay. */
export default function VisitCountBadge({ count, className = '' }: { count: number; className?: string }) {
  const { t } = useTranslation()
  if (count <= 0) return null

  return (
    <span className={`inline-flex min-w-5 shrink-0 items-center justify-center rounded-full bg-amber-400 px-1.5 py-0.5 text-[11px] font-bold leading-none text-primary ${className}`}>
      <span aria-hidden="true">{count > 99 ? '99+' : count}</span>
      <span className="sr-only">{t('visits:pendingBadge', { count })}</span>
    </span>
  )
}
