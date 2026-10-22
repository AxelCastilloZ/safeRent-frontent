import type { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext } from "@tanstack/react-router";
import RootLayout from '../i18n/RootLayout';
import { RouteError, RouteNotFound, RoutePending } from '../i18n/RouteStates';

/** Lo que reciben `beforeLoad`/`loader` de todas las rutas (se entrega en App.tsx). */
export interface RouterContext {
  queryClient: QueryClient;
}

export const rootRoute = createRootRouteWithContext<RouterContext>()({ component: RootLayout, errorComponent: RouteError, notFoundComponent: RouteNotFound, pendingComponent: RoutePending });
