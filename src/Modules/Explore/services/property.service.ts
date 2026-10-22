import type { CatalogTranslations } from '../../../i18n/catalog';
import { LocalizedError } from '../../../i18n/messages';
import type { Property } from '../interfaces/property.interface'
import { apiBase } from './api.service'

export interface PropertyFilters {
  serviceIds?: number[]
  search?: string
  minPrice?: number
  maxPrice?: number
  minRooms?: number
  typeOfPropertyId?: number
  displayCurrency?: string
  sourceCurrency?: string
  sort?: 'newest' | 'price_asc' | 'price_desc'
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
  if (filters.displayCurrency) params.set('displayCurrency', filters.displayCurrency)
  if (filters.sourceCurrency) params.set('sourceCurrency', filters.sourceCurrency)
  if (filters.sort) params.set('sort', filters.sort)

  const properties = new Map<number, Property>()
  let totalPages = 1

  for (let page = 1; page <= totalPages; page++) {
    params.set('page', String(page))
    const response = await fetch(`${apiBase}/properties?${params}`, { signal })
    if (!response.ok)
      throw new LocalizedError("explore:property.service_no_pudimos_cargar_las_propiedades_intenta_nuevamente")
    const payload: unknown = await response.json()

    if (Array.isArray(payload) && page === 1) return payload as Property[]
    if (
      !payload || typeof payload !== 'object' ||
      !('data' in payload) || !Array.isArray(payload.data) ||
      !('totalPages' in payload) || typeof payload.totalPages !== 'number' ||
      !Number.isSafeInteger(payload.totalPages) || payload.totalPages < 0 ||
      payload.totalPages > 1000
    ) throw new LocalizedError("explore:api.service_el_servidor_devolvio_una_respuesta_inesperada")

    totalPages = payload.totalPages
    if ('priceContext' in payload && payload.priceContext && typeof payload.priceContext === 'object' && 'batchId' in payload.priceContext && (payload.priceContext.batchId === null || typeof payload.priceContext.batchId === 'number')) {
      params.set('rateBatchId', String(payload.priceContext.batchId ?? 0))
    }
    for (const property of payload.data as Property[]) properties.set(property.id, property)
  }

  return [...properties.values()]
}

export interface PropertyType {
  catalogCode?: string | null
  translations?: CatalogTranslations | null
  id: number
  name: string
  description?: string | null
}

export async function getPropertyTypes(signal: AbortSignal): Promise<PropertyType[]> {
  const response = await fetch(`${apiBase}/properties/types`, { signal })
  if (!response.ok) throw new LocalizedError("explore:property.service_no_se_pudieron_cargar_los_tipos_de_propiedad")
  const data: unknown = await response.json()
  if (!Array.isArray(data)) throw new LocalizedError("explore:api.service_el_servidor_devolvio_una_respuesta_inesperada")
  return data as PropertyType[]
}
