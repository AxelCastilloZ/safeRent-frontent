import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from '@tanstack/react-router';
import LanguagePreference from './i18n/LanguagePreference';
import { queryClient, router } from './routes/router';

function App() {
  return (
     <QueryClientProvider client={queryClient}>
        <LanguagePreference />
        <RouterProvider router={router} />
    </QueryClientProvider>
  )
}

export default App
