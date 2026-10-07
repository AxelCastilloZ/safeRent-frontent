import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "../../../routes/rootRoute";
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";
import { isSafeRedirect } from "../utils/safeRedirect";
import ForgotPasswordForm from '../components/ForgotPasswordForm';
import ResetPasswordForm from '../components/ResetPasswordForm';
import { resetTokenSchema } from '../schemas/password-recovery.schema';

export const ForgotPasswordRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'forgot-password',
  component: ForgotPasswordForm,
});

export const ResetPasswordRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'reset-password',
  validateSearch: (search: Record<string, unknown>): { token?: string } => {
    const result = resetTokenSchema.safeParse(search.token);
    return { token: result.success ? result.data : undefined };
  },
  component: ResetPasswordForm,
});

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
