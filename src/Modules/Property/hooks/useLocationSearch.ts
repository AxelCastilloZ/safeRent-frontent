import i18n from '../../../i18n/instance';
import { useEffect, useState } from 'react'
import { locationService, type LocationSuggestion } from '../services/locationService'

export function useLocationSearch(text: string, enabled: boolean) {
  const [result, setResult] = useState<{ text: string; suggestions: LocationSuggestion[]; error: string } | null>(null)
  const query = text.trim()
  const active = enabled && query.length >= 3
  const current = active && result?.text === query ? result : null

  useEffect(() => {
    let cancelled = false
    if (!active) return
    const timer = window.setTimeout(() => {
      locationService.search(query)
        .then((suggestions) => { if (!cancelled) setResult({ text: query, suggestions, error: '' }) })
        .catch((err: unknown) => {
          if (!cancelled) setResult({ text: query, suggestions: [], error: err instanceof Error ? err.message : i18n.t("property:uselocationsearch_no_pudimos_buscar_la_direccion") })
        })
    }, 450)
    return () => { cancelled = true; window.clearTimeout(timer) }
  }, [query, active])

  return { suggestions: current?.suggestions ?? [], loading: active && !current, error: current?.error ?? '', searched: !!current }
}
