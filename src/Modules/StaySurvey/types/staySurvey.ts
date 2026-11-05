/** Lo que el inquilino contesta al terminar su estadía. */
export interface StaySurveyAnswers {
  /** De 1 (se va seguido) a 5 (siempre estable). */
  waterStability: number
  electricityStability: number
  /** Velocidad de Internet medida, en Mbps. */
  internetMbps: number
  hasWorkArea: boolean
}

export interface StaySurvey extends StaySurveyAnswers {
  id: number
  reservationId: number
  propertyId: number
  updatedAt: string
}

/** Una estadía terminada del inquilino y su encuesta (nula si falta responderla). */
export interface MyStay {
  reservationId: number
  endedAt: string
  property: { id: number; title: string }
  survey: StaySurvey | null
}

/** Promedios de lo que dijeron los inquilinos que ya vivieron en la propiedad. */
export interface StaySurveySummary {
  propertyId: number
  count: number
  waterStability: number | null
  electricityStability: number | null
  internetMbps: number | null
  universityKm: number | null
  coworkingKm: number | null
  workAreaVotes: number
  hasWorkArea: boolean
}
