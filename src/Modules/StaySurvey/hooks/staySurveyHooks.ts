import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getMyStays, getStaySurveySummary, submitStaySurvey } from '../services/staySurvey.service'
import type { StaySurveyAnswers } from '../types/staySurvey'

export const staySurveyKeys = {
  all: ['stay-surveys'] as const,
  mine: ['stay-surveys', 'mine'] as const,
  summary: (propertyId: number | undefined) => ['stay-surveys', 'summary', propertyId] as const,
}

/** Estadías terminadas del inquilino y cuáles tienen la encuesta pendiente. */
export function useMyStays(enabled = true) {
  return useQuery({
    queryKey: staySurveyKeys.mine,
    enabled,
    queryFn: ({ signal }) => getMyStays(signal),
    retry: false,
  })
}

export function useStaySurveySummary(propertyId: number | undefined) {
  return useQuery({
    queryKey: staySurveyKeys.summary(propertyId),
    enabled: propertyId !== undefined && Number.isInteger(propertyId) && propertyId > 0,
    queryFn: ({ signal }) => getStaySurveySummary(propertyId!, signal),
    staleTime: 60_000,
    retry: false,
  })
}

export function useSubmitStaySurvey() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ reservationId, answers }: { reservationId: number; answers: StaySurveyAnswers }) => submitStaySurvey(reservationId, answers),
    // Cambian las pendientes del inquilino y los promedios (y por tanto los filtros) de la propiedad.
    onSuccess: () => queryClient.invalidateQueries({ queryKey: staySurveyKeys.all }),
  })
}
