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
  if (!Array.isArray(data)) throw new Error('El servidor devolvió una respuesta inesperada.')
  return data
}