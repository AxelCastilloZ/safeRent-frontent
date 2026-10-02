import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "../../../routes/rootRoute";
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";
import { isSafeRedirect } from "../utils/safeRedirect";

export const LoginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "login",
  // ?next=/ruta: a dónde volver después de iniciar sesión.
  validateSearch: (search: Record<string, unknown>): { next?: string } => ({
    next: isSafeRedirect(search.next) ? search.next : undefined,
  }),
  component: LoginForm,
});

export const RegisterRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "register",
  component: RegisterForm,
});
