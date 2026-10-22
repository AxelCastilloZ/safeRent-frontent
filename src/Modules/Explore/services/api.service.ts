import { LocalizedError } from '../../../i18n/messages';
export const apiBase = (import.meta.env.VITE_API_URL || '/api').replace(
  /\/$/,
  '',
)

export async function getJsonArray(
  endpoint: string,
  signal: AbortSignal,
  unexpectedMessage: string,
): Promise<unknown[]> {
  const response = await fetch(`${apiBase}${endpoint}`, { signal })
  if (!response.ok) throw new Error(unexpectedMessage)
  const data: unknown = await response.json()
  if (!Array.isArray(data)) throw new LocalizedError("explore:api.service_el_servidor_devolvio_una_respuesta_inesperada")
  return data
}