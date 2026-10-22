import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'
import { useAuth } from '../../Auth/hooks/authHooks'
import type { AdminUser } from '../types/user'
import { userService } from '../services/userService'
import { roleService } from '../services/roleService'

export const adminUsersQueryKey = ['admin', 'users'] as const
export const rolesQueryKey = ['roles', 'catalog'] as const

/**
 * Usuarios para el panel de administración (GET /users, solo ADMIN), sin la cuenta de quien consulta:
 * un administrador no gestiona la suya (no puede desactivarse, quitarse roles ni escribirse a sí mismo).
 */
export function useAdminUsers() {
  const { user: me } = useAuth()
  const myId = me?.id
  return useQuery({
    queryKey: adminUsersQueryKey,
    queryFn: userService.getAllForAdmin,
    // Hasta saber quién es la sesión no se muestra nada, para que su cuenta no aparezca un instante.
    enabled: myId !== undefined,
    select: useCallback((users: AdminUser[]) => users.filter((user) => user.id !== myId), [myId]),
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
