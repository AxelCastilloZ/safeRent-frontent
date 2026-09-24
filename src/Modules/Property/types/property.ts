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

export interface Service {
  id: number
  name: string
  icono: string
  description: string
}

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

export interface Property {
  id: number
  title: string
  description: string
  cost: number
  typeOfCoin: string
  address: string
  guest: number
  rooms: number
  isActive: boolean
  owner: User
  typeOfProperty: TypeOfProperty | null
  services: Service[]
  files: PropertyFile[]
  iconDescriptions: IconDescription[]
}

export interface CreatePropertyPayload {
  title: string
  description: string
  cost: number
  typeOfCoin?: string
  address: string
  guest?: number
  rooms?: number
  ownerId: number
  typeOfPropertyId?: number
  serviceIds?: number[]
}

export interface UpdatePropertyPayload {
  title?: string
  description?: string
  cost?: number
  typeOfCoin?: string
  address?: string
  guest?: number
  rooms?: number
  isActive?: boolean
  ownerId?: number
  typeOfPropertyId?: number
  serviceIds?: number[]
}
