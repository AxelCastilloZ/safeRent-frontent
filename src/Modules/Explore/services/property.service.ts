import type { Property } from '../interfaces/property.interface'
import { apiBase } from './api.service'

export async function getProperties(
  signal: AbortSignal,
  serviceIds: number[] = [],
): Promise<Property[]> {
  const params = new URLSearchParams()
  if (serviceIds.length) params.set('serviceIds', serviceIds.join(','))
  params.set('limit', '100')
  const properties = new Map<number, Property>()
  let totalPages = 1

  for (let page = 1; page <= totalPages; page++) {
    params.set('page', String(page))
    const response = await fetch(`${apiBase}/properties?${params}`, { signal })
    if (!response.ok)
      throw new Error('No pudimos cargar las propiedades. Intenta nuevamente.')
    const payload: unknown = await response.json()

    // También admite la respuesta anterior sin paginación.
    if (Array.isArray(payload) && page === 1) return payload as Property[]
    if (
      !payload || typeof payload !== 'object' ||
      !('data' in payload) || !Array.isArray(payload.data) ||
      !('totalPages' in payload) || typeof payload.totalPages !== 'number' ||
      !Number.isSafeInteger(payload.totalPages) || payload.totalPages < 0 ||
      payload.totalPages > 1000
    ) throw new Error('El servidor devolvió una respuesta inesperada.')

    totalPages = payload.totalPages
    for (const property of payload.data as Property[]) properties.set(property.id, property)
  }

  return [...properties.values()]
}
