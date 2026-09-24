import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "../../../routes/rootRoute";
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";

export const LoginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "login",
  component: LoginForm,
});

export const RegisterRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "register",
  component: RegisterForm,
});

