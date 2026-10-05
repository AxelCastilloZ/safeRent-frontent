import type { AppRole } from '../types/roles';

/** Nombre con el que se muestra cada rol en la interfaz. */
export const ROLE_LABELS: Record<AppRole, string> = {
  CLIENT: 'Inquilino',
  OWNER: 'Propietario',
  ADMIN: 'Administrador',
};

// De mayor a menor: si un usuario tiene varios roles, manda el primero que tenga.
const ROLE_PRIORITY: AppRole[] = ['ADMIN', 'OWNER', 'CLIENT'];

function isAppRole(role: string): role is AppRole {
  return (ROLE_PRIORITY as string[]).includes(role);
}

/** Rol que define qué panel ve el usuario (ADMIN > OWNER > CLIENT), o undefined si no tiene ninguno conocido. */
export function getPrimaryRole(roles: readonly string[]): AppRole | undefined {
  return ROLE_PRIORITY.find((role) => roles.includes(role));
}

/** true si el usuario tiene alguno de los roles permitidos. */
export function hasAnyRole(roles: readonly string[], allowed: readonly AppRole[]): boolean {
  return roles.some((role) => isAppRole(role) && allowed.includes(role));
}
