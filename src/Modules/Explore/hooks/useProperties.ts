import { message, messageFromError, resolveMessage, type MessageDescriptor } from '../../../i18n/messages';
import { useEffect, useState } from 'react'
import type { Property } from '../interfaces/property.interface'
import { getProperties, type PropertyFilters } from '../services/property.service'
import { useDisplayCurrency } from '../../Auth/hooks/useDisplayCurrency'

export function useProperties(filters: PropertyFilters, attempt: number) {
  const { currency, ready } = useDisplayCurrency()
  const [result, setResult] = useState<{
    key: string
    properties: Property[]
    error: string | MessageDescriptor
  } | null>(null)

  const serializedFilters = JSON.stringify({ ...filters, displayCurrency: currency })
  const requestKey = `${ready}:${attempt}:${serializedFilters}`

  useEffect(() => {
    if (!ready) return
    const controller = new AbortController()
    const refresh = () => { void getProperties(controller.signal, JSON.parse(serializedFilters) as PropertyFilters)
      .then((properties) => {
        if (!controller.signal.aborted) setResult({ key: requestKey, properties, error: '' })
      })
      .catch((reason: unknown) => {
        if (!controller.signal.aborted)
          setResult({
            key: requestKey,
            properties: [],
            error:
              reason instanceof Error
                ? messageFromError(reason)
                : message("explore:useproperties_no_se_pudo_conectar_con_el_servidor"),
          })
      }) }
    const onVisible = () => { if (document.visibilityState === 'visible') refresh() }
    refresh()
    window.addEventListener('focus', refresh)
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      controller.abort()
      window.removeEventListener('focus', refresh)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [requestKey, ready, serializedFilters])

  return {
    properties:
      result?.key === requestKey && !result.error ? result.properties : [],
    loading: result?.key !== requestKey,
    error: result?.key === requestKey ? resolveMessage(result.error) : '',
  }
}
