import type { DisplayPrice } from './interfaces/display-price'
import { formatMoney } from './utils/property.utils'

export default function PriceDetails({ price }: { price?: DisplayPrice | null }) {
  if (!price || price.status === 'unchanged') return null
  if (price.status === 'unavailable') return <p className="mt-1 text-xs text-neutral/70">Conversión a {price.targetCurrency} no disponible. Precio original.</p>
  return <p className="mt-1 text-xs text-neutral/70">
    Original: {formatMoney(price.original.amount, price.original.currency)}.
    {price.ratesUpdatedAt && <> Tasas del {new Date(price.ratesUpdatedAt).toLocaleString('es-CR', { timeZone: 'America/Costa_Rica', dateStyle: 'short', timeStyle: 'short' })}.</>}
    {price.stale && <strong> Tasas desactualizadas.</strong>}
  </p>
}
