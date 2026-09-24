import { api } from './api'
import type {
  Property,
  Service,
  CreatePropertyPayload,
  UpdatePropertyPayload,
  PropertyFile,
} from '../types/property'

export const propertyService = {
  getAll: () => api.get<Property[]>('/properties'),

  getById: (id: number) => api.get<Property>(`/properties/${id}`),

  getByOwner: (ownerId: number) => api.get<Property[]>(`/properties/owner/${ownerId}`),

  create: (data: CreatePropertyPayload) => api.post<Property>('/properties', data),

  update: (id: number, data: UpdatePropertyPayload) =>
    api.patch<Property>(`/properties/${id}`, data),

  publish: (id: number) => api.patch<Property>(`/properties/${id}/publish`, {}),

  remove: (id: number) => api.delete<Property>(`/properties/${id}`),

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
  getAll: () => api.get<Service[]>('/services'),
}
