import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../../Auth/hooks/authHooks'
import {
  acceptVisit, cancelVisit, confirmVisit, getAvailability, getMyVisits, getReceivedVisits, getSlots, getVisitSummary, proposeVisit,
  requestVisit, reserveFromVisit, setAvailability,
} from '../services/visit.service'
import type { AvailabilityRule, RequestVisitPayload } from '../types/visit'

// Cuánto se refresca la lista: una respuesta de la otra persona aparece sin recargar (como la bandeja de mensajes).
const VISITS_POLL_MS = 15000
// Los contadores del menú se actualizan algo más despacio que las listas.
const SUMMARY_POLL_MS = 30000

export const visitKeys = {
  all: ['visits'] as const,
  mine: (userId: number | undefined) => ['visits', 'mine', userId] as const,
  received: (userId: number | undefined) => ['visits', 'received', userId] as const,
  summary: (userId: number | undefined) => ['visits', 'summary', userId] as const,
  slots: (propertyId: number | undefined) => ['visits', 'slots', propertyId] as const,
  availability: (propertyId: number | undefined) => ['visits', 'availability', propertyId] as const,
}

/**
 * Cifras para los contadores del menú. Solo para quien puede tener citas (inquilino o propietario):
 * a una cuenta solo de administrador el backend le respondería que no.
 */
export function useVisitSummary() {
  const { user } = useAuth()
  const hasVisits = Boolean(user?.roles.some((role) => role === 'CLIENT' || role === 'OWNER'))
  return useQuery({
    queryKey: visitKeys.summary(user?.id),
    enabled: hasVisits,
    queryFn: ({ signal }) => getVisitSummary(signal),
    refetchInterval: SUMMARY_POLL_MS,
  })
}

/** Citas que pidió el inquilino con sesión. */
export function useMyVisits() {
  const { user } = useAuth()
  return useQuery({
    queryKey: visitKeys.mine(user?.id),
    enabled: user !== undefined,
    queryFn: ({ signal }) => getMyVisits(signal),
    refetchInterval: VISITS_POLL_MS,
  })
}

/** Citas que recibió el propietario con sesión (pendientes primero, la más antigua arriba). */
export function useReceivedVisits() {
  const { user } = useAuth()
  return useQuery({
    queryKey: visitKeys.received(user?.id),
    enabled: user !== undefined,
    queryFn: ({ signal }) => getReceivedVisits(signal),
    refetchInterval: VISITS_POLL_MS,
  })
}

/** Horarios de una propiedad en un rango de fechas (el calendario y las horas libres). */
export function useSlots(propertyId: number | undefined, from: string, to: string, enabled = true) {
  return useQuery({
    queryKey: [...visitKeys.slots(propertyId), from, to],
    enabled: enabled && propertyId !== undefined,
    queryFn: ({ signal }) => getSlots(propertyId!, from, to, signal),
    // Los horarios los toman otras personas: se vuelven a pedir al abrir el calendario.
    staleTime: 0,
    retry: false,
  })
}

function useVisitMutation<TVariables, TResult>(mutationFn: (variables: TVariables) => Promise<TResult>) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn,
    // Cualquier cambio de estado puede liberar o tomar un horario y cambia las listas de las dos personas.
    onSettled: () => queryClient.invalidateQueries({ queryKey: visitKeys.all }),
  })
}

export const useRequestVisit = () => useVisitMutation((payload: RequestVisitPayload) => requestVisit(payload))
export const useConfirmVisit = () => useVisitMutation((id: number) => confirmVisit(id))
export const useProposeVisit = () => useVisitMutation(({ id, scheduledAt }: { id: number; scheduledAt: string }) => proposeVisit(id, scheduledAt))
export const useAcceptVisit = () => useVisitMutation((id: number) => acceptVisit(id))
export const useCancelVisit = () => useVisitMutation(({ id, reason }: { id: number; reason?: string }) => cancelVisit(id, reason))

/** Reservar desde una cita confirmada también cambia el estado de la propiedad en otras listas. */
export function useReserveFromVisit() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (visitId: number) => reserveFromVisit(visitId),
    onSettled: () => Promise.all([
      queryClient.invalidateQueries({ queryKey: visitKeys.all }),
      queryClient.invalidateQueries({ queryKey: ['owner-properties'] }),
    ]),
  })
}

export function useAvailability(propertyId: number | undefined) {
  return useQuery({
    queryKey: visitKeys.availability(propertyId),
    enabled: propertyId !== undefined,
    queryFn: ({ signal }) => getAvailability(propertyId!, signal),
    retry: false,
  })
}

export function useSetAvailability(propertyId: number | undefined) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: { timezone: string; rules: AvailabilityRule[] }) => setAvailability(propertyId!, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: visitKeys.all }),
  })
}
