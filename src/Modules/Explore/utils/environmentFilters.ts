import type { PropertyFilters } from '../services/property.service'

/** Lo escrito en el panel "Precio y entorno" (todo como texto: así los campos se pueden vaciar). */
export interface EnvironmentFilterState {
  minPrice: string
  maxPrice: string
  water: string
  electricity: string
  internet: string
  university: string
  coworking: string
  workArea: boolean
}

export const EMPTY_ENVIRONMENT_FILTERS: EnvironmentFilterState = {
  minPrice: '', maxPrice: '', water: '', electricity: '', internet: '', university: '', coworking: '', workArea: false,
}

function optionalNumber(text: string): number | undefined {
  if (text.trim() === '') return undefined
  const value = Number(text.replace(',', '.'))
  return Number.isFinite(value) && value >= 0 ? value : undefined
}

/** Filtros que se envían al servidor; los vacíos o inválidos se omiten. */
export function environmentFilters(state: EnvironmentFilterState): Partial<PropertyFilters> {
  const filters: Partial<PropertyFilters> = {}
  const minPrice = optionalNumber(state.minPrice)
  const maxPrice = optionalNumber(state.maxPrice)
  if (minPrice !== undefined) filters.minPrice = minPrice
  if (maxPrice !== undefined) filters.maxPrice = maxPrice
  if (state.water) filters.minWaterStability = Number(state.water)
  if (state.electricity) filters.minElectricityStability = Number(state.electricity)
  if (state.internet) filters.minInternetMbps = Number(state.internet)
  if (state.university) filters.maxUniversityKm = Number(state.university)
  if (state.coworking) filters.maxCoworkingKm = Number(state.coworking)
  if (state.workArea) filters.hasWorkArea = true
  return filters
}

export function activeEnvironmentFilterCount(state: EnvironmentFilterState): number {
  return Object.keys(environmentFilters(state)).length
}

export function priceRangeInvalid(state: EnvironmentFilterState): boolean {
  const min = optionalNumber(state.minPrice)
  const max = optionalNumber(state.maxPrice)
  return min !== undefined && max !== undefined && min > max
}
