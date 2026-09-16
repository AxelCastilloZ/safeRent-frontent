export interface Property {
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
  services?: { id: number; name: string }[]
  files?: { path: string; mimeType: string }[]
  typeOfProperty?: { name: string }
}

export const apiBase = (import.meta.env.VITE_API_URL || '/api').replace(
  /\/$/,
  '',
)

export async function getProperties(signal: AbortSignal): Promise<Property[]> {
  const response = await fetch(`${apiBase}/properties`, { signal })
  // The collection endpoint returns 404 when there are no published properties.
  if (response.status === 404) return []
  if (!response.ok)
    throw new Error('No pudimos cargar las propiedades. Intenta nuevamente.')
  const data: unknown = await response.json()
  if (!Array.isArray(data))
    throw new Error('El servidor devolvió una respuesta inesperada.')
  return data
}

export function coordinates(property: Property): [number, number] | null {
  const { latitude, longitude } = property
  if (
    latitude == null ||
    longitude == null ||
    latitude === '' ||
    longitude === ''
  )
    return null
  const lat = Number(latitude),
    lng = Number(longitude)
  return Number.isFinite(lat) &&
    Number.isFinite(lng) &&
    Math.abs(lat) <= 90 &&
    Math.abs(lng) <= 180
    ? [lat, lng]
    : null
}

export function priceLabel(property: Property) {
  const amount = Number(property.cost)
  const currency = property.typeOfCoin || 'CRC'
  try {
    return new Intl.NumberFormat('es-CR', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(amount)
  } catch {
    return `${currency} ${amount.toLocaleString('es-CR')}`
  }
}

export function photoUrl(property: Property) {
  const path = property.files?.find((file) =>
    file.mimeType?.startsWith('image/'),
  )?.path
  if (!path) return undefined
  try {
    const url = new URL(
      path,
      `${new URL(apiBase, window.location.origin).href}/`,
    )
    return ['http:', 'https:'].includes(url.protocol) ? url.href : undefined
  } catch {
    return undefined
  }
}

export const normalize = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
