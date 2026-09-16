export interface PropertyService {
  id: number
  name: string
  icono?: string | null
  description?: string | null
}

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
  services?: PropertyService[]
  files?: { path: string; mimeType: string }[]
  typeOfProperty?: { name: string }
}

export const apiBase = (import.meta.env.VITE_API_URL || '/api').replace(
  /\/$/,
  '',
)

export async function getProperties(
  signal: AbortSignal,
  serviceIds: number[] = [],
): Promise<Property[]> {
  const params = new URLSearchParams()
  if (serviceIds.length) params.set('serviceIds', serviceIds.join(','))
  const response = await fetch(
    `${apiBase}/properties${params.size ? `?${params}` : ''}`,
    { signal },
  )
  if (!response.ok)
    throw new Error('No pudimos cargar las propiedades. Intenta nuevamente.')
  const data: unknown = await response.json()
  if (!Array.isArray(data))
    throw new Error('El servidor devolvió una respuesta inesperada.')
  return data
}

export async function getServices(
  signal: AbortSignal,
): Promise<PropertyService[]> {
  const response = await fetch(`${apiBase}/services`, { signal })
  if (!response.ok)
    throw new Error('No pudimos cargar los servicios. Intenta nuevamente.')
  const data: unknown = await response.json()
  if (!Array.isArray(data))
    throw new Error('El servidor devolvió un catálogo inesperado.')
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
