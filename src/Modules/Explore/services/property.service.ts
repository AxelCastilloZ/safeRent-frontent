import type { Property } from '../interfaces/property.interface'
import { apiBase } from './api.service'

export async function getProperties(
  signal: AbortSignal,
  serviceIds: number[] = [],
): Promise<Property[]> {
  const params = new URLSearchParams()
  if (serviceIds.length) params.set('serviceIds', serviceIds.join(','))
  const response = await fetch(
    `${apiBase}/properties${params.size ? `?${params}` : ''}`,
    { signal },
  )
  if (!response.ok)
    throw new Error('No pudimos cargar las propiedades. Intenta nuevamente.')
  const data: unknown = await response.json()
  if (!Array.isArray(data))
    throw new Error('El servidor devolvió una respuesta inesperada.')
  return data as Property[]
}