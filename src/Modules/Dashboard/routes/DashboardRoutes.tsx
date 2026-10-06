import { createRoute, lazyRouteComponent } from '@tanstack/react-router';
import { requireDashboard, requireRole } from '../../Auth/routes/guards';
import { rootRoute } from '../../../routes/rootRoute';
import MessagesLayout from '../../Messages/Components/MessagesLayout';
import DashboardLayout from '../Components/DashboardLayout';

// Un solo layout (/dashboard) con tres áreas que salen de la URL:
//   /dashboard         → inquilino      /dashboard/owner/*  → propietario      /dashboard/admin/* → administrador
// Cada área verifica el rol asignado a la cuenta en el backend.
const DashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'dashboard',
  // Sin sesión no se llega a renderizar nada: va a /login y, tras iniciar sesión, vuelve aquí.
  // (Si la sesión se pierde con el panel abierto, lo cubre DashboardLayout.)
  beforeLoad: requireDashboard,
  component: DashboardLayout,
});

const messagesIndexPage = () => import('../../Messages/pages/MessagesIndexPage');
const conversationPage = () => import('../../Messages/pages/ConversationPage');
const settingsPage = () => import('../pages/SettingsPage');

// ── Inquilino ────────────────────────────────────────────────────────────────
const clientHomeRoute = createRoute({
  getParentRoute: () => DashboardRoute,
  path: '/',
  component: lazyRouteComponent(() => import('../pages/ClientHomePage')),
});
const clientReservationsRoute = createRoute({
  getParentRoute: () => DashboardRoute,
  path: 'reservations',
  component: lazyRouteComponent(() => import('../pages/ReservationsPage')),
});
const clientSavedRoute = createRoute({
  getParentRoute: () => DashboardRoute,
  path: 'saved',
  component: lazyRouteComponent(() => import('../pages/SavedPropertiesPage')),
});
const clientSettingsRoute = createRoute({
  getParentRoute: () => DashboardRoute,
  path: 'settings',
  component: lazyRouteComponent(settingsPage),
});
const clientMessagesRoute = createRoute({ getParentRoute: () => DashboardRoute, path: 'messages', component: MessagesLayout });
const clientMessagesIndexRoute = createRoute({
  getParentRoute: () => clientMessagesRoute,
  path: '/',
  component: lazyRouteComponent(messagesIndexPage),
});
const clientConversationRoute = createRoute({
  getParentRoute: () => clientMessagesRoute,
  path: '$conversationId',
  component: lazyRouteComponent(conversationPage),
});

// ── Propietario ──────────────────────────────────────────────────────────────
const ownerAreaRoute = createRoute({ getParentRoute: () => DashboardRoute, path: 'owner', beforeLoad: requireRole('OWNER') });
const ownerHomeRoute = createRoute({
  getParentRoute: () => ownerAreaRoute,
  path: '/',
  component: lazyRouteComponent(() => import('../pages/owner/OwnerHomePage')),
});
const ownerPropertiesRoute = createRoute({
  getParentRoute: () => ownerAreaRoute,
  path: 'properties',
  component: lazyRouteComponent(() => import('../pages/owner/OwnerPropertiesPage')),
});
const ownerRequestsRoute = createRoute({
  getParentRoute: () => ownerAreaRoute,
  path: 'requests',
  component: lazyRouteComponent(() => import('../pages/owner/OwnerRequestsPage')),
});
const ownerSettingsRoute = createRoute({
  getParentRoute: () => ownerAreaRoute,
  path: 'settings',
  component: lazyRouteComponent(settingsPage),
});
const ownerMessagesRoute = createRoute({ getParentRoute: () => ownerAreaRoute, path: 'messages', component: MessagesLayout });
const ownerMessagesIndexRoute = createRoute({
  getParentRoute: () => ownerMessagesRoute,
  path: '/',
  component: lazyRouteComponent(messagesIndexPage),
});
const ownerConversationRoute = createRoute({
  getParentRoute: () => ownerMessagesRoute,
  path: '$conversationId',
  component: lazyRouteComponent(conversationPage),
});

// ── Administrador ────────────────────────────────────────────────────────────
const adminAreaRoute = createRoute({ getParentRoute: () => DashboardRoute, path: 'admin', beforeLoad: requireRole('ADMIN') });
const adminHomeRoute = createRoute({
  getParentRoute: () => adminAreaRoute,
  path: '/',
  component: lazyRouteComponent(() => import('../pages/admin/AdminHomePage')),
});
const adminPropertiesRoute = createRoute({
  getParentRoute: () => adminAreaRoute,
  path: 'properties',
  component: lazyRouteComponent(() => import('../pages/admin/AdminPropertiesPage')),
});
const adminCommentsRoute = createRoute({
  getParentRoute: () => adminAreaRoute,
  path: 'comments',
  beforeLoad: requireRole('ADMIN'),
  component: lazyRouteComponent(() => import('../../Comments/pages/AdminCommentsPage')),
});
const adminUsersRoute = createRoute({
  getParentRoute: () => adminAreaRoute,
  path: 'users',
  component: lazyRouteComponent(() => import('../pages/admin/AdminUsersPage')),
});
const adminReportsRoute = createRoute({
  getParentRoute: () => adminAreaRoute,
  path: 'reports',
  component: lazyRouteComponent(() => import('../pages/admin/AdminReportsPage')),
});
const adminSettingsRoute = createRoute({
  getParentRoute: () => adminAreaRoute,
  path: 'settings',
  component: lazyRouteComponent(settingsPage),
});
const adminMessagesRoute = createRoute({ getParentRoute: () => adminAreaRoute, path: 'messages', component: MessagesLayout });
const adminMessagesIndexRoute = createRoute({
  getParentRoute: () => adminMessagesRoute,
  path: '/',
  component: lazyRouteComponent(messagesIndexPage),
});
const adminConversationRoute = createRoute({
  getParentRoute: () => adminMessagesRoute,
  path: '$conversationId',
  component: lazyRouteComponent(conversationPage),
});

export const dashboardRoute = DashboardRoute.addChildren([
  clientHomeRoute,
  clientReservationsRoute,
  clientSavedRoute,
  clientSettingsRoute,
  clientMessagesRoute.addChildren([clientMessagesIndexRoute, clientConversationRoute]),
  ownerAreaRoute.addChildren([
    ownerHomeRoute,
    ownerPropertiesRoute,
    ownerRequestsRoute,
    ownerSettingsRoute,
    ownerMessagesRoute.addChildren([ownerMessagesIndexRoute, ownerConversationRoute]),
  ]),
  adminAreaRoute.addChildren([
    adminHomeRoute,
    adminPropertiesRoute,
    adminUsersRoute,
    adminCommentsRoute,
    adminReportsRoute,
    adminSettingsRoute,
    adminMessagesRoute.addChildren([adminMessagesIndexRoute, adminConversationRoute]),
  ]),
]);
