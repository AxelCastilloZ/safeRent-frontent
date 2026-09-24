export const SUPPORT_CATEGORIES = [
  'Cuenta y perfil',
  'Publicación de propiedades',
  'Búsqueda y filtros',
  'Servicios de propiedades',
  'Mensajería',
  'Reseñas',
  'Seguridad y privacidad',
] as const

export type SupportCategory = (typeof SUPPORT_CATEGORIES)[number]

export interface FaqItem {
  id: string
  category: SupportCategory
  question: string
  answer: string
  /** Términos adicionales por los que debe encontrarse esta pregunta al buscar. */
  keywords: string[]
}
