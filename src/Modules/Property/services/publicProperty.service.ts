import type { Property } from '../../Explore/interfaces/property.interface'
import { apiBase } from '../../Explore/services/api.service'

export interface PublicProperty extends Property {
  owner: { id: number; name: string }
  iconDescriptions?: { id: number; title: string; icon: string }[]
}

export async function getPublicProperty(id: number, signal: AbortSignal): Promise<PublicProperty> {
  const response = await fetch(`${apiBase}/properties/active/${id}`, { signal })
  if (!response.ok) throw new Error(response.status === 404 ? 'Esta propiedad ya no está disponible.' : 'No pudimos cargar la propiedad. Intenta nuevamente.')
  return response.json()
}
