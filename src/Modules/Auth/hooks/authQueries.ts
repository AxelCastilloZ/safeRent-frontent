import { queryOptions } from '@tanstack/react-query';
import axios from 'axios';
import { GetCurrentUser } from '../services/aurhServices';
import { setSessionToken } from '../services/authSession';
import type { SessionUser } from '../types/session';
import { getStoredToken } from '../utils/sessionToken';

/**
 * Consulta del usuario de la sesión para los guards del router (`ensureQueryData`).
 * Usa la MISMA queryKey que `useAuth`, así comparten caché, y aplica la misma regla:
 * un 401 con el mismo token cierra la sesión. Si cambia el `queryFn` de `useAuth`,
 * este debe cambiar igual.
 */
export const authUserQueryOptions = (token: string) =>
  queryOptions({
    queryKey: ['auth', 'me', token],
    retry: false,
    queryFn: async (): Promise<SessionUser> => {
      try {
        // GET /auth/me devuelve también el correo; AuthUser aún no lo declara.
        return (await GetCurrentUser()) as SessionUser;
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 401 && getStoredToken() === token) {
          setSessionToken(null);
        }
        throw error;
      }
    },
  });
