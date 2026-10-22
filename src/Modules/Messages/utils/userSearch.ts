import type { AppRole } from '../../Auth/types/roles'
import { ROLE_LABELS } from '../../Auth/utils/roles'
import type { AdminUser } from '../../Users/types/user'

const MAX_RESULTS = 6

// Marcas diacríticas (tildes) que quedan sueltas tras descomponer el texto con NFD.
const DIACRITICS = new RegExp(`[${String.fromCharCode(0x300)}-${String.fromCharCode(0x36f)}]`, 'g')

/** Minúsculas y sin tildes: "Pérez" coincide con "perez". */
function normalize(text: string): string {
  return text.normalize('NFD').replace(DIACRITICS, '').toLowerCase()
}

/** Nombre del rol tal como se muestra (Inquilino, Propietario…); si no se conoce, el nombre del backend. */
export function userRoleLabels(user: AdminUser): string[] {
  return user.roles.filter((role) => role.isActive).map((role) => ROLE_LABELS[role.name as AppRole] ?? role.name)
}

/**
 * A quién puede escribirle el administrador: cuentas activas, que no sean administradoras y que no sean la suya.
 * Cada palabra escrita debe aparecer en el nombre, los apellidos, el correo o el rol (así "ana perez" o "propietario" funcionan).
 */
export function searchMessageableUsers(users: AdminUser[] | undefined, query: string, currentUserId: number | undefined): AdminUser[] {
  const words = normalize(query).split(/\s+/).filter(Boolean)
  if (!users || words.length === 0) return []

  return users
    .filter((user) => user.isActive && user.id !== currentUserId && !user.roles.some((role) => role.name === 'ADMIN'))
    .filter((user) => {
      const haystack = normalize([user.name, user.surname1, user.surname2 ?? '', user.email, ...userRoleLabels(user)].join(' '))
      return words.every((word) => haystack.includes(word))
    })
    .slice(0, MAX_RESULTS)
}
