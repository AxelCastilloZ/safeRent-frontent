import { createRoute } from '@tanstack/react-router';
import { rootRoute } from '../../../routes/rootRoute';
import PublishEntryPage from '../PublishEntryPage';

export const publishEntryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'publicar',
  component: PublishEntryPage,
});
