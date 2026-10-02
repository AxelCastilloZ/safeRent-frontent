import { createRoute, redirect } from '@tanstack/react-router'
import { rootRoute } from '../../../routes/rootRoute'

// Mensajes vive dentro del panel (/dashboard/messages, ver Dashboard/routes). Estas rutas
// solo mantienen vivos los links antiguos (/messages y /messages/:id) redirigiéndolos allá.
export const MessagesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'messages',
  beforeLoad: ({ location }) => {
    throw redirect({ to: location.pathname.replace(/^\/messages/, '/dashboard/messages') })
  },
})

export const messagesIndexRoute = createRoute({
  getParentRoute: () => MessagesRoute,
  path: '/',
})

export const conversationRoute = createRoute({
  getParentRoute: () => MessagesRoute,
  path: '$conversationId',
})
