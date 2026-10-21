import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../../Auth/hooks/authHooks'
import { useDisplayCurrency } from '../../Auth/hooks/useDisplayCurrency'
import {
  getSavedPropertyIds,
  getSavedProperties,
  importSavedProperties,
  removeSavedProperty,
  saveProperty,
} from '../services/savedProperty.service'
import { clearLegacySaved, readLegacySavedIds } from '../utils/legacySaved'

export const savedPropertyKeys = {
  all: ['saved-properties'] as const,
  ids: (userId: number | undefined) => ['saved-properties', 'ids', userId] as const,
  list: (userId: number | undefined, currency: string) => ['saved-properties', 'list', userId, currency] as const,
}

/** Solo los inquilinos guardan propiedades (el backend lo exige con el rol CLIENT). */
export function useCanSaveProperties() {
  const { user } = useAuth()
  return { userId: user?.id, enabled: Boolean(user?.roles.includes('CLIENT')) }
}

let legacyImport: Promise<void> | null = null

/**
 * Sube una sola vez a la cuenta lo que el inquilino había guardado en este navegador y limpia esas claves.
 * Si falla, las claves se conservan y se reintenta en la próxima carga. Varias consultas comparten la misma llamada.
 */
function ensureLegacyImported(): Promise<void> {
  const ids = readLegacySavedIds()
  if (ids.length === 0) return Promise.resolve()
  legacyImport ??= importSavedProperties(ids.slice(0, 100))
    .then(clearLegacySaved)
    .catch(() => undefined)
    .finally(() => { legacyImport = null })
  return legacyImport
}

/** Ids de las propiedades guardadas del inquilino con sesión (más reciente primero). */
export function useSavedPropertyIds() {
  const { userId, enabled } = useCanSaveProperties()
  return useQuery({
    queryKey: savedPropertyKeys.ids(userId),
    enabled,
    queryFn: async ({ signal }) => {
      await ensureLegacyImported()
      return getSavedPropertyIds(signal)
    },
  })
}

/** Guardadas con los datos de la tarjeta, con el precio en la moneda del perfil. */
export function useSavedProperties() {
  const { userId, enabled } = useCanSaveProperties()
  const { currency, ready } = useDisplayCurrency()
  return useQuery({
    queryKey: savedPropertyKeys.list(userId, currency),
    enabled: enabled && ready,
    queryFn: async ({ signal }) => {
      await ensureLegacyImported()
      return getSavedProperties(currency, signal)
    },
  })
}

/** Guardar / quitar con respuesta inmediata en el corazón; si el servidor falla se deshace. */
export function useToggleSavedProperty() {
  const queryClient = useQueryClient()
  const { userId } = useCanSaveProperties()
  const idsKey = savedPropertyKeys.ids(userId)

  return useMutation({
    mutationFn: ({ propertyId, save }: { propertyId: number; save: boolean }) =>
      save ? saveProperty(propertyId) : removeSavedProperty(propertyId),
    onMutate: async ({ propertyId, save }) => {
      await queryClient.cancelQueries({ queryKey: idsKey })
      const previous = queryClient.getQueryData<number[]>(idsKey)
      queryClient.setQueryData<number[]>(idsKey, (ids = []) =>
        save ? [propertyId, ...ids.filter((id) => id !== propertyId)] : ids.filter((id) => id !== propertyId),
      )
      return { previous }
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) queryClient.setQueryData(idsKey, context.previous)
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: savedPropertyKeys.all }),
  })
}
