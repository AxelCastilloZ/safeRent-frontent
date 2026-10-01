import { useEffect, useState } from 'react'
import type { Property } from '../interfaces/property.interface'
import { getProperties } from '../services/property.service'

export function useProperties(serviceIds: number[], attempt: number) {
  const [result, setResult] = useState<{
    key: string
    properties: Property[]
    error: string
  } | null>(null)
  const requestKey = `${attempt}:${serviceIds.join(',')}`

  useEffect(() => {
    const controller = new AbortController()
    getProperties(controller.signal, serviceIds)
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
  }, [requestKey, serviceIds])

  return {
    properties:
      result?.key === requestKey && !result.error ? result.properties : [],
    loading: result?.key !== requestKey,
    error: result?.key === requestKey ? result.error : '',
  }
}