import { listServices } from '../../Services/services/service.service'
import { api } from './api'
import type {
  Property,
  PaginatedProperties,
  CreatePropertyPayload,
  UpdatePropertyPayload,
  ReviewPropertyPayload,
  PropertyStatus,
  PropertyFile,
} from '../types/property'

export const propertyService = {
  getById: (id: number) => api.get<Property>(`/properties/${id}`),

  getByOwner: (ownerId: number) => api.get<Property[]>(`/properties/owner/${ownerId}`),

  create: (data: CreatePropertyPayload) => api.post<Property>('/properties', data),

  update: (id: number, data: UpdatePropertyPayload) =>
    api.patch<Property>(`/properties/${id}`, data),

  /** El propietario envía la propiedad a revisión (no la activa: queda en PENDING). */
  publish: (id: number) => api.patch<Property>(`/properties/${id}/publish`, {}),

  remove: (id: number) => api.delete<Property>(`/properties/${id}`),

  /** Solo ADMIN: todas las propiedades (cualquier estado) con su propietario. */
  getAllForAdmin: (status?: PropertyStatus) =>
    api.get<PaginatedProperties>(`/properties/admin/all${status ? `?status=${status}` : ''}`),

  /** Solo ADMIN: aprueba, pide cambios o rechaza una propiedad en revisión. */
  review: (id: number, data: ReviewPropertyPayload) =>
    api.patch<Property>(`/properties/${id}/review`, data),

  uploadFiles: (propertyId: number, files: File[]) => {
    const formData = new FormData()
    files.forEach((file) => formData.append('files', file))
    return api.upload<PropertyFile[]>(`/properties/${propertyId}/files`, formData)
  },

  getFiles: (propertyId: number) =>
    api.get<PropertyFile[]>(`/properties/${propertyId}/files`),

  removeFile: (propertyId: number, fileId: number) =>
    api.delete<PropertyFile>(`/properties/${propertyId}/files/${fileId}`),
}

export const serviceService = {
  getAll: () => listServices(),
}
