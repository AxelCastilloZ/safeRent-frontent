import { createRoute, lazyRouteComponent } from "@tanstack/react-router";
import { rootRoute } from "../../../routes/rootRoute";
import OwnerLayout from "../Components/OwnerLayout";

export const PropertyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "properties",
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
  component: lazyRouteComponent(() => import("../CreatePropertyStep1Page")),
});

export const propertyNewMediaRoute = createRoute({
  getParentRoute: () => PropertyRoute,
  path: "new/media",
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