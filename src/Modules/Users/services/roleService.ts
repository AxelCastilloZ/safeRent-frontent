import { api } from '../../Property/services/api'
import type { Role } from '../types/user'

/** Catálogo de roles (GET /roles) para el selector de "agregar rol" del panel de administración. */
export const roleService = {
  getAll: () => api.get<Role[]>('/roles'),
}
