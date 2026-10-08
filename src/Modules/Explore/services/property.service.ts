import type { Property } from '../interfaces/property.interface'
import { apiBase } from './api.service'

export interface PropertyFilters {
  serviceIds?: number[]
  search?: string
  minPrice?: number
  maxPrice?: number
  minRooms?: number
  typeOfPropertyId?: number
}

export async function getProperties(
  signal: AbortSignal,
  filters: PropertyFilters = {},
): Promise<Property[]> {
  const params = new URLSearchParams()
  const { serviceIds = [], search, minPrice, maxPrice, minRooms, typeOfPropertyId } = filters

  if (serviceIds.length) params.set('serviceIds', serviceIds.join(','))
  if (search) params.set('search', search)
  if (minPrice !== undefined) params.set('minPrice', String(minPrice))
  if (maxPrice !== undefined) params.set('maxPrice', String(maxPrice))
  if (minRooms !== undefined) params.set('minRooms', String(minRooms))
  if (typeOfPropertyId !== undefined) params.set('typeOfPropertyId', String(typeOfPropertyId))
  params.set('limit', '100')

  const properties = new Map<number, Property>()
  let totalPages = 1

  for (let page = 1; page <= totalPages; page++) {
    params.set('page', String(page))
    const response = await fetch(`${apiBase}/properties?${params}`, { signal })
    if (!response.ok)
      throw new Error('No pudimos cargar las propiedades. Intenta nuevamente.')
    const payload: unknown = await response.json()

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

export interface PropertyType {
  id: number
  name: string
}

export async function getPropertyTypes(signal: AbortSignal): Promise<PropertyType[]> {
  const response = await fetch(`${apiBase}/properties/types`, { signal })
  if (!response.ok) throw new Error('No se pudieron cargar los tipos de propiedad.')
  const data: unknown = await response.json()
  if (!Array.isArray(data)) throw new Error('El servidor devolvió una respuesta inesperada.')
  return data as PropertyType[]
}
