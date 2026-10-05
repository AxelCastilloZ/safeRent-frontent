import type { AppRole } from '../../Auth/types/roles'

/** Rol tal como lo devuelve el backend (GET /roles, user.Roles en la vista de administración). */
export interface Role {
  id: number
  name: AppRole | string
  description: string
  isActive: boolean
}

/**
 * Proyección segura de un usuario para el panel de administración
 * (GET /users admin): sin cédula, teléfono ni fecha de nacimiento.
 * Refleja `AdminUserView` en safeRent-backend/src/user/user.service.ts.
 */
export interface AdminUser {
  id: number
  name: string
  surname1: string
  surname2?: string
  email: string
  isActive: boolean
  createdAt: string
  roles: Role[]
}
