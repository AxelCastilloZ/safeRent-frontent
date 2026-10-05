type BadgeVariant = 'active' | 'draft' | 'pending' | 'changes' | 'inactive'

type StatusBadgeProps = {
  variant: BadgeVariant
  label?: string
}

const defaultLabels: Record<BadgeVariant, string> = {
  active: 'Activa',
  draft: 'Borrador',
  pending: 'En revisión',
  changes: 'Requiere cambios',
  inactive: 'Inactiva',
}

const variantClasses: Record<BadgeVariant, string> = {
  active: 'bg-green-100 text-green-700',
  draft: 'bg-slate-100 text-slate-600',
  pending: 'bg-blue-100 text-blue-700',
  changes: 'bg-amber-100 text-amber-700',
  inactive: 'bg-red-100 text-red-700',
}

export default function StatusBadge({ variant, label }: StatusBadgeProps) {
  return (
    <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${variantClasses[variant]}`}>
      {label ?? defaultLabels[variant]}
    </span>
  )
}
