import { useTranslation } from 'react-i18next';
import i18n from '../../../i18n/instance';
type BadgeVariant = 'active' | 'draft' | 'pending' | 'changes' | 'inactive'

type StatusBadgeProps = {
  variant: BadgeVariant
  label?: string
}

const defaultLabels: () => Record<BadgeVariant, string> = () => ({
  active: i18n.t("property:statusbadge_activa"),
  draft: i18n.t("property:statusbadge_borrador"),
  pending: i18n.t("dashboard:adminpropertiespage_en_revision"),
  changes: i18n.t("property:statusbadge_requiere_cambios"),
  inactive: i18n.t("property:statusbadge_inactiva"),
})

const variantClasses: Record<BadgeVariant, string> = {
  active: 'bg-green-100 text-green-700',
  draft: 'bg-slate-100 text-slate-600',
  pending: 'bg-blue-100 text-blue-700',
  changes: 'bg-amber-100 text-amber-700',
  inactive: 'bg-red-100 text-red-700',
}

export default function StatusBadge({ variant, label }: StatusBadgeProps) {
  useTranslation();
  return (
    <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${variantClasses[variant]}`}>
      {label ?? defaultLabels()[variant]}
    </span>
  )
}
