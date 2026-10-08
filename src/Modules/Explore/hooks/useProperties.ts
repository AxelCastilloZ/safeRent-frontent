import { useEffect, useState } from 'react'
import type { Property } from '../interfaces/property.interface'
import { getProperties, type PropertyFilters } from '../services/property.service'

export function useProperties(filters: PropertyFilters, attempt: number) {
  const [result, setResult] = useState<{
    key: string
    properties: Property[]
    error: string
  } | null>(null)

  const requestKey = `${attempt}:${JSON.stringify(filters)}`

  useEffect(() => {
    const controller = new AbortController()
    getProperties(controller.signal, filters)
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
                ? reason.message
                : 'No se pudo conectar con el servidor.',
          })
      })
    return () => controller.abort()
  }, [requestKey])

  return {
    properties:
      result?.key === requestKey && !result.error ? result.properties : [],
    loading: result?.key !== requestKey,
    error: result?.key === requestKey ? result.error : '',
  }
}
