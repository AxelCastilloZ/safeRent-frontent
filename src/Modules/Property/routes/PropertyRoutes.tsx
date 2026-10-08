import { createRoute, lazyRouteComponent } from "@tanstack/react-router";
import { rootRoute } from "../../../routes/rootRoute";
import { requireRole } from '../../Auth/routes/guards';
import OwnerLayout from "../Components/OwnerLayout";

function optionalPropertyId(value: unknown): number | undefined {
  if (typeof value !== 'string' && typeof value !== 'number') return undefined;
  const id = Number(value);
  return Number.isSafeInteger(id) && id > 0 ? id : undefined;
}

export const PropertyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "properties",
  beforeLoad: requireRole('OWNER', 'ADMIN'),
  component: OwnerLayout,
});

export const propertyIndexRoute = createRoute({
  getParentRoute: () => PropertyRoute,
  path: "/",
  component: lazyRouteComponent(() => import("../PropertyPage")),
});

export const propertyNewRoute = createRoute({
  getParentRoute: () => PropertyRoute,
  path: "new",
  validateSearch: (search: Record<string, unknown>): { editId?: number } => ({
    editId: optionalPropertyId(search.editId),
  }),
  component: lazyRouteComponent(() => import("../CreatePropertyStep1Page")),
});

export const propertyNewLocationRoute = createRoute({
  getParentRoute: () => PropertyRoute,
  path: "new/location",
  validateSearch: (search: Record<string, unknown>): { propertyId?: number } => ({
    propertyId: optionalPropertyId(search.propertyId),
  }),
  component: lazyRouteComponent(() => import("../CreatePropertyLocationPage")),
});

export const propertyNewMediaRoute = createRoute({
  getParentRoute: () => PropertyRoute,
  path: "new/media",
  validateSearch: (search: Record<string, unknown>): { propertyId?: number } => ({
    propertyId: optionalPropertyId(search.propertyId),
  }),
  component: lazyRouteComponent(() => import("../CreatePropertyStep2Page")),
});

export const propertyDetailsRoute = createRoute({
  getParentRoute: () => PropertyRoute,
  path: "detail/$propertyId",
  component: lazyRouteComponent(() => import("../PropertyDetailPage")),
});

export const propertyPublishRoute = createRoute({
  getParentRoute: () => PropertyRoute,
  path: "$propertyId/publish",
  component: lazyRouteComponent(() => import("../PropertyPublishedPage")),
});
export const publicPropertyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'property_detail/$propertyId',
  component: lazyRouteComponent(() => import('../PublicPropertyPage')),
});
