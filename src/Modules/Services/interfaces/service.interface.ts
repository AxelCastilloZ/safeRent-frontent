import type { CatalogTranslations } from '../../../i18n/catalog';
export interface Service {
  catalogCode?: string | null
  translations?: CatalogTranslations | null
  id: number
  name: string
  icono?: string | null
  description?: string | null
}

export interface CreateServiceInput {
  translations?: CatalogTranslations
  name: string
  icono: string
  description?: string
}

export interface UpdateServiceInput {
  translations?: CatalogTranslations
  name?: string
  icono?: string | null
  description?: string | null
}
