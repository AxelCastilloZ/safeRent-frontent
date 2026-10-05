import type { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext } from "@tanstack/react-router";

/** Lo que reciben `beforeLoad`/`loader` de todas las rutas (se entrega en App.tsx). */
export interface RouterContext {
  queryClient: QueryClient;
}

export const rootRoute = createRootRouteWithContext<RouterContext>()();
