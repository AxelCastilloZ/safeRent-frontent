import { useDiscoverProperties } from '../../hooks/useDiscoverProperties';
import HomeSection from '../HomeSection';
import PropertyThumbCard from '../PropertyThumbCard';
import { SectionEmpty, SectionError, SectionLoading } from './SectionStates';

/** "Descubre": las propiedades activas más recientes, en una fila que se desplaza. */
export default function DiscoverSection() {
  const discover = useDiscoverProperties();

  return (
    <HomeSection title="Descubre" to="/explorar" linkLabel="Explorar todas">
      {discover.isPending ? (
        <SectionLoading shape="cards" />
      ) : discover.isError ? (
        <SectionError message="No pudimos cargar las propiedades." onRetry={() => void discover.refetch()} />
      ) : discover.data.length === 0 ? (
        <SectionEmpty title="No hay propiedades nuevas por ahora" description="Vuelve pronto o explora todo el catálogo." actionLabel="Explorar propiedades" actionTo="/explorar" />
      ) : (
        <ul className="-mx-1 flex snap-x gap-4 overflow-x-auto px-1 pb-2">
          {discover.data.map((property) => (
            <li key={property.id} className="flex w-60 shrink-0 snap-start">
              <PropertyThumbCard property={property} className="w-full" />
            </li>
          ))}
        </ul>
      )}
    </HomeSection>
  );
}
