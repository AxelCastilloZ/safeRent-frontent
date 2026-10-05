import { redirect } from '@tanstack/react-router';
import type { RouterContext } from '../../../routes/rootRoute';
import { getAreaFromPath } from '../../Dashboard/config/navigation';
import { roleHome } from '../utils/roleHome';
import { authUserQueryOptions } from '../hooks/authQueries';
import type { AppRole } from '../types/roles';
import { hasAnyRole } from '../utils/roles';
import { getStoredToken } from '../utils/sessionToken';

// Forma mínima de lo que reciben los `beforeLoad` de TanStack Router.
interface GuardArgs {
  context: RouterContext;
  location: { href: string };
}

/**
 * Exige sesión: sin token (o con token vencido) manda a /login?next=<ruta> y,
 * tras iniciar sesión, vuelve a donde quería entrar. Devuelve el usuario.
 *
 * OJO: es solo experiencia de usuario. La seguridad real es la del backend.
 */
export async function requireAuth({ context, location }: GuardArgs) {
  const token = getStoredToken();
  const toLogin = () => redirect({ to: '/login', search: { next: location.href } });
  if (!token) throw toLogin();

  try {
    const user = await context.queryClient.fetchQuery({ ...authUserQueryOptions(token), staleTime: 0 });
    return { user };
  } catch {
    // authUserQueryOptions ya cerró la sesión si fue un 401; cualquier otro fallo también impide confirmar quién es.
    throw toLogin();
  }
}

/**
 * Exige sesión y además alguno de los roles indicados; si el usuario no lo tiene
 * lo manda al panel principal que corresponde a sus roles actuales.
 * Uso: `beforeLoad: requireRole('ADMIN')`.
 */
export async function requireDashboard(args: GuardArgs) {
  const { user } = await requireAuth(args);
  const area = getAreaFromPath(args.location.href.split('?')[0]);
  const role = area === 'admin' ? 'ADMIN' : area === 'owner' ? 'OWNER' : 'CLIENT';
  if (!user.roles.includes(role)) throw redirect({ to: roleHome(user.roles) });
  return { user };
}

export function requireRole(...allowed: AppRole[]) {
  return async (args: GuardArgs) => {
    const { user } = await requireAuth(args);
    if (!hasAnyRole(user.roles, allowed)) throw redirect({ to: roleHome(user.roles) });
    return { user };
  };
}
