import { useEffect, useState } from 'react'
import type { PropertyService } from '../interfaces/property.interface'
import { getServices } from '../services/service.service'

export function useServices(attempt: number) {
  const [result, setResult] = useState<{
    attempt: number
    services: PropertyService[]
    error: string
  } | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    getServices(controller.signal)
      .then((catalog) => {
        if (!controller.signal.aborted)
          setResult({ attempt, services: catalog, error: '' })
      })
      .catch((reason: unknown) => {
        if (!controller.signal.aborted)
          setResult({
            attempt,
            services: [],
            error:
              reason instanceof Error
                ? reason.message
                : 'No se pudo cargar el catálogo de servicios.',
          })
      })
    return () => controller.abort()
  }, [attempt])

  return {
    services: result?.attempt === attempt ? result.services : [],
    loading: result?.attempt !== attempt,
    error: result?.attempt === attempt ? result.error : '',
  }
}