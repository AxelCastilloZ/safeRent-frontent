import { useTranslation } from 'react-i18next'
import i18n from '../../../i18n/instance'
import { useProfileCurrencyOptions } from '../../Auth/hooks/profileHooks'
import { currencySymbol } from '../../Explore/utils/money'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectSeparator, SelectTrigger, SelectValue } from './Select'

// Las más comunes para publicar un alquiler; el resto de las monedas habilitadas van en "Todas".
const COMMON = ['CRC', 'USD', 'EUR']

interface CurrencySelectProps {
  id?: string
  /** Moneda elegida para la propiedad. */
  value: string
  /** Moneda del perfil del usuario: va primero y es la que se propone al publicar. */
  profileCurrency: string
  onChange: (code: string) => void
}

/** "₡ CRC": símbolo y código (solo el código si la moneda no tiene un símbolo propio). */
function currencyLabel(code: string) {
  const symbol = currencySymbol(code)
  return symbol === code ? code : `${symbol} ${code}`
}

/**
 * Selector de moneda del precio. Muestra la moneda ya elegida (por defecto la del perfil) y solo despliega
 * las demás cuando se pulsa. Las monedas disponibles son las mismas que el sistema habilita para los precios.
 */
export default function CurrencySelect({ id, value, profileCurrency, onChange }: CurrencySelectProps) {
  useTranslation()
  const options = useProfileCurrencyOptions()
  const names = new Map((options.data?.currencies ?? []).map((currency) => [currency.code, currency.name]))
  const codes = [...new Set([value, profileCurrency, ...COMMON, ...names.keys()])]
  const first = [...new Set([profileCurrency, ...COMMON])].filter((code) => codes.includes(code))
  const rest = codes.filter((code) => !first.includes(code)).sort()

  const item = (code: string) => (
    <SelectItem key={code} value={code} description={names.get(code)}>
      {currencyLabel(code)}
    </SelectItem>
  )

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger id={id} aria-label={i18n.t("property:createpropertystep1page_moneda")} variant="inline">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>{i18n.t("property:commonCurrencies")}</SelectLabel>
          {first.map(item)}
        </SelectGroup>
        {rest.length > 0 && (
          <>
            <SelectSeparator />
            <SelectGroup>
              <SelectLabel>{i18n.t("property:allCurrencies")}</SelectLabel>
              {rest.map(item)}
            </SelectGroup>
          </>
        )}
      </SelectContent>
    </Select>
  )
}
