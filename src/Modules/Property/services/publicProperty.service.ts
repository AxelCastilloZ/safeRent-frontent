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

/** Lo único que se publica de un propietario: su nombre y cuántas propiedades publicadas tiene. */
export interface PublicOwner {
  id: number
  name: string
  activeProperties: number
}

export async function getPublicOwner(id: number, signal: AbortSignal): Promise<PublicOwner> {
  const response = await apiAxios.get<PublicOwner>(`/properties/owners/${id}`, { signal })
  return response.data
}
