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

export function photoUrl(property: Pick<Property, 'files'>) {
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
