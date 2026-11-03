import type { Property } from '../interfaces/property.interface'
import { apiBase } from '../services/api.service'
import { formatMoney } from './money'
export { formatMoney } from './money'

export function coordinates(property: Property): [number, number] | null {
  const { latitude, longitude } = property
  if (
    latitude == null ||
    longitude == null ||
    latitude === '' ||
    longitude === ''
  )
    return null
  const lat = Number(latitude)
  const lng = Number(longitude)
  return Number.isFinite(lat) &&
    Number.isFinite(lng) &&
    Math.abs(lat) <= 90 &&
    Math.abs(lng) <= 180
    ? [lat, lng]
    : null
}

export function priceLabel(property: Pick<Property, 'cost' | 'typeOfCoin' | 'displayPrice'>) {
  const converted = property.displayPrice?.converted
  return `${property.displayPrice?.approximate && converted ? '≈ ' : ''}${formatMoney(converted?.amount ?? property.cost, converted?.currency ?? property.typeOfCoin ?? 'CRC')}`
}

type FileRef = { path: string; mimeType: string; url?: string | null }

/** Dirección http(s) segura de un archivo de la propiedad (la del almacenamiento, o la ruta del servidor); undefined si no es válida. */
function fileUrl(file: FileRef | undefined) {
  const path = file?.url || file?.path
  if (!path) return undefined
  try {
    const url = new URL(
      path,
      `${new URL(apiBase, window.location.origin).href.replace(/\/+$/, '')}/`,
    )
    return ['http:', 'https:'].includes(url.protocol) ? url.href : undefined
  } catch {
    return undefined
  }
}

export function photoUrl(property: Pick<Property, 'files'>) {
  return fileUrl(property.files?.find((file) => file.mimeType?.startsWith('image/')))
}

/** Direcciones de los videos de la propiedad, en el orden en que se subieron. */
export function videoUrls(property: Pick<Property, 'files'>) {
  return (property.files ?? [])
    .filter((file) => file.mimeType?.startsWith('video/'))
    .map(fileUrl)
    .filter((url): url is string => Boolean(url))
}

export const normalize = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
