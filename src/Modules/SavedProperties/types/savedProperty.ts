import type { Property } from '../../Explore/interfaces/property.interface'

/** Tarjeta de una propiedad guardada (GET /saved-properties). */
export interface SavedProperty extends Property {
  status: string
  owner: { id: number; name: string }
  /** Solo indica si está reservada, nunca a nombre de quién. */
  reserved: boolean
  /** false cuando la propiedad dejó de estar activa: se muestra marcada y se puede quitar. */
  available: boolean
  savedAt: string
}

export interface ImportSavedResult {
  saved: number
  skipped: number
}
