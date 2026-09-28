import type { PropertyService } from '../interfaces/property.interface'
import { getJsonArray } from './api.service'

export async function getServices(
  signal: AbortSignal,
): Promise<PropertyService[]> {
  const data = await getJsonArray(
    '/service',
    signal,
    'No pudimos cargar los servicios. Intenta nuevamente.',
  )
  return data as PropertyService[]
}