import apiAxios from '../../../api/apiConfig'
import type { AdminPropertyComment, ModerateCommentPayload, OwnPropertyComment, PropertyComment, PropertyRating } from '../models/comment'

export async function getAdminComments(): Promise<AdminPropertyComment[]> {
  return (await apiAxios.get<AdminPropertyComment[]>('/comments/admin')).data
}

export async function moderateComment(id: number, data: ModerateCommentPayload): Promise<void> {
  await apiAxios.patch(`/comments/${id}/moderation`, data)
}

export async function getOwnPropertyComment(propertyId: number): Promise<OwnPropertyComment | null> {
  return (await apiAxios.get<OwnPropertyComment | null>(`/comments/property/${propertyId}/me`)).data
}

export async function getPropertyComments(propertyId: number): Promise<PropertyComment[]> {
  const response = await apiAxios.get<PropertyComment[]>(`/comments/property/${propertyId}`)
  return response.data
}

export async function createPropertyComment(propertyId: number, content: string, rating: number): Promise<void> {
  await apiAxios.post(`/comments/property/${propertyId}`, { content, rating })
}

/** Calificación (promedio y cantidad) de cada propiedad del propietario con la sesión; las que no tienen no aparecen. */
export async function getOwnerPropertyRatings(): Promise<PropertyRating[]> {
  return (await apiAxios.get<PropertyRating[]>('/comments/owner/ratings')).data
}
