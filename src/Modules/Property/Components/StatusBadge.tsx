type BadgeVariant = 'active' | 'draft' | 'review' | 'pending'

type StatusBadgeProps = {
  variant: BadgeVariant
  label?: string
}

const defaultLabels: Record<BadgeVariant, string> = {
  active: 'Activa',
  draft: 'Borrador',
  review: 'En revisión',
  pending: 'Pendiente',
}

const variantClasses: Record<BadgeVariant, string> = {
  active: 'bg-green-100 text-green-700',
  draft: 'bg-slate-100 text-slate-600',
  review: 'bg-yellow-100 text-yellow-700',
  pending: 'bg-blue-100 text-blue-700',
}

export default function StatusBadge({ variant, label }: StatusBadgeProps) {
  return (
    <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${variantClasses[variant]}`}>
      {label ?? defaultLabels[variant]}
    </span>
  )
}
