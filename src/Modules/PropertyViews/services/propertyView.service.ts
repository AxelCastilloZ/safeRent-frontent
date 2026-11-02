import apiAxios from '../../../api/apiConfig'

export interface PropertyViews {
  propertyId: number
  /** Personas distintas que han abierto la propiedad. */
  views: number
}

export async function getPropertyViews(propertyId: number, signal?: AbortSignal): Promise<PropertyViews> {
  const response = await apiAxios.get<PropertyViews>(`/property-views/${propertyId}`, { signal })
  return response.data
}

/** Registra que esta persona abrió la propiedad (una sola vez por persona) y devuelve el total. */
export async function recordPropertyView(propertyId: number, visitorId: string): Promise<PropertyViews> {
  const response = await apiAxios.post<PropertyViews>(`/property-views/${propertyId}`, { visitorId })
  return response.data
}
