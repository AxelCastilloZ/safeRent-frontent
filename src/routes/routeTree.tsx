import { publicPropertyRoute } from '../Modules/Property/routes/PropertyRoutes';
import { servicesAdminRoute } from '../Modules/Services/routes/ServicesRoutes';
import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "./rootRoute";
import LandingPage from "../Modules/LandingPage/LandingPage";
import { LoginRoute, RegisterRoute } from "../Modules/Auth/routes/AuthRoutes";
import { propertyDetailsRoute, propertyIndexRoute, propertyNewLocationRoute, propertyNewMediaRoute, propertyNewRoute, propertyPublishRoute, PropertyRoute } from "../Modules/Property/routes/PropertyRoutes";
import { ExplorerRoute } from "../Modules/Explore/routes/ExplorerRoutes";
import { conversationRoute, MessagesRoute, messagesIndexRoute } from "../Modules/Messages/routes/MessagesRoutes";
import { PrivacyPolicyRoute, SobreNosotrosRoute, SoporteRoute, TermOfServiceRoute } from "../Modules/LandingPage/Routes/LandingRoutes";

const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/",
    component: LandingPage,
});

export const routeTree = rootRoute.addChildren([
    indexRoute,
    publicPropertyRoute,
    servicesAdminRoute,
    LoginRoute,
    RegisterRoute,
    PropertyRoute.addChildren([
        propertyIndexRoute,
        propertyNewRoute,
        propertyNewLocationRoute,
        propertyNewMediaRoute,
        propertyDetailsRoute,
        propertyPublishRoute
    ]),
    MessagesRoute.addChildren([
        messagesIndexRoute,
        conversationRoute
    ]),
    ExplorerRoute,
    SobreNosotrosRoute,
    SoporteRoute,
    PrivacyPolicyRoute,
    TermOfServiceRoute,
    // servicesAdminRoute
])

