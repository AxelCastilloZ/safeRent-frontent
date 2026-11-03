import apiAxios from '../../../api/apiConfig'
import type { MyStay, StaySurvey, StaySurveyAnswers, StaySurveySummary } from '../types/staySurvey'

export async function getMyStays(signal?: AbortSignal): Promise<MyStay[]> {
  const response = await apiAxios.get<MyStay[]>('/stay-surveys/mine', { signal })
  return response.data
}

export async function getStaySurveySummary(propertyId: number, signal?: AbortSignal): Promise<StaySurveySummary> {
  const response = await apiAxios.get<StaySurveySummary>(`/stay-surveys/property/${propertyId}/summary`, { signal })
  return response.data
}

/** Responder (o corregir) la encuesta de una estadía terminada. */
export async function submitStaySurvey(reservationId: number, answers: StaySurveyAnswers): Promise<StaySurvey> {
  const response = await apiAxios.put<StaySurvey>(`/stay-surveys/reservation/${reservationId}`, answers)
  return response.data
}
