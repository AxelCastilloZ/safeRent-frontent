import { useQuery } from '@tanstack/react-query';
import { propertyService } from '../../Property/services/propertyService';

// El backend devuelve primero las más nuevas y permite hasta 100 por página.
const FETCHED = 100;

/**
 * Cola de revisión: las propiedades pendientes, de la que lleva más tiempo esperando a la más reciente.
 * `total` es el número real de pendientes aunque haya más de las que se traen.
 */
export function useAdminReviewQueue() {
  return useQuery({
    // Cuelga de ['admin', 'properties'] para refrescarse cuando se revisa una propiedad.
    queryKey: ['admin', 'properties', 'PENDING', 'queue'],
    queryFn: async () => {
      const page = await propertyService.getAllForAdmin('PENDING', FETCHED);
      return { total: page.total, queue: [...page.data].sort((a, b) => a.id - b.id) };
    },
  });
}
