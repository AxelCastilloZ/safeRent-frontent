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

export const PROPERTY_STATUS_LABELS: Record<PropertyStatus, string> = {
  DRAFT: 'Borrador',
  PENDING: 'En revisión',
  ACTIVE: 'Activa',
  CHANGES_REQUESTED: 'Requiere cambios',
  INACTIVE: 'Inactiva',
}

/** Variante de `StatusBadge` que corresponde al estado real de la propiedad. */
export function statusBadgeVariant(status: PropertyStatus): PropertyStatusVariant {
  return VARIANT_BY_STATUS[status]
}
