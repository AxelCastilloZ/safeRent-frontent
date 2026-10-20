import { useQueries } from '@tanstack/react-query';
import { useState } from 'react';
import { getPublicProperty } from '../../Property/services/publicProperty.service';
import { readSavedPropertyIds } from '../utils/savedProperties';
import { useDisplayCurrency } from '../../Auth/hooks/useDisplayCurrency';

/** Propiedades guardadas en este dispositivo, con su detalle público (misma caché que la página de la propiedad). */
export function useSavedProperties() {
  const { currency, ready } = useDisplayCurrency();
  const [ids] = useState(readSavedPropertyIds);
  const results = useQueries({
    queries: ids.map((id) => ({
      queryKey: ['public-property', id, currency],
      queryFn: ({ signal }: { signal: AbortSignal }) => getPublicProperty(id, signal, currency),
      enabled: ready,
      retry: false,
    })),
  });

  return {
    ids,
    properties: results.flatMap((result) => (result.data ? [result.data] : [])),
    isLoading: results.some((result) => result.isPending),
    // Una guardada que ya no está disponible (404) simplemente no se muestra.
    unavailableCount: results.filter((result) => result.isError).length,
  };
}
