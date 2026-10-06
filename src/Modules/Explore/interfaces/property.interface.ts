export interface PropertyService {
  id: number
  name: string
  icono?: string | null
  description?: string | null
}

import type { ReservationState } from '../../Reservations/models/reservation'

export interface Property extends ReservationState {
  id: number
  title: string
  description: string
  address: string
  cost: number | string
  typeOfCoin: string
  rooms: number
  guest: number
  latitude?: number | string | null
  longitude?: number | string | null
  services?: PropertyService[]
  files?: { path: string; mimeType: string }[]
  typeOfProperty?: { name: string }
}