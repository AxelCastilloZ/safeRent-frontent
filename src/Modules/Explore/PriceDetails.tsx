import { currentLocale } from '../../i18n/formatters';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n/instance';
import type { DisplayPrice } from './interfaces/display-price'
import { formatMoney } from './utils/property.utils'

export default function PriceDetails({ price }: { price?: DisplayPrice | null }) {
  useTranslation();
  if (!price || price.status === 'unchanged') return null
  if (price.status === 'unavailable') return <p className="mt-1 text-xs text-neutral/70">{i18n.t("explore:pricedetails_conversion_a")}{' '}{price.targetCurrency}{' '}{i18n.t("explore:pricedetails_no_disponible_precio_original")}</p>
  return <p className="mt-1 text-xs text-neutral/70">{i18n.t("explore:pricedetails_original")}{' '}{formatMoney(price.original.amount, price.original.currency)}.
    {price.ratesUpdatedAt && <>{' '}{i18n.t("explore:pricedetails_tasas_del")}{' '}{new Date(price.ratesUpdatedAt).toLocaleString(currentLocale(), { timeZone: 'America/Costa_Rica', dateStyle: 'short', timeStyle: 'short' })}.</>}
    {price.stale && <strong>{' '}{i18n.t("explore:pricedetails_tasas_desactualizadas")}</strong>}
  </p>
}
