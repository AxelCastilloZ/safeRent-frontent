export interface User {
  id: number
  name: string
  surname1: string
  surname2: string
  email: string
}

export interface TypeOfProperty {
  id: number
  name: string
  description: string
  icon: string
}

export type { Service } from '../../Services/interfaces/service.interface'
import type { Service } from '../../Services/interfaces/service.interface'

export interface PropertyFile {
  id: number
  uploadedBy: string
  path: string
  fileName: string
  mimeType: string
  size: number
  rev: string
  uploadedAt: string
}

export interface IconDescription {
  id: number
  title: string
  icon: string
}

/** Refleja `PropertyStatus` en safeRent-backend/src/property/property-status.enum.ts. */
export type PropertyStatus = 'DRAFT' | 'PENDING' | 'ACTIVE' | 'CHANGES_REQUESTED' | 'INACTIVE'

export interface Property {
  id: number
  title: string
  description: string
  cost: number
  typeOfCoin: string
  latitude?: number | null
  longitude?: number | null
  address: string
  guest: number
  rooms: number
  status: PropertyStatus
  reviewNote?: string | null
  reviewedAt?: string | null
  createdAt: string
  owner: User
  typeOfProperty: TypeOfProperty | null
  services: Service[]
  files: PropertyFile[]
  iconDescriptions: IconDescription[]
}

export interface PaginatedProperties {
  data: Property[]
  total: number
  page: number
  limit: number
  totalPages: number
}

/** Cuerpo de `PATCH /properties/:id/review` (solo ADMIN). */
export interface ReviewPropertyPayload {
  status: 'ACTIVE' | 'CHANGES_REQUESTED' | 'INACTIVE'
  note?: string
}

export interface CreatePropertyPayload {
  title: string
  description: string
  cost: number
  typeOfCoin?: string
  latitude?: number | null
  longitude?: number | null
  address?: string
  guest?: number
  rooms?: number
  ownerId?: number
  typeOfPropertyId?: number
  serviceIds?: number[]
}

export interface UpdatePropertyPayload {
  title?: string
  description?: string
  cost?: number
  typeOfCoin?: string
  latitude?: number | null
  longitude?: number | null
  address?: string
  guest?: number
  rooms?: number
  ownerId?: number
  typeOfPropertyId?: number
  serviceIds?: number[]
}

