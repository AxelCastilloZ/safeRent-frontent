import i18n from '../../../i18n/instance';
import type { PropertyStatus } from '../types/property';

/** Variantes de `StatusBadge` — una por cada `PropertyStatus`. */
export type PropertyStatusVariant = 'draft' | 'pending' | 'active' | 'changes' | 'inactive'

const VARIANT_BY_STATUS: Record<PropertyStatus, PropertyStatusVariant> = {
  DRAFT: 'draft',
  PENDING: 'pending',
  ACTIVE: 'active',
  CHANGES_REQUESTED: 'changes',
  INACTIVE: 'inactive',
}

export const PROPERTY_STATUS_LABELS: () => Record<PropertyStatus, string> = () => ({
  DRAFT: i18n.t("property:statusbadge_borrador"),
  PENDING: i18n.t("dashboard:adminpropertiespage_en_revision"),
  ACTIVE: i18n.t("property:statusbadge_activa"),
  CHANGES_REQUESTED: i18n.t("property:statusbadge_requiere_cambios"),
  INACTIVE: i18n.t("property:statusbadge_inactiva"),
})

/** Variante de `StatusBadge` que corresponde al estado real de la propiedad. */
export function statusBadgeVariant(status: PropertyStatus): PropertyStatusVariant {
  return VARIANT_BY_STATUS[status]
}
