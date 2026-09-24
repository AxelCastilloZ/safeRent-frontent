import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "./rootRoute";
import LandingPage from "../Modules/LandingPage/LandingPage";
import { LoginRoute, RegisterRoute } from "../Modules/Auth/routes/AuthRoutes";
import { propertyDetailsRoute, propertyIndexRoute, propertyNewMediaRoute, propertyNewRoute, propertyPublishRoute, PropertyRoute } from "../Modules/Property/routes/PropertyRoutes";

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: LandingPage,
});

export const routeTree = rootRoute.addChildren([
    indexRoute,
    LoginRoute,
    RegisterRoute,
    PropertyRoute.addChildren([
        propertyIndexRoute,
        propertyNewRoute,
        propertyNewMediaRoute,
        propertyDetailsRoute,
        propertyPublishRoute
    ])
])