import type { AuthUser } from './auth';

/**
 * Usuario de la sesión con el correo que ahora devuelve GET /auth/me.
 * Extiende `AuthUser` en vez de modificarlo, para no tocar los tipos de Auth.
 */
export type SessionUser = AuthUser & { email: string };
