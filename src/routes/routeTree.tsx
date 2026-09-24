import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "./rootRoute";
import LandingPage from "../Modules/LandingPage/LandingPage";
import { LoginRoute, RegisterRoute } from "../Modules/Auth/routes/AuthRoutes";

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: LandingPage,
});

export const routeTree = rootRoute.addChildren([
    indexRoute,
    LoginRoute,
    RegisterRoute
])