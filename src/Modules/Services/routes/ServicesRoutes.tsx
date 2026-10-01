import { createRoute, lazyRouteComponent } from '@tanstack/react-router'
import { rootRoute } from '../../../routes/rootRoute'

export const servicesAdminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/services',
  component: lazyRouteComponent(() => import('../pages/ServicesAdminPage')),
})
