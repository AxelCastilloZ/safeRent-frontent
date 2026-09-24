import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { routeTree } from './routes/routeTree'
import { RouterProvider, createRouter } from '@tanstack/react-router';

const queryClient = new QueryClient();

export const router = createRouter({
  routeTree,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

function App() {
  return (
     <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
    </QueryClientProvider>
  )
}

export default App
