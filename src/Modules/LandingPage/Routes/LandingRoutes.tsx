import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "../../../routes/rootRoute";
import SupportPage from "../../Support/SupportPage";
import AboutPage from "../../About/AboutPage";
import PrivacyPolicyPage from "../../Legal/PrivacyPolicyPage";
import TermsOfServicePage from "../../Legal/TermsOfServicePage";

export const SobreNosotrosRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "sobre-nosotros",
  component: AboutPage,
});

export const SoporteRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "soporte",
  component: SupportPage,
});

export const PrivacyPolicyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "politica-de-privacidad",
  component: PrivacyPolicyPage,
});

export const TermOfServiceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "terminos-de-servicio",
  component: TermsOfServicePage,
});


