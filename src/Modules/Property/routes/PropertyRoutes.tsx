import { createRoute, lazyRouteComponent } from "@tanstack/react-router";
import { rootRoute } from "../../../routes/rootRoute";

// El asistente para crear / editar propiedades vive en el panel del propietario
// (/dashboard/owner/properties/...): ver Dashboard/routes/DashboardRoutes.tsx.

export function optionalPropertyId(value: unknown): number | undefined {
  if (typeof value !== 'string' && typeof value !== 'number') return undefined;
  const id = Number(value);
  return Number.isSafeInteger(id) && id > 0 ? id : undefined;
}

export const publicPropertyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'property_detail/$propertyId',
  component: lazyRouteComponent(() => import('../PublicPropertyPage')),
});