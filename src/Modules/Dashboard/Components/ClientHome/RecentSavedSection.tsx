import { useQueryClient } from '@tanstack/react-query';
import { savedPropertyKeys, useSavedProperties } from '../../../SavedProperties/hooks/savedPropertyHooks';
import HomeSection from '../HomeSection';
import PropertyThumbCard from '../PropertyThumbCard';
import { SectionEmpty, SectionError, SectionLoading } from './SectionStates';

const SHOWN = 3;

/** "Guardadas recientemente": las 3 más nuevas de GET /saved-properties. */
export default function RecentSavedSection() {
  const saved = useSavedProperties();
  const queryClient = useQueryClient();
  const recent = saved.data?.slice(0, SHOWN) ?? [];

  return (
    <HomeSection title="Guardadas recientemente" to="/dashboard/saved" linkLabel="Ver todas">
      {saved.isPending ? (
        <SectionLoading shape="cards" />
      ) : saved.isError ? (
        <SectionError message="No pudimos cargar tus guardadas." onRetry={() => void queryClient.invalidateQueries({ queryKey: savedPropertyKeys.all })} />
      ) : recent.length === 0 ? (
        <SectionEmpty
          title="Todavía no guardaste propiedades"
          description="Pulsa «Guardar» en las que te interesen para compararlas con calma."
          actionLabel="Explorar propiedades"
          actionTo="/explorar"
        />
      ) : (
        <ul className="grid gap-4 sm:grid-cols-3">
          {recent.map((property) => (
            <li key={property.id} className="flex">
              {/* Una guardada que ya no está activa no tiene página pública: se quita desde "Ver todas". */}
              <PropertyThumbCard
                property={property}
                unavailable={!property.available}
                badge={property.available ? (property.reserved ? 'Reservada' : undefined) : 'No disponible'}
                className="w-full"
              />
            </li>
          ))}
        </ul>
      )}
    </HomeSection>
  );
}
