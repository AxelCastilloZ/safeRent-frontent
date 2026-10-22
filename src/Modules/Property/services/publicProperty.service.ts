import type { Property } from '../../Explore/interfaces/property.interface'
import apiAxios from '../../../api/apiConfig'

export interface PublicProperty extends Property {
  owner: { id: number; name: string }
  iconDescriptions?: { id: number; title: string; icon: string }[]
}

export async function getPublicProperty(id: number, signal: AbortSignal, displayCurrency = 'CRC'): Promise<PublicProperty> {
  const response = await apiAxios.get<PublicProperty>(`/properties/active/${id}`, { signal, params: { displayCurrency } })
  return response.data
}
