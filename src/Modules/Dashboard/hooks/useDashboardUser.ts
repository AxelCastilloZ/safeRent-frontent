import { useAuth } from '../../Auth/hooks/authHooks';
import type { SessionUser } from '../../Auth/types/session';

function firstLetter(value: string | undefined): string {
  return Array.from((value ?? '').trim())[0] ?? '';
}

/** Datos del usuario de la sesión listos para mostrar en el panel (nombre, iniciales, correo). */
export function useDashboardUser() {
  const { user, hasSession, logout } = useAuth();
  // GET /auth/me devuelve también el correo; AuthUser aún no lo declara.
  const sessionUser = user as SessionUser | undefined;

  return {
    hasSession,
    logout,
    firstName: sessionUser?.name,
    fullName: sessionUser ? `${sessionUser.name} ${sessionUser.surname1}`.trim() : undefined,
    initials: sessionUser ? `${firstLetter(sessionUser.name)}${firstLetter(sessionUser.surname1)}`.toLocaleUpperCase() : undefined,
    email: sessionUser?.email,
    userId: sessionUser?.id,
  };
}
