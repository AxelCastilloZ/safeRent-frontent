import type { Property } from '../interfaces/property.interface'
import { apiBase } from '../services/api.service'

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