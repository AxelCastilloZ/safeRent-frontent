import { api } from '../../Property/services/api'
import type { AdminUser } from '../types/user'

/** Acciones de administración sobre usuarios. Todas requieren sesión con rol ADMIN. */
export const userService = {
  getAllForAdmin: () => api.get<AdminUser[]>('/users'),

  /** Activa o desactiva la cuenta (p. ej. por mal uso de la aplicación). */
  setActive: (id: number, isActive: boolean) =>
    api.patch<AdminUser>(`/users/${id}/status`, { isActive }),

  addRole: (id: number, roleId: number) =>
    api.patch<AdminUser>(`/users/${id}/roles/${roleId}`, {}),

  removeRole: (id: number, roleId: number) =>
    api.delete<AdminUser>(`/users/${id}/roles/${roleId}`),

  /** Elimina la cuenta de la aplicación. No se puede deshacer. */
  remove: (id: number) => api.delete<void>(`/users/${id}`),
}
