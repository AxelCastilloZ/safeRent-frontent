import apiAxios from '../../../api/apiConfig'
import type { PropertyComment } from '../models/comment'

export async function getPropertyComments(propertyId: number): Promise<PropertyComment[]> {
  const response = await apiAxios.get<PropertyComment[]>(`/comments/property/${propertyId}`)
  return response.data
}

export async function createPropertyComment(propertyId: number, content: string): Promise<void> {
  await apiAxios.post(`/comments/property/${propertyId}`, { content })
}
