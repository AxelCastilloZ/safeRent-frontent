import { publicPropertyRoute } from '../Modules/Property/routes/PropertyRoutes';
import { servicesAdminRoute } from '../Modules/Services/routes/ServicesRoutes';
import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "./rootRoute";
import LandingPage from "../Modules/LandingPage/LandingPage";
import { LoginRoute, RegisterRoute, ForgotPasswordRoute, ResetPasswordRoute } from "../Modules/Auth/routes/AuthRoutes";
import { ExplorerRoute } from "../Modules/Explore/routes/ExplorerRoutes";
import { conversationRoute, MessagesRoute, messagesIndexRoute } from "../Modules/Messages/routes/MessagesRoutes";
import { dashboardRoute } from "../Modules/Dashboard/routes/DashboardRoutes";
import { PrivacyPolicyRoute, SobreNosotrosRoute, SoporteRoute, TermOfServiceRoute } from "../Modules/LandingPage/Routes/LandingRoutes";
import { publishEntryRoute } from '../Modules/Property/routes/PublishRoutes';

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
    ForgotPasswordRoute,
    ResetPasswordRoute,
    publishEntryRoute,
    dashboardRoute,
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