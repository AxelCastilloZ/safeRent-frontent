import type { CatalogTranslations } from '../../../i18n/catalog';
export interface PropertyService {
  catalogCode?: string | null
  translations?: CatalogTranslations | null
  id: number
  name: string
  icono?: string | null
  description?: string | null
}

import type { ReservationState } from '../../Reservations/models/reservation'
import type { DisplayPrice } from './display-price'

export interface Property extends ReservationState {
  id: number
  title: string
  description: string
  address: string
  cost: number | string
  typeOfCoin: string
  displayPrice?: DisplayPrice | null
  rooms: number
  guest: number
  latitude?: number | string | null
  longitude?: number | string | null
  services?: PropertyService[]
  files?: { path: string; mimeType: string; url?: string | null }[]
  typeOfProperty?: { name: string; catalogCode?: string | null; translations?: CatalogTranslations | null }
}
