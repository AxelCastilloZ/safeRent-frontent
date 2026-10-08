import { createRoute, isRedirect, redirect } from '@tanstack/react-router';
import { rootRoute, type RouterContext } from '../../../routes/rootRoute';
import { authUserQueryOptions } from '../../Auth/hooks/authQueries';
import { getStoredToken } from '../../Auth/utils/sessionToken';
import PublishEntryPage from '../PublishEntryPage';

/**
 * Quien ya tiene sesión no necesita ver los pasos: va directo al formulario de publicar
 * propiedad (que aplica sus propias reglas de acceso). Sin sesión se muestra la página.
 */
async function sendSignedInUsersToForm({ context }: { context: RouterContext }) {
  const token = getStoredToken();
  if (!token) return;

  try {
    await context.queryClient.fetchQuery(authUserQueryOptions(token));
    throw redirect({ to: '/dashboard/owner/properties/new' });
  } catch (error) {
    if (isRedirect(error)) throw error;
    // No se pudo confirmar la sesión (red caída, 401…): se muestra la página, que se adapta sola.
  }
}

/** Entrada pública de "Publica tu propiedad" (la usa el CTA de la landing). */
export const publishEntryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'publicar',
  beforeLoad: sendSignedInUsersToForm,
  component: PublishEntryPage,
});
