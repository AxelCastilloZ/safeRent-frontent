import { api } from './api'

export interface LocationSuggestion {
  address: string
  latitude: number
  longitude: number
  type: string
}

export const locationService = {
  search: (text: string) => api.get<LocationSuggestion[]>(`/properties/locations/search?text=${encodeURIComponent(text)}`),
}
