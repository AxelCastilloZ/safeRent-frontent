import { getPrimaryRole } from './roles'

export function roleHome(roles: readonly string[]): string {
  const role = getPrimaryRole(roles)
  if (role === 'ADMIN') return '/dashboard/admin'
  if (role === 'OWNER') return '/dashboard/owner'
  return role === 'CLIENT' ? '/dashboard' : '/'
}
