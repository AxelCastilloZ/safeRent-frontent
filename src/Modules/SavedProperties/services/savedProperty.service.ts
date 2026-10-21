import apiAxios from '../../../api/apiConfig'
import type { ImportSavedResult, SavedProperty } from '../types/savedProperty'

const BASE = '/saved-properties'

export async function getSavedProperties(displayCurrency: string, signal?: AbortSignal): Promise<SavedProperty[]> {
  const response = await apiAxios.get<SavedProperty[]>(BASE, { signal, params: { displayCurrency } })
  return response.data
}

/** Solo los ids (de la más reciente a la más antigua): para el corazón y los contadores. */
export async function getSavedPropertyIds(signal?: AbortSignal): Promise<number[]> {
  const response = await apiAxios.get<number[]>(`${BASE}/ids`, { signal })
  return response.data
}

/** Idempotente: guardar dos veces la misma propiedad no falla ni duplica. */
export async function saveProperty(propertyId: number): Promise<void> {
  await apiAxios.put(`${BASE}/${propertyId}`)
}

/** Idempotente: quitar una que ya no estaba guardada no falla. */
export async function removeSavedProperty(propertyId: number): Promise<void> {
  await apiAxios.delete(`${BASE}/${propertyId}`)
}

export async function importSavedProperties(propertyIds: number[]): Promise<ImportSavedResult> {
  const response = await apiAxios.post<ImportSavedResult>(`${BASE}/import`, { propertyIds })
  return response.data
}
