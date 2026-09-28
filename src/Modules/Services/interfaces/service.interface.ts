export interface Service {
  id: number
  name: string
  icono?: string | null
  description?: string | null
}

export interface CreateServiceInput {
  name: string
  icono: string
  description?: string
}

export interface UpdateServiceInput {
  name?: string
  icono?: string | null
  description?: string | null
}
