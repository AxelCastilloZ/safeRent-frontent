import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { userService } from '../services/userService'
import { roleService } from '../services/roleService'

export const adminUsersQueryKey = ['admin', 'users'] as const
export const rolesQueryKey = ['roles', 'catalog'] as const

/** Usuarios para el panel de administración (GET /users, solo ADMIN). */
export function useAdminUsers() {
  return useQuery({
    queryKey: adminUsersQueryKey,
    queryFn: userService.getAllForAdmin,
  })
}

/** Catálogo de roles disponibles, para el selector de "agregar rol". */
export function useRoles() {
  return useQuery({
    queryKey: rolesQueryKey,
    queryFn: roleService.getAll,
  })
}

export function useSetUserActive() {
  const client = useQueryClient()
  return useMutation({
    mutationFn: ({ id, isActive }: { id: number; isActive: boolean }) => userService.setActive(id, isActive),
    onSuccess: () => void client.invalidateQueries({ queryKey: adminUsersQueryKey }),
  })
}

export function useAddUserRole() {
  const client = useQueryClient()
  return useMutation({
    mutationFn: ({ id, roleId }: { id: number; roleId: number }) => userService.addRole(id, roleId),
    onSuccess: () => void client.invalidateQueries({ queryKey: adminUsersQueryKey }),
  })
}

export function useRemoveUserRole() {
  const client = useQueryClient()
  return useMutation({
    mutationFn: ({ id, roleId }: { id: number; roleId: number }) => userService.removeRole(id, roleId),
    onSuccess: () => void client.invalidateQueries({ queryKey: adminUsersQueryKey }),
  })
}

export function useDeleteUser() {
  const client = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => userService.remove(id),
    onSuccess: () => void client.invalidateQueries({ queryKey: adminUsersQueryKey }),
  })
}
