import { createRoute, lazyRouteComponent } from '@tanstack/react-router'
import { rootRoute } from '../../../routes/rootRoute'
import MessagesPage from '../pages/MessagesPage'

export const MessagesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'messages',
  component: MessagesPage,
})

export const messagesIndexRoute = createRoute({
  getParentRoute: () => MessagesRoute,
  path: '/',
  component: lazyRouteComponent(() => import('../pages/MessagesIndexPage')),
})

export const conversationRoute = createRoute({
  getParentRoute: () => MessagesRoute,
  path: '$conversationId',
  component: lazyRouteComponent(() => import('../pages/ConversationPage')),
})
