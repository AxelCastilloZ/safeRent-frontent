import { createRoute, lazyRouteComponent } from '@tanstack/react-router'
import { requireRole } from '../../Auth/routes/guards'
import { rootRoute } from '../../../routes/rootRoute'

export const servicesAdminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/services',
  beforeLoad: requireRole('ADMIN'),
  component: lazyRouteComponent(() => import('../pages/ServicesAdminPage')),
})
