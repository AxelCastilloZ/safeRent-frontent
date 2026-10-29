import { createRoute, redirect } from '@tanstack/react-router'
import { requireRole } from '../../Auth/routes/guards'
import { rootRoute } from '../../../routes/rootRoute'

export const servicesAdminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/services',
  beforeLoad: async args => { await requireRole('ADMIN')(args); throw redirect({ to: '/dashboard/admin/services' }); },
})
